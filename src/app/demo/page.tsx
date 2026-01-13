"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { DemoProvider, useDemo } from "@/components/demo/DemoContext"
import { OnboardingStep } from "@/components/demo/OnboardingStep"
import { ConnectStep } from "@/components/demo/ConnectStep"
import { ProgressHomeStep } from "@/components/demo/ProgressHomeStep"
import { SeasonalArcsStep } from "@/components/demo/SeasonalArcsStep"
import { CrewsStep } from "@/components/demo/CrewsStep"
import { MicroWinsStep } from "@/components/demo/MicroWinsStep"
import { SupportStep } from "@/components/demo/SupportStep"
import { SummerStoryStep } from "@/components/demo/SummerStoryStep"
import { TrustCenter } from "@/components/demo/TrustCenter"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

const steps = [
    { title: "Onboarding", component: OnboardingStep },
    { title: "Connect", component: ConnectStep },
    { title: "Progress Home", component: ProgressHomeStep },
    { title: "Seasonal Arcs", component: SeasonalArcsStep },
    { title: "Crews", component: CrewsStep },
    { title: "Micro-wins", component: MicroWinsStep },
    { title: "Support", component: SupportStep },
    { title: "Summer Story", component: SummerStoryStep },
    { title: "Trust Center", component: TrustCenter },
]

function DemoHeader() {
    const { profile, totals } = useDemo()
    const seasonProgress = (totals.miles / 100) * 100 // assuming 100 is target

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4"
        >
            <div className="container mx-auto max-w-4xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full border border-orange-500/20 flex items-center justify-center p-1">
                        <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                            <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                            <motion.circle
                                cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (Math.min(seasonProgress, 100) / 100) * 283}
                                className="text-orange-500"
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Summer Series</p>
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter italic whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                            {profile.why_statement || "Finding Your Rhythm"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20">
                        <span className="text-[9px] font-black text-white">{totals.miles === 100 ? "COMPLETE" : `${totals.miles.toFixed(1)} MILES`}</span>
                    </div>
                </div>
            </div>
        </motion.header>
    )
}

function DemoContent() {
    const { step, nextStep, prevStep, demoMode, toggleDemoMode, hints } = useDemo()
    const CurrentStep = steps[step].component
    const shouldReduceMotion = useReducedMotion()

    return (
        <div className="min-h-screen bg-black pt-20">
            <DemoHeader />
            <div className="container mx-auto px-4 max-w-4xl py-12">
                {/* Stepper */}
                <div className="mb-12 flex justify-between items-center overflow-x-auto pb-4 scrollbar-hide">
                    {steps.map((s, i) => (
                        <div key={s.title} className="flex items-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${i <= step ? "bg-orange-500 text-black" : "bg-zinc-800 text-zinc-500"
                                    }`}
                            >
                                {i + 1}
                            </div>
                            <span
                                className={`ml-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${i <= step ? "text-white" : "text-zinc-600"
                                    }`}
                            >
                                {s.title}
                            </span>
                            {i < steps.length - 1 && (
                                <div className="mx-4 h-[1px] w-4 bg-zinc-800" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="relative min-h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <CurrentStep />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-12 flex justify-between items-center border-t border-white/5 pt-8">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 0}
                        className="text-white hover:bg-white/5 font-bold uppercase tracking-widest text-xs"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    {step < steps.length - 1 ? (
                        <Button
                            onClick={nextStep}
                            className="bg-orange-500 hover:bg-orange-600 text-black font-bold uppercase tracking-widest text-xs px-8"
                        >
                            Continue
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <div /> // empty space for flex
                    )}
                </div>
            </div>
            {/* Demo Mode Toggle & Hints */}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end gap-4">
                <AnimatePresence>
                    {hints.map((hint) => (
                        <motion.div
                            key={hint.id}
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-black/90 border border-white/10 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[240px]"
                        >
                            <div className={`h-2 w-2 rounded-full animate-pulse ${hint.type === 'success' ? 'bg-green-500' : 'bg-orange-500'}`} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/90">{hint.msg}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleDemoMode}
                    className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${demoMode
                        ? 'bg-orange-500 border-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                        : 'bg-black/40 border-white/10 text-zinc-500'
                        }`}
                >
                    {demoMode ? 'DEMO MODE: ON' : 'DEMO MODE: OFF'}
                </motion.button>
            </div>
        </div>
    )
}

export default function DemoPage() {
    return (
        <DemoProvider>
            <DemoContent />
        </DemoProvider>
    )
}
