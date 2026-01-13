"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useDemo } from "@/components/demo/DemoContext"

interface ActionButtonProps {
    onClick: () => Promise<void> | void
    label: string
    loadingLabel?: string
    successLabel?: string
    className?: string
    variant?: "primary" | "outline" | "ghost"
    children?: React.ReactNode
}

export function ActionButton({
    onClick,
    label,
    loadingLabel = "Processing...",
    successLabel = "Confirmed",
    className = "",
    variant = "primary",
    children
}: ActionButtonProps) {
    const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle")
    const { addHint } = useDemo()

    const handleAction = async () => {
        if (status !== "idle") return

        setStatus("loading")
        try {
            await onClick()
            setStatus("success")
            addHint(successLabel, "success")
            setTimeout(() => setStatus("idle"), 2000)
        } catch (e) {
            setStatus("idle")
            addHint("Action failed. System reset.", "error")
        }
    }

    const variants = {
        primary: "bg-orange-500 hover:bg-orange-600 text-black shadow-[0_0_20px_rgba(249,115,22,0.2)]",
        outline: "bg-black/40 border border-white/10 text-white hover:bg-white/5",
        ghost: "text-zinc-500 hover:text-white"
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleAction}
            disabled={status === "loading"}
            className={`
                relative px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] 
                transition-all flex items-center justify-center gap-2 overflow-hidden
                ${variants[variant]} 
                ${className}
                ${status === "loading" ? "cursor-wait" : "cursor-pointer"}
            `}
        >
            <AnimatePresence mode="wait">
                {status === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                    >
                        {children}
                        {label}
                    </motion.div>
                )}
                {status === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                    >
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {loadingLabel}
                    </motion.div>
                )}
                {status === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-green-500"
                    >
                        <CheckCircle2 className="h-3 w-3" />
                        {successLabel}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Ripple/Glow effect on Tap */}
            {status === "loading" && (
                <motion.div
                    layoutId="action-glow"
                    className="absolute inset-0 bg-white/10 blur-xl px-4"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
            )}
        </motion.button>
    )
}
