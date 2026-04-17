'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LoadingScreen from './loading-screen-hero-section/page'
import ScrollFrameCanvas from './components/ScrollFrameCanvas'
import SoftwareEngineerText from './components/SoftwareEngineerText'
import ContentOverlay from './components/ContentOverlay'
import TornEdge from './components/TornEdge'
import { useFramePreloader } from './components/useFramePreloader'
import { useScrollFrame } from './components/useScrollFrame'
import { useAppLoading } from '../../context/LoadingContext'

const MIN_LOADING_MS = 3000

export default function HeroSection() {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const textWrapperRef = useRef<HTMLDivElement>(null)
  const { frames, loadedCount, totalFrames, isReady } = useFramePreloader()
  const frameIndex = useScrollFrame(sectionRef)
  const [revealContent, setRevealContent] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const { setAppLoading } = useAppLoading()
  const startTimeRef = useRef(Date.now())

  // Tick elapsed time so progress bar stays in sync with minimum duration
  useEffect(() => {
    const id = setInterval(() => {
      const e = Date.now() - startTimeRef.current
      setElapsed(e)
      if (e >= MIN_LOADING_MS) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [])

  const frameProgress = totalFrames > 0 ? (loadedCount / totalFrames) * 100 : 0
  const timeProgress  = Math.min(100, (elapsed / MIN_LOADING_MS) * 100)
  // Min: bar follows whichever is SLOWER — fast frames = time drives, slow network = frames drive
  // 100% only when both time AND frames are done → dismiss fires immediately after
  const progress      = Math.min(frameProgress, timeProgress)

  useEffect(() => {
    if (!isReady) return
    const elapsed   = Date.now() - startTimeRef.current
    const remaining = Math.max(0, MIN_LOADING_MS - elapsed)
    const timer = setTimeout(() => {
      // Wait 200ms extra so progress bar visually hits 100% before fade-out
      setTimeout(() => {
        setShowLoading(false)
        setAppLoading(false)
        setTimeout(() => setRevealContent(true), 900)
      }, 200)
    }, remaining)
    return () => clearTimeout(timer)
  }, [isReady, setAppLoading])

  return (
    <>
      <LoadingScreen isLoading={showLoading} progress={progress} />

      {/* Scroll container — 350vh gives ~3.5x screen of scroll travel */}
      <motion.div
        ref={sectionRef}
        style={{ height: '350vh' }}
        className="relative"
        initial={{ opacity: 0 }}
        animate={revealContent ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="sticky top-0 h-screen">

          {/* ── Video frame — fills full 100vh so wave never shows black ───── */}
          <div className="absolute inset-0">
            <ScrollFrameCanvas frames={frames} frameIndex={frameIndex} />
            <ContentOverlay frameIndex={frameIndex} />
          </div>

          {/* ── Text zone (25vh) — overlaid at bottom, torn edge clips text ── */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: '25vh' }}
          >
            <TornEdge clipTargetRef={textWrapperRef} />
            <div ref={textWrapperRef} className="relative z-20 h-full">
              <SoftwareEngineerText trigger={revealContent} />
            </div>
          </div>

        </div>
      </motion.div>
    </>
  )
}
