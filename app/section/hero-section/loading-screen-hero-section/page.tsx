'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO_TEXT = '/,A'
const TYPE_SPEED = 120
const DELETE_SPEED = 80
const PAUSE_AFTER_TYPE = 700
const PAUSE_AFTER_DELETE = 300

interface Props {
  isLoading: boolean
  progress: number
}

export default function LoadingScreen({ isLoading, progress }: Props) {
  const [displayLogo, setDisplayLogo] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'waiting'>('typing')

  useEffect(() => {
    if (!isLoading) return

    let timeout: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (displayLogo.length < LOGO_TEXT.length) {
        timeout = setTimeout(() => {
          setDisplayLogo(LOGO_TEXT.slice(0, displayLogo.length + 1))
        }, TYPE_SPEED)
      } else {
        setPhase('pausing')
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPE)
    } else if (phase === 'deleting') {
      if (displayLogo.length > 0) {
        timeout = setTimeout(() => {
          setDisplayLogo(prev => prev.slice(0, -1))
        }, DELETE_SPEED)
      } else {
        setPhase('waiting')
      }
    } else if (phase === 'waiting') {
      timeout = setTimeout(() => setPhase('typing'), PAUSE_AFTER_DELETE)
    }

    return () => clearTimeout(timeout)
  }, [displayLogo, phase, isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-10"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Logo typewriter */}
          <div className="text-white font-mono text-6xl font-bold tracking-widest min-h-[1.2em] flex items-center">
            <span>{displayLogo}</span>
            <span className="inline-block w-[3px] h-[0.9em] bg-white ml-1 animate-pulse" />
          </div>

          {/* Progress bar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-52 h-px bg-white/15 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: 'linear' }}
              />
            </div>
            <span className="text-white/30 text-xs font-mono tracking-[0.3em]">
              {Math.round(progress)}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
