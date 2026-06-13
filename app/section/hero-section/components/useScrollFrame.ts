'use client'

import { useState, useEffect, RefObject } from 'react'

const TOTAL_FRAMES = 192
const LAST_FRAME = TOTAL_FRAMES - 1

// Frame milestones for the hero stage choreography:
// A: painting intro + Patmos→hall burn (burn spans frames 64–112)
// B: pure-WebGL About reading hold (about layer ramps in, then holds)
// C: project burn (spans frames 136–176, tail to 191)
// D: project card content scrolls natively over the revealed backdrop
const PHASE_A_END_FRAME = 112
const PHASE_B_END_FRAME = 136

// Spacer heights (in vh) — shared with HeroSection's layout and NavOverlay's
// navigation targets so the math never drifts apart.
// Spacer C is short so the project card rises in while the flame is still
// finishing, instead of waiting for the burn to fully complete.
export const SPACER_A_VH = 420
export const SPACER_B_VH = 150
export const SPACER_C_VH = 70

export interface StageProgress {
  frameIndex: number
  aboutProgress: number
}

/**
 * Maps page scroll through the hero wrapper onto the virtual frame timeline.
 *
 * Wrapper layout: [sticky 100vh canvas slot][spacer A][spacer B][spacer C]
 * [project content in normal flow]. Phases A–C use the fixed spacer heights;
 * phase C's end is MEASURED from the project content element, so the card can
 * be any length — frames hold at the last frame while it scrolls through.
 */
export function useStageProgress(
  wrapperRef: RefObject<HTMLDivElement>,
  contentRef: RefObject<HTMLDivElement>
): StageProgress {
  const [stage, setStage] = useState<StageProgress>({ frameIndex: 0, aboutProgress: 0 })

  useEffect(() => {
    const compute = (): StageProgress => {
      const wrapper = wrapperRef.current
      if (!wrapper) return { frameIndex: 0, aboutProgress: 0 }

      const vh = window.innerHeight
      const yRel = window.scrollY - wrapper.offsetTop

      const phaseAEnd = (SPACER_A_VH / 100) * vh
      const phaseBEnd = phaseAEnd + (SPACER_B_VH / 100) * vh
      // Project burn completes exactly when the project card enters the
      // viewport bottom (measured; falls back to spacer C height)
      const content = contentRef.current
      const contentEnter = content
        ? content.offsetTop - vh
        : phaseBEnd + (SPACER_C_VH / 100) * vh
      const phaseCEnd = Math.max(phaseBEnd + 1, contentEnter)

      let frame: number
      let aboutProgress: number

      if (yRel <= phaseAEnd) {
        frame = (Math.max(0, yRel) / phaseAEnd) * PHASE_A_END_FRAME
        aboutProgress = 0
      } else if (yRel <= phaseBEnd) {
        const p = (yRel - phaseAEnd) / (phaseBEnd - phaseAEnd)
        frame = PHASE_A_END_FRAME + p * (PHASE_B_END_FRAME - PHASE_A_END_FRAME)
        // Ramp the WebGL about layer in over the first 35% of the hold,
        // then keep it fully present for reading
        aboutProgress = Math.min(1, p / 0.35)
      } else if (yRel <= phaseCEnd) {
        const p = (yRel - phaseBEnd) / (phaseCEnd - phaseBEnd)
        frame = PHASE_B_END_FRAME + p * (LAST_FRAME - PHASE_B_END_FRAME)
        aboutProgress = 1
      } else {
        // Phase D: project content traverse — timeline complete, canvas idle
        frame = LAST_FRAME
        aboutProgress = 1
      }

      return {
        frameIndex: Math.max(0, Math.min(LAST_FRAME, Math.floor(frame))),
        // Quantized to 1% so the ramp doesn't re-render React on every pixel
        aboutProgress: Math.round(Math.max(0, Math.min(1, aboutProgress)) * 100) / 100,
      }
    }

    // rAF-throttled, deduped — same discipline as the rest of the site
    let rafId: number | null = null
    const apply = () => {
      const next = compute()
      setStage((prev) =>
        prev.frameIndex === next.frameIndex && prev.aboutProgress === next.aboutProgress
          ? prev
          : next
      )
    }
    const onScrollOrResize = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        apply()
      })
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    apply()
    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [wrapperRef, contentRef])

  return stage
}
