'use client'

import { useState, useEffect, useRef, RefObject } from 'react'
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
  heroRef: RefObject<HTMLDivElement>
}

export default function NavOverlay({ frameIndex, trigger, heroRef }: Props) {
  const [vw, setVw] = useState(1440)
  const [vh, setVh] = useState(900)
  const [hasFlown, setHasFlown] = useState(false)
  const [flyDone, setFlyDone]   = useState(false)
  const [time, setTime]         = useState('')
  const [isDark, setIsDark]               = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [hoveredItem, setHoveredItem]     = useState<string | null>(null)
  const navLockRef = useRef(false)  // prevent scroll override during click navigation

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const normalIds = ['contact', 'achievements', 'experience', 'skills', 'project']

    const getActive = () => {
      if (navLockRef.current) return   // locked during click navigation
      const scrollY = window.scrollY
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

      // About — inside hero sticky container, active from 60% scroll onward
      // No upper bound: normal sections above are checked first, so if #project
      // is already past mid it returns before reaching here
      const heroEl = heroRef.current
      if (heroEl) {
        const heroTotalScroll = heroEl.offsetHeight - window.innerHeight
        const progress        = scrollY / heroTotalScroll
        if (progress >= 0.6) {
          setActiveSection('about')
          return
        }
      }

      setActiveSection('home')
    }

    window.addEventListener('scroll', getActive, { passive: true })
    getActive()
    return () => window.removeEventListener('scroll', getActive)
  }, [heroRef])

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
    navLockRef.current = true
    clearTimeout((navigateTo as unknown as { _t?: ReturnType<typeof setTimeout> })._t)
    ;(navigateTo as unknown as { _t?: ReturnType<typeof setTimeout> })._t = setTimeout(() => {
      navLockRef.current = false
    }, 1200)  // unlock after smooth scroll finishes

    if (label === 'home') {
      setActiveSection('home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (label === 'about') {
      setActiveSection('about')
      const hero = heroRef.current
      if (hero) {
        const target = hero.offsetTop + hero.offsetHeight - window.innerHeight
        window.scrollTo({ top: target, behavior: 'smooth' })
      }
    } else {
      const el = document.getElementById(label)
      if (el) {
        setActiveSection(label)
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

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

  const spring         = { type: 'spring', stiffness: 80, damping: 18, mass: 1 } as const
  const fadeTransition = { duration: 0.45, ease: 'easeOut' } as const

  // ── Logika Override Warna untuk Section Project ────────────────────────────
  const isProject = activeSection === 'project'

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
            // Override warna di sini
            color:         isProject ? 'rgba(255,255,255,0.88)' : (isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.88)'),
            whiteSpace:    'nowrap',
            lineHeight:    1,
            letterSpacing: '0.01em',
            userSelect:    'none',
            transition:    'color 0.3s ease', // Tambahan transisi warna yang halus
          }}
        >
          iza creation labs
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
          pointerEvents:   trigger ? 'auto' : 'none',
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
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.label
          
          // Override warna di sini
          const textColor = isProject 
            ? 'rgba(255,255,255,0.85)' 
            : (isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)')
            
          const dimColor  = isProject 
            ? 'rgba(255,255,255,0.35)' 
            : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)')

          return (
            <li
              key={item.label}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display:     'flex',
                alignItems:  'baseline',
                marginBottom: NAV_GAP,
                cursor:       trigger ? 'pointer' : 'default',
              }}
              onClick={() => navigateTo(item.label)}
            >
              {/* Label */}
              <span
                style={{
                  fontFamily:    'var(--font-inknut-antiqua)',
                  fontSize:       NAV_PX,
                  color:          isActive ? textColor : dimColor,
                  fontWeight:     isActive || hoveredItem === item.label ? 700 : 400,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  userSelect:    'none',
                  whiteSpace:    'nowrap',
                  flexShrink:     0,
                  transition:    'color 0.3s ease', // Transisi halus
                }}
              >
                {item.label}
              </span>

              {/* Dots — fill remaining space, only visible for active item */}
              <span
                style={{
                  flex:          1,
                  overflow:      'hidden',
                  whiteSpace:    'nowrap',
                  letterSpacing: '0.35em',
                  fontSize:       NAV_PX * 0.70,
                  color:          isActive ? textColor : 'transparent',
                  padding:       '0 0 0 5px',
                  userSelect:    'none',
                  alignSelf:     'flex-end',
                  lineHeight:     1.6,
                  WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                  maskImage:       'linear-gradient(to right, black 90%, transparent 100%)',
                  transition:    'color 0.3s ease',
                }}
              >
                {'·'.repeat(80)}
              </span>

              {/* Roman numeral */}
              <span
                style={{
                  fontFamily:  'var(--font-inknut-antiqua)',
                  fontSize:     NAV_PX * 0.72,
                  color:        isActive ? textColor : dimColor,
                  fontWeight:   isActive ? 700 : 400,
                  userSelect:  'none',
                  whiteSpace:  'nowrap',
                  flexShrink:   0,
                  marginLeft:  '10px',
                  transition:  'color 0.3s ease',
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
        // Scroll progress: 0 at frame 116, 1 at frame 192
        const p          = Math.max(0, Math.min(1, (frameIndex - 116) / (192 - 116)))
        // Interpolate from (vh - 20px) at p=0 to 26px at p=1
        const topPx      = Math.round((1 - p) * (vh - 20) + p * 26)
        
        // Override warna di sini
        const dataBarColor = isProject 
          ? 'rgba(255,255,255,0.5)' 
          : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)')

        return (
          <div
            style={{
              position:     'fixed',
              zIndex:        999,
              top:            topPx,
              left:          '50%',
              transform:     'translateX(-50%)',
              pointerEvents: 'none',
              display:       'flex',
              alignItems:    'center',
              gap:            10,
              fontFamily:    'var(--font-inknut-antiqua)',
              fontSize:       10,
              color:          dataBarColor,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              whiteSpace:    'nowrap',
              userSelect:    'none',
              transition:    'color 0.3s ease',
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