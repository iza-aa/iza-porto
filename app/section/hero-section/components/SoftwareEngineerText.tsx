'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const WORD_LEFT = 'SOFTWARE'
const WORD_RIGHT = 'ENGINEER'
const GLITCH_CHARS = '01!@#$%ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop'

// ─── Idle flicker hook ────────────────────────────────────────────────────────
function useIdleFlicker(word: string, trigger: boolean) {
  const [chars, setChars] = useState(() => word.split(''))

  useEffect(() => {
    if (!trigger) return
    const timers: ReturnType<typeof setTimeout>[] = []

    const flickerAt = (i: number) => {
      const t1 = setTimeout(() => {
        setChars(prev => {
          const next = [...prev]
          next[i] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          return next
        })
        const t2 = setTimeout(() => {
          setChars(prev => {
            const next = [...prev]
            next[i] = word[i]
            return next
          })
          const t3 = setTimeout(() => flickerAt(i), 1000 + Math.random() * 5000)
          timers.push(t3)
        }, 60 + Math.random() * 110)
        timers.push(t2)
      }, Math.random() * 3000 + 300)
      timers.push(t1)
    }

    word.split('').forEach((_, i) => flickerAt(i))
    return () => timers.forEach(clearTimeout)
  }, [trigger, word])

  return chars
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

    // Subtract horizontal padding so last letter is never clipped
    const style   = window.getComputedStyle(outer)
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
    const targetW = outer.clientWidth - padding
    let lo = 8, hi = 600

    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2
      inner.style.fontSize = mid + 'px'
      if (inner.scrollWidth <= targetW) lo = mid
      else hi = mid
    }
    setFontSize(Math.floor(lo))
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

// ─── Live data bar ────────────────────────────────────────────────────────────
function LiveDataBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date())
      )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-center gap-5 font-mono text-xs tracking-[0.25em] uppercase select-none text-[#1a1209]/40">
      <span>Jakarta, ID</span>
      <span className="opacity-30">·</span>
      <span className="tabular-nums">{time} WIB</span>
      <span className="opacity-30">·</span>
      <span>4 Projects</span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
interface Props {
  trigger: boolean
}

export default function SoftwareEngineerText({ trigger }: Props) {
  const leftChars = useIdleFlicker(WORD_LEFT, trigger)
  const rightChars = useIdleFlicker(WORD_RIGHT, trigger)
  const { outerRef, innerRef, fontSize } = useFitWidth()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={trigger ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full h-full justify-between py-1.5 overflow-hidden"
    >
      {/* Full-width heading */}
      <div ref={outerRef} className="flex-1 flex items-center overflow-hidden px-2">
        <div
          ref={innerRef}
          className="flex items-center whitespace-nowrap leading-[0.9] select-none text-[#1a1209]"
          style={{ fontSize, fontFamily: 'var(--font-anton)' }}
        >
          {/* SOFTWARE */}
          <span>
            {leftChars.map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </span>

          {/* AI Star icon separator */}
          <span className="inline-flex items-center justify-center px-[0.08em]">
            <AIStarIcon size={Math.round(fontSize * 0.7)} />
          </span>

          {/* ENGINEER */}
          <span>
            {rightChars.map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#1a1209]/15 mx-0" />

      {/* Live data */}
      <LiveDataBar />
    </motion.div>
  )
}

