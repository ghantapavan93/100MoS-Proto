"use client"

import * as React from "react"
import { useDemo } from "./DemoContext"
import { Button } from "@/components/ui/button"
import { RefreshCw, Info, CheckCircle2, AlertCircle, Clock, Heart, Sparkles, Zap, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import confetti from "canvas-confetti"
import { AnimatedNumber } from "@/components/ui/animated-number"

export function ProgressHomeStep() {
    const { totals, syncStatus, lastSyncTime, nextSyncTime, syncActivities, profile, syncLogs, userState, motivation, addHint, generateDemoActivities, updateHydration, updateRefuel, hydrationCount, refuelState } = useDemo()
    const [celebrated, setCelebrated] = React.useState(false)
    const [showRecoveryPlan, setShowRecoveryPlan] = React.useState(false)
    const [showLogSheet, setShowLogSheet] = React.useState(false)
    const shouldReduceMotion = useReducedMotion()

    const isPitStop = userState.mode === 'pit_stop'
    const targetMiles = isPitStop ? 20 : 100
    const progress = Math.min((totals.miles / targetMiles) * 100, 100)
    const circumference = 2 * Math.PI * 90 // radius = 90

    React.useEffect(() => {
        if (totals.miles >= (targetMiles * 0.01) && !celebrated) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: isPitStop ? ['#0ea5e9', '#ffffff', '#2dd4bf'] : ['#f97316', '#ffffff', '#3b82f6']
            })
            setCelebrated(true)
        }
    }, [totals.miles, celebrated, isPitStop, targetMiles])

    return (
        <div className={`space-y-12 transition-all duration-[2000ms] ${isPitStop ? 'grayscale-[0.4] contrast-[0.9]' : ''}`} style={{ '--motion-scale': isPitStop ? '0.8' : '1' } as any}>
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* 3D Progress Ring with Glow */}
                <motion.div
                    animate={shouldReduceMotion ? {} : {
                        boxShadow: [
                            "0 0 0px rgba(255,120,40,0.0)",
                            "0 0 18px rgba(255,120,40,0.35)",
                            "0 0 0px rgba(255,120,40,0.0)"
                        ]
                    }}
                    transition={{
                        duration: (3.5 / (isPitStop ? 0.8 : 1)),
                        repeat: (isPitStop || shouldReduceMotion) ? 0 : Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative h-72 w-72 flex-shrink-0 rounded-full"
                >
                    <div className={`absolute inset-0 rounded-full blur-[40px] animate-pulse ${isPitStop ? 'bg-blue-500/10' : 'bg-orange-500/10'}`} />

                    <svg className={`h-full w-full rotate-[-90deg] drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] ${isPitStop ? 'drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]' : ''}`}>
                        <circle cx="144" cy="144" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                        <circle cx="144" cy="144" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" fill="transparent" className="text-white/10" />
                        <motion.circle
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            cx="144" cy="144" r="90" stroke="currentColor" strokeWidth="12" strokeDasharray={circumference} strokeLinecap="round" fill="transparent"
                            className={isPitStop ? "text-blue-500" : "text-orange-500"}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <AnimatedNumber
                            value={totals.miles}
                            decimals={1}
                            className="text-7xl font-black uppercase tracking-tighter text-white"
                        />
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isPitStop ? 'text-blue-500/70' : 'text-orange-500/70'}`}>
                            {isPitStop ? 'RECOVERY TARGET' : 'MILES TARGET'}
                        </span>
                    </div>
                    {/* System Confidence Trigger */}
                    <AnimatePresence>
                        {syncStatus === "success" && (
                            <motion.div
                                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute -top-12 left-0 bg-green-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl pointer-events-none flex items-center gap-2"
                            >
                                <CheckCircle2 className="h-3 w-3" />
                                Your total remains correct
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Stats Column */}
                <div className="flex-1 space-y-6 w-full">
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                rotateX: 5,
                                rotateY: -5,
                                transition: { type: "spring", stiffness: 400, damping: 15 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addHint("Consistency check: You've moved 5/7 days this week.", "info")}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="glass-card p-6 rounded-3xl group transition-all text-left relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <span className="block text-4xl font-black text-white group-hover:scale-110 transition-transform origin-left">
                                    <AnimatedNumber value={totals.daysLeft} />
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Days Remaining</span>
                            </div>
                            {/* Shimmer Effect */}
                            <motion.div
                                initial={{ x: "100%" }}
                                whileHover={{ x: "-100%" }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -z-0"
                            />
                        </motion.button>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                rotateX: 5,
                                rotateY: 5,
                                transition: { type: "spring", stiffness: 400, damping: 15 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addHint("A 4-day rhythm is the 'High Consistency' zone.", "info")}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="glass-card p-6 rounded-3xl group transition-all relative overflow-hidden text-left"
                        >
                            <div className="relative z-10">
                                {totals.miles >= 1.0 && (
                                    <div className="absolute -top-1 -right-1">
                                        <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                                    </div>
                                )}
                                <span className="block text-4xl font-black text-white group-hover:scale-110 transition-transform origin-left">4</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Weekly Rhythm</span>
                            </div>
                            {/* Shimmer Effect */}
                            <motion.div
                                initial={{ x: "100%" }}
                                whileHover={{ x: "-100%" }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -z-0"
                            />
                        </motion.button>
                    </div>

                    {/* Live Technical Log */}
                    <div className="bg-black/80 border border-white/5 rounded-2xl p-4 font-mono text-[10px] h-32 overflow-hidden relative shadow-inner">
                        <div className="absolute top-2 right-4 flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[8px] text-zinc-600 uppercase font-black">Sync-Stream Live</span>
                        </div>
                        <div className="space-y-1 overflow-y-auto h-full scrollbar-hide flex flex-col-reverse">
                            {syncLogs.length === 0 ? (
                                <p className="text-zinc-700">Waiting for stream data...</p>
                            ) : (
                                syncLogs.map((log) => (
                                    <p key={log.id} className={`${log.type === "success" ? "text-green-500" :
                                        log.type === "warning" ? "text-orange-500" :
                                            log.type === "error" ? "text-red-500" : "text-zinc-500"
                                        }`}>
                                        <span className="text-zinc-700 mr-2">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                        {log.msg}
                                    </p>
                                ))
                            )}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Sync Health Strip */}
            <div className={`glass-card rounded-[2rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-500 ${syncStatus === "rate-limited" || syncStatus === "delayed" || syncStatus === "error"
                ? "border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]"
                : "hover:border-white/20"
                }`}>
                <div className="flex items-center gap-6">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-black transition-all duration-500 overflow-hidden ${syncStatus === "loading" ? "bg-orange-500 animate-spin" :
                        syncStatus === "rate-limited" || syncStatus === "delayed" ? "bg-orange-500" :
                            syncStatus === "success" ? "bg-green-500" :
                                syncStatus === "error" ? "bg-red-500" : "bg-white"
                        }`}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={syncStatus}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {syncStatus === "loading" ? <RefreshCw className="h-8 w-8" /> :
                                    syncStatus === "rate-limited" ? <AlertCircle className="h-8 w-8" /> :
                                        syncStatus === "delayed" ? <Clock className="h-8 w-8" /> :
                                            syncStatus === "success" ? <CheckCircle2 className="h-8 w-8" /> : <RefreshCw className="h-8 w-8" />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-black uppercase tracking-widest text-white italic">
                                {syncStatus === "rate-limited"
                                    ? "Safe Sync Mode: Queued"
                                    : syncStatus === "error" ? "Provider Outage Detected" :
                                        <motion.span
                                            animate={{ opacity: [1, 0.5] }}
                                            transition={{ duration: 10, times: [0.1, 1] }}
                                        >
                                            Last Check: {lastSyncTime || 'Never'}
                                        </motion.span>}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-zinc-500 mt-1">
                            {syncStatus === "rate-limited"
                                ? "Resilience protocols engaged. Sync will resume automatically."
                                : syncStatus === "error" ? "No miles lost. Our outage protocol is currently holding all requests." : "Continuous monitoring for new activities across all connected devices."}
                        </p>
                        {nextSyncTime && syncStatus !== "loading" && (
                            <div className="flex items-center gap-1.5 mt-2">
                                <Clock className="h-3 w-3 text-zinc-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                    Next scheduled sync in: {Math.max(0, Math.floor((nextSyncTime - Date.now()) / 60000))}m
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <SyncPipelineButton />
            </div>

            {/* Crew Pulse & Coaching Edge Integration */}
            {/* Coaching Nudge / Motivation Alert */}
            <AnimatePresence>
                {motivation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="glass-card border-orange-500/20 bg-orange-500/5 p-6 rounded-3xl flex items-center gap-6 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000" />
                        <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-black flex-shrink-0 animate-bounce">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1">Coaching Trigger: {motivation.type}</p>
                            <p className="text-lg font-black text-white italic">"{motivation.message}"</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                            <X className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 glass-card border-white/5 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-6">
                        <div>
                            <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-white">Crew Pulse</CardTitle>
                            <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Team Performance • 2026 Summer Series</p>
                        </div>
                        <Badge className="bg-orange-500/20 text-orange-500 border-none font-black text-[10px]">RANK #3</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-zinc-600">First-Timers (Your Crew)</p>
                                    <h4 className="text-3xl font-black text-white italic">4,284 <span className="text-xs font-bold text-zinc-600 not-italic">total miles</span></h4>
                                </div>
                                <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 hover:bg-orange-500 hover:text-black transition-all text-[9px] font-black uppercase tracking-widest">
                                    <Heart className="h-3 w-3 mr-2" /> Cheer Crew
                                </Button>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-orange-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "68%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-white/5 overflow-hidden p-8 flex flex-col justify-between group hover:border-blue-500/30 transition-all">
                    <div className="space-y-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-black transition-all">
                            <Zap className="h-6 w-6 text-blue-500 group-hover:text-inherit" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-black text-white uppercase italic">Coaching Edge</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                {isPitStop
                                    ? "Pit Stop mode active. Your focus today is deep recovery. No mile pressure."
                                    : "You're 12% ahead of your weekly rhythm. Consider a light recovery walk tomorrow."}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="link"
                        onClick={() => setShowRecoveryPlan(true)}
                        className="text-blue-500 font-black uppercase tracking-widest text-[9px] p-0 h-auto justify-start hover:text-white transition-colors"
                    >
                        View Recovery Plan
                    </Button>
                </Card>
            </div>

            {/* Recovery Plan Drawer */}
            <AnimatePresence>
                {showRecoveryPlan && (
                    <div className="fixed inset-0 z-[500] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowRecoveryPlan(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="relative w-full max-w-md bg-zinc-950 border-l border-white/10 p-10 h-full flex flex-col"
                        >
                            <div className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-hide">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white uppercase italic">Recovery Plan</h3>
                                    <p className="text-[10px] text-blue-500 font-extrabold uppercase tracking-widest">Personalized for {isPitStop ? 'Deep Rest' : 'Consistency'}</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { title: "Recovery Walk", dur: "10 Minutes", icon: Clock, desc: "Easy pace, focused on lymphatic drainage.", anim: { rotate: [0, 360] }, animDur: 4 },
                                        { title: "Hydration Target", dur: "2.5 Liters", icon: Heart, desc: "Essential for cellular repair today.", anim: { scale: [1, 1.2, 1] }, animDur: 1.5 },
                                        { title: "Stretch Flow", dur: "5 Minutes", icon: Sparkles, desc: "Slow mobility for hip and ankle stability.", anim: { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }, animDur: 2 }
                                    ].map((plan, i) => (
                                        <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4 group hover:border-blue-500/30 transition-all">
                                            <div className="flex justify-between items-start">
                                                <motion.div
                                                    animate={plan.anim}
                                                    transition={{ duration: plan.animDur, repeat: Infinity, ease: "easeInOut" }}
                                                    className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"
                                                >
                                                    <plan.icon className="h-5 w-5" />
                                                </motion.div>
                                                <Button size="sm" className="h-8 bg-white text-black font-black uppercase tracking-widest text-[8px] rounded-lg">Start</Button>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-black text-white uppercase">{plan.title}</h4>
                                                    <span className="text-[9px] text-zinc-500 font-bold uppercase">{plan.dur}</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{plan.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button onClick={() => setShowRecoveryPlan(false)} className="h-16 w-full bg-blue-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl mt-8">
                                Close Plan
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {totals.miles >= 1.0 && celebrated && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-orange-500 text-black p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs"
                >
                    Milestone Cross: This is how it starts.
                </motion.div>
            )}

            {profile.why_statement && (
                <div className="glass-morphism p-10 rounded-[2.5rem] text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <Heart className="h-6 w-6 text-orange-500" />
                    </div>
                    <p className="text-orange-500 text-xs mb-3 uppercase font-black tracking-[0.3em]">THE STORY BEHIND THE MILES</p>
                    <p className="text-2xl text-white font-medium italic leading-relaxed">"{profile.why_statement}"</p>
                </div>
            )}

            {/* Activity Journal & Quick Log CTA */}
            <ActivityJournal onQuickLog={() => setShowLogSheet(true)} />

            {/* Quick Log Sheet */}
            <AnimatePresence>
                {showLogSheet && (
                    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl" onClick={() => setShowLogSheet(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-md w-full glass-card border-white/10 p-10 rounded-[3rem] shadow-2xl space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Quick Log</h3>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Manual Activity Entry</p>
                            </div>
                            <LogActivityForm
                                onSubmit={() => {
                                    generateDemoActivities()
                                    setShowLogSheet(false)
                                }}
                                onCancel={() => setShowLogSheet(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function LogActivityForm({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) {
    const [selectedType, setSelectedType] = React.useState('Walk')
    const [miles, setMiles] = React.useState('1.5')
    const [intensity, setIntensity] = React.useState(50)

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Activity Type</label>
                <div className="grid grid-cols-2 gap-2">
                    {['Walk', 'Run', 'Yoga', 'Cycle'].map(t => (
                        <Button
                            key={t}
                            onClick={() => setSelectedType(t)}
                            variant="outline"
                            className={`h-12 border-white/5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${selectedType === t
                                ? 'bg-orange-500 text-black border-orange-500'
                                : 'bg-white/5 text-white hover:bg-orange-500/20 hover:border-orange-500/40'
                                }`}
                        >
                            {t}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Miles Covered</label>
                <input
                    type="number"
                    step="0.1"
                    value={miles}
                    onChange={(e) => setMiles(e.target.value)}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-black text-2xl text-center focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="1.5"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
                    Intensity: {intensity}%
                </label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 rounded-full bg-zinc-900 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
            </div>

            <Button
                onClick={onSubmit}
                className="h-16 w-full bg-orange-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:bg-orange-600 transition-colors"
            >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Commit {selectedType} ({miles} mi)
            </Button>
            <Button variant="ghost" onClick={onCancel} className="w-full text-zinc-600 text-[10px] font-black uppercase">Cancel</Button>
        </div>
    )
}

function ActivityJournal({ onQuickLog }: { onQuickLog: () => void }) {
    const { activities, correctActivity, undoAction } = useDemo()
    const [selectedActivity, setSelectedActivity] = React.useState<any>(null)
    const [lastAction, setLastAction] = React.useState<{ id: string, msg: string } | null>(null)

    const handleCorrect = async (values: any) => {
        const delta = values.miles - (selectedActivity.effective_miles);
        const actionId = `corr_${Date.now()}`; // Simplified for demo, real one comes from API
        await correctActivity({
            activityId: selectedActivity.id,
            delta_miles: delta,
            reason: values.reason,
            notes: values.notes
        })
        setLastAction({ id: actionId, msg: "Correction applied." })
        setSelectedActivity(null)

        // Auto-clear undo after 10s
        setTimeout(() => setLastAction(null), 10000)
    }

    return (
        <div className="space-y-6 pt-12 border-t border-white/5 relative">
            <AnimatePresence>
                {lastAction && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-orange-500 text-black px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-4 shadow-2xl"
                    >
                        <span>{lastAction.msg}</span>
                        <button
                            onClick={() => {
                                // undoAction(lastAction.id)
                                setLastAction(null)
                                // In a real demo, we'd fetch the actual actionId from the POST response
                            }}
                            className="bg-black text-white px-3 py-1 rounded-full text-[8px] hover:scale-105 transition-transform"
                        >
                            Undo (1m)
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                    <h3 className="text-lg font-black uppercase tracking-widest text-white italic">Activity Journal</h3>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Filter: All
                    </div>
                </div>
            </div>

            <div className="grid gap-3">
                {activities.length === 0 ? (
                    <div className="relative">
                        <div className="space-y-3 opacity-20 grayscale">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="glass-card p-5 rounded-3xl border-dashed flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/5" />
                                        <div className="h-4 w-32 bg-zinc-900 rounded" />
                                    </div>
                                    <div className="h-6 w-12 bg-zinc-900 rounded" />
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                            <div className="text-center space-y-1">
                                <p className="text-white font-black uppercase tracking-[0.4em] text-xs">Waiting for your first step</p>
                                <p className="text-zinc-600 font-bold uppercase tracking-widest text-[9px]">Connect a provider or log manually below</p>
                            </div>
                            <Button
                                onClick={onQuickLog}
                                className="h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-2xl backdrop-blur-xl group"
                            >
                                <Zap className="h-3 w-3 mr-2 text-orange-500 group-hover:scale-125 transition-transform" />
                                Log 10-Min Walk
                            </Button>
                        </div>
                    </div>
                ) : (
                    activities.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ scale: 1.01, border: '1px solid rgba(249,115,22,0.3)' }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setSelectedActivity(item);
                            }}
                            onClick={() => setSelectedActivity(item)}
                            className="glass-card p-5 rounded-3xl flex items-center justify-between cursor-pointer group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:bg-orange-500 transition-colors">
                                    <span className="text-zinc-600 group-hover:text-black font-black text-xs uppercase">
                                        {item.provider.slice(0, 2)}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-sm tracking-tight">{item.type || 'Run'} Event</span>
                                        {item.corrections_count > 0 && (
                                            <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded-full text-[8px] font-black text-orange-500 uppercase tracking-tighter">
                                                {item.corrections_count} Correction(s)
                                            </span>
                                        )}
                                        {item.is_excluded === 1 && item.corrections_count === 0 && (
                                            <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-[8px] font-black text-red-500 uppercase tracking-tighter">
                                                Excluded
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-mono">
                                        {new Date(item.ts).toLocaleDateString()} • {new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {item.latest_note && (
                                        <div className="flex items-center gap-1.5 mt-1 opacity-70">
                                            <div className="h-1 w-1 rounded-full bg-orange-500" />
                                            <span className="text-[9px] text-zinc-400 italic truncate max-w-[200px]">"{item.latest_note}"</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-black text-white lining-nums">
                                    {(item.effective_miles || 0).toFixed(2)}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/70">Effective Miles</span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Edit Drawer */}
            <AnimatePresence>
                {selectedActivity && (
                    <EditDrawer
                        activity={selectedActivity}
                        onClose={() => setSelectedActivity(null)}
                        onSave={handleCorrect}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function EditDrawer({ activity, onClose, onSave }: { activity: any, onClose: () => void, onSave: (v: any) => Promise<void> }) {
    const [miles, setMiles] = React.useState(activity.effective_miles)
    const [reason, setReason] = React.useState("")
    const [notes, setNotes] = React.useState(activity.latest_note ?? "")
    const [isSaving, setIsSaving] = React.useState(false)

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-white/10 rounded-t-[2.5rem] p-8 z-[101] shadow-2xl max-w-2xl mx-auto touch-none"
            >
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing" />

                <div className="space-y-8">
                    <header className="flex justify-between items-start">
                        <div>
                            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Edit Activity</h4>
                            <p className="text-xs text-zinc-500 font-mono mt-1 uppercase">ID: {activity.id.slice(0, 16)}... (Audit Trail Active)</p>
                        </div>
                        <Button variant="ghost" onClick={onClose} className="text-zinc-500">Close</Button>
                    </header>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Miles (Goal)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={miles}
                                onChange={(e) => setMiles(parseFloat(e.target.value))}
                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-2xl font-black text-white focus:border-orange-500/50 outline-none transition-all"
                            />
                            <p className="text-[8px] text-zinc-600 font-bold ml-1 uppercase tracking-widest">
                                Delta: {(miles - (activity.effective_miles || 0)).toFixed(2)} miles
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Reason</label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:border-orange-500/50 outline-none transition-all h-[66px]"
                            >
                                <option value="">Select Reason...</option>
                                <option value="GPS Drift">GPS Drift / Error</option>
                                <option value="Wrong Activity Type">Wrong Activity Type</option>
                                <option value="Manual Addition">Forgot to record (Manual)</option>
                                <option value="Duplicate">Duplicate record</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="How did it feel?"
                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-orange-500/50 outline-none transition-all h-24 resize-none"
                        />
                    </div>

                    <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex gap-3">
                        <Info className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2 text-left">
                            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                                <span className="text-orange-500 font-black uppercase tracking-widest mr-1">Trust Layer:</span>
                                Your provider data is immutable. We apply a {(miles - (activity.effective_miles || 0)) >= 0 ? '+' : ''}{(miles - (activity.effective_miles || 0)).toFixed(2)} mile correction to your summer ledger.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={async () => {
                            setIsSaving(true)
                            await onSave({ miles, reason, notes })
                            setIsSaving(false)
                        }}
                        disabled={isSaving || !reason || miles === activity.effective_miles && notes === (activity.latest_note ?? "")}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-widest py-8 rounded-2xl group relative overflow-hidden h-16"
                    >
                        {isSaving ? "Publishing Audit Trail..." : (
                            <>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Commit Correction & Update Totals
                                    <CheckCircle2 className="h-4 w-4" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                />
                            </>
                        )}
                    </Button>

                    <div className="pt-4 border-t border-white/5">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">Integrity Audit History</h5>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="h-2 w-2 rounded-full bg-zinc-800 mt-1" />
                                <div className="text-left">
                                    <p className="text-[10px] text-white font-bold uppercase tracking-tight">Original Import from {activity.provider}</p>
                                    <p className="text-[9px] text-zinc-600 font-mono mt-0.5">MILES: {activity.miles} • SYNCED: {new Date(activity.ts).toLocaleString()}</p>
                                </div>
                            </div>
                            {activity.corrections_count > 0 && (
                                <div className="flex gap-4 items-start">
                                    <div className="h-2 w-2 rounded-full bg-orange-500 mt-1" />
                                    <div className="text-left">
                                        <p className="text-[10px] text-orange-500 font-bold uppercase tracking-tight italic">Active Correction Layer</p>
                                        <p className="text-[9px] text-zinc-600 font-mono mt-0.5">TOTAL ADJUSTMENT: {(activity.total_correction || 0) > 0 ? '+' : ''}{(activity.total_correction || 0).toFixed(2)} MILES • ACROSS {activity.corrections_count || 0} EVENTS</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}
function SyncPipelineButton() {
    const { syncActivities, syncStatus, addHint } = useDemo()
    const [showPipeline, setShowPipeline] = React.useState(false)
    const [stage, setStage] = React.useState(0)
    const stages = ["Received", "Deduplicated", "Validated", "Applied"]

    const handleSync = async () => {
        setShowPipeline(true)
        setStage(0)

        // Simulate pipeline sequence
        for (let i = 0; i < stages.length; i++) {
            setStage(i)
            await new Promise(r => setTimeout(r, 600))
        }

        await syncActivities()
        addHint("Pipeline Clear: Totals updated successfully.", "success")
        setTimeout(() => setShowPipeline(false), 2000)
    }

    return (
        <>
            <Button
                onClick={handleSync}
                disabled={syncStatus === "loading" || showPipeline}
                className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-widest text-xs px-10 rounded-2xl h-16 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
            >
                {syncStatus === "loading" ? "Syncing..." : "Sync Now"}
            </Button>

            <AnimatePresence>
                {showPipeline && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="fixed bottom-32 right-8 z-[200] max-w-xs w-full glass-card border-orange-500/30 p-8 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Sync Pipeline</h4>
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                            </div>

                            <div className="space-y-4">
                                {stages.map((s, i) => (
                                    <div key={s} className="flex items-center gap-4">
                                        <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-colors ${i <= stage ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-zinc-700'}`}>
                                            {i < stage ? <CheckCircle2 className="h-3 w-3" /> : <span className="text-[8px] font-black">{i + 1}</span>}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${i <= stage ? 'text-white' : 'text-zinc-700'}`}>{s}</span>
                                        {i === stage && (
                                            <motion.div
                                                layoutId="pipeline-glow"
                                                className="ml-auto h-1 w-1 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)]"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
