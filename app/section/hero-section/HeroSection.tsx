'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import LoadingScreen from '../../components/LoadingScreen'
import LivingCanvasHero from './components/LivingCanvasHero'
import NavOverlay from '../../components/NavOverlay'
import { useScrollFrame } from './components/useScrollFrame'
import { useAppLoading } from '../../context/LoadingContext'

const MIN_LOADING_MS = 1200
const TOTAL_FRAMES = 192

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const frameIndex = useScrollFrame(sectionRef)
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
  const projectIntroProgress = Math.max(0, Math.min(1, (frameIndex - 176) / 10))

  return (
    <>
      <LoadingScreen isLoading={showLoading} progress={progress} />
      <NavOverlay frameIndex={frameIndex} trigger={revealContent} totalFrames={TOTAL_FRAMES} heroRef={sectionRef} />

      <motion.div
        ref={sectionRef}
        id="home"
        style={{ height: '520vh', zIndex: 10, position: 'relative' }}
        className="relative"
        initial={{ opacity: 0 }}
        animate={revealContent ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0">
            <LivingCanvasHero
              frameIndex={frameIndex}
              totalFrames={TOTAL_FRAMES}
              burnProgress={burnProgress}
              projectBurnProgress={projectBurnProgress}
              aboutContentProgress={1}
            />
          </div>

          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              opacity: projectIntroProgress,
              transform: `translateY(${(1 - projectIntroProgress) * 18}px)`,
              willChange: 'opacity, transform',
            }}
          >
            <div className="h-full w-full px-6 pt-[18vh] md:pl-[300px] lg:pl-[360px]">
              <div className="max-w-5xl">
                <h2 className="font-inknut-antiqua text-5xl leading-none text-[#f5f0e8] md:text-7xl lg:text-8xl">
                  Project Labs
                </h2>
                <div className="mt-7 flex items-center gap-4 text-[#f5f0e8]/70">
                  <span className="text-xs">◇</span>
                  <span className="h-px w-16 bg-[#f5f0e8]/35" />
                  <p className="font-pinyon-script text-3xl md:text-4xl">Standard 3-column architecture.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
