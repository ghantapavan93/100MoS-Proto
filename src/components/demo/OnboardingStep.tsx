"use client"

import * as React from "react"
import { useDemo } from "./DemoContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Heart, Anchor, Zap, MessageCircle, Info, Star, Compass, Ship, CheckCircle2 } from "lucide-react"

const personalityOptions = [
    { id: 'gentle', label: 'Gentle', msg: "Hey — 10 minutes counts.", color: 'text-blue-500' },
    { id: 'coach', label: 'Coach', msg: "Let's lock today in.", color: 'text-orange-500' },
    { id: 'competitive', label: 'Competitive', msg: "You're 0.7 miles behind your crew.", color: 'text-red-500' },
]

const suggestions = [
    "Time with my kids",
    "Rebuild after burnout",
    "Consistency",
    "Find my people",
]

const careTags = [
    "First-time mover",
    "Post-injury",
    "Caregiver schedule",
    "Night owl",
    "Wheel/roll",
]

export function OnboardingStep() {
    const { profile, setProfile, updateRitualIdentity, ritualIdentity } = useDemo()
    const [why, setWhy] = React.useState(profile.why_statement)
    const [tags, setTags] = React.useState<string[]>(profile.care_tags)
    const [personality, setPersonality] = React.useState(ritualIdentity?.pattern || 'coach')
    const [showSeen, setShowSeen] = React.useState(false)
    const [sparkles, setSparkles] = React.useState<Array<{ id: number; top: number; left: number }>>([])

    // Generate sparkle positions only on client side
    React.useEffect(() => {
        setSparkles([1, 2, 3, 4, 5].map(i => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100
        })))
    }, [])

    React.useEffect(() => {
        setProfile({ why_statement: why, care_tags: tags })
        updateRitualIdentity({ mission: why, tags, pattern: personality })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [why, tags, personality])

    const handlePersonalitySelect = (id: string) => {
        setPersonality(id)
        setShowSeen(true)
        setTimeout(() => setShowSeen(false), 5000)
    }

    const toggleTag = (tag: string) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    }

    return (
        <div className="space-y-16">
            {/* Header with Floating Constellation */}
            <div className="space-y-6 text-center relative py-10">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {sparkles.map(sparkle => (
                        <motion.div
                            key={sparkle.id}
                            animate={{
                                x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                                y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                                scale: [0.5, 1, 0.5],
                                opacity: [0.1, 0.3, 0.1]
                            }}
                            transition={{ duration: 5 + sparkle.id, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute"
                            style={{ top: `${sparkle.top}%`, left: `${sparkle.left}%` }}
                        >
                            <Sparkles className="h-4 w-4 text-orange-500" />
                        </motion.div>
                    ))}
                </div>

                {/* Animated Gradient Background */}
                <motion.div
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(249,115,22,0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(249,115,22,0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 80%, rgba(249,115,22,0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 50%, rgba(249,115,22,0.15) 0%, transparent 50%)'
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 pointer-events-none -z-10"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mx-auto"
                >
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{
                            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                    >
                        <Star className="h-4 w-4 text-orange-500" />
                    </motion.div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 pr-1">Your Summer Compass</span>
                </motion.div>
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">
                    DEFINE YOUR <motion.span
                        animate={{
                            textShadow: [
                                '0 0 20px rgba(249,115,22,0.5)',
                                '0 0 40px rgba(249,115,22,0.8)',
                                '0 0 20px rgba(249,115,22,0.5)'
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-orange-500 italic"
                    >WHY.</motion.span>
                </h2>
                <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] max-w-lg mx-auto leading-relaxed opacity-60">
                    This anchor protects your consistency when the momentum gets heavy.
                </p>
            </div>

            {/* Why Selection */}
            <div className="space-y-10 group">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {suggestions.map((s, idx) => (
                        <motion.button
                            key={s}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{
                                scale: 1.08,
                                y: -8,
                                rotateY: 5,
                                rotateX: -5,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setWhy(s)}
                            style={{ transformStyle: 'preserve-3d' }}
                            className={`rounded-3xl border p-6 h-auto text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex flex-col items-center gap-4 relative overflow-hidden ${why === s
                                ? "bg-gradient-to-br from-white to-orange-50 text-black shadow-2xl border-orange-500/50 shadow-orange-500/20"
                                : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10 hover:border-white/20"
                                }`}
                        >
                            {/* Shimmer effect on selected */}
                            {why === s && (
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                            )}

                            <motion.div
                                animate={why === s ? { rotate: [0, 360] } : { rotate: 0 }}
                                transition={{ duration: 20, repeat: why === s ? Infinity : 0, ease: "linear" }}
                                className={`h-12 w-12 rounded-2xl flex items-center justify-center relative ${why === s ? 'bg-black text-white shadow-lg' : 'bg-black/40 text-zinc-700'
                                    }`}
                            >
                                <Compass className="h-6 w-6 relative z-10" />
                                {why === s && (
                                    <>
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-0 rounded-2xl bg-orange-500"
                                        />
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 rounded-2xl border-2 border-dashed border-orange-500/30"
                                        />
                                    </>
                                )}
                            </motion.div>

                            <span className="relative z-10">{s}</span>

                            {why === s && (
                                <motion.div
                                    layoutId="selection-glow"
                                    className="absolute inset-0 bg-orange-500/5 blur-3xl pointer-events-none"
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
                <div className="relative group">
                    <Input
                        placeholder="Or define your own custom summer anchor..."
                        value={why}
                        onChange={(e) => setWhy(e.target.value)}
                        className="h-28 glass-card border-white/5 text-2xl text-white font-medium italic placeholder:text-zinc-800 focus-visible:ring-orange-500 rounded-[3rem] px-12 transition-all focus:border-orange-500"
                    />
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                            <Ship className="h-8 w-8 text-orange-500/20" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Care Tags & Voice */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8 glass-card border-white/5 p-10 rounded-[3rem]">
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Care Tags</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Help us curate your ritual path.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {careTags.map((tag) => (
                            <motion.button
                                key={tag}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleTag(tag)}
                                className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${tags.includes(tag)
                                    ? "bg-orange-500 border-orange-500 text-black"
                                    : "bg-black/40 border-white/5 text-zinc-600 hover:text-white"
                                    }`}
                            >
                                {tag}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="space-y-8 glass-card border-white/5 p-10 rounded-[3rem]">
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Ritual Voice</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Choose the tone of your guidance.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {personalityOptions.map((opt) => (
                            <motion.button
                                key={opt.id}
                                whileHover={{ x: 10 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePersonalitySelect(opt.id)}
                                className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${personality === opt.id ? 'bg-white border-white text-black' : 'bg-black/40 border-white/5 hover:bg-white/5 text-zinc-500'}`}
                            >
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
                                    <p className={`font-medium italic text-sm ${personality === opt.id ? 'text-black/70' : 'text-zinc-400'}`}>"{opt.msg}"</p>
                                </div>
                                {personality === opt.id && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-black" />
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Live Identity Pulse Rendering */}
            <AnimatePresence>
                {(why || tags.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group py-8"
                    >
                        <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="glass-card border-orange-500/30 bg-black/80 p-12 rounded-[4rem] relative overflow-hidden text-center space-y-8 shadow-[0_0_100px_rgba(249,115,22,0.1)]">
                            <div className="h-20 w-20 rounded-[1.5rem] bg-orange-500 text-black flex items-center justify-center mx-auto shadow-2xl relative">
                                <Zap className="h-10 w-10" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-[1.5rem] border-4 border-orange-500/50" />
                            </div>

                            <div className="space-y-4">
                                <p className="text-[12px] font-black uppercase tracking-[0.6em] text-orange-500">Your Declared Identity</p>
                                <h4 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">
                                    {tags.length > 0 ? tags[0] : 'Sovereign Mover'} <span className="text-zinc-700 mx-2">•</span> {personalityOptions.find(o => o.id === personality)?.label} Guidance
                                </h4>
                                <p className="text-xl md:text-2xl font-light text-zinc-400 italic max-w-2xl mx-auto">
                                    "{why || "Finding my summer rhythm."}"
                                </p>
                            </div>

                            <div className="pt-8 flex justify-center gap-4">
                                {tags.map(t => (
                                    <span key={t} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        Protected: {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Reactions */}
            <AnimatePresence>
                {showSeen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: '-50%', y: 100 }}
                        animate={{ opacity: 1, scale: 1, x: '-50%', y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-12 left-1/2 z-[300] bg-orange-500 text-black p-8 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,1)] flex items-center gap-8 max-w-lg w-full border-4 border-black"
                    >
                        <div className="h-16 w-16 rounded-[1.5rem] bg-black text-orange-500 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">System Synchronized</p>
                            <p className="text-xl font-black italic leading-tight">"I see your mission. Let's make this summer real."</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
