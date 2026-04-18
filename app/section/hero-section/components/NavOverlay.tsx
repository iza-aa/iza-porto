'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const FLIGHT_TRIGGER = 70

const NAV_ITEMS = [
  { label: 'home',         roman: 'I'   },
  { label: 'about',        roman: 'II'  },
  { label: 'project',      roman: 'III' },
  { label: 'skills',       roman: 'IV'  },
  { label: 'experience',   roman: 'V'   },
  { label: 'achievements', roman: 'VI'  },
  { label: 'contact',      roman: 'VII' },
]

interface Props {
  frameIndex: number
  trigger: boolean
  totalFrames: number
}

export default function NavOverlay({ frameIndex, trigger }: Props) {
  const [vw, setVw] = useState(1440)
  const [vh, setVh] = useState(900)
  const [hasFlown, setHasFlown] = useState(false)
  const [flyDone, setFlyDone]   = useState(false)
  const [time, setTime]         = useState('')

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

  // ── Box geometry ──────────────────────────────────────────────────────────
  const BOX_PAD  = 28
  const TITLE_PX = Math.round(Math.min(26, vw * 0.02))
  const NAV_PX   = Math.round(Math.min(17, vw * 0.013))
  const NAV_GAP  = 10
  const NAV_H    = NAV_ITEMS.length * (NAV_PX * 1.5 + NAV_GAP)
  const SEP_H    = 36
  const BOX_W    = Math.round(Math.min(360, vw * 0.27))
  const BOX_H    = Math.round(BOX_PAD + TITLE_PX * 1.4 + SEP_H + NAV_H + BOX_PAD)
  const boxL     = Math.round(vw / 2 - BOX_W / 2)
  const boxT     = Math.round(vh * 0.44 - BOX_H / 2)
  const LIST_W   = BOX_W - BOX_PAD * 2

  // ── Idle positions (viewport-relative px) ─────────────────────────────────
  const idleTitleX = boxL + BOX_PAD
  const idleTitleY = boxT + BOX_PAD
  const idleNavX   = boxL + BOX_PAD
  const idleNavY   = boxT + BOX_PAD + Math.round(TITLE_PX * 1.4) + SEP_H

  // ── Final positions ────────────────────────────────────────────────────────
  const FINAL_TITLE_PX = 12
  const FINAL_TITLE_X  = 24
  const FINAL_TITLE_Y  = 20
  const FINAL_NAV_X    = 32
  // Scale the whole nav block — preserves internal layout so roman numerals stay in line
  const navScale       = Math.min(0.52, 160 / LIST_W)
  const scaledNavH     = Math.round(NAV_H * navScale)
  // Position: visual bottom sits 80px above the wave (wave top = vh*0.75)
  const FINAL_NAV_Y    = Math.round(vh * 0.75 - 20 - scaledNavH)

  const spring          = { type: 'spring', stiffness: 80, damping: 18, mass: 1 } as const
  const fadeTransition  = { duration: 0.45, ease: 'easeOut' } as const

  return (
    <>
      {/* ── Background effects: vignette + border + separator ─────────────── */}
      {/* Fades in with trigger, fades out as soon as flight fires             */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: trigger && !hasFlown ? 1 : 0 }}
        transition={fadeTransition}
      >
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 55% 60% at 50% 44%, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
        {/* Border */}
        <div
          style={{
            position: 'absolute',
            left: boxL, top: boxT,
            width: BOX_W, height: BOX_H,
            border: '1px solid rgba(120,120,120,0.45)',
          }}
        />
      </motion.div>

      {/* ── Title — ONE element, springs from idle → final ─────────────────── */}
      <motion.div
        className="pointer-events-none"
        style={{ position: 'fixed', zIndex: 99, left: idleTitleX, top: idleTitleY }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: trigger ? 1 : 0,
          left:    hasFlown ? FINAL_TITLE_X : idleTitleX,
          top:     hasFlown ? FINAL_TITLE_Y : idleTitleY,
        }}
        transition={{
          opacity: fadeTransition,
          left: spring,
          top:  spring,
        }}
        onAnimationComplete={() => { if (hasFlown) setFlyDone(true) }}
      >
        <motion.span
          initial={{ fontSize: TITLE_PX }}
          animate={{ fontSize: hasFlown ? FINAL_TITLE_PX : TITLE_PX }}
          transition={spring}
          style={{
            fontFamily:    'var(--font-anton)',
            display:       'block',
            color:         'rgba(0,0,0,0.88)',
            whiteSpace:    'nowrap',
            lineHeight:    1,
            letterSpacing: '0.01em',
            userSelect:    'none',
          }}
        >
          iza creation works
        </motion.span>
      </motion.div>

      {/* ── Nav list — scale the whole block so roman numerals never overflow ── */}
      <motion.ul
        style={{
          position:        'fixed',
          zIndex:           99,
          listStyle:       'none',
          padding:          0,
          margin:           0,
          width:            LIST_W,
          transformOrigin: 'top left',
          pointerEvents:   flyDone ? 'auto' : 'none',
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: trigger ? 1 : 0,
          left:    hasFlown ? FINAL_NAV_X : idleNavX,
          top:     hasFlown ? FINAL_NAV_Y : idleNavY,
          scale:   hasFlown ? navScale    : 1,
        }}
        transition={{
          opacity: fadeTransition,
          left:    spring,
          top:     spring,
          scale:   spring,
        }}
      >
        {NAV_ITEMS.map((item) => (
          <li
            key={item.label}
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'baseline',
              marginBottom:    NAV_GAP,
              cursor:          flyDone ? 'pointer' : 'default',
            }}
            onClick={() => {
              if (!flyDone) return
              const el = document.getElementById(item.label)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <span
              style={{
                fontFamily:    'var(--font-inknut-antiqua)',
                fontSize:       NAV_PX,
                color:         'rgba(0,0,0,0.85)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                userSelect:    'none',
                whiteSpace:    'nowrap',
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-inknut-antiqua)',
                fontSize:    NAV_PX * 0.72,
                color:      'rgba(0,0,0,0.85)',
                fontWeight:  700,
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {item.roman}
            </span>
          </li>
        ))}
      </motion.ul>

      {/* ── Data bar — rides up with container, sticks at navbar level ── */}
      {trigger && (() => {
        // Scroll progress: 0 at frame 116, 1 at frame 192
        const p          = Math.max(0, Math.min(1, (frameIndex - 116) / (192 - 116)))
        // Interpolate from (vh - 20px) at p=0 to 26px at p=1
        const topPx      = Math.round((1 - p) * (vh - 20) + p * 26)
        return (
          <div
            style={{
              position:     'fixed',
              zIndex:        99,
              top:            topPx,
              left:          '50%',
              transform:     'translateX(-50%)',
              pointerEvents: 'none',
              display:       'flex',
              alignItems:    'center',
              gap:            10,
              fontFamily:    'var(--font-inknut-antiqua)',
              fontSize:       10,
              color:         'rgba(0,0,0,0.5)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              whiteSpace:    'nowrap',
              userSelect:    'none',
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
