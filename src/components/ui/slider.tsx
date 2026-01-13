"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface SliderProps {
    defaultValue?: number[]
    max?: number
    step?: number
    onValueChange?: (value: number[]) => void
    className?: string
}

export function Slider({ defaultValue = [0], max = 100, onValueChange, className }: SliderProps) {
    const [value, setValue] = React.useState(defaultValue[0])
    const [isDragging, setIsDragging] = React.useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = parseInt(e.target.value)
        setValue(newVal)
        onValueChange?.([newVal])
    }

    return (
        <div className={`relative flex items-center select-none touch-none w-full h-10 ${className}`}>
            <div className="relative w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                    className="absolute h-full bg-orange-500"
                    initial={false}
                    animate={{ width: `${(value / max) * 100}%` }}
                />
            </div>
            <input
                type="range"
                min="0"
                max={max}
                value={value}
                onChange={handleChange}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <motion.div
                className={`absolute h-5 w-5 rounded-full bg-white shadow-xl z-10 pointer-events-none flex items-center justify-center`}
                initial={false}
                animate={{
                    left: `calc(${(value / max) * 100}% - 10px)`,
                    scale: isDragging ? 1.2 : 1,
                    boxShadow: isDragging ? "0 0 20px rgba(249,115,22,0.5)" : "0 0 0px rgba(0,0,0,0)"
                }}
            >
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            </motion.div>
        </div>
    )
}
