"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface DataPoint {
    label: string
    value: number
}

interface SimpleLineGraphProps {
    data: DataPoint[]
    height?: number
    color?: string
}

export function SimpleLineGraph({ data, height = 120, color = "#f97316" }: SimpleLineGraphProps) {
    const max = Math.max(...data.map(d => d.value), 1)
    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * 100,
        y: 100 - (d.value / max) * 100
    }))

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    return (
        <div className="w-full relative" style={{ height }}>
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
            >
                {/* Grid Line */}
                <line x1="0" y1="100" x2="100" y2="100" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />

                {/* The Line */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Data Points */}
                {points.map((p, i) => (
                    <motion.circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="2"
                        fill={color}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + (i * 0.05), duration: 0.3 }}
                    />
                ))}
            </svg>

            {/* Tooltip Simulation on hover could go here */}
        </div>
    )
}
