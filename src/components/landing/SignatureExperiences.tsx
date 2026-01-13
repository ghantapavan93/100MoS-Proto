"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Home, Users, Settings } from "lucide-react"

const features = [
    {
        title: "Seasonal Journey",
        description: "Capture each person's 'why' and reflect it back to them throughout the summer.",
        icon: Calendar,
        color: "text-blue-500",
    },
    {
        title: "Progress Home",
        description: "Miles, days left, weekly rhythm, and sync clarity. No lost progress, ever.",
        icon: Home,
        color: "text-green-500",
    },
    {
        title: "Crews, Not Pressure",
        description: "Themed crews and gentle prompts. Belonging without the leaderboard stress.",
        icon: Users,
        color: "text-purple-500",
    },
    {
        title: "Calm Summer Ops",
        description: "Provider health, retry logic, and quiet list monitoring for a stress-free peak season.",
        icon: Settings,
        color: "text-orange-500",
    },
]

export function SignatureExperiences() {
    return (
        <section className="bg-black py-24 md:py-32">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white md:text-6xl lg:text-7xl">
                        NO LOST MILES. HIGH BELONGING.<br />
                        <span className="text-orange-500 text-3xl md:text-5xl lg:text-6xl">LOW OPS LOAD.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative rounded-2xl border border-white/10 bg-zinc-900/50 p-8 transition-all hover:bg-zinc-900"
                        >
                            <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black/50 ${feature.color}`}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-2xl font-black uppercase tracking-tight text-white">
                                {feature.title}
                            </h3>
                            <p className="mb-8 text-white/60">
                                {feature.description}
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 hover:text-black font-bold uppercase tracking-widest text-xs"
                            >
                                <Link href="/demo">Preview →</Link>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
