"use client"

import { motion, useReducedMotion } from "framer-motion"

export function MarqueeSection() {
    const manifestoText = "CONSISTENCY OVER INTENSITY • RITUAL OVER RUSH • PROGRESS OVER PERFECTION • "
    const missionText = "THE MOMENT THAT GETS YOU MOVING • NO LOST MILES • A SUMMER PROMISE YOU CAN ACTUALLY KEEP • "
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative w-full overflow-hidden bg-orange-500 py-6 select-none border-y border-orange-600/20">
            {/* Cinematic Fade Masks */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-orange-500 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-orange-500 to-transparent z-10 pointer-events-none" />

            <div className="flex flex-col gap-2">
                {/* Track 1: Manifesto (Right to Left) */}
                <div className="marquee-track">
                    {!prefersReducedMotion && [...Array(4)].map((_, i) => (
                        <div key={`manifesto-${i}`} className="flex items-center">
                            <span className="mx-6 text-xl font-black uppercase tracking-[0.2em] text-black/90 md:text-3xl">
                                {manifestoText}
                            </span>
                        </div>
                    ))}
                    {prefersReducedMotion && (
                        <span className="mx-6 text-xl font-black uppercase tracking-[0.2em] text-black/90 md:text-3xl">
                            {manifestoText}
                        </span>
                    )}
                </div>

                {/* Track 2: Mission (Left to Right - Reverse) */}
                <div className="marquee-track-reverse">
                    {!prefersReducedMotion && [...Array(4)].map((_, i) => (
                        <div key={`mission-${i}`} className="flex items-center">
                            <span className="mx-6 text-xl font-black uppercase italic tracking-tighter text-white md:text-4xl text-shadow-sm">
                                {missionText}
                            </span>
                        </div>
                    ))}
                    {prefersReducedMotion && (
                        <span className="mx-6 text-xl font-black uppercase italic tracking-tighter text-white md:text-4xl text-shadow-sm">
                            {missionText}
                        </span>
                    )}
                </div>
            </div>
        </section>
    )
}
