"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const cards = [
    {
        title: "OUR MISSION",
        image: "/hero_3.jpg",
        content: "Leverage walking, jogging, running, and rolling for better health. We build self-confidence, lasting habits, and deep human connection. Fully inclusive and accessible for every body.",
    },
    {
        title: "OUR COMMUNITY",
        image: "/hero_5.jpg",
        content: "A global community of all paces and faces. With meetups in 6+ cities and thousands joining online, we are united by a healthier lifestyle through movement.",
    },
    {
        title: "OUR IMPACT",
        image: "/hero_1.jpg",
        content: "More than just running. We break down access and inclusivity boundaries by providing resources and connection so you never have to feel alone in your journey.",
    },
]

export function MissionSection() {
    return (
        <section className="bg-black py-24 md:py-32">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <Card className="overflow-hidden border-none bg-zinc-900 shadow-2xl transition-all hover:-translate-y-2">
                                <div className="aspect-[4/3] w-full overflow-hidden">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <CardContent className="p-8">
                                    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-orange-500">
                                        {card.title}
                                    </h3>
                                    <p className="text-lg font-medium leading-relaxed text-white/80">
                                        {card.content}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
