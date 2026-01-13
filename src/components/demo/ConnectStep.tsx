"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Zap, CheckCircle2, AlertCircle, RefreshCw, Key, Lock, Globe, Database, ArrowRight, Box, UserX, Activity, Smartphone, Info, TrendingUp } from "lucide-react"
import { useDemo } from "./DemoContext"
import { ActionButton } from "@/components/ui/action-button"

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'needs-attention'

export function ConnectStep() {
    const { connections, setProfile, repairConnection, simulateConnectionBreak, disconnectProvider, addLog, nextStep, generateDemoActivities } = useDemo()
    const [isConnecting, setIsConnecting] = React.useState(false)
    const [showDeltaCheck, setShowDeltaCheck] = React.useState(false)
    const [showPipeline, setShowPipeline] = React.useState(false)
    const [showDemoModal, setShowDemoModal] = React.useState(false)
    const [localConnections, setLocalConnections] = React.useState(connections)

    // For simplicity in the demo, we just focus on the 'strava' connection
    const activeConnections = localConnections.length > 0 ? localConnections : connections
    const stravaConn = activeConnections.find(c => c.provider === 'strava')
    const status = stravaConn ? stravaConn.status : 'disconnected'

    const [handshakeStage, setHandshakeStage] = React.useState<'none' | 'permissions' | 'flow'>('none')

    const startHandshake = () => {
        setShowDeltaCheck(true)
        addLog("Opening Delta Check drawer...", "info")
    }

    const handleConfirmPermissions = () => {
        setHandshakeStage('flow')
    }

    const handleConnect = async () => {
        setIsConnecting(true)
        addLog("Initiating OAuth2.0 handshake with Strava...", "info")
        await new Promise(r => setTimeout(r, 2000))

        // Update local connections state
        setLocalConnections([
            { provider: 'strava', status: 'active', expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() }
        ])

        setIsConnecting(false)
        setHandshakeStage('none')
        addLog("Strava connected successfully. Auth Token secure.", "success")
    }

    // Auto-connect after Delta Check animation
    React.useEffect(() => {
        if (showDeltaCheck && (status === 'disconnected' || status === 'expired')) {
            const timer = setTimeout(async () => {
                await handleConnect()
                setShowDeltaCheck(false)
            }, 4000) // Close after animation completes (4 seconds)
            return () => clearTimeout(timer)
        }
    }, [showDeltaCheck, status])

    return (
        <div className="space-y-16">
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mx-auto">
                    <Key className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Secure Integration</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                    CONNECT <span className="text-orange-500 italic">STREAM.</span>
                </h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto leading-relaxed">
                    We bridge your movement from Strava, Garmin, and Apple Health with zero friction.
                </p>
            </div>

            <div className="max-w-xl mx-auto">
                <Card className="glass-card border-white/5 overflow-hidden relative">
                    <CardContent className="p-10 text-center space-y-8">
                        <AnimatePresence mode="wait">
                            {isConnecting ? (
                                <motion.div key="conn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-10">
                                    <RefreshCw className="h-16 w-16 text-orange-500 animate-spin mx-auto" />
                                    <p className="text-sm font-black text-white uppercase tracking-[0.3em] animate-pulse">Establishing Secure Tunnel...</p>
                                </motion.div>
                            ) : status === 'disconnected' ? (
                                <motion.div key="disc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="h-24 w-24 rounded-[2rem] bg-zinc-900 mx-auto flex items-center justify-center text-zinc-700"
                                    >
                                        <Shield className="h-10 w-10" />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-white uppercase italic">Ready to Bridge</h3>
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Your data stays yours. We only read the miles.</p>
                                    </div>
                                    <Button onClick={startHandshake} className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-widest text-xs rounded-2xl">
                                        Connect Strava
                                    </Button>
                                </motion.div>
                            ) : status === 'active' ? (
                                <motion.div key="succ" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                    <div className="relative h-24 w-24 mx-auto">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-0 rounded-[2rem] bg-green-500"
                                        />
                                        <div className="relative h-24 w-24 rounded-[2rem] bg-green-500 flex items-center justify-center text-black shadow-xl">
                                            <CheckCircle2 className="h-10 w-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-white uppercase italic">Connected & Secure</h3>
                                        <p className="text-[10px] text-green-500/70 font-black uppercase tracking-[0.2em]">OAuth Token: [ID_V4_842...] • Status: Active</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setLocalConnections([
                                                    { provider: 'strava', status: 'expired' }
                                                ])
                                                addLog("Token expired. Connection needs repair.", "warning")
                                            }}
                                            className="h-12 border-white/5 bg-white/5 text-zinc-500 font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-white/10"
                                        >
                                            Simulate Expiry
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setLocalConnections([])
                                                addLog("Strava disconnected.", "info")
                                            }}
                                            className="h-12 border-white/5 bg-white/10 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-red-500/20"
                                        >
                                            Disconnect
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="err" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <div className="h-24 w-24 rounded-[2rem] bg-red-500/20 mx-auto flex items-center justify-center text-red-500 border border-red-500/30">
                                        <AlertCircle className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-white uppercase italic">
                                            {status === 'expired' ? 'Token Expired' : 'Access Revoked'}
                                        </h3>
                                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ backgroundPosition: ["0%", "100%"] }}
                                                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                                className="h-full w-full bg-gradient-to-r from-red-500/50 via-red-400 to-red-500/50 bg-[length:200%_100%]"
                                            />
                                        </div>
                                        <p className="text-xs text-red-500 font-bold uppercase tracking-widest">
                                            {status === 'expired' ? 'Refresh window closed. Safe Sync Mode active.' : 'Participation permissions removed via Provider settings.'}
                                        </p>
                                    </div>
                                    <Button onClick={startHandshake} className="w-full h-16 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all">
                                        Repair Connection
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <div className="mt-12 grid grid-cols-2 gap-6">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDeltaCheck(true)}
                        className="flex flex-col gap-4 p-6 glass-card rounded-3xl border-white/5 cursor-pointer hover:border-orange-500/30 transition-colors shadow-2xl relative group"
                    >
                        <div className="flex items-center justify-between">
                            <Zap className="h-6 w-6 text-orange-500 group-hover:animate-pulse" />
                            {status === 'active' && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-widest">Live Sync</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time delta checks</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPipeline(true)}
                        className="flex flex-col gap-4 p-6 glass-card rounded-3xl border-white/5 cursor-pointer hover:border-blue-500/30 transition-colors shadow-2xl group"
                    >
                        <div className="flex items-center justify-between">
                            <Shield className="h-6 w-6 text-blue-500 group-hover:rotate-12 transition-transform" />
                            {status === 'active' && <Lock className="h-3 w-3 text-blue-500/50" />}
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-widest">End-to-End</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Encrypted mile ingestion</p>
                        </div>
                    </motion.div>
                </div>

                {/* Provider Tiles */}
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    {[
                        { name: 'Strava', icon: Smartphone, active: status === 'active' },
                        { name: 'Garmin', icon: Globe, active: false },
                        { name: 'Apple Health', icon: Activity, active: false }
                    ].map((p, i) => (
                        <motion.div
                            key={p.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{
                                scale: 1.05,
                                y: -2,
                                rotateX: 5,
                                rotateY: 5,
                                transition: { type: "spring", stiffness: 400, damping: 15 }
                            }}
                            className={`px-4 py-2 rounded-xl flex items-center gap-2 border text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden group cursor-default ${p.active ? 'bg-orange-500/10 border-orange-500/40 text-orange-500' : 'bg-white/5 border-white/10 text-zinc-600 hover:bg-white/10 hover:text-zinc-400'
                                }`}
                        >
                            <p.icon className={`h-3 w-3 ${p.active ? 'animate-pulse' : ''}`} />
                            {p.name}
                            {p.active && (
                                <motion.div
                                    layoutId="provider-glow"
                                    className="absolute inset-0 bg-orange-500/5 blur-md"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button
                        variant="ghost"
                        onClick={() => status === 'active' ? nextStep() : setShowDemoModal(true)}
                        className="text-zinc-600 hover:text-white font-black uppercase tracking-[0.3em] text-[10px]"
                    >
                        Continue to Dashboard <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Delta Check Drawer */}
            <AnimatePresence>
                {showDeltaCheck && (
                    <div className="fixed inset-0 z-[500] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeltaCheck(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-10 h-full flex flex-col"
                        >
                            <div className="space-y-8 flex-1 overflow-y-auto pr-4 scrollbar-hide">
                                <div className="space-y-2">
                                    <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase italic">Delta Check</h3>
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Polling Secure Provider Streams</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: "Polling connected providers...", icon: RefreshCw, spin: true },
                                        { label: "Found 1 new activity", icon: CheckCircle2, delay: 1000 },
                                        { label: "Deduplication check passed", icon: Shield, delay: 2000 },
                                        { label: "Ledger append complete", icon: Lock, delay: 2800 },
                                        { label: "Progress updated", icon: TrendingUp, delay: 3500 }
                                    ].map((step, i) => (
                                        <DelayedStep key={i} {...step} show={showDeltaCheck} />
                                    ))}
                                </div>

                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stream Status</span>
                                        <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1">
                                            <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                                            Active
                                        </span>
                                    </div>
                                    <div className="h-px bg-white/5" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Last Check</span>
                                        <span className="text-[10px] font-black text-white uppercase">Just Now</span>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={() => setShowDeltaCheck(false)} className="h-16 w-full bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl">
                                Close Terminal
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Pipeline Viewer Modal */}
            <AnimatePresence>
                {showPipeline && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPipeline(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl glass-card border-white/10 p-12 rounded-[4rem] shadow-2xl overflow-hidden"
                        >
                            <div className="space-y-12 h-64 flex flex-col justify-center">
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black text-white uppercase italic">Encrypted Ingestion Pipeline</h3>
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Audit Trail: [AES-256-GCM] Active</p>
                                </div>

                                <div className="relative flex justify-between items-center px-12">
                                    {/* Connection Lines */}
                                    <div className="absolute inset-x-24 h-[1px] bg-zinc-800 top-1/2 -translate-y-1/2 z-0" />

                                    {[
                                        { icon: Shield, label: "Token Verified" },
                                        { icon: Globe, label: "Provider Fetch" },
                                        { icon: RefreshCw, label: "Normalize" },
                                        { icon: Database, label: "Ledger Update" },
                                        { icon: CheckCircle2, label: "Verified" }
                                    ].map((node, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: i * 0.4 }}
                                            className="relative z-10 flex flex-col items-center gap-4"
                                        >
                                            <motion.div
                                                animate={{
                                                    borderColor: ['rgba(255,255,255,0.05)', 'rgba(59,130,246,0.5)', 'rgba(255,255,255,0.05)'],
                                                    backgroundColor: ['rgba(255,255,255,0.02)', 'rgba(59,130,246,0.1)', 'rgba(255,255,255,0.02)']
                                                }}
                                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                                                className="h-14 w-14 rounded-2xl border border-white/10 flex items-center justify-center text-blue-500 relative overflow-hidden"
                                            >
                                                <node.icon className="h-6 w-6" />
                                                <motion.div
                                                    animate={{ x: [-50, 100], opacity: [0, 1, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
                                                />
                                            </motion.div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 absolute -bottom-8 whitespace-nowrap">{node.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-8 right-8 cursor-pointer text-zinc-600 hover:text-white" onClick={() => setShowPipeline(false)}>
                                <UserX className="h-6 w-6" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Demo Mode Modal */}
            <AnimatePresence>
                {showDemoModal && (
                    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-md w-full glass-card border-white/10 p-10 rounded-[3rem] shadow-2xl space-y-8"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-[2rem] bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Info className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black text-white italic">DEMO MODE READY</h3>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                                    You can proceed without connecting real data. We'll inject 2 sample activities to simulate the ritual.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <ActionButton
                                    onClick={async () => {
                                        generateDemoActivities()
                                        await new Promise(r => setTimeout(r, 1000))
                                        nextStep()
                                    }}
                                    label="Generate & Continue"
                                    className="h-16 w-full bg-white text-black"
                                />
                                <Button variant="ghost" onClick={() => setShowDemoModal(false)} className="w-full h-12 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                                    Stay on this page
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function DelayedStep({ label, icon: Icon, spin, delay = 0, show }: { label: string, icon: any, spin?: boolean, delay?: number, show: boolean }) {
    const [visible, setVisible] = React.useState(false)
    React.useEffect(() => {
        if (!show) { setVisible(false); return }
        const t = setTimeout(() => setVisible(true), delay)
        return () => clearTimeout(t)
    }, [delay, show])

    if (!visible) return null

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 py-2"
        >
            <div className={`h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 ${spin ? 'animate-spin' : ''}`}>
                <Icon className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">{label}</p>
        </motion.div>
    )
}
