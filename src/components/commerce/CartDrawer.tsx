"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "./CartContext"

export function CartDrawer() {
    const { items, isCartOpen, setCartOpen, removeItem, total, count } = useCart()

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/5 z-[101] flex flex-col shadow-2xl"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-6 w-6 text-orange-500" />
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Your Gear <span className="text-orange-500">[{count}]</span></h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)} className="text-zinc-500 hover:text-white">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                    <ShoppingBag className="h-12 w-12" />
                                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Your cart is empty.<br />The road is waiting.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="h-24 w-24 rounded-2xl bg-zinc-900 overflow-hidden border border-white/5 flex-shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.name}</h4>
                                                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-zinc-600 hover:text-red-500 -mt-1">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                                            <p className="text-orange-500 font-black mt-2">${item.price}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 bg-zinc-900/50 border-t border-white/5 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        <span>Subtotal</span>
                                        <span>${total}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black uppercase tracking-tight text-white">
                                        <span>Total</span>
                                        <span className="text-orange-500">${total}</span>
                                    </div>
                                </div>
                                <Button className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-widest text-xs rounded-2xl group">
                                    Checkout Now
                                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
