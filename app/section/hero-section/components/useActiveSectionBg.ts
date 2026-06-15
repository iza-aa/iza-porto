'use client'

import { useEffect, useRef } from 'react'

/**
 * Scroll-driven backdrop state. Produces TWO independent signals, both pure
 * functions of scroll position (one rAF loop reading sentinel rects — no scroll
 * listener, no React state per frame):
 *
 *  1. `progressRef` (float `i.f`) — drives the BURN between paintings.
 *       0.0 = painting 0; 1.6 = 60% burned from painting 1 → 2. The burn for
 *       title N runs as its sentinel rises from START_VH to END_VH.
 *
 *  2. `zoomRef` (float 0..1) + `zoomIndexRef` (int) — drives the per-section
 *       ZOOM. `zoomIndexRef` is the painting currently being read; `zoomRef` is
 *       how far we have scrolled THROUGH that painting's dwell (0 = just arrived,
 *       1 = about to hand off to the next). This RESETS each section, so every
 *       painting performs its own zoom from the very first scroll — independent
 *       of the burn. With down = zoom-out, 0 → zoomed-in, 1 → zoomed-out.
 */

// viewport-height fractions: a title's burn starts as the sentinel reaches
// START_VH and completes at END_VH. The sentinels sit at the TOP of each
// section block, but the titles are now TALL and sit well below that point —
// so these lines are set HIGHER on screen (smaller fractions) than a naive
// "enters at the bottom" would suggest. That makes the tall title scroll up
// near reading position before the burn fires, instead of firing too early.
// Lower both numbers toward 0 to delay the burn more.
const START_VH = 0.38
const END_VH = 0.02

// The sentinels sit at the TOP of each section block, but the title itself is
// tall and sits well below that point. Without compensation the zoom dwell
// triggers as soon as the (high) sentinel crosses the read line — i.e. too
// early, while the title is still far down the viewport. ZOOM_LINE is set
// HIGHER on screen than END_VH (smaller fraction = nearer the top), so the
// sentinel must rise further — i.e. the tall title must scroll up near reading
// position — before the zoom dwell begins. Raise it toward 0 to delay more.
const ZOOM_LINE = 0.02

export function useActiveSectionBg(count: number) {
  const els = useRef<(HTMLElement | null)[]>(Array(count).fill(null))
  const progressRef = useRef(0) // burn (continuous float i.f)
  // per-painting dwell 0..1 (0 = zoomed-in, 1 = zoomed-out). One slot each, so
  // A and B can be read independently with no discrete mid-burn flip.
  const zoomDwellRef = useRef<number[]>(Array(count).fill(0))

  useEffect(() => {
    let raf = 0
    const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)

    const tick = () => {
      const vh = window.innerHeight || 1

      // sentinel tops in viewport fractions (0 = top of viewport)
      const tops: number[] = []
      for (let i = 0; i < count; i++) {
        const el = els.current[i]
        tops[i] = el ? el.getBoundingClientRect().top / vh : Infinity
      }

      // ── BURN progress (unchanged) ──
      let active = 0
      let frac = 0
      for (let i = 0; i < count; i++) {
        if (!els.current[i]) continue
        const t = clamp01((START_VH - tops[i]) / (START_VH - END_VH))
        if (t > 0) {
          active = i
          frac = i === 0 ? 1 : t
        }
      }
      progressRef.current = active === 0 ? 0 : active - 1 + frac

      // ── ZOOM dwell progress — ONE value per painting, fully continuous ──
      // Each painting carries its OWN dwell, measured purely from ITS OWN
      // sentinel rising past ZOOM_LINE. The shader reads dwell[i] for A and
      // dwell[i+1] for B directly, so nothing is ever forced to a discrete 0/1
      // mid-burn — which is what made the outgoing painting suddenly shrink.
      // Each dwell is 0 (zoomed-in) at ZOOM_LINE, growing to 1 (zoomed-out) over
      // DWELL_VH viewport-heights of upward travel.
      const DWELL_VH = 2.2
      for (let k = 0; k < count; k++) {
        const risen = ZOOM_LINE - tops[k]
        zoomDwellRef.current[k] = clamp01(risen / DWELL_VH)
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count])

  const setRef = (i: number) => (el: HTMLElement | null) => {
    els.current[i] = el
  }

  return { progressRef, zoomDwellRef, setRef }
}
