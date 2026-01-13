"use client"

import * as React from "react"
import { useDemo } from "./DemoContext"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Share2, Download, Trophy, Sparkles, Loader2, CheckCircle2, Star, Ghost, ArrowLeft, PartyPopper } from "lucide-react"
import { toPng } from 'html-to-image'
import { ActionButton } from "@/components/ui/action-button"

export function SummerStoryStep() {
    const { totals, profile, addLog } = useDemo()
    const cardRef = React.useRef<HTMLDivElement>(null)
    const [isExporting, setIsExporting] = React.useState(false)
    const [isSharing, setIsSharing] = React.useState(false)
    const [shareSuccess, setShareSuccess] = React.useState(false)
    const [ceremonyState, setCeremonyState] = React.useState<'idle' | 'revealing' | 'complete'>('idle')

    const startCeremony = async () => {
        setCeremonyState('revealing')
        addLog("Cinematic: Award Ceremony Initiated", "info")
        await new Promise(r => setTimeout(r, 2000))
        setCeremonyState('complete')
    }

    const shareStory = async () => {
        setIsSharing(true)
        const shareText = `🏆 My Summer Story: ${totals.miles.toFixed(0)} miles completed!\n\n"${profile.why_statement || "I wanted to find my summer rhythm."}"\n\n#100MilesOfSummer #SummerRitual`

        try {
            if (cardRef.current) {
                const dataUrl = await toPng(cardRef.current, { cacheBust: true })
                const blob = await (await fetch(dataUrl)).blob()
                const file = new File([blob], '100-miles-summer.png', { type: 'image/png' })

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: '100 Miles of Summer - My Story',
                        text: shareText,
                        files: [file]
                    })
                    setShareSuccess(true)
                } else {
                    await navigator.clipboard.writeText(shareText)
                    setShareSuccess(true)
                }
            }
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                await navigator.clipboard.writeText(shareText)
                setShareSuccess(true)
            }
        } finally {
            setIsSharing(false)
            if (shareSuccess) {
                setTimeout(() => setShareSuccess(false), 3000)
            }
        }
    }

    const downloadCard = async () => {
        if (!cardRef.current) return
        setIsExporting(true)
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true })
            const link = document.createElement('a')
            link.download = `100-miles-summer-recap-${new Date().getFullYear()}.png`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error('Download failed:', err)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="space-y-16">
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mx-auto">
                    <Trophy className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">The Season Finale</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                    YOUR SUMMER <span className="text-orange-500 italic">STORY.</span>
                </h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto leading-relaxed">
                    A celebration of consistency and heart. You didn't just move — you built a ritual.
                </p>
            </div>

            <div className="relative">
                <AnimatePresence mode="wait">
                    {ceremonyState === 'idle' ? (
                        <motion.div
                            key="ceremony-trigger"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center py-20 space-y-8"
                        >
                            <div className="h-40 w-40 rounded-[3rem] bg-zinc-900 border border-white/5 flex items-center justify-center relative overflow-hidden group">
                                <Trophy className="h-20 w-20 text-zinc-800 group-hover:text-orange-500/50 transition-colors" />
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5" />
                            </div>
                            <Button
                                onClick={startCeremony}
                                className="h-20 px-12 bg-white text-black font-black uppercase tracking-widest text-sm rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                            >
                                <PartyPopper className="mr-3 h-5 w-5" /> Begin Award Ceremony
                            </Button>
                        </motion.div>
                    ) : ceremonyState === 'revealing' ? (
                        <motion.div
                            key="revealing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center py-20 space-y-8 text-center"
                        >
                            <Loader2 className="h-16 w-16 text-orange-500 animate-spin" />
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Preparing Your Summer Recapitulation...</h3>
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Verified Ledger Audit in Progress</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="final-card"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-12"
                        >
                            <motion.div
                                ref={cardRef}
                                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                whileHover={{
                                    scale: 1.02,
                                    rotateX: 2,
                                    rotateY: 2,
                                    boxShadow: "0 50px 100px -20px rgba(249,115,22,0.3)",
                                    transition: { type: "spring", stiffness: 200, damping: 20 }
                                }}
                                style={{ transformStyle: 'preserve-3d' }}
                                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                                className="relative glass-card shadow-[0_0_100px_rgba(249,115,22,0.15)] rounded-[4rem] overflow-hidden border-white/5 bg-black"
                            >
                                {/* Shimmer Effect */}
                                <motion.div
                                    initial={{ x: "100%", opacity: 0 }}
                                    whileHover={{ x: "-100%", opacity: 0.2 }}
                                    transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 pointer-events-none z-10"
                                />
                                {/* Premium Border */}
                                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500" />

                                <div className="p-12 md:p-24 space-y-20 relative">
                                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                                    <div className="flex flex-col items-center text-center space-y-10">
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.4 }}
                                            className="h-32 w-32 rounded-[3.5rem] bg-orange-500 text-black flex items-center justify-center relative shadow-[0_0_60px_rgba(249,115,22,0.6)]"
                                        >
                                            <Trophy className="h-16 w-16" />
                                            <motion.div
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 rounded-[3.5rem] border-4 border-orange-500"
                                            />
                                        </motion.div>

                                        <div className="space-y-3">
                                            <motion.h3
                                                initial={{ opacity: 0, y: 40 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6, type: "spring" }}
                                                className="text-8xl md:text-9xl font-black text-white italic tracking-tighter"
                                            >
                                                {totals.miles.toFixed(0)} <span className="text-orange-500">MILES</span>
                                            </motion.h3>
                                            <p className="text-[12px] font-black uppercase tracking-[0.8em] text-zinc-600 pl-4">The Summer Story • Full Recapitulation</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-16 border-y border-white/10 relative">
                                        {[
                                            { label: "CONSISTENCY PEAK", val: "WEEK 4", sub: "5 Active Days", color: "text-orange-500" },
                                            { label: "RESILIENCE SCORE", val: "TOP 5%", sub: "10-Day Break Bridge", color: "text-blue-500" }
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={stat.label}
                                                initial={{ y: -100, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    damping: 10,
                                                    stiffness: 80,
                                                    delay: 1 + (i * 0.2)
                                                }}
                                                className="space-y-4 text-center md:text-left"
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 block">{stat.label}</span>
                                                <span className={`text-5xl font-black uppercase italic tracking-tighter ${stat.color}`}>{stat.val}</span>
                                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{stat.sub}</p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="text-center space-y-8 p-12 rounded-[3.5rem] relative bg-white/[0.03] border border-white/5">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 bg-black rounded-full border border-white/10 flex items-center justify-center">
                                            <Sparkles className="h-6 w-6 text-orange-500" />
                                        </div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">"I completed this ritual because..."</p>
                                        <p className="text-3xl md:text-4xl font-medium text-white italic leading-relaxed max-w-3xl mx-auto">
                                            "{profile.why_statement || "I wanted to find my summer rhythm."}"
                                        </p>
                                        <div className="pt-6">
                                            <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                                Ritual Authenticated • August 31, 2026
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="flex flex-col md:flex-row gap-6 max-w-2xl mx-auto pt-8">
                                <ActionButton
                                    onClick={async () => await shareStory()}
                                    label="Share My Story"
                                    loadingLabel="Preparing Card..."
                                    successLabel="Link Copied!"
                                    className="flex-1 h-20 bg-orange-500 text-black rounded-3xl"
                                >
                                    <Share2 className="mr-3 h-5 w-5" />
                                </ActionButton>
                                <ActionButton
                                    onClick={async () => await downloadCard()}
                                    label="Download Card"
                                    loadingLabel="Generating PNG..."
                                    variant="outline"
                                    className="flex-1 h-20 border-white/20 bg-white/5 text-white rounded-3xl"
                                >
                                    <Download className="mr-3 h-5 w-5" />
                                </ActionButton>
                            </div>

                            <div className="text-center pt-12">
                                <Button
                                    variant="ghost"
                                    onClick={() => setCeremonyState('idle')}
                                    className="text-zinc-600 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all"
                                >
                                    <ArrowLeft className="mr-2 h-3 w-3" /> Reset Ceremony
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
