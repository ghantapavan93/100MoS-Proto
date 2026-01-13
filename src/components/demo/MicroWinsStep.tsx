"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap, Award, Share2, ArrowUpRight, CheckCircle2, ShieldCheck, Map, Clock } from "lucide-react"
import { useDemo } from "./DemoContext"
import { Button } from "@/components/ui/button"

const wins = [
    {
        id: "consistency",
        title: "CONSISTENCY ACE",
        description: "You've moved on 5 different days this week. This is what real change looks like.",
        evidence: "5/7 active days. Peak activity: Wednesday (4.2 mi).",
        why: "Regular movement at low intensity builds sustainable aerobic base and metabolic flexibility.",
        icon: Sparkles,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        id: "comeback",
        title: "THE COMEBACK",
        description: "You returned after a 10-day break. Most people stop there, but you started again.",
        evidence: "Previous activity: June 4. Return activity: June 15.",
        why: "Psychological resilience is defined by the 'Second Start'. Bridging gaps prevents total drop-offs.",
        icon: Zap,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        id: "rhythm",
        title: "RHYTHM MAKER",
        description: "Your most consistent time is 6:00 PM. You're building a ritual that your body trusts.",
        evidence: "80% of activities started between 5:45 PM and 6:30 PM.",
        why: "Entraining your circadian rhythm reduces perceived effort and improves recovery efficiency.",
        icon: Award,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
]

export function MicroWinsStep() {
    const { addLog } = useDemo()
    const [expandedWin, setExpandedWin] = React.useState<string | null>(null)

    return (
        <div className="space-y-16">
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mx-auto">
                    <Sparkles className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Milestone Engine</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                    MICRO-<span className="text-orange-500 italic">WINS.</span>
                </h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto leading-relaxed">
                    Celebrating the small steps that lead to big summers. Every achievement is tracked and validated.
                </p>
            </div>

            <div className="space-y-6">
                {wins.map((win, i) => (
                    <motion.div
                        key={win.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{
                            scale: 1.02,
                            rotateX: 2,
                            rotateY: 2,
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                            transition: { type: "spring", stiffness: 300, damping: 20 }
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className={`group glass-card border-white/5 rounded-[2.5rem] p-4 flex flex-col hover:border-orange-500/30 transition-all cursor-pointer relative overflow-hidden ${expandedWin === win.id ? 'ring-2 ring-orange-500/20' : ''}`}
                        onClick={() => setExpandedWin(expandedWin === win.id ? null : win.id)}
                    >
                        {/* Shimmer Effect */}
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            whileHover={{ x: "-100%", opacity: 0.1 }}
                            transition={{ duration: 1, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 pointer-events-none z-10"
                        />
                        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                            <div className={`h-20 w-20 rounded-3xl bg-black flex items-center justify-center ${win.color} group-hover:scale-110 transition-transform group-hover:rotate-6 shadow-2xl`}>
                                <win.icon className="h-10 w-10" />
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-3">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white opacity-50">{win.title}</h3>
                                    <div className="h-px w-8 bg-zinc-800 hidden md:block" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 italic flex items-center gap-2">
                                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                                            <ShieldCheck className="h-3 w-3" />
                                        </motion.div>
                                        Verified Insight
                                    </span>
                                </div>
                                <p className="text-2xl md:text-3xl font-medium text-white italic leading-tight">
                                    "{win.description}"
                                </p>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-12 w-12 rounded-2xl bg-white/5 group-hover:bg-orange-500 group-hover:text-black transition-all ${expandedWin === win.id ? 'rotate-45 bg-orange-500 text-black' : ''}`}
                            >
                                <ArrowUpRight className="h-6 w-6" />
                            </Button>
                        </div>

                        <AnimatePresence>
                            {expandedWin === win.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-8 pb-10 pt-4 space-y-8 border-t border-white/5 mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-orange-500">
                                                    <Map className="h-3 w-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">The Evidence</span>
                                                </div>
                                                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                                                    {win.evidence}
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <Clock className="h-3 w-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">The "Why"</span>
                                                </div>
                                                <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">
                                                    {win.why}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="h-8 w-8 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center text-[10px] font-black text-white">
                                                        {String.fromCharCode(64 + i)}
                                                    </div>
                                                ))}
                                                <div className="h-8 w-8 rounded-full bg-orange-500 border-2 border-black flex items-center justify-center text-[8px] font-black text-black">
                                                    +42
                                                </div>
                                            </div>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    addLog(`Shared Insight: ${win.title}`, "success")
                                                }}
                                                className="bg-white text-black font-black uppercase tracking-widest text-[10px] px-8 rounded-2xl h-12 hover:scale-105 active:scale-95 transition-all shadow-xl"
                                            >
                                                <Share2 className="h-3 w-3 mr-2" /> Share Insight
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Verified Stamp Animation Overlay */}
                        <AnimatePresence>
                            {!expandedWin && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 2 }}
                                    animate={{ opacity: [0, 1, 0], scale: [2, 1, 0.8] }}
                                    transition={{ duration: 1.5, times: [0, 0.2, 1] }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                                >
                                    <div className="border-4 border-orange-500/40 text-orange-500/40 px-6 py-2 rounded-xl rotate-[-12deg] font-black uppercase tracking-widest text-4xl">
                                        VERIFIED
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            <div className="glass-morphism rounded-[3rem] p-12 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">THE CUSTODIAN'S PHILOSOPHY</p>
                <p className="text-white text-2xl font-light italic max-w-2xl mx-auto leading-relaxed">
                    "Every mile is a new chapter in your summer story. Don't worry about the speed — worry about the soul. Resilience is built in the <span className="text-orange-500 font-black">quiet miles</span>."
                </p>
                <div className="mt-10 flex justify-center items-center gap-6">
                    <div className="h-px w-16 bg-zinc-800" />
                    <ShieldCheck className="h-5 w-5 text-zinc-800" />
                    <div className="h-px w-16 bg-zinc-800" />
                </div>
            </div>
        </div>
    )
}
