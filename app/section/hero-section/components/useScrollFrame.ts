'use client'

import { useState, useEffect, RefObject } from 'react'

const TOTAL_FRAMES = 192

export function useScrollFrame(sectionRef: RefObject<HTMLDivElement>) {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const sectionTop = section.offsetTop
      const scrollableHeight = section.offsetHeight - window.innerHeight
      const scrolled = window.scrollY - sectionTop
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight))
      const index = Math.floor(progress * (TOTAL_FRAMES - 1))

      setFrameIndex(index)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionRef])

  return frameIndex
}
