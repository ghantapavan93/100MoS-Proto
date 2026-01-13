"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "../commerce/CartContext"
import { ShoppingBag, Star } from "lucide-react"

const products = [
    {
        id: "summer-gear-001",
        name: "Founder's Crew Socks",
        price: 24,
        description: "Zero-friction performance blend. No lost miles, no blisters.",
        image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=400",
        badge: "Limited Drop"
    },
    {
        id: "summer-gear-002",
        name: "Morning Ritual Tee",
        price: 48,
        description: "Ultra-breathable moisture wicking for those early summer miles.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400",
        badge: "Bestseller"
    },
    {
        id: "summer-gear-003",
        name: "High Noon Runner's Hat",
        price: 36,
        description: "Lightweight, crushable, and ready for 100 miles of heat.",
        image: "/high_noon_runners_hat.png",
        badge: "New Arrival"
    }
]

export function ShopSection() {
    const { addItem } = useCart()

    return (
        <section id="shop" className="bg-zinc-950 py-32 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                            <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Premium Gear</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
                            EQUIPPED FOR <br />
                            <span className="text-orange-500 italic font-black">THE LONG HAUL.</span>
                        </h2>
                    </div>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-sm mb-4">
                        Premium performance gear engineered for the 100 mile journey. Limited quantities for the 2026 season.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 mb-8">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />

                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">
                                        {product.badge}
                                    </span>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                                <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <Button
                                        onClick={() => addItem(product)}
                                        className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl"
                                    >
                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                        Add to Cart — ${product.price}
                                    </Button>
                                </div>
                            </div>

                            <div className="px-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                                        {product.name}
                                    </h3>
                                    <span className="text-orange-500 font-black">${product.price}</span>
                                </div>
                                <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
