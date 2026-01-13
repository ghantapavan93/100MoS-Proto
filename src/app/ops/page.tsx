"use client"

import * as React from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useSpring } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Activity,
    ShieldCheck,
    Clock,
    AlertCircle,
    Zap,
    Server,
    Filter,
    BarChart3,
    RefreshCw,
    MessageSquare,
    CheckCircle2,
    History,
    Volume2,
    VolumeX,
    RotateCcw,
    Target,
    Wifi,
    WifiOff,
    Timer,
    Flame,
    Check,
    Sparkles,
    PartyPopper,
    Cloud,
    Footprints,
    ZapOff
} from "lucide-react"
import { MovingBanner } from "@/components/ui/moving-banner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { SimpleLineGraph } from "@/components/ui/simple-line-graph"
import { useOpsSimulation } from "@/hooks/useOpsSimulation"
import { Incident, TimelineEvent, OpsMetrics, Flags } from "@/types/ops"
import { CommandCenterBackground } from "@/components/ui/command-center-background"
import { MagneticCard } from "@/components/ui/magnetic-card"

// Animated number component with count-up effect
function AnimatedNumber({ value, decimals = 0, duration = 1, className = "" }: { value: number, decimals?: number, duration?: number, className?: string }) {
    const [displayValue, setDisplayValue] = React.useState(0)

    React.useEffect(() => {
        const controls = animate(displayValue, value, {
            duration,
            ease: "easeOut",
            onUpdate: (v) => setDisplayValue(v)
        })
        return () => controls.stop()
    }, [value, duration])

    return <span className={className}>{displayValue.toFixed(decimals)}</span>
}

// Typewriter effect component
function Typewriter({ text }: { text: string }) {
    const [displayText, setDisplayText] = React.useState("")

    React.useEffect(() => {
        let i = 0
        setDisplayText("")
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i))
                i++
            } else {
                clearInterval(interval)
            }
        }, 20)
        return () => clearInterval(interval)
    }, [text])

    return <span>{displayText}</span>
}

// Confetti component
function Confetti({ show }: { show: boolean }) {
    if (!show) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: -20,
                        rotate: 0,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: window.innerHeight + 20,
                        rotate: Math.random() * 720,
                        x: Math.random() * window.innerWidth
                    }}
                    transition={{
                        duration: Math.random() * 2 + 2,
                        ease: "linear"
                    }}
                    className={`absolute w-3 h-3 rounded-sm ${['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500'][i % 5]
                        }`}
                />
            ))}
        </div>
    )
}

// Types are now imported from @/types/ops

// Activity heatmap data (simulated)
const HEATMAP_DATA = [
    [2, 1, 0, 0, 0, 1, 3, 5, 8, 12, 15, 10, 8, 6, 5, 8, 12, 18, 22, 15, 8, 4, 2, 1], // Mon
    [1, 0, 0, 0, 1, 2, 4, 7, 10, 14, 12, 9, 7, 5, 6, 9, 14, 20, 18, 12, 6, 3, 2, 1], // Tue
    [2, 1, 0, 0, 0, 1, 3, 6, 9, 11, 13, 10, 8, 6, 5, 7, 11, 16, 19, 14, 7, 4, 2, 1], // Wed
    [1, 1, 0, 0, 0, 2, 4, 8, 12, 15, 14, 11, 9, 7, 6, 8, 12, 17, 21, 16, 9, 5, 3, 1], // Thu
    [2, 1, 1, 0, 0, 1, 3, 5, 8, 10, 11, 9, 7, 5, 4, 6, 10, 14, 17, 13, 8, 5, 3, 2], // Fri
    [3, 2, 1, 1, 0, 0, 1, 2, 4, 8, 12, 15, 14, 11, 9, 7, 8, 10, 12, 10, 6, 4, 3, 2], // Sat
    [4, 3, 2, 1, 0, 0, 1, 2, 3, 6, 10, 14, 16, 13, 10, 8, 7, 9, 11, 9, 5, 4, 3, 2], // Sun
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function OpsPage() {
    const [hasMounted, setHasMounted] = React.useState(false)
    const [baseMetrics, setBaseMetrics] = React.useState<OpsMetrics | null>(null)
    const [timelineEvents, setTimelineEvents] = React.useState<TimelineEvent[]>([])
    const [timelineCursor, setTimelineCursor] = React.useState<string | null>(null)
    const [incidentsCursor, setIncidentsCursor] = React.useState<string | null>(null)
    const [isTimelineLoading, setIsTimelineLoading] = React.useState(false)
    const [isIncidentsLoading, setIsIncidentsLoading] = React.useState(false)
    const [baseFlags, setBaseFlags] = React.useState<Flags>({
        rate_limit: false,
        delay: false,
        duplicates: false,
        outage: false
    })
    const [traffic, setTraffic] = React.useState<number[]>(Array(60).fill(35))
    const [soundEnabled, setSoundEnabled] = React.useState(false)
    const [uptime, setUptime] = React.useState(0)
    const [acknowledgedIncidents, setAcknowledgedIncidents] = React.useState<Set<number>>(new Set())
    const [lastIncidentTime, setLastIncidentTime] = React.useState<Date | null>(null)
    const audioRef = React.useRef<HTMLAudioElement | null>(null)
    const metricsRef = React.useRef<OpsMetrics | null>(null)
    const [showConfetti, setShowConfetti] = React.useState(false)
    const [shakeScreen, setShakeScreen] = React.useState(false)
    const [nudgeSuccess, setNudgeSuccess] = React.useState<string | null>(null)
    const [nudgeTargetUserId, setNudgeTargetUserId] = React.useState<string | null>(null)
    const [pingProvider, setPingProvider] = React.useState<string | null>(null)
    const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null)
    const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null)

    const refreshOps = React.useCallback(async () => {
        try {
            const [resStats, resTimeline] = await Promise.all([
                fetch("/api/ops/stats"),
                fetch("/api/ops/timeline?limit=20")
            ])
            const data = await resStats.json()
            const timelineData = await resTimeline.json()

            if (metricsRef.current?.recentIncidents && data.recentIncidents) {
                const newIncidents = data.recentIncidents.filter(
                    (i: Incident) => !metricsRef.current?.recentIncidents.find(m => m.id === i.id)
                )
                if (newIncidents.length > 0 && soundEnabled && audioRef.current) {
                    audioRef.current.play().catch(() => { })
                    setLastIncidentTime(new Date())
                }
            }

            metricsRef.current = data
            setBaseMetrics(data)
            setTimelineEvents(timelineData.items)
            setTimelineCursor(timelineData.nextCursor)

            setTraffic(prev => {
                const base = baseFlags.outage ? 8 : (baseFlags.rate_limit ? 20 : 45)
                const lastVal = prev[prev.length - 1]
                const change = (Math.random() - 0.5) * 6
                const newVal = Math.max(5, Math.min(55, lastVal + change + (base - lastVal) * 0.1))
                return [...prev.slice(1), newVal]
            })
        } catch (e) {
            console.error(e)
        }
    }, [baseFlags.outage, baseFlags.rate_limit, soundEnabled])

    React.useEffect(() => {
        const interval = setInterval(() => {
            setUptime(prev => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    React.useEffect(() => {
        setHasMounted(true)
        refreshOps()
        const interval = setInterval(refreshOps, 30000)
        return () => clearInterval(interval)
    }, [refreshOps])

    const simulation = useOpsSimulation(baseMetrics, baseFlags, refreshOps)
    const { flags, effectiveMetrics, injectedEvents, activeScenario, runScenario, setSimulatedFlags } = simulation

    // Magnetic interaction state
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e
        setMousePos({ x: clientX, y: clientY })
    }

    if (!hasMounted) return null

    // Constants and derived values
    const COLLECTIVE_GOAL = 1000000
    const metrics = effectiveMetrics
    const calmScore = flags.outage ? 12 : (flags.rate_limit || flags.delay ? 64 : 98)
    const isStressMode = calmScore < 50
    const collectiveMiles = (metrics?.totalMiles || 0) * 3847

    const toggleFlag = async (flag: keyof Flags) => {
        const newFlags = { ...flags, [flag]: !flags[flag] }
        setSimulatedFlags(newFlags)

        // Screen shake when toggling outage ON
        if (flag === 'outage' && !flags.outage) {
            setShakeScreen(true)
            setTimeout(() => setShakeScreen(false), 500)
        }

        await fetch("/api/demo/simulate", {
            method: "POST",
            body: JSON.stringify(newFlags)
        })
        refreshOps()
    }

    const restoreCalm = async () => {
        const resetFlags = { rate_limit: false, delay: false, duplicates: false, outage: false }
        setSimulatedFlags(resetFlags)

        // Show confetti celebration
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)

        await fetch("/api/demo/simulate", {
            method: "POST",
            body: JSON.stringify(resetFlags)
        })
        refreshOps()
    }

    // Send nudge with success animation
    const handleQuietAction = async (userId: string, action: 'send_ritual' | 'dismiss') => {
        if (action === 'send_ritual') {
            setNudgeTargetUserId(userId)
            return
        }

        await fetch("/api/ops/action", {
            method: "POST",
            body: JSON.stringify({ userId, action })
        })
        setNudgeSuccess(userId)
        setTimeout(() => setNudgeSuccess(null), 2000)
        refreshOps()
    }

    const sendRitual = async (ritualType: string) => {
        if (!nudgeTargetUserId) return

        // Mock API call
        await fetch("/api/ops/action", {
            method: "POST",
            body: JSON.stringify({ userId: nudgeTargetUserId, action: "send_ritual", ritualType })
        })

        const id = nudgeTargetUserId
        setNudgeTargetUserId(null)
        setNudgeSuccess(id)
        setTimeout(() => setNudgeSuccess(null), 2000)
        refreshOps()
    }

    const resolveIncident = async (incidentId: number) => {
        await fetch("/api/ops/action", {
            method: "POST",
            body: JSON.stringify({ incidentId, action: 'resolve' })
        })
        refreshOps()
    }

    const acknowledgeIncident = (id: number) => {
        setAcknowledgedIncidents(prev => new Set([...prev, id]))
    }

    const loadMoreTimeline = async () => {
        if (!timelineCursor || isTimelineLoading) return
        setIsTimelineLoading(true)
        try {
            const res = await fetch(`/api/ops/timeline?cursor=${timelineCursor}&limit=20`)
            const data = await res.json()
            setTimelineEvents(prev => [...prev, ...data.items])
            setTimelineCursor(data.nextCursor)
        } catch (e) {
            console.error(e)
        } finally {
            setIsTimelineLoading(false)
        }
    }

    const loadMoreIncidents = async () => {
        if (isIncidentsLoading) return
        setIsIncidentsLoading(true)
        try {
            const cursor = incidentsCursor || (metrics?.recentIncidents[metrics.recentIncidents.length - 1]?.ts)
            const res = await fetch(`/api/ops/incidents?cursor=${cursor}&limit=10`)
            const data = await res.json()
            setBaseMetrics((prev: OpsMetrics | null) => prev ? ({
                ...prev,
                recentIncidents: [...prev.recentIncidents, ...data.items]
            }) : null)
            setIncidentsCursor(data.nextCursor)
        } catch (e) {
            console.error(e)
        } finally {
            setIsIncidentsLoading(false)
        }
    }





    if (!metrics) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-orange-500 animate-spin" />
        </div>
    )



    // Magnetic Tilt Helper
    const useMagneticTilt = (ref: React.RefObject<HTMLDivElement>) => {
        const x = useSpring(0, { stiffness: 100, damping: 30 })
        const y = useSpring(0, { stiffness: 100, damping: 30 })

        const onMouseMove = (e: React.MouseEvent) => {
            if (!ref.current) return
            const rect = ref.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const distanceX = e.clientX - centerX
            const distanceY = e.clientY - centerY
            x.set(distanceX / 10)
            y.set(distanceY / 10)
        }

        const onMouseLeave = () => {
            x.set(0)
            y.set(0)
        }

        return { x, y, onMouseMove, onMouseLeave }
    }

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h}h ${m}m ${s}s`
    }

    const getHeatColor = (value: number) => {
        if (value === 0) return 'bg-white/5'
        if (value <= 5) return 'bg-orange-500/20'
        if (value <= 10) return 'bg-orange-500/40'
        if (value <= 15) return 'bg-orange-500/60'
        return 'bg-orange-500'
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            className={`min-h-screen bg-black text-white p-4 md:p-8 font-mono overflow-x-hidden relative selection:bg-orange-500 selection:text-black ${isStressMode ? 'selection:bg-red-500' : ''}`}
        >
            <CommandCenterBackground isStressMode={isStressMode} />

            <motion.div
                animate={shakeScreen ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto relative z-10"
            >
                {/* Confetti celebration */}
                <Confetti show={showConfetti} />
                <MovingBanner className="rounded-2xl mb-12 shadow-2xl shadow-orange-500/20" />

                {/* Demo Mode Indicator */}
                {(activeScenario || Object.values(flags).some(Boolean)) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-6"
                    >
                        <Badge className="bg-orange-500 text-black font-black text-[9px] uppercase tracking-widest px-4 py-2">
                            <Sparkles className="h-3 w-3 mr-2 inline" />
                            Simulated Data • Local Only
                        </Badge>
                    </motion.div>
                )}

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <div className={`h-1.5 w-1.5 rounded-full ${isStressMode ? 'bg-red-500' : 'bg-orange-500'} animate-pulse`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Global Operational Cockpit</span>
                        </div>
                        <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter text-white ${isStressMode ? 'animate-pulse' : ''}`}>
                            COMMAND <span className={`${isStressMode ? 'text-red-500 glitch' : 'text-orange-500'} text-shadow-glow`}>CENTRAL.</span>
                        </h1>
                        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 max-w-xl leading-relaxed italic">
                            Aggregating real data across all participants. Proving <span className="text-white">resilience through transparency.</span>
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {/* Uptime Counter */}
                        <div className="glass-card p-6 rounded-3xl flex items-center gap-4 group hover:border-green-500/30 transition-all cursor-default">
                            <motion.div
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <Timer className="h-8 w-8 text-green-500" />
                            </motion.div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Uptime</p>
                                <p className="text-lg font-black text-white font-mono">{formatUptime(uptime)}</p>
                            </div>
                        </div>

                        {/* System Calm Score */}
                        <div className="glass-card p-6 rounded-3xl flex items-center gap-6 group hover:border-orange-500/30 transition-all cursor-default">
                            <div className="relative h-20 w-20">
                                {/* Glow effect behind the ring */}
                                <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${calmScore > 80 ? 'bg-green-500' : calmScore > 30 ? 'bg-orange-500' : 'bg-red-500 animate-pulse'}`} />

                                <svg className="h-full w-full rotate-[-90deg] relative z-10">
                                    <circle cx="40" cy="40" r="34" strokeWidth="8" fill="transparent" className="stroke-white/5" />
                                    <motion.circle
                                        cx="40" cy="40" r="34" strokeWidth="8" fill="transparent"
                                        strokeDasharray={213.6}
                                        animate={{ strokeDashoffset: 213.6 - (calmScore / 100) * 213.6 }}
                                        className={calmScore > 80 ? "stroke-green-500" : calmScore > 30 ? "stroke-orange-500" : "stroke-red-500"}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-black text-white text-xl z-20">
                                    <AnimatedNumber value={calmScore} duration={1} />%
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-orange-500 transition-colors">System Calm Score</p>
                                <p className="text-xs font-bold text-white mt-1 capitalize">{calmScore > 80 ? 'Optimal' : calmScore > 30 ? 'Pressure Ingress' : 'Critical Failure'}</p>
                            </div>
                        </div>

                        {/* Cloud Sync Status */}
                        <div className="glass-card p-6 rounded-3xl flex items-center gap-4 group hover:border-blue-500/30 transition-all cursor-default">
                            <div className="relative">
                                <motion.div
                                    animate={metrics.cloudSyncEnabled ? {
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                    } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`h-10 w-10 rounded-2xl flex items-center justify-center ${metrics.cloudSyncEnabled ? 'bg-blue-500/20 text-blue-500' : 'bg-zinc-800 text-zinc-600'}`}
                                >
                                    <Cloud className="h-6 w-6" />
                                </motion.div>
                                {metrics.cloudSyncEnabled && (
                                    <motion.div
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-400 blur-[2px]"
                                    />
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Cloud Sync Hub</p>
                                <p className={`text-xs font-black uppercase mt-1 ${metrics.cloudSyncEnabled ? 'text-blue-500' : 'text-zinc-600'}`}>
                                    {metrics.cloudSyncEnabled ? 'Active Bridge' : 'Local Only'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Challenge Progress Ring */}
                <Card className="glass-card border-white/5 overflow-hidden mb-8">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="relative h-24 w-24"
                                >
                                    <svg className="h-full w-full rotate-[-90deg]">
                                        <circle cx="48" cy="48" r="42" strokeWidth="8" fill="transparent" className="stroke-white/5" />
                                        <motion.circle
                                            cx="48" cy="48" r="42" strokeWidth="8" fill="transparent"
                                            strokeDasharray={264}
                                            initial={{ strokeDashoffset: 264 }}
                                            animate={{ strokeDashoffset: 264 - (Math.min(collectiveMiles / COLLECTIVE_GOAL, 1)) * 264 }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                            className="stroke-orange-500"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Target className="h-8 w-8 text-orange-500" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Summer 2026 Collective Goal</p>
                                    <p className="text-4xl font-black text-white">
                                        <AnimatedNumber value={collectiveMiles} duration={2} /> <span className="text-zinc-600 text-lg">/ {(COLLECTIVE_GOAL / 1000).toFixed(0)}K miles</span>
                                    </p>
                                    <p className="text-xs font-bold text-orange-500 mt-1">
                                        <AnimatedNumber value={(collectiveMiles / COLLECTIVE_GOAL) * 100} decimals={1} duration={2} />% complete • {Math.floor((COLLECTIVE_GOAL - collectiveMiles) / 50)} days to go
                                    </p>
                                </div>
                            </div>
                            <motion.div
                                animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="flex items-center gap-4"
                            >
                                <Flame className="h-12 w-12 text-orange-500/40" />
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Live Traffic */}
                    <Card className="lg:col-span-4 glass-card border-white/5 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-6">
                            <div>
                                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-white">Live Signal Frequency</CardTitle>
                                <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Aggregate Synchronizations • All Providers</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-zinc-600 uppercase">Deduplication Rate</p>
                                    <p className="text-sm font-black text-white">100.0%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-zinc-600 uppercase">Active Threads</p>
                                    <p className="text-sm font-black text-orange-500">12</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-48 px-0 pb-0 overflow-hidden">
                            <div className="relative h-full w-full flex items-end px-6">
                                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 150">
                                    <motion.polyline
                                        fill="none"
                                        stroke={isStressMode ? "#ef4444" : "#f97316"}
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={(traffic || []).map((v, i) => `${(i / (Math.max((traffic || []).length - 1, 1))) * 1000},${150 - (v * 2.5)}`).join(' ')}
                                        style={{ transition: 'all 2s ease-out' }}
                                    />
                                    {/* Gradient fill under the line */}
                                    <defs>
                                        <linearGradient id="trafficGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor={isStressMode ? "#ef4444" : "#f97316"} stopOpacity="0.3" />
                                            <stop offset="100%" stopColor={isStressMode ? "#ef4444" : "#f97316"} stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <motion.polygon
                                        fill="url(#trafficGradient)"
                                        points={`0,150 ${(traffic || []).map((v, i) => `${(i / (Math.max((traffic || []).length - 1, 1))) * 1000},${150 - (v * 2.5)}`).join(' ')} 1000,150`}
                                        style={{ transition: 'all 2s ease-out' }}
                                    />
                                </svg>
                                <div className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${isStressMode ? 'from-red-500/10' : 'from-orange-500/5'} to-transparent pointer-events-none`} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Provider Health Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { name: 'Strava', success: flags.outage ? 0 : 99.2, errors: flags.outage ? 100 : 0.8, latency: flags.delay ? 2400 : 145, color: 'orange' },
                                { name: 'Garmin', success: flags.outage ? 0 : 98.7, errors: flags.outage ? 100 : 1.3, latency: flags.delay ? 1800 : 230, color: 'blue' },
                                { name: 'Apple Health', success: flags.outage ? 0 : 99.9, errors: flags.outage ? 100 : 0.1, latency: flags.delay ? 3200 : 89, color: 'green' }
                            ].map((provider, idx) => (
                                <MagneticCard
                                    key={provider.name}
                                    whileHover={{ scale: 1.03 }}
                                    onClick={() => setSelectedProvider(provider.name)}
                                    className="glass-card p-6 rounded-2xl transition-all relative overflow-hidden cursor-pointer border border-white/5"
                                >
                                    {/* Data Pulse Aura */}
                                    <div className={`absolute inset-0 opacity-20 pointer-events-none blur-3xl transition-all duration-1000 ${provider.success > 90 ? 'bg-green-500/0 group-hover:bg-green-500/10' : 'bg-red-500/20 animate-pulse'
                                        }`} />

                                    {/* Ping animation for healthy providers */}
                                    {provider.success > 90 && (
                                        <motion.div
                                            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                                            className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500"
                                        />
                                    )}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                animate={provider.success > 90 ? { rotate: [0, 5, -5, 0] } : { x: [-2, 2, -2] }}
                                                transition={{ duration: provider.success > 90 ? 2 : 0.5, repeat: Infinity }}
                                            >
                                                {provider.success > 90 ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                                            </motion.div>
                                            <span className="text-xs font-black uppercase text-white">{provider.name}</span>
                                        </div>
                                        <Badge className={provider.success > 90 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                                            {provider.success > 90 ? 'HEALTHY' : 'DOWN'}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-zinc-500 uppercase">Success Rate</span>
                                            <span className="font-black text-white"><AnimatedNumber value={provider.success} decimals={1} duration={1} />%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${provider.success > 90 ? 'bg-green-500' : 'bg-red-500'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${provider.success}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] pt-2">
                                            <span className="text-zinc-600">Latency</span>
                                            <span className={`font-bold ${provider.latency > 500 ? 'text-orange-500' : 'text-zinc-400'}`}>
                                                <AnimatedNumber value={provider.latency} duration={0.8} />ms
                                            </span>
                                        </div>
                                    </div>
                                </MagneticCard>
                            ))}
                        </div>

                        {/* Operational Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MagneticCard
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedMetric('users')}
                                className="glass-card p-10 rounded-[2.5rem] space-y-4 hover:border-orange-500/30 transition-all group cursor-pointer border border-white/5"
                            >
                                <div className="flex items-center justify-between text-zinc-500 group-hover:text-orange-500 transition-colors">
                                    <Users className="h-5 w-5" />
                                    <span className="text-[10px] font-black tracking-widest uppercase">Users Today</span>
                                </div>
                                <div className="text-6xl font-black text-white tracking-tighter">
                                    <AnimatedNumber value={metrics.activeUsers} duration={1.5} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-1.5 w-1.5 rounded-full bg-green-500"
                                    />
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Scaling on demand</p>
                                </div>
                            </MagneticCard>

                            <MagneticCard
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedMetric('sync')}
                                className="glass-card p-10 rounded-[2.5rem] space-y-4 hover:border-blue-500/30 transition-all group cursor-pointer border border-white/5"
                            >
                                <div className="flex items-center justify-between text-zinc-500 group-hover:text-blue-500 transition-colors">
                                    <RefreshCw className="h-5 w-5" />
                                    <span className="text-[10px] font-black tracking-widest uppercase">Sync Queue</span>
                                </div>
                                <div className="text-6xl font-black text-white tracking-tighter">
                                    <AnimatedNumber value={metrics.scheduledSyncs.queueDepth || 0} duration={1.5} />
                                    <span className="text-sm text-zinc-600 ml-1">ITEMS</span>
                                </div>
                                <div className="flex gap-4">
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                        P95 Age: <span className="text-orange-500">{metrics.scheduledSyncs.p95Age || '0m'}</span>
                                    </p>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic">
                                        Total/hr: <span className="text-blue-500">{metrics.scheduledSyncs.success}</span>
                                    </p>
                                </div>
                            </MagneticCard>

                            <MagneticCard
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedMetric('token')}
                                className="glass-card p-10 rounded-[2.5rem] space-y-4 hover:border-green-500/30 transition-all group cursor-pointer border border-white/5"
                            >
                                <div className="flex items-center justify-between text-zinc-500 group-hover:text-green-500 transition-colors">
                                    <ShieldCheck className="h-5 w-5" />
                                    <span className="text-[10px] font-black tracking-widest uppercase">Token Health</span>
                                </div>
                                <div className="text-4xl font-black text-white tracking-tighter">
                                    <AnimatedNumber value={metrics.dataHealth.tokenStability || 0} duration={1.5} />
                                    <span className="text-sm text-zinc-600 ml-1">STABLE</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                                        Cache: <span className="text-green-500">{metrics.dataHealth.cacheHealth}</span>
                                    </p>
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1 italic">
                                        Size: {metrics.dataHealth.dbSize}
                                    </p>
                                </div>
                            </MagneticCard>

                            <MagneticCard
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedMetric('miles')}
                                className="glass-card p-10 rounded-[2.5rem] space-y-4 hover:border-purple-500/30 transition-all group cursor-pointer border border-white/5"
                            >
                                <div className="flex items-center justify-between text-zinc-500 group-hover:text-purple-500 transition-colors">
                                    <Activity className="h-5 w-5" />
                                    <span className="text-[10px] font-black tracking-widest uppercase">Total Miles</span>
                                </div>
                                <div className="text-6xl font-black text-white tracking-tighter">
                                    <AnimatedNumber value={metrics.totalMiles || 0} decimals={0} duration={1.5} />
                                </div>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Collective Total</p>
                            </MagneticCard>
                        </div>

                        {/* Activity Heatmap */}
                        <div className="glass-card rounded-[3rem] p-10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-widest text-white">Activity Heatmap</h2>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Weekly patterns by hour</p>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-zinc-600">
                                    <span>Low</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded bg-white/5" />
                                        <div className="w-3 h-3 rounded bg-orange-500/20" />
                                        <div className="w-3 h-3 rounded bg-orange-500/40" />
                                        <div className="w-3 h-3 rounded bg-orange-500/60" />
                                        <div className="w-3 h-3 rounded bg-orange-500" />
                                    </div>
                                    <span>High</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                {HEATMAP_DATA.map((row, dayIndex) => (
                                    <div key={dayIndex} className="flex items-center gap-1">
                                        <span className="w-8 text-[9px] font-bold text-zinc-600 uppercase">{DAYS[dayIndex]}</span>
                                        <div className="flex gap-[2px] flex-1">
                                            {row.map((value, hourIndex) => (
                                                <motion.div
                                                    key={hourIndex}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    whileHover={{ scale: 1.5, zIndex: 10, borderRadius: "4px" }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`flex-1 h-4 rounded-sm ${getHeatColor(value)} hover:ring-2 hover:ring-white cursor-pointer shadow-sm`}
                                                    title={`${DAYS[dayIndex]} ${hourIndex}:00 - ${value} activities`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="w-8" />
                                    <div className="flex justify-between flex-1 text-[8px] text-zinc-700 font-bold">
                                        {[0, 6, 12, 18, 23].map(h => <span key={h}>{h}:00</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quiet List */}
                        <div className="glass-card rounded-[3rem] p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                                <Users className="h-48 w-48" />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">The Quiet List</h2>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Founders' Pulse: Re-engaging inactive participants</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="h-10 px-4 rounded-xl border-white/10 text-zinc-400 font-black tracking-widest text-[9px]">
                                        {(metrics.quietList || []).length} TARGETS FOUND
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(metrics.quietList || []).map((q, idx) => (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="group glass-card p-8 border-white/5 bg-white/[0.01] rounded-[2rem] hover:border-orange-500/30 transition-all relative overflow-hidden"
                                    >
                                        {/* Success animation overlay */}
                                        <AnimatePresence>
                                            {nudgeSuccess === q.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 1.5 }}
                                                    className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm z-10"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <Sparkles className="h-12 w-12 text-green-500" />
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <motion.div
                                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                                    className="h-12 w-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center font-black text-white text-lg italic shadow-xl"
                                                >
                                                    {q.name[0]}
                                                </motion.div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase tracking-tighter">{q.name}</p>
                                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{q.crew}</p>
                                                </div>
                                            </div>
                                            <Badge className={q.contacted ? "bg-green-500 text-black font-black" : "bg-zinc-800 text-zinc-500 font-black"}>
                                                {q.contacted ? "CONTACTED" : "QUIET"}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleQuietAction(q.id, "send_ritual")}
                                                disabled={q.contacted}
                                                className="h-12 rounded-xl border-white/5 bg-white/[0.02] hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                                            >
                                                <Target className="h-3 w-3 mr-2" />
                                                Send Ritual
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleQuietAction(q.id, "dismiss")}
                                                disabled={q.contacted}
                                                className="h-12 rounded-xl border-white/5 bg-white/[0.02] hover:bg-white hover:text-black transition-all text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                                            >
                                                <VolumeX className="h-3 w-3 mr-2" />
                                                Dismiss
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        {/* Live Community Pulse: "People Running" Section */}
                        <div className="glass-card rounded-[3rem] p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05] -rotate-12">
                                <Footprints className="h-64 w-64 text-orange-500" />
                            </div>
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">Live Community Pulse</h2>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Real-time Movement Detection • Bridged from Supabase</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                                        <motion.div
                                            animate={{ scale: [1, 1.5, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="h-2 w-2 rounded-full bg-green-500"
                                        />
                                        <span className="text-[10px] font-black text-green-500 uppercase">124 Runners Live</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex-shrink-0 w-64 glass-card p-6 border-white/5 bg-white/[0.02] rounded-3xl"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="relative">
                                                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 100}`} alt="avatar" />
                                                </div>
                                                <motion.div
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                    className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-orange-500 border-2 border-black flex items-center justify-center"
                                                >
                                                    <Zap className="h-2 w-2 text-black fill-black" />
                                                </motion.div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-tighter">Runner #{i + 10}4</p>
                                                <p className="text-[9px] font-bold text-zinc-600 uppercase">Synchronizing...</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-zinc-500 uppercase">Session Goal</span>
                                                <span className="text-white font-bold italic">5.2 mi</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    animate={{ width: ["10%", "85%", "10%"] }}
                                                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                                                    className="h-full bg-orange-500"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Spike Lab */}
                        <div className={`rounded-[3rem] p-10 shadow-[0_0_100px_rgba(249,115,22,0.2)] group relative overflow-hidden transition-all duration-500 ${isStressMode ? 'bg-red-500' : 'bg-orange-500'}`}>
                            <div className="absolute -top-10 -right-10 h-32 w-32 bg-black/10 rounded-full group-hover:scale-150 transition-transform duration-1000" />
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-3 italic">
                                    <Zap className="h-8 w-8 fill-black" />
                                    SPIKE LAB
                                </h2>
                                {Object.values(flags).some(Boolean) && (
                                    <Button
                                        onClick={restoreCalm}
                                        size="sm"
                                        className="bg-black/20 hover:bg-black/40 text-black font-black text-[9px] uppercase tracking-widest rounded-xl"
                                    >
                                        <RotateCcw className="h-3 w-3 mr-2" />
                                        Restore Calm
                                    </Button>
                                )}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-black/50 mb-10">High-Traffic Chaos Engineering</p>

                            <div className="space-y-4 relative">
                                {Object.entries(flags).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-6 bg-black/[0.08] rounded-2xl group/item hover:bg-black/15 transition-all">
                                        <div>
                                            <p className="text-[11px] font-black text-black uppercase tracking-widest block">{key.replace('_', ' ')}</p>
                                            <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest italic">Simulated stress</p>
                                        </div>
                                        <Switch
                                            checked={value}
                                            onCheckedChange={() => toggleFlag(key as keyof Flags)}
                                            className="data-[state=checked]:bg-black data-[state=unchecked]:bg-black/20"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Scenario Buttons */}
                            <div className="mt-8 pt-8 border-t border-black/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-black/50 mb-4">One-Click Scenarios</p>
                                <div className="grid grid-cols-1 gap-3">
                                    <Button
                                        onClick={() => runScenario('RATE_LIMIT')}
                                        disabled={activeScenario !== null}
                                        className="h-12 bg-black/10 hover:bg-black/20 text-black font-black text-[9px] uppercase tracking-widest rounded-xl disabled:opacity-50 justify-start"
                                    >
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Simulate Strava Rate Limit
                                    </Button>
                                    <Button
                                        onClick={() => runScenario('OUTAGE_SPIKE')}
                                        disabled={activeScenario !== null}
                                        className="h-12 bg-black/10 hover:bg-black/20 text-black font-black text-[9px] uppercase tracking-widest rounded-xl disabled:opacity-50 justify-start"
                                    >
                                        <Server className="h-4 w-4 mr-2" />
                                        Simulate Provider Outage
                                    </Button>
                                    <Button
                                        onClick={() => runScenario('DUPLICATE_STORM')}
                                        disabled={activeScenario !== null}
                                        className="h-12 bg-black/10 hover:bg-black/20 text-black font-black text-[9px] uppercase tracking-widest rounded-xl disabled:opacity-50 justify-start"
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Simulate Duplicate Storm
                                    </Button>
                                </div>
                                {activeScenario && (
                                    <p className="text-[9px] font-bold text-black/60 mt-3 italic text-center">Running {activeScenario.replace('_', ' ')}...</p>
                                )}
                            </div>
                        </div>

                        {/* Trust Timeline */}
                        <div className="glass-card rounded-[3rem] p-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Trust Timeline</h3>
                                </div>
                            </div>
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {/* Merge injected events from scenarios */}
                                {[...injectedEvents, ...timelineEvents].length === 0 && <p className="text-[10px] text-zinc-600 italic">No events yet.</p>}
                                {[...injectedEvents, ...timelineEvents].map((event) => (
                                    <div key={event.id} className="flex items-start gap-3 border-l-2 border-white/5 pl-4 py-1 relative">
                                        <div className={`absolute -left-[5px] top-2 h-2 w-2 rounded-full ${event.status === 'success' ? 'bg-green-500' :
                                            event.status === 'warning' ? 'bg-orange-500' :
                                                event.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                            }`} />
                                        <div>
                                            <p className="text-[11px] font-bold text-white leading-tight">{event.title}</p>
                                            <p className="text-[9px] text-zinc-500 mt-0.5">{event.subtitle}</p>
                                            <p className="text-[8px] text-zinc-700 mt-1 uppercase tracking-wider">{new Date(event.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {timelineCursor && (
                                    <div className="pt-4 flex justify-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={loadMoreTimeline}
                                            disabled={isTimelineLoading}
                                            className="text-[9px] font-black uppercase text-zinc-600 hover:text-white"
                                        >
                                            {isTimelineLoading ? <RefreshCw className="h-3 w-3 animate-spin mr-2" /> : <RotateCcw className="h-3 w-3 mr-2" />}
                                            Load More Events
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sound Toggle */}
                        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {soundEnabled ? <Volume2 className="h-5 w-5 text-orange-500" /> : <VolumeX className="h-5 w-5 text-zinc-600" />}
                                <div>
                                    <p className="text-xs font-black text-white uppercase">Alert Sounds</p>
                                    <p className="text-[9px] text-zinc-600 uppercase">Beep on new incidents</p>
                                </div>
                            </div>
                            <Switch
                                checked={soundEnabled}
                                onCheckedChange={setSoundEnabled}
                                className="data-[state=checked]:bg-orange-500"
                            />
                        </div>

                        {/* Live Resilience Feed */}
                        <div className="glass-card rounded-[3rem] p-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <History className="h-4 w-4 text-zinc-500" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Live Resilience Feed</h3>
                                </div>
                                <RefreshCw className="h-4 w-4 text-zinc-700 animate-spin-slow" />
                            </div>
                            <div className="space-y-6 max-h-80 overflow-y-auto">
                                <AnimatePresence mode="popLayout">
                                    {(metrics.recentIncidents || []).map((incident) => {
                                        const isAcknowledged = acknowledgedIncidents.has(incident.id)
                                        return (
                                            <motion.div
                                                key={incident.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: isAcknowledged ? 0.5 : 1, x: 0 }}
                                                className={`p-4 rounded-2xl glass-card border-white/5 space-y-3 group ${isAcknowledged ? 'opacity-50' : ''}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-1.5 w-1.5 rounded-full ${incident.type === 'error' ? 'bg-red-500' :
                                                            incident.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                                                            }`} />
                                                        <span className={`text-[11px] font-black uppercase tracking-widest ${incident.type === 'error' ? 'text-red-500/70' :
                                                            incident.type === 'warning' ? 'text-orange-500/70' : 'text-blue-500/70'
                                                            }`}>
                                                            {incident.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {!isAcknowledged && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => { resolveIncident(incident.id); acknowledgeIncident(incident.id); }}
                                                                className="h-6 px-2 text-[8px] text-zinc-600 hover:text-green-500 uppercase font-black"
                                                            >
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Resolve
                                                            </Button>
                                                        )}
                                                        <span className="text-[9px] font-black text-zinc-700 uppercase">
                                                            {new Date(incident.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className={`text-xs font-medium italic transition-colors ${isAcknowledged ? 'text-zinc-600 line-through' : 'text-zinc-400 group-hover:text-white'}`}>
                                                        "{isAcknowledged ? incident.msg : <Typewriter text={incident.msg} />}"
                                                    </p>

                                                    {incident.affectedUser && (
                                                        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-3 w-3 text-zinc-600" />
                                                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                                                    Affected: {incident.affectedUser}
                                                                    {incident.affectedProvider && ` • ${incident.affectedProvider}`}
                                                                </span>
                                                            </div>
                                                            {!isAcknowledged && (
                                                                <span className="text-[8px] font-black text-orange-500 uppercase tracking-tighter animate-pulse">Deep Drill Available</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                                {(metrics.recentIncidents || []).length === 0 && (
                                    <p className="text-[10px] font-bold text-zinc-700 uppercase text-center py-10 tracking-[0.2em]">No recent incidents</p>
                                )}
                                {(metrics.recentIncidents.length >= 10 && (incidentsCursor || !incidentsCursor)) && (
                                    <div className="pt-4 flex justify-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={loadMoreIncidents}
                                            disabled={isIncidentsLoading}
                                            className="text-[9px] font-black uppercase text-zinc-600 hover:text-white"
                                        >
                                            {isIncidentsLoading ? <RefreshCw className="h-3 w-3 animate-spin mr-2" /> : <Clock className="h-3 w-3 mr-2" />}
                                            Load Older Incidents
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Provider Drilldown Dialog */}
                <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
                    <DialogContent className="sm:max-w-2xl bg-zinc-950 border-white/5 text-zinc-400">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                                <Wifi className="h-6 w-6 text-orange-500" />
                                {selectedProvider} Operational Depth
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                                Real-time health telemetry & connectivity audit
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="space-y-6">
                                <div className="glass-card p-6 rounded-2xl border-white/5">
                                    <p className="text-[10px] font-black uppercase text-zinc-500 mb-2">Success Rate Histograph</p>
                                    <SimpleLineGraph
                                        data={[
                                            { label: '10m', value: 98 },
                                            { label: '8m', value: 99 },
                                            { label: '6m', value: 97 },
                                            { label: '4m', value: 99.5 },
                                            { label: '2m', value: 99.8 },
                                            { label: '0m', value: metrics?.providerHealth.find(p => p.provider === selectedProvider)?.success || 99 }
                                        ]}
                                        color="#22c55e"
                                    />
                                </div>
                                <div className="glass-card p-6 rounded-2xl border-white/5">
                                    <p className="text-[10px] font-black uppercase text-zinc-500 mb-4">Traffic Composition</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-zinc-600">GET /activities</span>
                                            <span className="text-white font-mono">1.2ms avg</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-zinc-600">POST /webhook</span>
                                            <span className="text-white font-mono">45ms p99</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                    <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Current Token Status</h4>
                                    <p className="text-sm text-white font-black italic">"Active & Throttled"</p>
                                    <p className="text-[10px] text-zinc-600 mt-2 uppercase">Last refresh: 12m ago</p>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Ingestion Pipeline</h4>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        Bridge connected via Supabase Replication. Deduplication filter active (SHA-256).
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-xl border-white/5 bg-white/[0.02] hover:bg-orange-500 hover:text-black transition-all text-[10px] font-black uppercase tracking-widest"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Force Token Rotation
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* KPI Drilldown Dialog */}
                <Dialog open={!!selectedMetric} onOpenChange={() => setSelectedMetric(null)}>
                    <DialogContent className="sm:max-w-xl bg-zinc-950 border-white/5 text-zinc-400">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                                {selectedMetric === 'users' && <Users className="h-6 w-6 text-orange-500" />}
                                {selectedMetric === 'sync' && <RefreshCw className="h-6 w-6 text-blue-500" />}
                                {selectedMetric === 'token' && <ShieldCheck className="h-6 w-6 text-green-500" />}
                                {selectedMetric === 'miles' && <Activity className="h-6 w-6 text-purple-500" />}
                                {selectedMetric?.toUpperCase()} Deep Drill
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                                Advanced analytical breakdown of operational telemetry
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 mt-4">
                            <div className="glass-card p-8 rounded-3xl border-white/5">
                                <p className="text-[10px] font-black uppercase text-zinc-500 mb-6 italic text-center">Last 24 Hour Frequency</p>
                                <SimpleLineGraph
                                    data={[
                                        { label: '3am', value: 12 },
                                        { label: '7am', value: 45 },
                                        { label: '11am', value: 89 },
                                        { label: '3pm', value: 120 },
                                        { label: '7pm', value: 240 },
                                        { label: '11pm', value: 180 }
                                    ]}
                                    color={
                                        selectedMetric === 'users' ? '#f97316' :
                                            selectedMetric === 'sync' ? '#3b82f6' :
                                                selectedMetric === 'token' ? '#22c55e' : '#a855f7'
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <p className="text-[10px] font-black uppercase text-zinc-600 mb-1">Standard Deviation</p>
                                    <p className="text-lg font-black text-white italic">0.14</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <p className="text-[10px] font-black uppercase text-zinc-600 mb-1">Reliability Index</p>
                                    <p className="text-lg font-black text-white italic">99.98%</p>
                                </div>
                            </div>

                            <p className="text-[10px] text-center text-zinc-700 font-bold uppercase tracking-[0.2em]">
                                System auto-scaling is currently optimal for this metric.
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Ritual Selector Dialog */}
                <Dialog open={!!nudgeTargetUserId} onOpenChange={() => setNudgeTargetUserId(null)}>
                    <DialogContent className="sm:max-w-md bg-zinc-950 border-white/5 text-zinc-400">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-orange-500" />
                                Launch Re-engagement
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                                Select a "Founder's Ritual" to wake up {metrics?.quietList.find(q => q.id === nudgeTargetUserId)?.name}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-3 mt-4">
                            <Button
                                onClick={() => sendRitual('sunrise')}
                                className="h-16 justify-start px-6 bg-white/[0.02] hover:bg-orange-500 hover:text-black border border-white/5 rounded-2xl group transition-all"
                            >
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest">The Sunrise Streak</p>
                                    <p className="text-[9px] text-zinc-500 group-hover:text-black/60 italic font-bold">Push notification: "Your crew missed you at dawn..."</p>
                                </div>
                            </Button>
                            <Button
                                onClick={() => sendRitual('ghost_miles')}
                                className="h-16 justify-start px-6 bg-white/[0.02] hover:bg-blue-500 hover:text-black border border-white/5 rounded-2xl group transition-all"
                            >
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest">The Ghost Miles</p>
                                    <p className="text-[9px] text-zinc-500 group-hover:text-black/60 italic font-bold">In-app prompt: "Someone just ran past your last mark..."</p>
                                </div>
                            </Button>
                            <Button
                                onClick={() => sendRitual('founder_direct')}
                                className="h-16 justify-start px-6 bg-white/[0.02] hover:bg-purple-500 hover:text-black border border-white/5 rounded-2xl group transition-all"
                            >
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Founder Direct</p>
                                    <p className="text-[9px] text-zinc-500 group-hover:text-black/60 italic font-bold">Email: "A personal note from the 100 Miles team."</p>
                                </div>
                            </Button>
                        </div>

                        <p className="text-[9px] text-center text-zinc-700 font-bold uppercase mt-4 italic">
                            All rituals are delivered via the AetherLabs Messaging Bridge.
                        </p>
                    </DialogContent>
                </Dialog>
            </motion.div>
        </div>
    )
}

