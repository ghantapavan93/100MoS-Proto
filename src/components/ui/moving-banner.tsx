"use client"

import React from "react"
import { motion } from "framer-motion"

const MANTRA = "THE MOVEMENT THAT GETS YOU MOVING • ALL PACES AND FACES • NO LOST MILES • SUMMER IS A STORY • "

interface MovingBannerProps {
    className?: string
    speed?: number
}

export function MovingBanner({ className = "", speed = 20 }: MovingBannerProps) {
    return (
        <div className={`relative overflow-hidden bg-orange-500 py-3 select-none flex ${className}`}>
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="flex whitespace-nowrap"
            >
                <span className="text-black font-black italic uppercase tracking-tighter text-sm md:text-lg px-2">
                    {MANTRA.repeat(4)}
                </span>
                <span className="text-black font-black italic uppercase tracking-tighter text-sm md:text-lg px-2">
                    {MANTRA.repeat(4)}
                </span>
            </motion.div>
        </div>
    )
}
