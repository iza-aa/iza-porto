'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import LoadingScreen from '../../components/LoadingScreen'
import LivingCanvasHero from './components/LivingCanvasHero'
import NavOverlay from '../../components/NavOverlay'
import ProjectRevealContent from './components/ProjectRevealContent'
import BurnEdgeMask from './components/BurnRevealMask'
import ProjectWebGLBackground from './components/ProjectWebGLBackground'
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
  const projectEdgeBurnProgress = Math.max(0, Math.min(1, (frameIndex - 136) / 55))

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
        {/* ── Sticky canvas stage — hero + about live entirely in WebGL.
            Pins through phases A & B; the project curtain rises over it. ── */}
        <div className="sticky top-0 h-screen overflow-hidden z-20 pointer-events-none">
          <div className="absolute inset-0 pointer-events-none">
            <LivingCanvasHero
              frameIndex={frameIndex}
              totalFrames={TOTAL_FRAMES}
              burnProgress={burnProgress}
              projectBurnProgress={projectEdgeBurnProgress}
              aboutContentProgress={aboutProgress}
            />
          </div>
        </div>

        {/* ── Phase A travel: painting intro + about burn (frames 0–112) ── */}
        <div aria-hidden style={{ height: `${SPACER_A_VH}vh` }} />

        {/* ── Phase B travel: pure-WebGL About reading hold (frames 112–136) ── */}
        <div aria-hidden style={{ height: `${SPACER_B_VH}vh` }} />

        {/* ── Phase C travel: the project curtain rises over the about scene
            (frames 136→191). The curtain DOM below is the SAME element that
            scrolls in phase D — no overlay, no duplicate. ── */}
        <div aria-hidden style={{ height: `${SPACER_C_VH}vh` }} />

        {/* ── Project curtain: ONE DOM panel in normal flow. It scrolls up over
            the pinned about scene like the hero→about curtain, but its TOP EDGE
            is torn into fire (BurnEdgeMask, shader fbm) instead of a flat line.
            Its content scrolls natively afterwards — no overlay, no duplicate,
            no inner scrollbar. The negative margin pulls it up so it begins
            covering the scene while phase C scroll is still in progress. ── */}
        <div id="project" ref={contentRef} className="relative z-10" style={{ marginTop: `-${SPACER_C_VH + 100}vh` }}>
          <div className="sticky top-0 h-screen overflow-hidden pointer-events-none">
            <ProjectWebGLBackground />
          </div>
          <div className="relative z-10 -mt-[100vh]">
            <BurnEdgeMask burnProgress={projectEdgeBurnProgress} className="w-full">
              <ProjectRevealContent />
            </BurnEdgeMask>
          </div>
        </div>
      </motion.div>
    </>
  )
}
