"use client"

import * as React from "react"

export type SyncStatus = "idle" | "loading" | "success" | "error" | "delayed" | "rate-limited" | "needs-attention"

type DemoState = {
    step: number
    profile: { why_statement: string; care_tags: string[]; crew_response?: string }
    activities: any[]
    totals: { miles: number; daysLeft: number }
    syncStatus: SyncStatus
    lastSyncTime: string | null
    nextSyncTime: number | null
    syncLogs: { id: string; msg: string; type: "info" | "success" | "warning" | "error" }[]
    communityPulse: number
    storyFeed: { items: any[], cursor: string | null, loading: boolean }
    connections: { provider: string; status: string; expiresAt?: string }[]
    userState: { mode: "normal" | "pit_stop"; modeUntil?: string; note?: string }
    motivation: { id: number; message: string; type: string } | null
    demoMode: boolean
    hints: { id: string; msg: string; type: string }[]
    ritualIdentity: { mission?: string; tags: string[]; mood?: string; pattern?: string }
    settings: { sound: boolean; haptics: boolean; motion: 'full' | 'reduced' }
    hydrationCount: number
    refuelState: { snack?: string; electrolyte?: boolean; stretches: number }
}

const initialState: DemoState = {
    step: 0,
    profile: { why_statement: "", care_tags: [] },
    activities: [],
    totals: { miles: 0, daysLeft: 52 },
    syncStatus: "idle",
    lastSyncTime: null,
    nextSyncTime: null,
    syncLogs: [
        { id: "1", msg: "Deduplication engine active.", type: "info" },
        { id: "2", msg: "Monitoring 3 provider streams.", type: "info" },
    ],
    communityPulse: 0,
    storyFeed: { items: [], cursor: null, loading: false },
    connections: [],
    userState: { mode: "normal" },
    motivation: null,
    demoMode: false,
    hints: [],
    ritualIdentity: { tags: [] },
    settings: { sound: false, haptics: true, motion: 'full' },
    hydrationCount: 0,
    refuelState: { stretches: 0 }
}

type DemoContextType = DemoState & {
    setStep: (step: number) => void
    setProfile: (profile: Partial<DemoState['profile']>) => Promise<void>
    syncActivities: (provider?: string) => Promise<void>
    refreshActivities: () => Promise<void>
    correctActivity: (params: { activityId: string; delta_miles: number; reason: string; notes?: string }) => Promise<void>
    undoAction: (actionId: string) => Promise<void>
    nextStep: () => void
    prevStep: () => void
    addLog: (msg: string, type?: "info" | "success" | "warning" | "error") => void
    loadMoreStories: () => Promise<void>
    repairConnection: (provider: string) => Promise<void>
    simulateConnectionBreak: (provider: string, type: 'expired' | 'revoked') => Promise<void>
    disconnectProvider: (provider: string) => Promise<void>
    togglePitStop: (note?: string) => Promise<void>
    toggleDemoMode: () => void
    addHint: (msg: string, type?: string) => void
    updateRitualIdentity: (identity: Partial<DemoState['ritualIdentity']>) => void
    updateSettings: (settings: Partial<DemoState['settings']>) => void
    generateDemoActivities: () => void
    updateHydration: (count: number) => void
    updateRefuel: (refuel: Partial<DemoState['refuelState']>) => void
}

const DemoContext = React.createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = React.useState<DemoState>(initialState)

    const refreshProgress = async () => {
        try {
            const res = await fetch("/api/demo/progress")
            const data = await res.json()
            setState(s => ({
                ...s,
                totals: { ...s.totals, miles: data.miles },
                profile: data.profile,
                userState: data.userState,
                motivation: data.motivation
            }))
        } catch (e) {
            console.error("Failed to refresh progress", e)
        }
    }

    const refreshActivities = async () => {
        try {
            const res = await fetch("/api/demo/activities?range=7d")
            const data = await res.json()
            setState(s => ({
                ...s,
                activities: data.items
            }))
        } catch (e) {
            console.error("Failed to refresh activities", e)
        }
    }

    const correctActivity = async (params: { activityId: string; delta_miles: number; reason: string; notes?: string }) => {
        try {
            // Add correction
            const res = await fetch(`/api/demo/activities/${params.activityId}/correct`, {
                method: "POST",
                body: JSON.stringify({ deltamiles: params.delta_miles, reason: params.reason })
            })
            const data = await res.json()

            // Add note if provided
            if (params.notes) {
                await fetch(`/api/demo/activities/${params.activityId}/note`, {
                    method: "POST",
                    body: JSON.stringify({ note: params.notes })
                })
            }

            if (res.ok) {
                addLog(`Applied correction. Mile-ledger updated.`, "success")
                refreshActivities()
                refreshProgress()

                // Show undo toast (simplified for demo)
                // In a real app, you'd use a toast library with the actionId
                console.log("Action ID for undo:", data.actionId)
            }
        } catch (e) {
            console.error("Failed to correct activity", e)
            addLog("Correction failed. Integrity layer blocked request.", "error")
        }
    }

    const undoAction = async (actionId: string) => {
        try {
            const res = await fetch(`/api/demo/actions/${actionId}/undo`, { method: "POST" })
            if (res.ok) {
                addLog("Action undone. Ledger restored.", "success")
                refreshActivities()
                refreshProgress()
            } else {
                const data = await res.json()
                addLog(`Undo failed: ${data.error}`, "error")
            }
        } catch (e) {
            console.error("Failed to undo", e)
        }
    }

    const fetchSchedulerStatus = async () => {
        try {
            const res = await fetch("/api/demo/sync/scheduler")
            const data = await res.json()
            setState(s => ({ ...s, nextSyncTime: data.nextSyncTime }))
        } catch (e) {
            console.error("Failed to fetch scheduler status", e)
        }
    }

    const refreshCommunityStats = async () => {
        try {
            const res = await fetch("/api/community/stats")
            const data = await res.json()
            setState(s => ({ ...s, communityPulse: data.pulse }))
        } catch (e) {
            console.error("Failed to fetch community pulse", e)
        }
    }

    const loadMoreStories = async () => {
        if (state.storyFeed.loading) return
        setState(s => ({ ...s, storyFeed: { ...s.storyFeed, loading: true } }))
        try {
            const url = state.storyFeed.cursor
                ? `/api/community/feed?cursor=${state.storyFeed.cursor}`
                : "/api/community/feed"
            const res = await fetch(url)
            const data = await res.json()
            setState(s => ({
                ...s,
                storyFeed: {
                    items: [...s.storyFeed.items, ...data.items],
                    cursor: data.nextCursor,
                    loading: false
                }
            }))
        } catch (e) {
            console.error("Failed to fetch feed", e)
            setState(s => ({ ...s, storyFeed: { ...s.storyFeed, loading: false } }))
        }
    }

    const refreshConnections = async () => {
        try {
            const res = await fetch("/api/user/connections")
            const data = await res.json()
            setState(s => ({ ...s, connections: data.connections }))
        } catch (e) {
            console.error("Failed to fetch connections", e)
        }
    }

    const repairConnection = async (provider: string) => {
        addLog(`Initiating repair flow for ${provider}...`, "info")
        try {
            const res = await fetch("/api/user/connections/action", {
                method: "POST",
                body: JSON.stringify({ userId: 'demo-user', provider, action: 'repair' })
            })
            if (res.ok) {
                await new Promise(r => setTimeout(r, 1500))
                addLog(`${provider} connection repaired and re-authorized.`, "success")
                refreshConnections()
            }
        } catch (e) {
            console.error("Failed to repair connection", e)
        }
    }

    const simulateConnectionBreak = async (provider: string, type: 'expired' | 'revoked') => {
        try {
            await fetch("/api/user/connections/action", {
                method: "POST",
                body: JSON.stringify({ userId: 'demo-user', provider, action: 'simulateBreak', type })
            })
            addLog(`Simulated ${type} status for ${provider}. Resilience tests triggered.`, "warning")
            refreshConnections()
        } catch (e) {
            console.error("Failed to simulate break", e)
        }
    }

    const disconnectProvider = async (provider: string) => {
        try {
            await fetch("/api/user/connections/action", {
                method: "POST",
                body: JSON.stringify({ userId: 'demo-user', provider, action: 'disconnect' })
            })
            addLog(`Revoked ${provider} access. Token purged from session.`, "warning")
            refreshConnections()
        } catch (e) {
            console.error("Failed to disconnect", e)
        }
    }

    const togglePitStop = async (note?: string) => {
        const newMode = state.userState.mode === 'normal' ? 'pit_stop' : 'normal';
        try {
            const res = await fetch("/api/demo/user/pitstop", {
                method: "POST",
                body: JSON.stringify({ mode: newMode, note })
            })
            if (res.ok) {
                addLog(newMode === 'pit_stop' ? "Pit Stop Mode active. Recovery data streams priority." : "Resuming Summer Series rhythm.", "info")
                refreshProgress()
            }
        } catch (e) {
            console.error("Failed to toggle pit stop", e)
        }
    }

    React.useEffect(() => {
        refreshProgress()
        refreshActivities()
        fetchSchedulerStatus()
        refreshCommunityStats()
        loadMoreStories()
        refreshConnections()

        // Polling for statuses
        const interval = setInterval(() => {
            fetchSchedulerStatus()
            refreshCommunityStats()
            refreshConnections()
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    const setStep = (step: number) => setState(s => ({ ...s, step }))
    const nextStep = () => setState(s => ({ ...s, step: s.step + 1 }))
    const prevStep = () => setState(s => ({ ...s, step: Math.max(0, s.step - 1) }))

    const addLog = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
        setState(s => ({
            ...s,
            syncLogs: [{ id: Math.random().toString(), msg, type }, ...s.syncLogs].slice(0, 50)
        }))
    }

    const setProfile = async (profile: Partial<DemoState['profile']>) => {
        setState(s => {
            const updatedProfile = { ...s.profile, ...profile };
            fetch("/api/demo/onboarding", {
                method: "POST",
                body: JSON.stringify(updatedProfile)
            }).catch(e => console.error("Failed to set profile", e));
            return { ...s, profile: updatedProfile };
        });
    }

    const syncActivities = async (provider = "strava") => {
        setState(s => ({ ...s, syncStatus: "loading" }))
        addLog(`Initiating streaming sync with ${provider}...`, "info")

        const eventSource = new EventSource(`/api/demo/sync/stream?provider=${provider}`)

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            addLog(data.msg, data.type || "info")

            if (data.step === 'complete') {
                setState(s => ({
                    ...s,
                    syncStatus: "success",
                    lastSyncTime: "Just now"
                }))
                refreshProgress()
                refreshActivities()
                eventSource.close()
                setTimeout(() => setState(s => ({ ...s, syncStatus: "idle" })), 3000)
            }

            if (data.step === 'error') {
                setState(s => ({ ...s, syncStatus: "error" }))
                eventSource.close()
            }

            if (data.step === 'warning') {
                setState(s => ({ ...s, syncStatus: data.msg.includes('rate-limit') ? "rate-limited" : "delayed" }))
                eventSource.close()
            }
        }

        eventSource.onerror = () => {
            setState(s => ({ ...s, syncStatus: "error" }))
            addLog("Stream connection interrupted. Resilience protocols engaged.", "error")
            eventSource.close()
        }
    }

    React.useEffect(() => {
        if (!state.demoMode) return
        const interval = setInterval(() => {
            const shouldTrigger = Math.random() > 0.8
            if (shouldTrigger) {
                const msgs = [
                    "Synthetic activity ingested.",
                    "Deduplication pulse check: Clear.",
                    "Provider handshake: Healthy.",
                    "Latency check: 12ms."
                ]
                addHint(msgs[Math.floor(Math.random() * msgs.length)], "info")
            }
        }, 15000)
        return () => clearInterval(interval)
    }, [state.demoMode])

    const toggleDemoMode = () => setState(s => ({ ...s, demoMode: !s.demoMode, hints: [] }))

    const addHint = (msg: string, type: string = "info") => {
        const id = Math.random().toString()
        setState(s => ({ ...s, hints: [...s.hints, { id, msg, type }] }))
        setTimeout(() => {
            setState(s => ({ ...s, hints: s.hints.filter(h => h.id !== id) }))
        }, 4000)
    }

    const updateRitualIdentity = (identity: Partial<DemoState['ritualIdentity']>) => {
        setState(s => ({ ...s, ritualIdentity: { ...s.ritualIdentity, ...identity } }))
    }

    const updateSettings = (settings: Partial<DemoState['settings']>) => {
        setState(s => ({ ...s, settings: { ...s.settings, ...settings } }))
    }

    const generateDemoActivities = () => {
        const newActivities = [
            { id: 'd1', type: 'Run', miles: 3.2, timestamp: new Date(Date.now() - 86400000).toISOString(), provider: 'Strava' },
            { id: 'd2', type: 'Walk', miles: 1.5, timestamp: new Date(Date.now() - 43200000).toISOString(), provider: 'Manual' }
        ]
        setState(s => ({
            ...s,
            activities: [...newActivities, ...s.activities],
            totals: { ...s.totals, miles: s.totals.miles + 4.7 }
        }))
        addLog("Demo data injection: 2 activities added to ledger.", "success")
        addHint("Preview activities generated.", "success")
    }

    const updateHydration = (count: number) => {
        setState(s => ({ ...s, hydrationCount: count }))
        addLog(`Hydration log: ${count} units synced.`, "info")
    }

    const updateRefuel = (refuel: Partial<DemoState['refuelState']>) => {
        setState(s => ({ ...s, refuelState: { ...s.refuelState, ...refuel } }))
        addLog("Refuel event secured in ledger.", "success")
    }

    return (
        <DemoContext.Provider value={{
            ...state,
            setStep,
            setProfile,
            syncActivities,
            refreshActivities,
            correctActivity,
            undoAction,
            nextStep,
            prevStep,
            addLog,
            loadMoreStories,
            repairConnection,
            simulateConnectionBreak,
            disconnectProvider,
            togglePitStop,
            toggleDemoMode,
            addHint,
            updateRitualIdentity,
            updateSettings,
            generateDemoActivities,
            updateHydration,
            updateRefuel
        }}>
            {children}
        </DemoContext.Provider>
    )
}

export function useDemo() {
    const context = React.useContext(DemoContext)
    if (context === undefined) {
        throw new Error("useDemo must be used within a DemoProvider")
    }
    return context
}
