"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Clock, MapPin, Coffee, Send, CheckCircle2, RefreshCw, Trophy, Zap, ArrowUpRight, Flame } from "lucide-react"
import { ActionButton } from "@/components/ui/action-button"
import { useDemo } from "./DemoContext"
import { Input } from "@/components/ui/input"

const crews = [
    {
        id: "first-timers",
        name: "First-Timers",
        members: 1240,
        miles: 4520,
        icon: Coffee,
        prompt: "What was your very first mile like?",
        color: "bg-blue-500",
    },
    {
        id: "chicago",
        name: "Chicago Crew",
        members: 856,
        miles: 3120,
        icon: MapPin,
        prompt: "Best lakefront path segment?",
        color: "bg-orange-500",
    },
    {
        id: "night-owls",
        name: "Night Owls",
        members: 642,
        miles: 2450,
        icon: Clock,
        prompt: "Most peaceful thing about a midnight walk?",
        color: "bg-purple-500",
    },
    {
        id: "caregivers",
        name: "Caregivers",
        members: 532,
        miles: 1890,
        icon: Users,
        prompt: "How did you find your 10 minutes today?",
        color: "bg-green-500",
    },
]

export function CrewsStep() {
    const { setProfile, communityPulse, storyFeed, loadMoreStories, addLog } = useDemo()
    const [activePrompt, setActivePrompt] = React.useState<string | null>(null)
    const [responses, setResponses] = React.useState<Record<string, string>>({})
    const [currentInput, setCurrentInput] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [rivalMode, setRivalMode] = React.useState(false)
    const [selectedMember, setSelectedMember] = React.useState<any>(null)
    const [cheerSent, setCheerSent] = React.useState<string | null>(null)

    const handleSubmit = async (crewId: string, e: React.FormEvent) => {
        e.preventDefault()
        if (!currentInput.trim()) return

        setIsSubmitting(true)
        await setProfile({ crew_response: currentInput })
        setTimeout(() => {
            setResponses(prev => ({ ...prev, [crewId]: currentInput }))
            setIsSubmitting(false)
            setCurrentInput("")
            setActivePrompt(null)
        }, 1200)
    }

    return (
        <div className="space-y-16">
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mx-auto">
                    <Users className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Collective Momentum</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                    CREWS, NOT <span className="text-orange-500 italic">PRESSURE.</span>
                </h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto leading-relaxed">
                    Rituals are easier when you're not alone. Join a crew that matches your energy and pace.
                </p>

                {/* LIVE PULSE BANNER + RIVAL MODE TOGGLE */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-morphism p-4 border border-orange-500/20 rounded-2xl flex items-center justify-between w-full max-w-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="h-2 w-2 bg-orange-500 rounded-full animate-ping absolute inset-0" />
                                <div className="h-2 w-2 bg-orange-500 rounded-full relative" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Pulse</p>
                                <p className="text-lg font-black text-white italic">{communityPulse.toFixed(1)} <span className="text-xs text-orange-500">MILES TODAY</span></p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setRivalMode(!rivalMode)
                            addLog(`Friendly Rival Mode ${!rivalMode ? 'Activated' : 'Deactivated'}`, "info")
                        }}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${rivalMode
                            ? "bg-orange-500 border-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                            : "bg-black/40 border-white/10 text-zinc-500 hover:text-white"
                            }`}
                    >
                        <Trophy className={`h-4 w-4 ${rivalMode ? "animate-bounce" : ""}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {rivalMode ? "Friendly Rival Mode: ON" : "Enable Friendly Rival"}
                        </span>
                    </motion.button>
                </div>
            </div>

            {/* Challenge of the Day Micro-Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto glass-card border-orange-500/20 p-6 rounded-[2rem] flex items-center justify-between gap-6 relative overflow-hidden group bg-orange-500/5"
            >
                <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-orange-500 text-black flex items-center justify-center shadow-lg">
                        <Flame className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">CHALLENGE OF THE DAY</p>
                        <h4 className="text-2xl font-black text-white italic tracking-tighter">"The Golden Hour Sprint"</h4>
                        <p className="text-xs font-medium text-zinc-500 mt-1">Log any activity between 6 PM - 8 PM for 2x Crew Momentum.</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-2">
                    <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-black text-white">PJ</div>
                    <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-black text-white">DS</div>
                    <div className="h-10 w-10 rounded-full bg-orange-500 text-black flex items-center justify-center border-2 border-black -ml-4">
                        <span className="text-[10px] font-black">+12</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {crews.map((crew, i) => (
                    <motion.div
                        key={crew.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ y: -8 }}
                    >
                        <Card className="glass-card border-white/5 overflow-hidden hover:border-orange-500/30 transition-all group cursor-pointer relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                            <CardContent className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className={`h-16 w-16 rounded-3xl ${crew.color} flex items-center justify-center text-black group-hover:rotate-12 transition-transform shadow-lg shadow-black/20`}>
                                        <crew.icon className="h-8 w-8" />
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-3xl font-black text-white group-hover:text-orange-500 transition-colors italic">{crew.miles.toLocaleString()}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Shared Miles</span>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-8">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white group-hover:translate-x-1 transition-transform">
                                        {crew.name}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                            {crew.members.toLocaleString()} MEMBERS STRONG
                                        </p>
                                        {rivalMode && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-1 text-[9px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full"
                                            >
                                                <ArrowUpRight className="h-3 w-3" />
                                                CLOSING THE GAP
                                            </motion.span>
                                        )}
                                    </div>
                                </div>

                                <div className="glass-morphism rounded-2xl p-6 border border-white/5 relative overflow-hidden bg-white/[0.02]">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">WEEKLY RITUAL PROMPT</p>
                                    <p className="text-lg font-medium text-white italic leading-snug mb-6">"{crew.prompt}"</p>

                                    <AnimatePresence mode="wait">
                                        {activePrompt === crew.id ? (
                                            <motion.form
                                                onSubmit={(e) => handleSubmit(crew.id, e)}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-4"
                                            >
                                                <div className="relative">
                                                    <Input
                                                        autoFocus
                                                        placeholder="Your 140-char response..."
                                                        maxLength={140}
                                                        value={currentInput}
                                                        onChange={(e) => setCurrentInput(e.target.value)}
                                                        className="bg-black/40 border-white/10 text-white italic rounded-xl h-12 pr-12 focus:border-orange-500/50"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitting || !currentInput.trim()}
                                                        size="icon"
                                                        className="absolute right-1 top-1 h-10 w-10 bg-orange-500 hover:bg-orange-600 text-black rounded-lg transition-transform hover:scale-105 active:scale-95"
                                                    >
                                                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </motion.form>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex items-center justify-between"
                                            >
                                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic flex items-center gap-2">
                                                    <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse" />
                                                    Active Discussion
                                                </span>
                                                <Button
                                                    onClick={(e) => { e.stopPropagation(); setActivePrompt(crew.id); }}
                                                    variant="link"
                                                    className="text-orange-500 text-[10px] font-black uppercase p-0 h-auto tracking-widest hover:text-white transition-colors"
                                                >
                                                    Add Your Story →
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {responses[crew.id] && !activePrompt && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3"
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-[11px] font-medium text-white italic">"{responses[crew.id]}"</p>
                                        </motion.div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* LIVE STORY FEED */}
            <div className="space-y-8 pt-20 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Crew <span className="text-orange-500">Pulse</span></h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Real-time activity stream</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {storyFeed.items.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (idx % 3) * 0.1 }}
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                rotateX: 5,
                                rotateY: -5,
                                transition: { type: "spring", stiffness: 400, damping: 15 }
                            }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="glass-card p-6 rounded-3xl space-y-4 border-white/5 hover:border-orange-500/50 transition-all relative group overflow-hidden"
                        >
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 group-hover:via-orange-500/10 transition-all duration-500 pointer-events-none" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black text-white capitalize">
                                        {item.id.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-white">Member {item.id.slice(-4)}</p>
                                        <p className="text-[9px] font-bold text-zinc-600 italic">{new Date(item.ts).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${item.provider === 'strava' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                    {item.provider}
                                </span>
                            </div>
                            <div
                                onClick={() => setSelectedMember(item)}
                                className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-colors"
                            >
                                <p className="text-2xl font-black text-white italic tracking-tighter">
                                    {item.miles.toFixed(1)} <span className="text-sm text-zinc-500 uppercase">Miles</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setCheerSent(item.id)
                                        setTimeout(() => setCheerSent(null), 2000)
                                    }}
                                    className={`h-8 text-[9px] font-black uppercase tracking-widest rounded-lg flex-1 ${cheerSent === item.id ? 'bg-orange-500 text-black' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                                >
                                    {cheerSent === item.id ? "CHEER SENT!" : "SEND CHEER"}
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/5 text-zinc-500 rounded-lg">
                                    <ArrowUpRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {storyFeed.cursor && (
                    <div className="flex justify-center pt-8">
                        <ActionButton
                            onClick={async () => await loadMoreStories()}
                            label="Load More Stories ↓"
                            loadingLabel="Fetching Data Ledger..."
                            variant="outline"
                            className="h-12 px-10 rounded-full border-white/10"
                        />
                    </div>
                )}
            </div>

            {/* Member Profile Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="max-w-md w-full glass-card border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-orange-500" />

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-zinc-900 flex items-center justify-center text-4xl font-black text-orange-500 border-4 border-black shadow-2xl">
                                    {selectedMember.id.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Member {selectedMember.id.slice(-4)}</h3>
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Chicago Crew • Consistent Walker</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 w-full">
                                    {[
                                        { label: "STREAK", val: "12d", icon: Flame },
                                        { label: "RANK", val: "#42", icon: Trophy },
                                        { label: "MILES", val: "84.2", icon: Zap }
                                    ].map(s => (
                                        <div key={s.label} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <s.icon className="h-3 w-3 text-orange-500 mx-auto mb-2" />
                                            <p className="text-lg font-black text-white">{s.val}</p>
                                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full space-y-3">
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-left ml-1">Recent Momentum</p>
                                    <div className="flex gap-1 h-8 items-end">
                                        {[20, 45, 10, 80, 50, 60, 30, 90, 40, 70].map((h, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                className="flex-1 bg-white/10 rounded-t-sm hover:bg-orange-500 transition-colors"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setSelectedMember(null)}
                                    className="w-full h-16 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl mt-4"
                                >
                                    Close Profile
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
