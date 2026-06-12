'use client'

import { useState, useEffect, useRef, RefObject } from 'react'

const TOTAL_FRAMES = 192

export function useScrollFrame(sectionRef: RefObject<HTMLDivElement>) {
  const [frameIndex, setFrameIndex] = useState(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const computeIndex = () => {
      const section = sectionRef.current
      if (!section) return 0
      const sectionTop       = section.offsetTop
      const scrollableHeight = section.offsetHeight - window.innerHeight
      const scrolled         = window.scrollY - sectionTop
      const progress         = Math.max(0, Math.min(1, scrolled / scrollableHeight))
      return Math.floor(progress * (TOTAL_FRAMES - 1))
    }

    // rAF-throttled: scroll can fire many times per displayed frame (esp. with
    // Lenis); coalesce to one state update per frame, and skip when the
    // computed index hasn't changed so React never re-renders needlessly.
    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const idx = computeIndex()
        if (idx !== frameRef.current) {
          frameRef.current = idx
          setFrameIndex(idx)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [sectionRef])

  return frameIndex
}
