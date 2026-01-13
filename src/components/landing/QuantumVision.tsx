"use client"

import React from "react"
import { motion } from "framer-motion"
import { Sparkles, Activity, ShieldCheck, Zap } from "lucide-react"

export function QuantumVision() {
    return (
        <section className="relative py-32 bg-black overflow-hidden border-t border-white/5">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Visual Asset Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="relative"
                    >
                        <div className="relative aspect-square max-w-[600px] mx-auto group">
                            {/* Animated Frame */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-transparent border border-white/5 rounded-[3rem] -z-10 animate-pulse" />

                            {/* Quantum Coach Image */}
                            <img
                                src="/quantum_health_coach.png"
                                alt="Quantum Health Coach"
                                className="w-full h-full object-cover rounded-[2.5rem] shadow-[0_0_100px_rgba(249,115,22,0.15)] group-hover:scale-[1.02] transition-transform duration-700"
                            />

                            {/* Floating UI Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 glass-card p-6 rounded-3xl border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.2)]"
                            >
                                <Activity className="h-8 w-8 text-orange-500 mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pulse Status</p>
                                <p className="text-xl font-black text-white italic tracking-tighter">OPTIMIZED</p>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl border border-white/10"
                            >
                                <Zap className="h-8 w-8 text-white mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bio-Sync</p>
                                <p className="text-xl font-black text-white italic tracking-tighter">98.4% ACT</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20"
                            >
                                <Sparkles className="h-4 w-4 text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Aether Technology Layer</span>
                            </motion.div>
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.85]">
                                QUANTUM <br />
                                <span className="text-orange-500 italic">HEALTH COACH.</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-zinc-400 font-medium italic leading-relaxed max-w-xl">
                                More than an app. A <span className="text-white">biometric mirror</span> that reflects your spiritual, mental, and physical progress across the 100 Mile journey.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-card p-8 rounded-3xl border border-white/5 hover:border-orange-500/20 transition-all group">
                                <Zap className="h-10 w-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                                <h4 className="text-lg font-black uppercase tracking-tight text-white mb-2">Real-Time Sync</h4>
                                <p className="text-sm text-zinc-500 font-bold leading-relaxed">Automatic progression tracking across every wearable and device.</p>
                            </div>
                            <div className="glass-card p-8 rounded-3xl border border-white/5 hover:border-orange-500/20 transition-all group">
                                <ShieldCheck className="h-10 w-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                                <h4 className="text-lg font-black uppercase tracking-tight text-white mb-2">Privacy Core</h4>
                                <p className="text-sm text-zinc-500 font-bold leading-relaxed">Your data belongs to you. Zero tracking, just purely local resilience mapping.</p>
                            </div>
                        </div>

                        <motion.div
                            whileHover={{ x: 10 }}
                            className="inline-flex items-center gap-4 text-orange-500 font-black uppercase tracking-widest cursor-pointer group"
                        >
                            <span>Explore the Research</span>
                            <div className="h-1 w-12 bg-orange-500/30 group-hover:w-20 transition-all" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
