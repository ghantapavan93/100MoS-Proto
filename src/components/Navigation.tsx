"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useCart } from "./commerce/CartContext"
import { CartDrawer } from "./commerce/CartDrawer"
import { GlobalSidebar } from "./commerce/GlobalSidebar"

export function Navigation() {
  const { count, setCartOpen, setMenuOpen } = useCart()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Left: About/Shop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/#vision"
                className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-orange-500 transition-colors"
              >
                About
              </Link>
              <Link
                href="/#shop"
                className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-orange-500 transition-colors"
              >
                Shop
              </Link>
            </nav>

            <Link href="/" className="flex items-center transition-transform active:scale-95">
              <img src="/logo.jpg" alt="100 Miles of Summer" className="h-12 w-auto" />
            </Link>

            {/* Right: Cart/Menu/Ops */}
            <div className="flex items-center space-x-6">
              {/* The Engine Room (Ops Cockpit) - Redesigned for Maximum Impact */}
              <Link
                href="/ops"
                className="group relative hidden sm:flex items-center gap-3 px-6 py-2.5 rounded-full bg-black border border-white/10 hover:border-orange-500/50 transition-all active:scale-95 overflow-hidden"
              >
                {/* Animated Background Pulse */}
                <motion.div
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-orange-500/10"
                />

                {/* Rolling Scanline */}
                <motion.div
                  animate={{ top: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-0 h-px bg-orange-500/20 blur-[2px] z-10"
                />

                <div className="relative z-20 flex items-center gap-2">
                  <div className="relative">
                    <Rocket className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 leading-none mb-0.5">Console</span>
                    <span className="text-xs font-black uppercase tracking-widest text-white leading-none">Ops Cockpit</span>
                  </div>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-[10px] font-bold text-black flex items-center justify-center animate-in zoom-in duration-300">
                    {count}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />
      <GlobalSidebar />
    </>
  )
}
