'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LoadingScreen from './loading-screen-hero-section/LoadingScreen'
import ScrollFrameCanvas from './components/ScrollFrameCanvas'
import SoftwareEngineerText from './components/SoftwareEngineerText'
import ContentOverlay from './components/ContentOverlay'
import NavOverlay from './components/NavOverlay'
import TornEdge from './components/TornEdge'
import { useFramePreloader } from './components/useFramePreloader'
import { useScrollFrame, SnapPoint } from './components/useScrollFrame'
import { useAppLoading } from '../../context/LoadingContext'

const MIN_LOADING_MS = 3000

// Snap points — defined outside component so the array reference is stable
// frame 70: nav flies to top (spring ~700ms)
// frame 72: "What I Work With" icons auto-animate (~1200ms)
const SNAP_POINTS: SnapPoint[] = [
  { frame: 70, duration: 700  },
  { frame: 79, duration: 1200 },
]

export default function HeroSection() {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const textWrapperRef = useRef<HTMLDivElement>(null)
  const { frames, loadedCount, totalFrames, isReady } = useFramePreloader()
  const frameIndex = useScrollFrame(sectionRef, SNAP_POINTS)
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
            <NavOverlay frameIndex={frameIndex} trigger={revealContent} totalFrames={totalFrames} />
          </div>

          {/* ── Text zone + curtain — ONE container, scroll up together ──── */}
          {/* Container: text zone (25vh) on top, curtain (100vh) below it    */}
          {/* bottom: -100vh anchors it so text zone sits at screen bottom     */}
          {/* translateY 0 → -100vh brings curtain to fill full viewport       */}
          {(() => {
            const p  = Math.max(0, Math.min(1, (frameIndex - 116) / (192 - 116)))
            const ty = p * -100
            return (
              <div
                style={{
                  position:   'absolute',
                  left:        0,
                  right:       0,
                  bottom:     '-100vh',
                  height:     '125vh',
                  transform:  `translateY(${ty}vh)`,
                  willChange: 'transform',
                }}
              >
                {/* Text zone — 25vh, top of container = bottom of screen initially */}
                <div style={{ position: 'relative', height: '25vh' }}>
                  {/* Helper fill: z-5, starts at 44px (below max wave excursion ±36px).
                      Matches TornEdge fill color so no gap/snap when TornEdge unmounts.
                      Area 0-44px stays transparent → video shows through wave as normal. */}
                  <div style={{
                    position: 'absolute', top: '44px', bottom: 0, left: 0, right: 0,
                    background: 'var(--color-paper)', zIndex: 5,
                  }} />
                  {/* Unmount heavy components (rAF + glitch timers) once text zone bottom
                      exits the top of viewport — max visible at frame 191 (~1.3vh sliver). */}
                  {frameIndex < 191 && (
                    <>
                      <TornEdge clipTargetRef={textWrapperRef} />
                      <div ref={textWrapperRef} className="relative z-20 h-full">
                        <SoftwareEngineerText trigger={revealContent} />
                      </div>
                    </>
                  )}
                </div>
                {/* Curtain — 100vh, glued directly below the text zone */}
                {/* Use --color-paper (#f0ece4 light / #1a1209 dark) to match TornEdge fill */}
                <div style={{ height: '100vh', background: 'var(--color-paper)' }} />
              </div>
            )
          })()}

        </div>
      </motion.div>
    </>
  )
}
