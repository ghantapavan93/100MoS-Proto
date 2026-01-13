"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Footprints, Heart, Flag, Clock, Sparkles, Zap } from "lucide-react"
import { useDemo } from "./DemoContext"
import { ActionButton } from "@/components/ui/action-button"
import { Slider } from "@/components/ui/slider"

const arcs = [
    {
        id: "getting-started",
        title: "GETTING STARTED",
        icon: Footprints,
        copy: "The hardest part is the first 10 days. Start small. Start real. A 10-minute walk counts exactly the same as a 10-minute run.",
        action: "Log a 10-min walk",
        successMsg: "Walk validated. Added +0.5 miles to your Summer Ledger.",
        nudge: "Week 2 is where the magic (and the soreness) happens.",
        color: "from-orange-500/10",
    },
    {
        id: "sticking-with-it",
        title: "STICKING WITH IT",
        icon: Heart,
        copy: "Life happens. Rain happens. Busy schedules happen. Movement still counts even when it looks different than you planned.",
        action: "Check in with your crew",
        successMsg: "Crew check-in complete. You contributed +0.2 to crew momentum.",
        nudge: "Week 5 is usually when life gets in the way. That's normal.",
        color: "from-blue-500/10",
    },
    {
        id: "finishing-strong",
        title: "FINISHING STRONG",
        icon: Flag,
        copy: "The finish line is yours to define. Whether you reach 100 miles or 10, the transformation is in the consistency.",
        action: "Plan your final mile ritual",
        successMsg: "Final Mile Plan generated. We've protected your finish style.",
        nudge: "You're building habits that last long after August 31.",
        color: "from-purple-500/10",
    },
]

export function SeasonalArcsStep() {
    const { addLog, addHint, generateDemoActivities } = useDemo()
    const [activeArc, setActiveArc] = React.useState("getting-started")
    const [showStoryModal, setShowStoryModal] = React.useState(false)
    const [showCommitRitual, setShowCommitRitual] = React.useState(false)
    const [storyForm, setStoryForm] = React.useState({ type: 'Walk', intensity: 50, why: '' })
    const [ritualStep, setRitualStep] = React.useState(0)

    const handleArcAction = async (arc: typeof arcs[0]) => {
        if (arc.id === 'getting-started') {
            setShowStoryModal(true)
            return
        }
        addLog(`Initiating action: ${arc.action}`, "info")
        await new Promise(r => setTimeout(r, 1500))
    }

    const handleCommit = async () => {
        setShowStoryModal(false)
        setShowCommitRitual(true)
        setRitualStep(0)

        const steps = ["Writing to ledger", "Updating your rhythm", "Generating your next arc"]
        for (let i = 0; i < steps.length; i++) {
            setRitualStep(i)
            await new Promise(r => setTimeout(r, 1000))
        }

        generateDemoActivities()
        setShowCommitRitual(false)
        addHint("Arc updated. Check your progress.", "success")
    }

    return (
        <div className="space-y-16">
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mx-auto">
                    <Flag className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Seasonal Rhythm</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                    YOUR SUMMER <span className="text-orange-500 italic">STORY.</span>
                </h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto leading-relaxed">
                    A guided journey from May to August. We break the 100 miles into three meaningful chapters.
                </p>
            </div>

            <Tabs defaultValue="getting-started" onValueChange={setActiveArc} className="w-full">
                <TabsList className="grid w-full grid-cols-3 glass-card bg-black/40 h-20 rounded-[1.5rem] p-2 border-white/5">
                    {arcs.map((arc) => (
                        <TabsTrigger
                            key={arc.id}
                            value={arc.id}
                            className={`rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/20`}
                        >
                            {arc.title}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {arcs.map((arc) => (
                    <TabsContent key={arc.id} value={arc.id} className="mt-12 focus-visible:outline-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{
                                scale: 1.02,
                                rotateX: 2,
                                rotateY: 2,
                                transition: { type: "spring", stiffness: 200, damping: 20 }
                            }}
                            style={{ transformStyle: 'preserve-3d' }}
                            transition={{ duration: 0.5 }}
                            className={`glass-card rounded-[2.5rem] p-12 md:p-16 border-white/5 flex flex-col items-center text-center space-y-10 relative overflow-hidden group bg-gradient-to-b ${arc.color} to-transparent`}
                        >
                            {/* Shimmer Overlay */}
                            <motion.div
                                initial={{ x: "100%", opacity: 0 }}
                                whileHover={{ x: "-100%", opacity: 0.2 }}
                                transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 mix-blend-overlay pointer-events-none z-10"
                            />
                            <div className="absolute top-12 right-12 opacity-5 pointer-events-none">
                                <motion.div
                                    animate={{ x: [-20, 20], opacity: [0.2, 0.5, 0.2] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Footprints className="h-24 w-24" />
                                </motion.div>
                            </div>

                            <div className="absolute top-0 left-0 w-full h-1 bg-white/5" />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: arc.id === 'getting-started' ? '33%' : arc.id === 'sticking-with-it' ? '66%' : '100%' }}
                                className="absolute top-0 left-0 h-1 bg-orange-500 transition-all duration-1000"
                            />

                            <div className="h-24 w-24 rounded-[2rem] bg-black flex items-center justify-center text-orange-500 shadow-2xl group-hover:rotate-6 transition-transform">
                                <arc.icon className="h-12 w-12 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            </div>

                            <div className="space-y-4">
                                <p className="text-3xl md:text-4xl font-medium text-white max-w-2xl italic leading-tight">
                                    "{arc.copy}"
                                </p>
                            </div>

                            <ActionButton
                                onClick={() => handleArcAction(arc)}
                                label={arc.action}
                                loadingLabel="System Processing..."
                                successLabel={arc.successMsg}
                                className="h-16 px-12"
                            />

                            <div className="pt-12 border-t border-white/5 w-full">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="h-px w-8 bg-zinc-800" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-orange-500 transition-colors">
                                        GUIDANCE FROM THE CUSTODIANS
                                    </p>
                                    <div className="h-px w-8 bg-zinc-800" />
                                </div>
                                <p className="text-sm font-medium text-zinc-400 mt-4 italic">
                                    {arc.nudge}
                                </p>
                            </div>
                        </motion.div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Story-to-Ledger Modal */}
            <AnimatePresence>
                {showStoryModal && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-md w-full glass-card border-white/10 p-10 rounded-[3rem] shadow-2xl space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Story Engine</h3>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Connect your movement to the ledger</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Select Mode</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Walk', 'Run', 'Roll', 'Yoga'].map(t => (
                                            <Button
                                                key={t}
                                                variant="outline"
                                                onClick={() => setStoryForm({ ...storyForm, type: t })}
                                                className={`h-12 border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${storyForm.type === t ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'text-zinc-500 hover:bg-white/10'}`}
                                            >
                                                {t}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Intensity</label>
                                        <span className="text-[10px] font-black text-orange-500 uppercase">{storyForm.intensity}%</span>
                                    </div>
                                    <Slider
                                        defaultValue={[50]}
                                        max={100}
                                        step={1}
                                        onValueChange={(v: number[]) => setStoryForm({ ...storyForm, intensity: v[0] })}
                                        className="py-4"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Why Today? (Optional)</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-white focus:border-orange-500/50 outline-none transition-all h-20 resize-none"
                                        placeholder="Mood, weather, rhythm..."
                                        value={storyForm.why}
                                        onChange={(e) => setStoryForm({ ...storyForm, why: e.target.value })}
                                    />
                                </div>

                                <ActionButton
                                    onClick={handleCommit}
                                    label="Commit to Summer Ledger"
                                    className="w-full h-16 bg-white text-black"
                                />
                            </div>
                            <Button variant="ghost" onClick={() => setShowStoryModal(false)} className="w-full text-zinc-600 text-[10px] font-black uppercase">Close Engine</Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Commit Ritual Overlay */}
            <AnimatePresence>
                {showCommitRitual && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[600] bg-orange-500 flex flex-col items-center justify-center p-12 text-center"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-32 w-32 rounded-[3rem] bg-black flex items-center justify-center text-orange-500 mb-12 shadow-2xl"
                        >
                            <Footprints className="h-16 w-16" />
                        </motion.div>

                        <div className="space-y-6">
                            <h3 className="text-4xl font-black text-black uppercase italic tracking-tighter">Syncing Your Story...</h3>
                            <div className="flex gap-2 justify-center">
                                {["Writing", "Updating", "Generating"].map((s, i) => (
                                    <div
                                        key={s}
                                        className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i <= ritualStep ? 'bg-black' : 'bg-black/20'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm font-black text-black/60 uppercase tracking-widest animate-pulse">
                                {ritualStep === 0 ? "WRITING TO LEDGER (SECURE)" : ritualStep === 1 ? "UPDATING YOUR RHYTHM MODEL" : "GENERATING YOUR NEXT ARC CHAPTER"}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
