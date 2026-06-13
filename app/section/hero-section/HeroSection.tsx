'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import LoadingScreen from '../../components/LoadingScreen'
import LivingCanvasHero from './components/LivingCanvasHero'
import NavOverlay from '../../components/NavOverlay'
import ProjectRevealLayer from './components/ProjectRevealLayer'
import ProjectRevealContent from './components/ProjectRevealContent'
import { useStageProgress, SPACER_A_VH, SPACER_B_VH, SPACER_C_VH } from './components/useScrollFrame'
import { useAppLoading } from '../../context/LoadingContext'

const MIN_LOADING_MS = 1200
const TOTAL_FRAMES = 192

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { frameIndex, aboutProgress } = useStageProgress(sectionRef, contentRef)
  const [revealContent, setRevealContent] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const { setAppLoading } = useAppLoading()
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const id = setInterval(() => {
      const e = Date.now() - startTimeRef.current
      setElapsed(e)
      if (e >= MIN_LOADING_MS) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [])

  const [paintingReady, setPaintingReady] = useState(false)
  useEffect(() => {
    const img = new window.Image()
    img.src = '/asset/hero-section/patmos.jpg'
    const done = () => setPaintingReady(true)
    if (img.complete) done()
    else {
      img.onload = done
      img.onerror = done
    }
  }, [])

  const timeProgress = Math.min(100, (elapsed / MIN_LOADING_MS) * 100)
  const progress = Math.min(timeProgress, paintingReady ? 100 : 92)

  useEffect(() => {
    if (!paintingReady) return
    const elapsedNow = Date.now() - startTimeRef.current
    const remaining = Math.max(0, MIN_LOADING_MS - elapsedNow)
    const timer = setTimeout(() => {
      setTimeout(() => {
        setShowLoading(false)
        setAppLoading(false)
        setTimeout(() => setRevealContent(true), 900)
      }, 200)
    }, remaining)
    return () => clearTimeout(timer)
  }, [paintingReady, setAppLoading])

  const burnProgress = Math.max(0, Math.min(1, (frameIndex - 64) / 48))
  const projectBurnProgress = Math.max(0, Math.min(1, (frameIndex - 136) / 40))

  return (
    <>
      <LoadingScreen isLoading={showLoading} progress={progress} />
      <NavOverlay frameIndex={frameIndex} trigger={revealContent} totalFrames={TOTAL_FRAMES} heroRef={sectionRef} />

      <motion.div
        ref={sectionRef}
        id="home"
        style={{ zIndex: 10, position: 'relative' }}
        className="relative"
        initial={{ opacity: 0 }}
        animate={revealContent ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* ── Sticky canvas stage — first child, pins for the WHOLE wrapper
            (intro travel + About traverse + project hand-off). Its slot also
            contributes the first 100vh of scroll height. ── */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ProjectRevealLayer progress={projectBurnProgress} />
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none">
            <LivingCanvasHero
              frameIndex={frameIndex}
              totalFrames={TOTAL_FRAMES}
              burnProgress={burnProgress}
              projectBurnProgress={projectBurnProgress}
              aboutContentProgress={aboutProgress}
            />
          </div>
        </div>

        {/* ── Phase A travel: painting intro + about burn (frames 0–112) ── */}
        <div aria-hidden style={{ height: `${SPACER_A_VH}vh` }} />

        {/* ── Phase B travel: pure-WebGL About reading hold (frames 112–136,
            shader about layer ramps in via aboutProgress then holds) ── */}
        <div aria-hidden style={{ height: `${SPACER_B_VH}vh` }} />

        {/* ── Phase C travel: project burn (frames 136–191) — completes
            exactly when the project card below enters the viewport ── */}
        <div aria-hidden style={{ height: `${SPACER_C_VH}vh` }} />

        {/* ── Phase D: project card content scrolls NATIVELY over the pinned
            reveal backdrop. Any content length works — the hook measures it. ── */}
        <div ref={contentRef} className="relative z-20">
          <ProjectRevealContent />
        </div>
      </motion.div>
    </>
  )
}
