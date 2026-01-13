"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EmailSubscribe() {
    return (
        <section className="bg-zinc-900 py-24 md:py-32">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="mb-6 text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">
                        STAY IN <span className="text-orange-500">THE KNOW.</span>
                    </h2>
                    <p className="mb-12 text-lg font-medium text-white/60 italic">
                        Get the latest movement prompts, gear drops, and summer stories delivered straight to your inbox.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            type="email"
                            placeholder="YOUR@EMAIL.COM"
                            className="h-16 bg-black border-white/10 text-white font-bold tracking-widest placeholder:text-white/20 focus-visible:ring-orange-500"
                        />
                        <Button className="h-16 px-10 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-widest text-lg">
                            Subscribe
                        </Button>
                    </form>
                </motion.div>
            </div>
        </section>
    )
}
