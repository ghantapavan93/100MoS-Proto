"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"

const HERO_IMAGES = [
    "/hero.jpg",
    "/hero_1.jpg",
    "/hero_2.jpg",
    "/hero_3.jpg",
    "/hero_4.jpg",
    "/hero_5.jpg",
]

const NARRATIVES = [
    "No lost miles — even when life gets loud.",
    "Start small. Stay steady. Finish strong.",
    "A story you write one day at a time.",
    "Your pace counts. Your progress counts.",
    "Consistency over intensity — every time.",
    "Built for mornings, lunch breaks, and after-work miles.",
    "The first 10 minutes are the whole secret.",
    "Show up once — we’ll help you show up again.",
    "A season of tiny wins that add up.",
    "Proof you moved — not pressure to perform.",
    "Your summer rhythm, tracked with zero friction.",
    "A challenge that respects real life.",
    "Momentum is a habit. This is the system.",
    "Join the story — keep the promise.",
]

export function HeroSection() {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
    const [narrativeIndex, setNarrativeIndex] = React.useState(0)
    const prefersReducedMotion = useReducedMotion()

    React.useEffect(() => {
        const imageTimer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
        }, 5000)

        const narrativeTimer = setInterval(() => {
            setNarrativeIndex((prev) => (prev + 1) % NARRATIVES.length)
        }, 4100) // 0.35s in + 3.5s hold + 0.25s out = 4.1s

        return () => {
            clearInterval(imageTimer)
            clearInterval(narrativeTimer)
        }
    }, [])

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-black py-20">
            {/* Background Image Slideshow */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={HERO_IMAGES[currentImageIndex]}
                        initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
                        animate={{ opacity: 0.35, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url("${HERO_IMAGES[currentImageIndex]}")` }}
                    />
                </AnimatePresence>

                {/* Deep Ember Radial Glow */}
                <motion.div
                    animate={{
                        opacity: [0.1, 0.25, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'radial-gradient(circle at 50% 40%, #f97316 0%, transparent 70%)',
                        filter: 'blur(120px)',
                    }}
                />

                {/* Overlay Gradient (Filmic) */}
                <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/90 via-black/20 to-black" />
            </div>

            <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center z-30">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-md"
                >
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-orange-500">
                        TRUSTED BY 270K+ RUNNERS WORLDWIDE
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="relative h-32 w-32 mx-auto">
                        <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
                        <img
                            src="/logo.jpg"
                            alt="100 Miles of Summer Logo"
                            className="relative z-10 h-full w-full object-contain rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.2)]"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    className="mb-8 relative"
                >
                    {/* Cinematic Text Reveal with Scanning Animation */}
                    <div className="relative inline-block overflow-hidden">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="max-w-7xl text-5xl font-black uppercase tracking-tighter text-white sm:text-7xl md:text-[8rem] lg:text-[10rem] leading-[0.85] mb-4"
                        >
                            THE MOMENT <br />
                            <span className="text-orange-500 text-shadow-glow glitch italic block mt-2 pr-4">
                                THAT GETS YOU MOVING.
                            </span>
                        </motion.h1>

                        {/* Scanning Laser Fade */}
                        <motion.div
                            animate={{ left: ['-10%', '110%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent skew-x-12 pointer-events-none"
                        />
                    </div>

                    {/* Main Subheading Anchor - Cinematic Cascade Reveal */}
                    <div className="mt-8 mb-6 overflow-hidden">
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            className="max-w-5xl mx-auto text-xl font-black text-white uppercase tracking-tight md:text-3xl leading-tight"
                        >
                            {["All", "paces", "and", "faces", "—", "walking,", "jogging,", "running,", "and", "rolling."].map((word, i) => (
                                <motion.span
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                                        visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                                    }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="inline-block mr-2"
                                >
                                    {word}
                                </motion.span>
                            ))}
                            <br />
                            <motion.span
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
                                    visible: { opacity: 1, scale: 1, filter: "blur(0px)" }
                                }}
                                transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                                className="text-orange-500 inline-block mt-2 relative"
                            >
                                A summer promise you can actually keep.
                                <motion.div
                                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-orange-500/20 blur-xl -z-10 rounded-full"
                                />
                            </motion.span>
                        </motion.p>
                    </div>

                    {/* Narrative Poetic Cycler */}
                    <div className="h-16 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {!prefersReducedMotion ? (
                                <motion.div
                                    key={narrativeIndex}
                                    initial={{ opacity: 0, y: 15, filter: "blur(12px)" }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                        transition: { duration: 0.35 }
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -10,
                                        filter: "blur(8px)",
                                        transition: { duration: 0.25 }
                                    }}
                                    className="px-4"
                                >
                                    <p className="max-w-4xl mx-auto text-lg font-bold text-zinc-500 md:text-2xl italic tracking-tight">
                                        “{NARRATIVES[narrativeIndex]}”
                                    </p>
                                </motion.div>
                            ) : (
                                <p className="max-w-4xl mx-auto text-lg font-bold text-zinc-500 md:text-2xl italic tracking-tight">
                                    “{NARRATIVES[0]}”
                                </p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col items-center space-y-8"
                >
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                        <Button
                            asChild
                            size="lg"
                            className="h-20 px-12 text-xl font-black uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                        >
                            <Link href="/demo">Join the Challenge</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-20 px-12 text-xl font-black uppercase tracking-widest border-white/20 text-white hover:bg-white hover:text-black transition-all border-2"
                        >
                            <Link href="#shop">Get Your Gear</Link>
                        </Button>
                    </div>

                    {/* Massive Attractive Preview CTA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="group w-full max-w-2xl mt-8"
                    >
                        <Link
                            href="/demo"
                            className="relative flex items-center justify-between p-10 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-orange-500/50 hover:bg-white/[0.04] transition-all group-hover:scale-[1.05] active:scale-[0.98] cursor-pointer overflow-hidden"
                        >
                            {/* Animated Background Shine */}
                            <motion.div
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent skew-x-12"
                            />

                            <div className="relative z-10 text-left">
                                <p className="text-[12px] font-black uppercase text-orange-500 tracking-[0.4em] mb-2 animate-pulse">Live Interactive Console</p>
                                <h3 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter group-hover:text-orange-500 transition-colors flex items-center gap-4">
                                    PREVIEW THE APP
                                    <Sparkles className="h-8 w-8 text-orange-500" />
                                </h3>
                                <p className="mt-3 text-lg font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors italic">
                                    Experience the <span className="text-white">Aether Grid</span> & Operational Cockpit.
                                </p>
                            </div>
                            <div className="relative z-10 h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black group-hover:border-orange-600 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] transition-all">
                                <ArrowRight className="h-10 w-10" />
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1, delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/50 animate-bounce">Scroll to Explore</span>
            </motion.div>
        </section>
    )
}
