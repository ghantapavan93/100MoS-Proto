import { useState, useEffect, useCallback, useMemo } from 'react'
import { OpsMetrics, Flags, TimelineEvent } from '@/types/ops'

type ScenarioType = 'RATE_LIMIT' | 'OUTAGE_SPIKE' | 'DUPLICATE_STORM'

export function useOpsSimulation(baseMetrics: OpsMetrics | null, baseFlags: Flags, refreshOps: () => void) {
    const [simulatedFlags, setSimulatedFlags] = useState<Flags>(baseFlags)
    const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null)
    const [injectedIncidents, setInjectedIncidents] = useState<any[]>([])
    const [injectedEvents, setInjectedEvents] = useState<TimelineEvent[]>([])

    // Sync base flags initially if not running a scenario
    useEffect(() => {
        if (!activeScenario) {
            setSimulatedFlags(baseFlags)
        }
    }, [baseFlags, activeScenario])

    const runScenario = useCallback((type: ScenarioType) => {
        if (activeScenario) return // Block if already running

        setActiveScenario(type)

        const now = new Date()

        // Scenario Scripts
        if (type === 'RATE_LIMIT') {
            // Step 1: Trigger Flag
            setSimulatedFlags(prev => ({ ...prev, rate_limit: true }))

            // Step 2: Inject Detection Event
            const detectionEvent: TimelineEvent = {
                id: Date.now(),
                title: 'Rate Limit Detected',
                subtitle: 'Strava API throttling (429 Too Many Requests)',
                type: 'incident',
                status: 'warning',
                timestamp: now.toISOString()
            }
            setInjectedEvents(prev => [detectionEvent, ...prev])

            // Step 3: Mitigation (after 3s)
            setTimeout(() => {
                const mitigationEvent: TimelineEvent = {
                    id: Date.now() + 1,
                    title: 'Backoff Protocol Initiated',
                    subtitle: ' exponential-backoff-jitter applied to sync jobs',
                    type: 'sync',
                    status: 'info',
                    timestamp: new Date().toISOString()
                }
                setInjectedEvents(prev => [mitigationEvent, ...prev])
            }, 3000)

            // Step 4: Recovery (after 6s)
            setTimeout(() => {
                setSimulatedFlags(prev => ({ ...prev, rate_limit: false }))
                const recoveryEvent: TimelineEvent = {
                    id: Date.now() + 2,
                    title: 'Traffic Normalized',
                    subtitle: 'Rate limit lifted, queue draining active',
                    type: 'sync',
                    status: 'success',
                    timestamp: new Date().toISOString()
                }
                setInjectedEvents(prev => [recoveryEvent, ...prev])
                setActiveScenario(null)
            }, 6000)
        }

        if (type === 'OUTAGE_SPIKE') {
            // Step 1: Trigger Flag
            setSimulatedFlags(prev => ({ ...prev, outage: true }))

            // Step 2: Inject Outage Event
            const outageEvent: TimelineEvent = {
                id: Date.now(),
                title: 'Provider Outage: Garmin',
                subtitle: '503 Service Unavailable detected via Health Check',
                type: 'incident',
                status: 'error',
                timestamp: now.toISOString()
            }
            setInjectedEvents(prev => [outageEvent, ...prev])

            // Step 3: Recovery (after 5s)
            setTimeout(() => {
                setSimulatedFlags(prev => ({ ...prev, outage: false }))
                const recoveryEvent: TimelineEvent = {
                    id: Date.now() + 1,
                    title: 'Provider Recovered',
                    subtitle: 'Garmin services operational. Resuming sync.',
                    type: 'sync',
                    status: 'success',
                    timestamp: new Date().toISOString()
                }
                setInjectedEvents(prev => [recoveryEvent, ...prev])
                setActiveScenario(null)
            }, 5000)
        }

        if (type === 'DUPLICATE_STORM') {
            // Step 1: Trigger Flag
            setSimulatedFlags(prev => ({ ...prev, duplicates: true }))

            // Step 2: Inject Detection
            const dedupEvent: TimelineEvent = {
                id: Date.now(),
                title: 'High Duplication Rate',
                subtitle: '>15% redundant payloads detected in ingestion',
                type: 'audit',
                status: 'warning',
                timestamp: now.toISOString()
            }
            setInjectedEvents(prev => [dedupEvent, ...prev])

            // Step 3: Auto-Resolve (after 4s)
            setTimeout(() => {
                setSimulatedFlags(prev => ({ ...prev, duplicates: false }))
                const resolvedEvent: TimelineEvent = {
                    id: Date.now() + 1,
                    title: 'Deduplication Sweep Complete',
                    subtitle: '142 redundant records purged. Ledger intact.',
                    type: 'audit',
                    status: 'success',
                    timestamp: new Date().toISOString()
                }
                setInjectedEvents(prev => [resolvedEvent, ...prev])
                setActiveScenario(null)
            }, 4000)
        }

    }, [activeScenario])

    // Compute Effective Metrics
    const effectiveMetrics = useMemo(() => {
        if (!baseMetrics) return null

        let m = { ...baseMetrics }

        // OVERRIDE: Provider Health based on Flags
        if (simulatedFlags.rate_limit) {
            m.providerHealth = m.providerHealth.map(p =>
                p.provider === 'Strava' ? { ...p, latency: 2400, success: 85, errors: 15, status: 'degraded' } : p
            )
            m.dataHealth = { ...m.dataHealth, latency: 'High (Throttle)' }
        }

        if (simulatedFlags.outage) {
            m.providerHealth = m.providerHealth.map(p =>
                p.provider === 'Garmin' ? { ...p, success: 0, errors: 100, status: 'down' } : p
            )
            m.scheduledSyncs = { ...m.scheduledSyncs, queueDepth: (m.scheduledSyncs.queueDepth || 0) + 42, delayed: (m.scheduledSyncs.delayed || 0) + 15 }
        }

        if (simulatedFlags.duplicates) {
            m.dataHealth = { ...m.dataHealth, totalRows: m.dataHealth.totalRows + 140 } // Spike rows
        }

        // INJECT: Fake Incidents
        if (injectedIncidents.length > 0) {
            m.recentIncidents = [...injectedIncidents, ...m.recentIncidents]
        }
        // OVERRIDE: Force some Quiet List targets if empty (for demo continuity)
        if (!m.quietList || m.quietList.length === 0) {
            m.quietList = [
                { id: 'demo-1', name: 'Participant 1204', crew: 'First-Timers', contacted: false, nudgeCount: 0, daysInactive: 15 },
                { id: 'demo-2', name: 'Participant 8832', crew: 'The OGs', contacted: false, nudgeCount: 0, daysInactive: 22 }
            ]
        }

        return m
    }, [baseMetrics, simulatedFlags, injectedIncidents])

    return {
        flags: simulatedFlags,
        effectiveMetrics,
        injectedEvents,
        activeScenario,
        runScenario,
        setSimulatedFlags
    }
}
