'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const FLIGHT_TRIGGER = 70
// Stage frames where the pure-WebGL About and the project reveal own the
// screen — used as active-section fallbacks since neither is a DOM section
const ABOUT_FRAME_START = 108
const PROJECT_FRAME_START = 150
// Hoisted — avoids rebuilding an 80-char string per item on every render
const LEADER_DOTS = '·'.repeat(80)

const NAV_ITEMS = [
  { label: 'home', roman: 'I' },
  { label: 'about', roman: 'II' },
  { label: 'project', roman: 'III' },
  { label: 'skills', roman: 'IV' },
  { label: 'experience', roman: 'V' },
  { label: 'contact', roman: 'VI' },
]

interface Props {
  frameIndex: number
  trigger: boolean
  totalFrames: number
  disabled?: boolean
}

export default function NavOverlay({ frameIndex, trigger, disabled = false }: Props) {
  // getActive lives in a mount-once effect — read the live frame via ref
  const frameIndexRef = useRef(frameIndex)
  frameIndexRef.current = frameIndex
  const [vw, setVw] = useState(1440)
  const [vh, setVh] = useState(900)
  const [hasFlown, setHasFlown] = useState(false)
  const [flyDone, setFlyDone] = useState(false)
  const [time, setTime] = useState('')
  const [activeSection, setActiveSection] = useState('home')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const navLockRef = useRef(false)  // prevent scroll override during click navigation

  useEffect(() => {
    const normalIds = ['contact', 'achievements', 'experience', 'skills', 'project']

    const getActive = () => {
      if (navLockRef.current) return   // locked during click navigation
      const mid = window.innerHeight * 0.5

      // Normal sections — iterate bottom-to-top, first one whose top <= mid wins
      for (const id of normalIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= mid) {
          setActiveSection(id)
          return
        }
      }

      // About & project-reveal live inside the WebGL stage (no DOM sections) —
      // resolve them from the stage frame timeline
      const frame = frameIndexRef.current
      if (frame >= PROJECT_FRAME_START) {
        setActiveSection('project')
        return
      }
      if (frame >= ABOUT_FRAME_START) {
        setActiveSection('about')
        return
      }

      setActiveSection('home')
    }

    // rAF-throttled: getActive does 5x getBoundingClientRect (layout reads) —
    // cap it at once per displayed frame instead of once per scroll event
    let rafId: number | null = null
    const onScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        getActive()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    getActive()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    const tick = () => setTime(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).format(new Date())
    )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const update = () => { setVw(window.innerWidth); setVh(window.innerHeight) }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!hasFlown && frameIndex > FLIGHT_TRIGGER) {
      setHasFlown(true)
    }
    if (hasFlown && frameIndex <= FLIGHT_TRIGGER) {
      setHasFlown(false)
      setFlyDone(false)
    }
  }, [frameIndex, hasFlown])

  const navigateTo = (label: string) => {
    if (disabled) return
    navLockRef.current = true
    clearTimeout((navigateTo as unknown as { _t?: ReturnType<typeof setTimeout> })._t)
      ; (navigateTo as unknown as { _t?: ReturnType<typeof setTimeout> })._t = setTimeout(() => {
        navLockRef.current = false
      }, 1200)  // unlock after smooth scroll finishes

    // hero/about/project transitions are driven by the scroll-snap engine
    // (gesture-triggered), not by scroll position — clicking them just marks
    // the active item and returns to the top of the stage. The DOM sections
    // below (skills/experience/contact) still scroll normally.
    if (label === 'home' || label === 'about' || label === 'project') {
      setActiveSection(label)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.getElementById(label)
      if (el) {
        setActiveSection(label)
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // ── Box geometry ──────────────────────────────────────────────────────────
  const BOX_PAD = 28
  const TITLE_PX = Math.round(Math.min(26, vw * 0.02))
  const NAV_PX = Math.round(Math.min(17, vw * 0.013))
  const NAV_GAP = 10
  const NAV_H = NAV_ITEMS.length * (NAV_PX * 1.5 + NAV_GAP)
  const SEP_H = 36
  const BOX_W = Math.round(Math.min(360, vw * 0.27))
  const BOX_H = Math.round(BOX_PAD + TITLE_PX * 1.4 + SEP_H + NAV_H + BOX_PAD)
  const boxL = Math.round(vw / 2 - BOX_W / 2)
  const boxT = Math.round(vh * 0.44 - BOX_H / 2)
  const LIST_W = BOX_W - BOX_PAD * 2

  // ── Idle positions (viewport-relative px) ─────────────────────────────────
  const idleTitleX = boxL + BOX_PAD
  const idleTitleY = boxT + BOX_PAD
  const idleNavX = boxL + BOX_PAD
  const idleNavY = boxT + BOX_PAD + Math.round(TITLE_PX * 1.4) + SEP_H

  // ── Final positions ────────────────────────────────────────────────────────
  const FINAL_TITLE_PX = 12
  const FINAL_TITLE_X = 24
  const FINAL_TITLE_Y = 20
  const FINAL_NAV_X = 32
  // Scale the whole nav block — preserves internal layout so roman numerals stay in line
  const navScale = Math.min(0.52, 160 / LIST_W)
  const scaledNavH = Math.round(NAV_H * navScale)
  // Position: visual bottom sits 80px above the wave (wave top = vh*0.75)
  const FINAL_NAV_Y = Math.round(vh * 0.75 - 20 - scaledNavH)

  const spring = { type: 'spring', stiffness: 80, damping: 18, mass: 1 } as const
  const fadeTransition = { duration: 0.45, ease: 'easeOut' } as const

  // Nav text is always white, in both light and dark mode.
  const NAV_WHITE = 'rgba(255,255,255,0.88)'

  return (
    <>
      {/* ── Title — ONE element, springs from idle → final ─────────────────── */}
      <motion.div
        className="pointer-events-none"
        style={{ position: 'fixed', zIndex: 99, left: idleTitleX, top: idleTitleY }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: trigger ? 1 : 0,
          left: hasFlown ? FINAL_TITLE_X : idleTitleX,
          top: hasFlown ? FINAL_TITLE_Y : idleTitleY,
        }}
        transition={{
          opacity: fadeTransition,
          left: spring,
          top: spring,
        }}
        onAnimationComplete={() => { if (hasFlown) setFlyDone(true) }}
      >
        <motion.span
          initial={{ fontSize: TITLE_PX }}
          animate={{ fontSize: hasFlown ? FINAL_TITLE_PX : TITLE_PX }}
          transition={spring}
          style={{
            fontFamily: 'var(--font-anton)',
            display: 'block',
            color: NAV_WHITE,
            whiteSpace: 'nowrap',
            lineHeight: 1,
            letterSpacing: '0.01em',
            userSelect: 'none',
            transition: 'color 0.3s ease', // Tambahan transisi warna yang halus
          }}
        >
          iza creation labs
        </motion.span>
      </motion.div>

      {/* ── Nav list — scale the whole block so roman numerals never overflow ── */}
      <motion.ul
        style={{
          position: 'fixed',
          zIndex: 99,
          listStyle: 'none',
          padding: 0,
          margin: 0,
          width: LIST_W,
          transformOrigin: 'top left',
          // The <ul> spans a tall/wide fixed strip but is mostly empty space
          // (transparent leader dots). Keep IT click-through so it never eats
          // clicks meant for content beneath (e.g. the finale button); only the
          // actual <li> rows below opt back into pointer events.
          pointerEvents: 'none',
          opacity: disabled ? 0.38 : undefined,
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: trigger ? 1 : 0,
          left: hasFlown ? FINAL_NAV_X : idleNavX,
          top: hasFlown ? FINAL_NAV_Y : idleNavY,
          scale: hasFlown ? navScale : 1,
        }}
        transition={{
          opacity: fadeTransition,
          left: spring,
          top: spring,
          scale: spring,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.label

          // Always white, both light and dark mode
          const textColor = 'rgba(255,255,255,0.85)'
          const dimColor = 'rgba(255,255,255,0.35)'

          return (
            <li
              key={item.label}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                marginBottom: NAV_GAP,
                cursor: trigger && !disabled ? 'pointer' : 'default',
                // Only the rows themselves are interactive (the <ul> is click-
                // through); disabled until the intro reveal completes.
                pointerEvents: trigger && !disabled ? 'auto' : 'none',
              }}
              onClick={() => navigateTo(item.label)}
            >
              {/* Label */}
              <span
                style={{
                  fontFamily: 'var(--font-inknut-antiqua)',
                  fontSize: NAV_PX,
                  color: isActive ? textColor : dimColor,
                  fontWeight: isActive || hoveredItem === item.label ? 700 : 400,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'color 0.3s ease', // Transisi halus
                }}
              >
                {item.label}
              </span>

              {/* Dots — fill remaining space, only visible for active item */}
              <span
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.35em',
                  fontSize: NAV_PX * 0.70,
                  color: isActive ? textColor : 'transparent',
                  padding: '0 0 0 5px',
                  userSelect: 'none',
                  alignSelf: 'flex-end',
                  lineHeight: 1.6,
                  WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                  maskImage: 'linear-gradient(to right, black 90%, transparent 100%)',
                  transition: 'color 0.3s ease',
                }}
              >
                {LEADER_DOTS}
              </span>

              {/* Roman numeral */}
              <span
                style={{
                  fontFamily: 'var(--font-inknut-antiqua)',
                  fontSize: NAV_PX * 0.72,
                  color: isActive ? textColor : dimColor,
                  fontWeight: isActive ? 700 : 400,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  marginLeft: '10px',
                  transition: 'color 0.3s ease',
                }}
              >
                {item.roman}
              </span>
            </li>
          )
        })}
      </motion.ul>

      {/* ── Data bar — rides up with container, sticks at navbar level ── */}
      {trigger && (() => {
        const topPx = 26

        // Always white, both light and dark mode
        const dataBarColor = 'rgba(255,255,255,0.5)'

        return (
          <div
            style={{
              position: 'fixed',
              zIndex: 999,
              top: topPx,
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'var(--font-inknut-antiqua)',
              fontSize: 10,
              color: dataBarColor,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              transition: 'color 0.3s ease',
            }}
          >
            <span>Jakarta, ID</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time} WIB</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>4 Projects</span>
          </div>
        )
      })()}
    </>
  )
}
