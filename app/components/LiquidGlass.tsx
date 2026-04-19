'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LiquidGlassProps {
  children: React.ReactNode
  className?: string
  animated?: boolean
  padding?: string
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  className = '',
  animated = true,
  padding = 'p-5',
}) => {
  const liquidVariants = {
    animate: {
      y: [0, 10, -10, 0],
      opacity: [0.3, 0.5, 0.3, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Floating colour orbs */}
      {animated && (
        <>
          <motion.div
            variants={liquidVariants}
            animate="animate"
            className="absolute top-0 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 pointer-events-none"
          />
          <motion.div
            variants={liquidVariants}
            animate="animate"
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-4 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 pointer-events-none"
          />
          <motion.div
            variants={liquidVariants}
            animate="animate"
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-0 right-1/3 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 pointer-events-none"
          />
        </>
      )}

      {/* Glass surface */}
      <div className={`relative backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 shadow-xl ${padding}`}>
        {/* Frosted shimmer edge */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}

export default LiquidGlass
