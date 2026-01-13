"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Wind, HelpCircle, AlertTriangle, X, RefreshCw, CheckCircle2, Phone, ExternalLink, Clock, Smile, Frown, Meh, Coffee, Droplets, Zap, Leaf, BrainCircuit, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDemo } from "./DemoContext"
import { ActionButton } from "@/components/ui/action-button"

type ModalState = 'none' | 'grounding' | 'reset' | 'help' | 'refuel'

export function SupportStep() {
    const { userState, togglePitStop, addLog, hydrationCount, updateHydration } = useDemo()
    const isPitStop = userState.mode === 'pit_stop'
    const [modal, setModal] = React.useState<ModalState>('none')
    const [showPitStopModal, setShowPitStopModal] = React.useState(false)
    const [timer, setTimer] = React.useState(30)
    const [newTarget, setNewTarget] = React.useState("75")
    const [resetConfirmed, setResetConfirmed] = React.useState(false)
    const [helpStep, setHelpStep] = React.useState(0)
    const [mood, setMood] = React.useState<string | null>(null)

    React.useEffect(() => {
        let interval: NodeJS.Timeout
        if (modal === 'grounding' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000)
        } else if (timer === 0) {
            setModal('none')
            setTimer(30)
        }
        return () => clearInterval(interval)
    }, [modal, timer])

    const handleReset = () => {
        setResetConfirmed(true)
        setTimeout(() => {
            setResetConfirmed(false)
            setModal('none')
        }, 2000)
    }

    const helpSteps = [
        { title: "Check Provider Connection", desc: "Ensure Strava/Garmin is still connected in settings." },
        { title: "Force Refresh", desc: "Try a manual sync from the Progress page." },
        { title: "Clear Cache", desc: "Sometimes old data blocks new syncs. Clear and retry." },
        { title: "Contact Support", desc: "Still stuck? We're here to help." },
    ]

    return (
        <div className="space-y-16">
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mx-auto">
                    <Heart className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Human Logistics</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                    YOU'RE STILL <span className="text-orange-500 italic">IN THIS.</span>
                </h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto leading-relaxed">
                    No pressure. Just support. We are here to help you find your rhythm again, no matter the pace.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {modal === 'none' && (
                    <motion.div
                        key="options"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Refuel Station */}
                        <Button
                            variant="outline"
                            className="h-44 rounded-[3rem] border-white/5 bg-black/40 hover:bg-blue-600 hover:text-black hover:border-blue-600 transition-all justify-start p-10 group relative overflow-hidden"
                            onClick={() => setModal('refuel')}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-8 relative">
                                <div className="h-20 w-20 rounded-3xl bg-black flex items-center justify-center text-blue-500 group-hover:bg-black/20 group-hover:text-black transition-colors relative overflow-hidden">
                                    <Droplets className="h-10 w-10 relative z-10" />
                                    <motion.div
                                        animate={{ y: [40, -40], opacity: [0, 1, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute bottom-0 left-0 right-0 h-full bg-blue-500/20"
                                    />
                                </div>
                                <div className="text-left space-y-2">
                                    <span className="block text-3xl font-black uppercase tracking-tighter">Refuel Station</span>
                                    <span className="text-xs font-medium text-zinc-500 group-hover:text-black/70 italic">Hydration, electrolytes, and mindful recovery.</span>
                                </div>
                            </div>
                        </Button>

                        {/* Logging Help */}
                        <Button
                            variant="outline"
                            className="h-44 rounded-[3rem] border-white/5 bg-black/40 hover:bg-white hover:text-black transition-all justify-start p-10 group relative overflow-hidden"
                            onClick={() => setModal('help')}
                        >
                            <div className="flex items-center gap-8 relative">
                                <div className="h-20 w-20 rounded-3xl bg-black flex items-center justify-center text-white group-hover:bg-black/20 group-hover:text-black transition-colors relative">
                                    <HelpCircle className="h-10 w-10 relative z-10" />
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute inset-0 rounded-3xl border-2 border-white"
                                    />
                                </div>
                                <div className="text-left space-y-2">
                                    <span className="block text-3xl font-black uppercase tracking-tighter">Logging Help</span>
                                    <span className="text-xs font-medium text-zinc-500 group-hover:text-black/70 italic">Troubleshoot sync issues and data gaps.</span>
                                </div>
                            </div>
                        </Button>

                        {/* Reset Gently */}
                        <Button
                            variant="outline"
                            className="h-44 rounded-[3rem] border-white/5 bg-black/40 hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all justify-start p-10 group relative overflow-hidden"
                            onClick={() => setModal('reset')}
                        >
                            <div className="flex items-center gap-8 relative">
                                <div className="h-20 w-20 rounded-3xl bg-black flex items-center justify-center text-orange-500 group-hover:bg-black/20 group-hover:text-black transition-colors relative">
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative z-10"
                                    >
                                        <Heart className="h-10 w-10" />
                                    </motion.div>
                                </div>
                                <div className="text-left space-y-2">
                                    <span className="block text-3xl font-black uppercase tracking-tighter">Reset Gently</span>
                                    <span className="text-xs font-medium text-zinc-500 group-hover:text-black/70 italic">Recalculate your target for the weeks ahead.</span>
                                </div>
                            </div>
                        </Button>

                        {/* Breath Sync */}
                        <Button
                            variant="outline"
                            className="h-44 rounded-[3rem] border-white/5 bg-black/40 hover:bg-zinc-100 hover:text-black hover:border-white transition-all justify-start p-10 group relative overflow-hidden"
                            onClick={() => setModal('grounding')}
                        >
                            <div className="flex items-center gap-8 relative">
                                <div className="h-20 w-20 rounded-3xl bg-black flex items-center justify-center text-zinc-100 group-hover:bg-black/20 group-hover:text-black transition-colors relative overflow-hidden">
                                    <motion.div
                                        animate={{ x: [-3, 3, -3] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative z-10"
                                    >
                                        <Wind className="h-10 w-10" />
                                    </motion.div>
                                    <motion.div
                                        animate={{ x: [60, -60], opacity: [0, 0.3, 0] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-y-0 w-8 bg-white/10 blur-sm"
                                    />
                                </div>
                                <div className="text-left space-y-2">
                                    <span className="block text-3xl font-black uppercase tracking-tighter">Breath Sync</span>
                                    <span className="text-xs font-medium text-zinc-500 group-hover:text-black/70 italic">30-second mindful breathing ritual.</span>
                                </div>
                            </div>
                        </Button>

                        {/* Pit Stop Mode */}
                        <Button
                            variant="outline"
                            className={`h-44 rounded-[3rem] border-white/5 transition-all justify-start p-10 group relative overflow-hidden md:col-span-2 ${isPitStop ? 'bg-orange-500 text-black border-orange-500' : 'bg-black/40 text-white hover:bg-orange-500 hover:text-black hover:border-orange-500'}`}
                            onClick={() => setShowPitStopModal(true)}
                        >
                            <div className="flex items-center gap-8 relative">
                                <div className={`h-20 w-20 rounded-3xl flex items-center justify-center transition-colors relative ${isPitStop ? 'bg-black/20 text-black' : 'bg-black text-orange-500 group-hover:bg-black/20 group-hover:text-black'}`}>
                                    <motion.div
                                        animate={{ rotate: isPitStop ? [0, 360] : 0 }}
                                        transition={{ duration: 8, repeat: isPitStop ? Infinity : 0, ease: "linear" }}
                                        className="relative z-10"
                                    >
                                        <Clock className="h-10 w-10" />
                                    </motion.div>
                                </div>
                                <div className="text-left space-y-2">
                                    <span className="block text-3xl font-black uppercase tracking-tighter">
                                        {isPitStop ? 'Pit Stop Active' : 'Pit Stop Mode'}
                                    </span>
                                    <span className={`text-xs font-medium italic ${isPitStop ? 'text-black/70' : 'text-zinc-500 group-hover:text-black/70'}`}>
                                        {isPitStop ? 'Recovery mode enabled. Nudges paused.' : 'Pause for a few days. Slow down to regain momentum.'}
                                    </span>
                                </div>
                                {isPitStop && (
                                    <div className="absolute top-4 right-4">
                                        <div className="h-3 w-3 rounded-full bg-black animate-pulse" />
                                    </div>
                                )}
                            </div>
                        </Button>
                    </motion.div>
                )}

                {/* Refuel Modal */}
                {modal === 'refuel' && (
                    <motion.div
                        key="refuel"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center p-6 backdrop-blur-2xl"
                        onClick={() => setModal('none')}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-4xl w-full glass-card border-blue-500/20 p-12 rounded-[4rem] shadow-2xl space-y-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Refuel Station</h3>
                                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.4em]">Optimizing your recovery rhythm</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setModal('none')} className="rounded-full h-12 w-12 bg-white/5 hover:bg-white/10 text-zinc-500">
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Hydration Sync */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                                            <Droplets className="h-5 w-5" />
                                        </div>
                                        <h4 className="text-xl font-black text-white uppercase italic">Hydration Sync</h4>
                                    </div>

                                    <div className="relative group cursor-pointer" onClick={() => updateHydration(1)}>
                                        <div className="h-64 w-full bg-black/40 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-8">
                                            <motion.div
                                                animate={{ y: [0, -10, 0] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                className="absolute inset-x-0 bottom-0 bg-blue-500/20"
                                                style={{ height: `${(hydrationCount / 8) * 100}%` }}
                                            />
                                            <p className="text-6xl font-black text-white italic relative z-10">{hydrationCount}<span className="text-blue-500">/8</span></p>
                                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-4 relative z-10">Cups Today</p>
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mt-8 bg-blue-500 text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest relative z-10">
                                                Add Cup +
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fuel Selector */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <h4 className="text-xl font-black text-white uppercase italic">Fuel Matrix</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'electrolytes', label: 'Electrolytes', icon: Zap, sub: 'Salt + Minerals', color: 'text-orange-500' },
                                            { id: 'protein', label: 'Protein Peak', icon: Heart, sub: 'Muscle Repair', color: 'text-red-500' },
                                            { id: 'caffeine', label: 'Rhythm Boost', icon: Coffee, sub: 'Mental Sharpness', color: 'text-zinc-100' },
                                            { id: 'micronutrients', label: 'Green Vitality', icon: Leaf, sub: 'Berry Burst', color: 'text-green-500' },
                                        ].map(item => (
                                            <motion.button
                                                key={item.id}
                                                whileHover={{ y: -4, scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => addLog(`Fuel Selected: ${item.label}`, "success")}
                                                className="glass-card border-white/5 p-6 rounded-3xl text-left space-y-3 hover:border-white/20 transition-all"
                                            >
                                                <item.icon className={`h-6 w-6 ${item.color}`} />
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-white uppercase">{item.label}</p>
                                                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{item.sub}</p>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 text-center">
                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mb-4">The Custodian's Suggestion</p>
                                <p className="text-white font-medium italic text-lg max-w-lg mx-auto leading-relaxed">
                                    "Your recovery is the foundation of your performance. Hydrate like you move — with intention."
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Grounding Modal (Calm Mode) */}
                {modal === 'grounding' && (
                    <motion.div
                        key="grounding"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl"
                        onClick={() => { setModal('none'); setTimer(30); }}
                    >
                        <motion.div
                            animate={{
                                background: [
                                    "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)",
                                    "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.2) 0%, transparent 70%)",
                                    "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)"
                                ]
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute inset-0 pointer-events-none"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-center justify-center p-16 glass-card rounded-[4rem] border-blue-500/20 text-center space-y-12 relative overflow-hidden max-w-xl w-full mx-4"
                        >
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Breath Sync Active</p>
                                <h3 className="text-3xl font-black text-white italic tracking-tight">Syncing your soul with the summer.</h3>
                            </div>

                            <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="h-56 w-56 rounded-full border-2 border-blue-500/30 flex items-center justify-center relative bg-blue-500/10 shadow-[0_0_80px_rgba(59,130,246,0.3)]"
                            >
                                <div className="text-6xl font-black text-white italic tabular-nums">
                                    {timer}
                                </div>
                            </motion.div>

                            <div className="space-y-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={timer % 8 > 4 ? "inhale" : "exhale"}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        className="space-y-4"
                                    >
                                        <h4 className="text-4xl font-black uppercase text-white tracking-[0.2em] italic">
                                            {timer % 8 > 4 ? "Inhale..." : "Exhale..."}
                                        </h4>
                                        <p className="text-blue-400 text-sm font-medium italic max-w-xs mx-auto">
                                            {timer > 20 ? "The code doesn't define you." : timer > 10 ? "The miles can wait for a moment." : "You are doing exactly enough."}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {!mood ? (
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">How's your pulse now?</p>
                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={() => { setMood('bad'); addLog("Mood: Seeking restoration", "info"); }} className="h-16 w-16 rounded-2xl border-white/5 bg-black/40 hover:bg-red-500/20 hover:text-red-500">
                                            <Frown className="h-6 w-6" />
                                        </Button>
                                        <Button variant="outline" onClick={() => { setMood('ok'); addLog("Mood: Centering", "info"); }} className="h-16 w-16 rounded-2xl border-white/5 bg-black/40 hover:bg-yellow-500/20 hover:text-yellow-500">
                                            <Meh className="h-6 w-6" />
                                        </Button>
                                        <Button variant="outline" onClick={() => { setMood('good'); addLog("Mood: Restored", "info"); }} className="h-16 w-16 rounded-2xl border-white/5 bg-black/40 hover:bg-green-500/20 hover:text-green-500">
                                            <Smile className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                    <CheckCircle2 className="h-4 w-4" /> Ritual Data Recorded
                                </motion.div>
                            )}

                            <Button
                                variant="ghost"
                                onClick={(e) => { e.stopPropagation(); setModal('none'); setTimer(30); setMood(null); }}
                                className="text-zinc-600 hover:text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 transition-colors"
                            >
                                Leave Calm Mode
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Reset Modal */}
                {modal === 'reset' && (
                    <motion.div
                        key="reset"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-6 backdrop-blur-xl"
                        onClick={() => setModal('none')}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-center justify-center p-16 glass-morphism rounded-[4rem] border border-orange-500/20 text-center space-y-10 relative overflow-hidden max-w-2xl w-full"
                        >
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setModal('none'); }} className="absolute top-8 right-8 text-zinc-500 hover:text-white z-10">
                                <X className="h-8 w-8" />
                            </Button>

                            {!resetConfirmed ? (
                                <>
                                    <div className="h-24 w-24 rounded-[2rem] bg-orange-500/20 flex items-center justify-center">
                                        <Heart className="h-12 w-12 text-orange-500" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black uppercase text-white italic tracking-tight">Reset Your Target</h3>
                                        <p className="text-zinc-500 text-sm max-w-md mx-auto font-bold uppercase tracking-widest leading-relaxed">Life happens. Adjust your goal to something that feels achievable. Progress over perfection.</p>
                                    </div>
                                    <div className="space-y-4 w-full max-w-xs">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 block">New Mile Target</label>
                                        <Input
                                            type="number"
                                            value={newTarget}
                                            onChange={(e) => setNewTarget(e.target.value)}
                                            className="h-20 text-center text-5xl font-black bg-black/40 border-white/5 text-white rounded-[1.5rem]"
                                        />
                                        <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Current: 100 miles • Days Left: 52</p>
                                    </div>
                                    <ActionButton
                                        onClick={async () => handleReset()}
                                        label="Confirm Reset"
                                        loadingLabel="Recalculating Arcs..."
                                        successLabel="Target Updated"
                                        className="h-16 px-16 rounded-[1.5rem] bg-white text-black"
                                    />
                                </>
                            ) : (
                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8 py-10">
                                    <div className="h-32 w-32 rounded-full bg-green-500/20 flex items-center justify-center mx-auto border border-green-500/30">
                                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-white uppercase italic">Target Updated!</h3>
                                        <p className="text-green-500 font-black uppercase tracking-widest">New goal: {newTarget} miles</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}

                {/* Help Modal */}
                {modal === 'help' && (
                    <motion.div
                        key="help"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-6 backdrop-blur-xl"
                        onClick={() => setModal('none')}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-center justify-center py-16 glass-morphism rounded-[4rem] border border-white/10 text-center space-y-10 relative overflow-hidden max-w-2xl w-full"
                        >
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setModal('none'); }} className="absolute top-6 right-6 text-zinc-500 hover:text-white z-10">
                                <X className="h-6 w-6" />
                            </Button>

                            <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center">
                                <HelpCircle className="h-10 w-10 text-white" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-3xl font-black uppercase text-white tracking-tight">Sync Troubleshooting</h3>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Step {helpStep + 1} of {helpSteps.length}</p>
                            </div>

                            <div className="bg-black/40 rounded-3xl p-8 border border-white/5 w-full max-w-md">
                                <motion.div key={helpStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <p className="text-xl font-black text-white">{helpSteps[helpStep].title}</p>
                                    <p className="text-sm text-zinc-400">{helpSteps[helpStep].desc}</p>
                                </motion.div>
                            </div>

                            <div className="flex gap-4">
                                {helpStep > 0 && (
                                    <Button variant="outline" onClick={() => setHelpStep(s => s - 1)} className="border-white/10 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] h-12 px-8">
                                        Back
                                    </Button>
                                )}
                                {helpStep < helpSteps.length - 1 ? (
                                    <Button onClick={() => setHelpStep(s => s + 1)} className="bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-[10px] h-12 px-8">
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button onClick={() => setModal('none')} className="bg-green-500 hover:bg-green-600 text-black font-black uppercase tracking-widest text-[10px] h-12 px-8">
                                        <CheckCircle2 className="h-4 w-4 mr-2" /> Done
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Pit Stop Modal */}
                {showPitStopModal && (
                    <motion.div
                        key="pitstop"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center p-6 backdrop-blur-2xl"
                        onClick={() => setShowPitStopModal(false)}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-2xl w-full glass-card border-orange-500/20 p-12 rounded-[4rem] shadow-2xl space-y-10 relative overflow-hidden"
                        >
                            <Button variant="ghost" size="icon" onClick={() => setShowPitStopModal(false)} className="absolute top-8 right-8 rounded-full h-12 w-12 bg-white/5 hover:bg-white/10 text-zinc-500">
                                <X className="h-6 w-6" />
                            </Button>

                            <div className="space-y-6 text-center">
                                <div className={`h-24 w-24 rounded-[2rem] mx-auto flex items-center justify-center ${isPitStop ? 'bg-orange-500' : 'bg-orange-500/20'}`}>
                                    <Clock className={`h-12 w-12 ${isPitStop ? 'text-black' : 'text-orange-500'}`} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tight">
                                        {isPitStop ? 'Recovery Mode Active' : 'Enter Pit Stop Mode'}
                                    </h3>
                                    <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.4em]">
                                        {isPitStop ? 'Your journey is paused' : 'Take a break. Recharge your energy.'}
                                    </p>
                                </div>
                            </div>

                            {isPitStop ? (
                                <div className="glass-card border-white/5 p-8 rounded-[3rem] space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase text-orange-500">Paused</span>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nudges</span>
                                        <span className="text-[10px] font-black uppercase text-white">Disabled</span>
                                    </div>
                                    <div className="h-px bg-white/5" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mode</span>
                                        <span className="text-[10px] font-black uppercase text-white">Recovery</span>
                                    </div>
                                    <div className="h-px bg-white/5" />
                                    <div className="pt-4">
                                        <p className="text-sm text-zinc-400 italic text-center leading-relaxed">
                                            "Movement is paused. Your data is safe. Take all the time you need to recharge. We'll be here when you're ready."
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 text-center">
                                    <p className="text-zinc-400 font-medium text-sm leading-relaxed max-w-md mx-auto">
                                        Pit Stop Mode pauses all progress tracking and notifications for a few days. Perfect for when you need to slow down and recover without pressure.
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                                        {[
                                            { label: 'Pause Tracking', icon: Clock },
                                            { label: 'Stop Nudges', icon: AlertTriangle },
                                            { label: 'Keep Data', icon: Shield }
                                        ].map(item => (
                                            <div key={item.label} className="glass-card border-white/5 p-4 rounded-2xl text-center space-y-2">
                                                <item.icon className="h-6 w-6 text-orange-500 mx-auto" />
                                                <p className="text-[8px] font-black uppercase text-zinc-500">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <ActionButton
                                onClick={async () => {
                                    await togglePitStop(isPitStop ? "Resumed movement" : "Recovery pause");
                                    addLog(isPitStop ? "Pit Stop ended. Resuming movement." : "Entered Pit Stop. Slowing down to recharge.", "info")
                                    setShowPitStopModal(false)
                                }}
                                label={isPitStop ? "Resume Movement" : "Enter Pit Stop"}
                                loadingLabel="Updating..."
                                successLabel={isPitStop ? "Movement Resumed!" : "Pit Stop Activated!"}
                                className={`w-full h-16 rounded-[1.5rem] ${isPitStop ? 'bg-white text-black' : 'bg-orange-500 text-black'}`}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Safety Footer */}
            <div className="glass-card rounded-[3rem] p-10 border border-red-500/20 bg-red-500/5 flex flex-col md:flex-row items-center gap-10">
                <div className="h-20 w-20 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center flex-shrink-0 relative">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-[1.5rem] bg-red-500/20"
                    />
                    <AlertTriangle className="h-10 w-10 text-red-500 relative z-10" />
                </div>
                <div className="space-y-2 flex-1 text-center md:text-left">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-red-500">SAFETY PROTOCOL</p>
                    <p className="text-sm text-zinc-500 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                        If you are in immediate danger or experiencing a medical emergency, please call your local emergency number.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <a href="tel:911" className="flex-1 md:flex-none flex items-center justify-center gap-3 h-16 px-10 rounded-[1.5rem] bg-red-500 text-white text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                        <Phone className="h-5 w-5" /> Call 911
                    </a>
                    <a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-3 h-16 px-10 rounded-[1.5rem] bg-white/10 border-2 border-white/20 text-white text-[11px] font-black uppercase tracking-widest transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
                        <ExternalLink className="h-5 w-5" /> 988 Lifeline
                    </a>
                </div>
            </div>
        </div>
    )
}
