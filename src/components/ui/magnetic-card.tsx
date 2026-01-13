"use client"

import React, { useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

interface MagneticCardProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    whileHover?: any
    animate?: any
}

export const MagneticCard: React.FC<MagneticCardProps> = ({
    children,
    className,
    onClick,
    whileHover,
    animate
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const rotateX = useSpring(0, { stiffness: 100, damping: 30 })
    const rotateY = useSpring(0, { stiffness: 100, damping: 30 })

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distanceX = e.clientX - centerX
        const distanceY = e.clientY - centerY
        rotateY.set(distanceX / 10) // Tilt on Y axis based on mouse X
        rotateX.set(-distanceY / 10) // Tilt on X axis based on mouse Y
    }

    const handleMouseLeave = () => {
        rotateX.set(0)
        rotateY.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000
            }}
            whileHover={whileHover}
            animate={animate}
            className={className}
        >
            <div style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>
        </motion.div>
    )
}
