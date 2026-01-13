"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Rocket, ExternalLink, Github, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "./CartContext"
import Link from "next/link"

const navLinks = [
    { name: "Live Demo", href: "/demo", icon: Rocket, highlight: true },
    { name: "The Mission", href: "#mission" },
    { name: "Summer Gear", href: "#shop" },
    { name: "Ops Cockpit", href: "/ops" },
    { name: "2026 Roadmap", href: "#" },
]

export function GlobalSidebar() {
    const { isMenuOpen, setMenuOpen } = useCart()

    return (
        <AnimatePresence>
            {isMenuOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMenuOpen(false)}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
                    />
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-full w-full max-w-sm bg-black border-r border-white/5 z-[101] flex flex-col"
                    >
                        <div className="p-8 flex items-center justify-between">
                            <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
                                <img src="/logo.jpg" alt="100 Miles of Summer" className="h-10 w-auto" />
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} className="text-zinc-500 hover:text-white">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 flex flex-col justify-center gap-8">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={`group flex items-center justify-between text-3xl font-black uppercase tracking-tighter transition-all hover:translate-x-4 ${link.highlight ? 'text-orange-500' : 'text-white'}`}
                                    >
                                        <span>{link.name}</span>
                                        {link.highlight ? <Rocket className="h-6 w-6" /> : <ArrowRight className="h-6 w-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-12 space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Join the movement</p>
                                <div className="flex gap-6">
                                    <Instagram className="h-5 w-5 text-white/40 hover:text-orange-500 transition-colors cursor-pointer" />
                                    <Twitter className="h-5 w-5 text-white/40 hover:text-orange-500 transition-colors cursor-pointer" />
                                    <Github className="h-5 w-5 text-white/40 hover:text-orange-500 transition-colors cursor-pointer" />
                                </div>
                            </div>

                            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700 leading-relaxed max-w-[200px]">
                                Built for the community. <br />
                                No lost miles. <br />
                                No lost progress.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
