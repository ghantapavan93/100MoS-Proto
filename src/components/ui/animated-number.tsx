"use client"

import * as React from "react"
import { motion, useSpring, useTransform, animate, useReducedMotion } from "framer-motion"

interface AnimatedNumberProps {
    value: number
    decimals?: number
    className?: string
    delay?: number
}

export function AnimatedNumber({ value, decimals = 0, className = "", delay = 0 }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = React.useState(0)
    const [isFinished, setIsFinished] = React.useState(false)
    const shouldReduceMotion = useReducedMotion()

    React.useEffect(() => {
        if (shouldReduceMotion) {
            setDisplayValue(value)
            return
        }
        const controls = animate(0, value, {
            duration: 1.2,
            delay,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (latest) => {
                setDisplayValue(latest)
            },
            onComplete: () => {
                setIsFinished(true)
                // Reset finish state after animation
                setTimeout(() => setIsFinished(false), 300)
            }
        })
        return () => controls.stop()
    }, [value, delay, shouldReduceMotion])

    return (
        <motion.span
            animate={isFinished ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.25 }}
            className={className}
        >
            {displayValue.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
        </motion.span>
    )
}
