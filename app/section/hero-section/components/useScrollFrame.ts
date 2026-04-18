'use client'

import { useState, useEffect, useRef, RefObject } from 'react'

const TOTAL_FRAMES = 192

export interface SnapPoint {
  frame: number     // frame index to lock scroll at
  duration: number  // ms to hold before releasing
}

export function useScrollFrame(
  sectionRef: RefObject<HTMLDivElement>,
  snapPoints: SnapPoint[] = [],
) {
  const [frameIndex, setFrameIndex] = useState(0)
  const frameRef    = useRef(0)
  const lockedRef   = useRef(false)
  const lockScrollY = useRef(0)  // exact scroll position to hold during lock

  useEffect(() => {
    const frameToScrollY = (frame: number) => {
      const section = sectionRef.current
      if (!section) return 0
      const scrollableHeight = section.offsetHeight - window.innerHeight
      return section.offsetTop + (frame / (TOTAL_FRAMES - 1)) * scrollableHeight
    }

    const computeIndex = () => {
      const section = sectionRef.current
      if (!section) return 0
      const sectionTop       = section.offsetTop
      const scrollableHeight = section.offsetHeight - window.innerHeight
      const scrolled         = window.scrollY - sectionTop
      const progress         = Math.max(0, Math.min(1, scrolled / scrollableHeight))
      return Math.floor(progress * (TOTAL_FRAMES - 1))
    }

    const handleScroll = () => {
      // While locked: hold scroll at anchor position
      if (lockedRef.current) {
        window.scrollTo({ top: lockScrollY.current, behavior: 'instant' })
        return
      }

      const rawIndex = computeIndex()
      const prev     = frameRef.current

      for (const sp of snapPoints) {
        if (prev < sp.frame && rawIndex >= sp.frame) {
          lockedRef.current = true
          lockScrollY.current = frameToScrollY(sp.frame)
          window.scrollTo({ top: lockScrollY.current, behavior: 'instant' })
          frameRef.current = sp.frame
          setFrameIndex(sp.frame)
          setTimeout(() => {
            lockedRef.current = false
          }, sp.duration)
          return
        }
      }

      frameRef.current = rawIndex
      setFrameIndex(rawIndex)
    }

    // Block wheel/touch while locked so browser can't move scroll position
    const blockIfLocked = (e: Event) => {
      if (lockedRef.current) e.preventDefault()
    }

    window.addEventListener('scroll',    handleScroll,  { passive: false })
    window.addEventListener('wheel',     blockIfLocked, { passive: false })
    window.addEventListener('touchmove', blockIfLocked, { passive: false })
    handleScroll()
    return () => {
      window.removeEventListener('scroll',    handleScroll)
      window.removeEventListener('wheel',     blockIfLocked)
      window.removeEventListener('touchmove', blockIfLocked)
    }
  }, [sectionRef])

  return frameIndex
}
