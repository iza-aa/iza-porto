'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from '@studio-freight/react-lenis'

const TOTAL_FRAMES = 192
const LAST_FRAME = TOTAL_FRAMES - 1
const ABOUT_FRAME = 130
const WHEEL_FRAME_GAIN = 0.045
const TOUCH_FRAME_GAIN = 0.09
const FRAME_SMOOTHING = 6.2

export type SnapPhase = 'hero' | 'about' | 'project' | 'skills' | 'experience'

export interface SnapState {
  frameIndex: number
  aboutProgress: number
  skillsBurnProgress: number
  experienceBurnProgress: number
  phase: SnapPhase
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function roundFrame(value: number) {
  return Math.round(value * 10) / 10
}

function damp(current: number, target: number, lambda: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * delta))
}

function getPhase(frame: number): SnapPhase {
  if (frame >= LAST_FRAME - 0.05) return 'project'
  if (frame >= ABOUT_FRAME) return 'about'
  return 'hero'
}

/**
 * Scroll-driven hero/about/project scrubber.
 *
 * Wheel/touch deltas now move the WebGL timeline frame-by-frame instead of
 * firing a timed transition. Native page scroll is held only while this fixed
 * stage has unfinished frames; once frame LAST is reached, the long Project →
 * Skills → Experience document flow owns scrolling again.
 */
export function useScrollSnap(): SnapState {
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  const frameRef = useRef(0)
  const targetFrameRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  const touchYRef = useRef(0)
  const [state, setState] = useState<SnapState>({
    frameIndex: 0,
    aboutProgress: 1,
    skillsBurnProgress: 0,
    experienceBurnProgress: 0,
    phase: 'hero',
  })

  useEffect(() => {
    const commitFrame = (nextFrame: number) => {
      const frame = clamp(nextFrame, 0, LAST_FRAME)
      frameRef.current = frame
      const phase = getPhase(frame)
      setState((current) => {
        const rounded = roundFrame(frame)
        if (current.frameIndex === rounded && current.phase === phase) return current
        return { ...current, frameIndex: rounded, phase }
      })
      return phase
    }

    const startSmoothLoop = () => {
      if (rafRef.current !== null) return

      const tick = (now: number) => {
        const previous = lastTimeRef.current || now
        const delta = Math.min(0.05, (now - previous) / 1000)
        lastTimeRef.current = now

        const nextFrame = damp(frameRef.current, targetFrameRef.current, FRAME_SMOOTHING, delta)
        const settled = Math.abs(nextFrame - targetFrameRef.current) < 0.03
        const phase = commitFrame(settled ? targetFrameRef.current : nextFrame)

        if (phase !== 'project') {
          lenisRef.current?.stop()
          lockAtTop()
        } else {
          lenisRef.current?.start()
        }

        if (!settled) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          rafRef.current = null
          lastTimeRef.current = 0
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const lockAtTop = () => {
      if (window.scrollY > 1) lenisRef.current?.scrollTo(0, { immediate: true })
    }

    const scrub = (delta: number) => {
      targetFrameRef.current = clamp(targetFrameRef.current + delta, 0, LAST_FRAME)
      startSmoothLoop()
    }

    const onWheel = (event: WheelEvent) => {
      const atTimelineEnd = frameRef.current >= LAST_FRAME - 0.05
      const atPageTop = window.scrollY <= 2

      if (atTimelineEnd && event.deltaY > 0) {
        lenisRef.current?.start()
        return
      }

      if (atTimelineEnd && event.deltaY < 0 && !atPageTop) return

      event.preventDefault()
      scrub(event.deltaY * WHEEL_FRAME_GAIN)
    }

    const onTouchStart = (event: TouchEvent) => {
      touchYRef.current = event.touches[0]?.clientY ?? 0
    }

    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? touchYRef.current
      const dy = touchYRef.current - y
      touchYRef.current = y

      const atTimelineEnd = frameRef.current >= LAST_FRAME - 0.05
      const atPageTop = window.scrollY <= 2

      if (atTimelineEnd && dy > 0) {
        lenisRef.current?.start()
        return
      }

      if (atTimelineEnd && dy < 0 && !atPageTop) return

      event.preventDefault()
      scrub(dy * TOUCH_FRAME_GAIN)
    }

    lenisRef.current?.stop()
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      lenisRef.current?.start()
    }
  }, [])

  return state
}
