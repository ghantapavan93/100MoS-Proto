"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BackgroundProps {
    isStressMode: boolean
}

export const CommandCenterBackground: React.FC<BackgroundProps> = ({ isStressMode }) => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
            {/* Deep Ember Radial Glow */}
            <motion.div
                animate={{
                    opacity: isStressMode ? [0.2, 0.4, 0.2] : [0.08, 0.15, 0.08],
                    scale: isStressMode ? [1, 1.3, 1] : [1, 1.1, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-0"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${isStressMode ? '#ef4444' : '#f97316'} 0%, transparent 60%)`,
                    filter: 'blur(80px)',
                }}
            />

            {/* The Dynamic Grid */}
            <motion.div
                className="absolute inset-x-[-50%] inset-y-[-50%] w-[200%] h-[200%]"
                animate={{
                    rotate: isStressMode ? [0, 1] : [0, 0.5],
                    x: isStressMode ? ["-2%", "0%"] : ["-1%", "0%"],
                    y: isStressMode ? ["-2%", "0%"] : ["-1%", "0%"]
                }}
                transition={{
                    duration: isStressMode ? 5 : 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${isStressMode ? '#ef444420' : '#f9731610'} 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Scanning Laser Line (Only in Stress Mode) */}
            <AnimatePresence>
                {isStressMode && (
                    <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10"
                    />
                )}
            </AnimatePresence>

            {/* Ambient Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />

            {/* Grain/Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    )
}
