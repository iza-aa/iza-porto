'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const WORD_LEFT = 'SOFTWARE'
const WORD_RIGHT = 'ENGINEER'
const GLITCH_CHARS = '01!@#$%ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop'

// ─── Self-contained flicker char ─────────────────────────────────────────────
// State lives INSIDE each char: one flicker re-renders one <span>, not the
// whole heading (16 chars + SVG). Same timing law as the original:
// wait (0.3–3.3s) → glitch (60–170ms) → restore → rest (1–6s) → repeat.
function FlickerChar({ original, trigger }: { original: string; trigger: boolean }) {
  const [display, setDisplay] = useState(original)

  useEffect(() => {
    if (!trigger) return
    let t1: ReturnType<typeof setTimeout>
    let t2: ReturnType<typeof setTimeout>
    let t3: ReturnType<typeof setTimeout>

    const cycle = () => {
      t1 = setTimeout(() => {
        setDisplay(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
        t2 = setTimeout(() => {
          setDisplay(original)
          t3 = setTimeout(cycle, 1000 + Math.random() * 5000)
        }, 60 + Math.random() * 110)
      }, Math.random() * 3000 + 300)
    }
    cycle()

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      setDisplay(original)
    }
  }, [trigger, original])

  const isGlitching = display !== original
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {/* Original always holds the space — invisible when glitching */}
      <span style={{ visibility: isGlitching ? 'hidden' : 'visible' }}>{original}</span>
      {/* Glitch char absolutely overlaid — zero layout impact */}
      {isGlitching && (
        <span style={{
          position:  'absolute',
          left:      '50%',
          top:       0,
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}>{display}</span>
      )}
    </span>
  )
}

// ─── Fit-to-width hook ────────────────────────────────────────────────────────
function useFitWidth() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(100)

  const fit = useCallback(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    // Subtract padding + safety margin so last letter is never clipped
    const style   = window.getComputedStyle(outer)
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
    const targetW = outer.clientWidth - padding - 4
    let lo = 8, hi = 600

    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2
      inner.style.fontSize = mid + 'px'
      if (inner.scrollWidth <= targetW) lo = mid
      else hi = mid
    }
    // Scale to 88% of the max-fit size so there's visible breathing room on all screen sizes
    setFontSize(Math.floor(lo * 0.88))
  }, [])

  useEffect(() => {
    fit()
    const ro = new ResizeObserver(fit)
    if (outerRef.current) ro.observe(outerRef.current)
    return () => ro.disconnect()
  }, [fit])

  return { outerRef, innerRef, fontSize }
}

// ─── AI Star icon (liquid glass) ─────────────────────────────────────────────
const MAIN_STAR = "M22.462 11.035l2.88 7.097c1.204 2.968 3.558 5.322 6.526 6.526l7.097 2.88c1.312.533 1.312 2.391 0 2.923l-7.097 2.88c-2.968 1.204-5.322 3.558-6.526 6.526l-2.88 7.097c-.533 1.312-2.391 1.312-2.923 0l-2.88-7.097c-1.204-2.968-3.558-5.322-6.526-6.526l-7.097-2.88c-1.312-.533-1.312-2.391 0-2.923l7.097-2.88c2.968-1.204 5.322-3.558 6.526-6.526l2.88-7.097C20.071 9.723 21.929 9.723 22.462 11.035z"
const SMALL_STAR = "M39.945 2.701l.842 2.428c.664 1.915 2.169 3.42 4.084 4.084l2.428.842c.896.311.896 1.578 0 1.889l-2.428.842c-1.915.664-3.42 2.169-4.084 4.084l-.842 2.428c-.311.896-1.578.896-1.889 0l-.842-2.428c-.664-1.915-2.169-3.42-4.084-4.084l-2.428-.842c-.896-.311-.896-1.578 0-1.889l2.428-.842c1.915-.664 3.42-2.169 4.084-4.084l.842-2.428C38.366 1.805 39.634 1.805 39.945 2.701z"

function AIStarIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      aria-hidden
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      <defs>
        {/* Dark glass base gradient — top-left lighter, bottom-right darker */}
        <linearGradient id="aistar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(160,155,145,0.55)" />
          <stop offset="100%" stopColor="rgba(80,78,72,0.70)" />
        </linearGradient>
        {/* Specular sheen — small bright patch top-left */}
        <radialGradient id="aistar-sheen" cx="28%" cy="28%" r="40%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.40)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* Clip paths */}
        <clipPath id="aistar-clip-main">
          <path d={MAIN_STAR} />
        </clipPath>
        <clipPath id="aistar-clip-small">
          <path d={SMALL_STAR} />
        </clipPath>
      </defs>

      {/* ── Main star ── */}
      {/* Dark glass fill */}
      <path d={MAIN_STAR} fill="url(#aistar-fill)" />
      {/* Specular sheen */}
      <g clipPath="url(#aistar-clip-main)">
        <rect width="50" height="50" fill="url(#aistar-sheen)" />
      </g>
      {/* Border */}
      <path d={MAIN_STAR} stroke="rgba(255,255,255,0.30)" strokeWidth="0.6" />

      {/* ── Small star ── */}
      <path d={SMALL_STAR} fill="url(#aistar-fill)" />
      <g clipPath="url(#aistar-clip-small)">
        <rect width="50" height="50" fill="url(#aistar-sheen)" />
      </g>
      <path d={SMALL_STAR} stroke="rgba(255,255,255,0.30)" strokeWidth="0.6" />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
interface Props {
  trigger: boolean
  burnProgress?: number
}

export default function SoftwareEngineerText({ trigger, burnProgress = 0 }: Props) {
  const { outerRef, innerRef, fontSize } = useFitWidth()
  const emberOpacity = Math.max(0, Math.min(1, burnProgress))
  const textBurn = Math.max(0, Math.min(1, burnProgress / 0.34))
  const textOpacity = 1 - Math.max(0, (textBurn - 0.78) / 0.22)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={trigger ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full h-full justify-between py-1.5 overflow-hidden"
      style={{ opacity: textOpacity }}
    >
      {/* Full-width heading */}
      <div ref={outerRef} className="flex-1 flex items-center justify-center px-4">
        <div
          ref={innerRef}
          className="relative flex items-center whitespace-nowrap leading-[0.9] select-none text-[#1a1209] dark:text-[#f0ece4]"
          style={{
            fontSize,
            fontFamily: 'var(--font-anton)',
            filter: textBurn > 0.18 ? `blur(${textBurn * 0.8}px)` : 'none',
            textShadow: burnProgress > 0.05
              ? `0 0 ${Math.round(24 * textBurn)}px rgba(237,122,34,${0.72 * textBurn})`
              : 'none',
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[8%] h-[22%]"
            style={{
              opacity: emberOpacity,
              background:
                'linear-gradient(90deg, transparent, rgba(239,111,32,0.72), rgba(246,202,91,0.44), transparent)',
              filter: `blur(${12 + burnProgress * 14}px)`,
              transform: `translateY(${-burnProgress * 18}px) scaleY(${1 + burnProgress * 0.55})`,
              mixBlendMode: 'screen',
            }}
          />
          {/* SOFTWARE */}
          {WORD_LEFT.split('').map((ch, i) => (
            <FlickerChar key={i} original={ch} trigger={trigger} />
          ))}

          {/* AI Star icon separator */}
          <span className="inline-flex items-center justify-center px-[0.08em]">
            <AIStarIcon size={Math.round(fontSize * 0.7)} />
          </span>

          {/* ENGINEER */}
          {WORD_RIGHT.split('').map((ch, i) => (
            <FlickerChar key={i} original={ch} trigger={trigger} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

