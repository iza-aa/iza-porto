'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import LoadingScreen from '../../components/LoadingScreen'
import LivingCanvasHero from './components/LivingCanvasHero'
import NavOverlay from '../../components/NavOverlay'
import ProjectRevealContent from './components/ProjectRevealContent'
import ProjectWebGLBackground from './components/ProjectWebGLBackground'
import GoldKeyGuide from './components/GoldKeyGuide'
import SkillsSection from '../skills-section/SkillsSection'
import ExperienceSection from '../experience-section/ExperienceSection'
import { useScrollSnap } from './components/useScrollSnap'
import { useActiveSectionBg } from './components/useActiveSectionBg'
import { useAppLoading } from '../../context/LoadingContext'

const MIN_LOADING_MS = 1200
const TOTAL_FRAMES = 192

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { frameIndex, aboutProgress, phase } = useScrollSnap()
  // Per-title painting (scroll-driven burn). 4 titles, in scroll order:
  //   0 extended labs · 1 selected systems · 2 skills · 3 experience
  const {
    progressRef: bgProgressRef,
    zoomDwellRef: bgZoomDwellRef,
    setRef: setBgSentinel,
  } = useActiveSectionBg(4)
  const [revealContent, setRevealContent] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const finaleSobelRef = useRef(0)
  const finaleSobelMixRef = useRef(0)
  const finaleSobelRafRef = useRef<number | null>(null)
  const [finaleLocked, setFinaleLocked] = useState(false)
  const { setAppLoading } = useAppLoading()
  const startTimeRef = useRef(Date.now())

  // Track theme so the ambience haze can warm/cool with light vs dark mode
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const stopFinaleSobel = () => {
      if (finaleSobelRafRef.current !== null) {
        cancelAnimationFrame(finaleSobelRafRef.current)
        finaleSobelRafRef.current = null
      }
    }

    const enableFinaleSobel = () => {
      stopFinaleSobel()
      setFinaleLocked(true)
      const start = performance.now()
      const duration = 2600
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        finaleSobelRef.current = 0.001 + eased * 3.999
        finaleSobelMixRef.current = Math.min(1, t / 0.18)
        if (t < 1) {
          finaleSobelRafRef.current = requestAnimationFrame(tick)
        } else {
          finaleSobelRafRef.current = null
          window.dispatchEvent(new CustomEvent('portfolio:finale-flipbook-complete'))
        }
      }
      finaleSobelRafRef.current = requestAnimationFrame(tick)
    }
    const disableFinaleSobel = () => {
      stopFinaleSobel()
      const startProgress = finaleSobelRef.current
      const start = performance.now()
      const duration = 700
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        finaleSobelRef.current = startProgress
        finaleSobelMixRef.current = 1 - t
        if (t < 1) {
          finaleSobelRafRef.current = requestAnimationFrame(tick)
        } else {
          finaleSobelRef.current = 0
          finaleSobelMixRef.current = 0
          finaleSobelRafRef.current = null
          setFinaleLocked(false)
        }
      }
      finaleSobelRafRef.current = requestAnimationFrame(tick)
    }
    window.addEventListener('portfolio:finale-sobel-on', enableFinaleSobel)
    window.addEventListener('portfolio:finale-sobel-off', disableFinaleSobel)
    return () => {
      window.removeEventListener('portfolio:finale-sobel-on', enableFinaleSobel)
      window.removeEventListener('portfolio:finale-sobel-off', disableFinaleSobel)
      stopFinaleSobel()
    }
  }, [])

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
      <NavOverlay frameIndex={frameIndex} trigger={revealContent} totalFrames={TOTAL_FRAMES} disabled={finaleLocked} />

      {/* ── Project section — revealed by the WebGL about→project burn, then
          becomes one long native scroll holding Project → Skills → Experience.
          (The per-section burn veils are disabled; kept in useScrollSnap for
          possible future use.) The shared WebGL backdrop sits behind all of it. ── */}
      <div
        data-project-stage
        className="relative z-10"
        style={{
          opacity: phase === 'hero' ? 0 : 1,
          pointerEvents: phase === 'hero' ? 'none' : 'auto',
        }}
      >
        {/* Shared living backdrop — a gallery of frescoes that burns from one to
            the next as each section TITLE scrolls into view (scroll-driven). */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ProjectWebGLBackground
            progressRef={bgProgressRef}
            zoomDwellRef={bgZoomDwellRef}
            forceSobelRef={finaleSobelRef}
            forceSobelMixRef={finaleSobelMixRef}
          />
        </div>
        <GoldKeyGuide enabled={revealContent && phase !== 'hero'} />
        <div className="relative z-[1]">
          {/* Titles 0 (extended labs) & 1 (selected systems) live inside the
              project content — their sentinels are placed on each heading there. */}
          <ProjectRevealContent titleRefs={[setBgSentinel(0), setBgSentinel(1)]} />
          <div id="skills" className="relative">
            <span ref={setBgSentinel(2)} aria-hidden className="absolute top-0 h-px w-px" />
            <SkillsSection isVisible={true} />
          </div>
          <div id="experience" className="relative">
            <span ref={setBgSentinel(3)} aria-hidden className="absolute top-0 h-px w-px" />
            <ExperienceSection />
          </div>
        </div>
      </div>

      {/* ── Hero + About stage — FIXED full-screen WebGL, ON TOP of the project
          section. The shader burns itself transparent to reveal the project
          below. Stays mounted/visible through the whole burn; only hidden once
          the burn has fully completed so its idle ambience never disappears
          mid-scroll. ── */}
      <motion.div
        ref={sectionRef}
        id="home"
        className="fixed inset-0 z-20 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealContent ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ visibility: phase === 'project' || phase === 'skills' ? 'hidden' : 'visible' }}
      >
        <LivingCanvasHero
          frameIndex={frameIndex}
          totalFrames={TOTAL_FRAMES}
          burnProgress={burnProgress}
          projectBurnProgress={projectEdgeBurnProgress}
          aboutContentProgress={aboutProgress}
        />
      </motion.div>

      {/* ── Ambience haze — THE single source of haze/light-shaft for the whole
          experience (hero, about, project). One fixed overlay above everything
          means there is never a double-haze glitch during the burn hand-off.
          Theme-aware: warm gold in light mode, cool silver-blue & dimmer in
          dark mode (museum after hours). Fades in with the content reveal. ── */}
      <div
        aria-hidden
        className="fixed inset-0 z-30 pointer-events-none overflow-hidden"
        style={{ opacity: revealContent && phase !== 'skills' ? 1 : 0, transition: 'opacity 0.8s ease' }}
      >
        <style>{`
          @keyframes proj-shaft { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.62; } }
          @keyframes proj-haze  { 0%, 100% { transform: translateX(-3%); } 50% { transform: translateX(3%); } }
        `}</style>
        {/* Soft light shaft — warm gold (light) / cool moonlight (dark) */}
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background: isDark
              ? 'linear-gradient(118deg, rgba(180,205,255,0.2) 0%, rgba(150,180,235,0.07) 28%, transparent 55%)'
              : 'linear-gradient(118deg, rgba(255,232,170,0.32) 0%, rgba(255,222,150,0.1) 28%, transparent 55%)',
            animation: 'proj-shaft 11s ease-in-out infinite',
          }}
        />
        {/* Drifting haze/cloud at the top edge — warm cream / cool silver */}
        <div
          className="absolute top-[-8%] left-[-8%] right-[-8%] h-[24%]"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, rgba(186,198,224,0.18), transparent 82%)'
              : 'linear-gradient(to bottom, rgba(238,226,200,0.3), transparent 82%)',
            filter: 'blur(14px)',
            animation: 'proj-haze 26s ease-in-out infinite',
          }}
        />
      </div>
    </>
  )
}
