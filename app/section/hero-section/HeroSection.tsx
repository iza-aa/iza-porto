'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import LoadingScreen from '../../components/LoadingScreen'
import LivingCanvasHero from './components/LivingCanvasHero'
import NavOverlay from '../../components/NavOverlay'
import ProjectRevealContent from './components/ProjectRevealContent'
import BurnVeil from './components/BurnVeil'
import ProjectWebGLBackground from './components/ProjectWebGLBackground'
import SkillsSection from '../skills-section/SkillsSection'
import ExperienceSection from '../experience-section/ExperienceSection'
import { useScrollSnap } from './components/useScrollSnap'
import { useAppLoading } from '../../context/LoadingContext'

const MIN_LOADING_MS = 1200
const TOTAL_FRAMES = 192

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { frameIndex, aboutProgress, skillsBurnProgress, experienceBurnProgress, phase } = useScrollSnap()
  const [revealContent, setRevealContent] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [elapsed, setElapsed] = useState(0)
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
      <NavOverlay frameIndex={frameIndex} trigger={revealContent} totalFrames={TOTAL_FRAMES} />

      {/* ── Skills section — sits ABOVE project (z-16) and below the burn veil
          (z-17). Becomes visible only ONCE THE FLAME STARTS (burn ≥ 0.18), i.e.
          after the veil has fully darkened to black over project. Before that,
          project must remain the thing seen through the still-transparent veil,
          so skills must NOT show yet. As the veil then burns transparent, the
          skills layer right beneath it is revealed (not the project below). ── */}
      <div
        id="skills"
        data-skills-stage
        className="fixed inset-0 z-[16] overflow-y-auto overscroll-contain"
        style={{
          opacity: phase === 'skills' || skillsBurnProgress >= 0.18 ? 1 : 0,
          pointerEvents: phase === 'skills' ? 'auto' : 'none',
          visibility: phase === 'skills' || skillsBurnProgress >= 0.18 ? 'visible' : 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
        onWheelCapture={(event) => {
          if (phase !== 'skills') return
          const el = event.currentTarget
          const shouldScrollSkills = event.deltaY > 0 || el.scrollTop > 2
          if (!shouldScrollSkills) return
          event.preventDefault()
          event.stopPropagation()
          el.scrollTop += event.deltaY
        }}
      >
        <SkillsSection isVisible={true} />
      </div>

      {/* ── Project section — sits BEHIND the hero stage, revealed by the WebGL
          about→project burn. It stays fully solid; the project→skills burn is
          done by the BurnVeil layer ABOVE it (z-15), not by masking project. ── */}
      <div
        data-project-stage
        className="relative z-10"
        style={{
          opacity: phase === 'hero' ? 0 : 1,
          pointerEvents: phase === 'project' ? 'auto' : 'none',
        }}
      >
        {/* Living project backdrop (leopard WebGL, its own drift/grain/vignette
            ambience). z-0 so it sits ABOVE the page's solid <main> background
            but behind the project content — a negative z-index would hide it
            behind that background and the ambience would appear to vanish. */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ProjectWebGLBackground />
        </div>
        <div className="relative z-[1]">
          <ProjectRevealContent />
        </div>
      </div>

      {/* ── Project→Skills burn — a WebGL veil ABOVE skills (z-17). It covers
          the screen then burns itself away with the SAME gold flame as
          about→project; the skills layer (z-16) directly beneath is revealed
          through the burned-away holes. Below the hero stage (z-20). ── */}
      <div className="fixed inset-0 z-[17] pointer-events-none">
        <BurnVeil progress={skillsBurnProgress} className="absolute inset-0" />
      </div>

      {/* ── Experience section — sits ABOVE skills (z-26), below its burn veil
          (z-27). Visible only once the skills→experience flame starts
          (experienceBurnProgress ≥ 0.18), after the veil has darkened over
          skills. Revealed as that veil burns transparent. ── */}
      <div
        id="experience"
        data-experience-stage
        className="fixed inset-0 z-[26] overflow-y-auto overscroll-contain"
        style={{
          opacity: phase === 'experience' || experienceBurnProgress >= 0.18 ? 1 : 0,
          pointerEvents: phase === 'experience' ? 'auto' : 'none',
          visibility: phase === 'experience' || experienceBurnProgress >= 0.18 ? 'visible' : 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
        onWheelCapture={(event) => {
          if (phase !== 'experience') return
          const el = event.currentTarget
          const shouldScroll = event.deltaY > 0 || el.scrollTop > 2
          if (!shouldScroll) return
          event.preventDefault()
          event.stopPropagation()
          el.scrollTop += event.deltaY
        }}
      >
        <ExperienceSection />
      </div>

      {/* ── Skills→Experience burn — veil ABOVE experience (z-27). Darkens over
          skills then burns away with the gold flame to reveal experience. ── */}
      <div className="fixed inset-0 z-[27] pointer-events-none">
        <BurnVeil progress={experienceBurnProgress} className="absolute inset-0" />
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
