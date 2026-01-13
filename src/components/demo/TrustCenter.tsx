"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Download, Trash2, ShieldAlert, CheckCircle2, Lock, History, Box, Database, Key, Eye, UserX, Flame, Radiation, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDemo } from "./DemoContext"
import { ActionButton } from "@/components/ui/action-button"

export function TrustCenter() {
    const { totals, addLog } = useDemo()
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [showConfirm, setShowConfirm] = React.useState(false)
    const [isPacking, setIsPacking] = React.useState(false)
    const [purgeProgress, setPurgeProgress] = React.useState(0)
    const holdTimer = React.useRef<NodeJS.Timeout | null>(null)

    const handleExport = async () => {
        setIsPacking(true)
        addLog("Initiating Secure Packing Sequence", "info")
        await new Promise(r => setTimeout(r, 4000))
        setIsPacking(false)
        addLog("Data Ledger Archive Ready for Download", "success")
    }

    const startPurgeHold = () => {
        let progress = 0
        holdTimer.current = setInterval(() => {
            progress += 1.5
            setPurgeProgress(progress)
            if (progress >= 100) {
                if (holdTimer.current) clearInterval(holdTimer.current)
                handleDelete()
            }
        }, 30)
    }

    const stopPurgeHold = () => {
        if (holdTimer.current) clearInterval(holdTimer.current)
        if (purgeProgress < 100) setPurgeProgress(0)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        addLog("Executing Cryptographic Purge", "warning")
        await new Promise(r => setTimeout(r, 3000))
        window.location.href = "/" // Redirect to home
    }

    const auditTrail = [
        { action: "Provider Sync", system: "Strava API", ts: "2m ago", status: "Verified", icon: Zap },
        { action: "Identity Lock", system: "Auth Core", ts: "1h ago", status: "Secure", icon: Key },
        { action: " Ledger Update", system: "DB Instance", ts: "4h ago", status: "Signed", icon: Lock },
    ]

    return (
        <div className="space-y-12">
            <div className="space-y-4 text-center pb-8 border-b border-white/5">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mx-auto"
                >
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Active Privacy Shield</span>
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">Your Data, Your <span className="text-blue-500">Sovereignty.</span></h2>
                <p className="text-zinc-500 max-w-2xl mx-auto text-sm font-medium leading-relaxed">In the 100 Miles of Summer, we don't just secure your data — we empower you to own it. Access, export, or erase everything in one click.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Data Security Card */}
                <Card className="glass-card border-white/5 overflow-hidden group hover:border-blue-500/30 transition-all">
                    <CardContent className="p-10 space-y-8">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <Lock className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Encryption & Transit</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                                Your activity history is encrypted at rest (AES-256) and in transit (TLS 1.3). No third-party ad trackers or sales are permitted.
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Badge className="bg-white/5 text-white/50 border-white/10 font-black px-4 py-2">SOC 2 TYPE II</Badge>
                            <Badge className="bg-blue-500/20 text-blue-500 border-none font-black px-4 py-2 uppercase tracking-tighter">GDPR PRIVACY FOCUS</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Trail Card */}
                <Card className="glass-card border-white/5 overflow-hidden group hover:border-orange-500/30 transition-all">
                    <CardContent className="p-10 space-y-8">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-orange-500/10 flex items-center justify-center group-hover:-rotate-12 transition-transform">
                            <History className="h-8 w-8 text-orange-500" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Immutable Ledger</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                                Every distance correction and manual note is cryptographically signed. This ensures the integrity of the collective goal.
                            </p>
                        </div>
                        <div className="text-[11px] font-black text-white uppercase flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            {totals.miles.toFixed(1)} miles signed in trail
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                    <ActionButton
                        onClick={handleExport}
                        label="Download Data Archive (.JSON)"
                        loadingLabel="Packing Ledger Chunks..."
                        className="h-24 w-full rounded-[2.5rem] bg-white text-black font-black text-sm"
                    >
                        <Download className="mr-3 h-6 w-6" />
                    </ActionButton>

                    {/* Export Packing Animation Overlay */}
                    <AnimatePresence>
                        {isPacking && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-white rounded-[2.5rem] flex items-center justify-center gap-8 overflow-hidden z-20 pointer-events-none"
                            >
                                <div className="relative flex items-center">
                                    {[1, 2, 3].map((bit, i) => (
                                        <motion.div
                                            key={bit}
                                            initial={{ x: -100, opacity: 0 }}
                                            animate={{ x: 0, opacity: [0, 1, 0] }}
                                            transition={{
                                                duration: 1.2,
                                                repeat: Infinity,
                                                delay: i * 0.3,
                                                ease: "circOut"
                                            }}
                                            className="absolute"
                                        >
                                            <Database className="h-8 w-8 text-black/20" />
                                        </motion.div>
                                    ))}
                                    <Box className="h-12 w-12 text-black relative z-10" />
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className="absolute -top-4 -right-4"
                                    >
                                        <Badge className="bg-black text-white font-black">PACKING</Badge>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div
                    className="relative cursor-none group"
                    onMouseDown={startPurgeHold}
                    onMouseUp={stopPurgeHold}
                    onMouseLeave={stopPurgeHold}
                    onTouchStart={startPurgeHold}
                    onTouchEnd={stopPurgeHold}
                >
                    <button
                        className={`
                            h-24 w-full rounded-[2.5rem] transition-all font-black uppercase tracking-[0.3em] text-[12px]
                            flex items-center justify-center relative overflow-hidden
                            ${purgeProgress > 0 ? 'bg-red-500/20 text-red-500 scale-[0.98]' : 'bg-red-500/5 text-red-500 border border-red-500/20 hover:border-red-500/50'}
                        `}
                    >
                        <div
                            className="absolute inset-0 bg-red-500/30 origin-left transition-all duration-75"
                            style={{ width: `${purgeProgress}%` }}
                        />
                        <Trash2 className="mr-3 h-6 w-6 relative z-10 group-hover:animate-bounce" />
                        <span className="relative z-10">
                            {purgeProgress > 0 ? "Purge in Progress..." : "Hold to Incinerate Data"}
                        </span>
                    </button>

                    {/* Incineration Indicator */}
                    <AnimatePresence>
                        {purgeProgress > 0 && purgeProgress < 100 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-16 left-1/2 -translate-x-1/2 bg-red-600 text-white font-black px-6 py-2 rounded-xl text-4xl italic tracking-tighter"
                            >
                                {Math.floor(purgeProgress)}%
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Audit Timeline */}
            <div className="glass-card rounded-[3rem] border-white/5 p-10 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">System Integrity Audit</p>
                        <h4 className="text-xl font-black text-white uppercase italic">Live Security Feed</h4>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest animate-pulse">All Systems Green</span>
                        <div className="h-3 w-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                </div>

                <div className="space-y-4">
                    {auditTrail.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                                    <log.icon className="h-5 w-5 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight">{log.action}</p>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{log.system}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-zinc-500">{log.ts}</p>
                                <p className="text-xs font-black text-green-500 uppercase italic tracking-tighter">{log.status}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Retention Note */}
            <div className="text-center space-y-2 py-12">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
                    Data Retention Policy: Non-active records are purged 30 days after August 31st.
                </p>
            </div>

            {/* Incineration Overlay Ritual */}
            <AnimatePresence>
                {isDeleting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-12 text-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                rotate: [0, 10, -10, 0],
                                color: ["#ef4444", "#f97316", "#ef4444"]
                            }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="mb-12"
                        >
                            <Flame className="h-32 w-32" />
                        </motion.div>

                        <div className="space-y-6">
                            <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter">Data Incinerated.</h3>
                            <p className="text-xl font-bold text-red-500 uppercase tracking-widest animate-pulse">Wiping Ledger • Revoking Tokens • Erasing Story</p>
                        </div>

                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 3, ease: "linear" }}
                            className="h-1 bg-red-500 mt-12 max-w-lg w-full"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
