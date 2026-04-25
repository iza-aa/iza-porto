'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LiquidGlassProps {
  children: React.ReactNode
  className?: string
  animated?: boolean
  padding?: string
  variant?: 'default' | 'navbar'
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  className = '',
  animated = true,
  padding = 'p-5',
  variant = 'default',
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

  const glassStyles = {
    default:
      'backdrop-blur-md bg-white/10  border border-white/20 shadow-xl transition-all duration-200',
    navbar:
      'backdrop-blur-2xl bg-white/10 rounded-sm border border-white/20 shadow-[0_4px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-200 hover:bg-white/20 hover:border-white/30 hover:shadow-[0_6px_36px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.45)]',
  }

  const showOrbs = animated && variant === 'default'

  return (
    <div className={`relative F ${className}`}>
      {/* Floating colour orbs */}
      {showOrbs && (
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
      <div className={`${glassStyles[variant]} ${padding}`}>
        {/* Frosted shimmer edge */}
        <div className="absolute inset-0  bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}

export default LiquidGlass
