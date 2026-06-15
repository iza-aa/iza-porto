'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Signature from './Signature'
import ContactCatalogue from './ContactCatalogue'

// The 3D padlock is heavy — load it only on the client when the finale runs.
const PadlockScene = dynamic(() => import('./PadlockScene'), { ssr: false })

/**
 * FinaleUnlock — the closing "wow" of the portfolio, told as one arc:
 *
 *   idle       → a gold plaque button at the bottom of Experience.
 *   darkening  → the gallery lights die: a vignette closes from every corner.
 *   lock       → a 3D gold padlock turns in the dark, then opens.
 *   signature  → the artist's name is written in glowing gold calligraphy.
 *   catalogue  → contact details appear one by one on paper-textured plaques.
 *
 * Each beat is a phase in this state machine; transitions are time/event driven
 * so the arc plays itself once the button is pressed.
 */

type Phase = 'idle' | 'darkening' | 'lock' | 'signature' | 'catalogue'

const GOLD_KEY_UNLOCK_EVENT = 'portfolio:gold-key-unlock'

export default function FinaleUnlock() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [lockOpening, setLockOpening] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Lock page scroll while the finale overlay is up.
  useEffect(() => {
    if (phase === 'idle') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [phase])

  // The veil mounts in its OPEN (clear-centre) state, then we flip this to true
  // on the next frame so the CSS background transition actually animates closed.
  // (Mounting already-closed would skip the transition AND its transitionend.)
  const [veilClosed, setVeilClosed] = useState(false)

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const addTimer = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }

  // Single driver for the whole arc — purely time-based so no beat can hang on
  // a missed transitionend/animationend event.
  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []

    if (phase === 'darkening') {
      // next frame → trigger the vignette close transition
      requestAnimationFrame(() => requestAnimationFrame(() => setVeilClosed(true)))
      addTimer(() => setPhase('lock'), 1250)           // after veil closes
    } else if (phase === 'lock') {
      addTimer(() => setLockOpening(true), 1300)         // lock turns then opens
      addTimer(() => setPhase('signature'), 3000)        // then write signature
    } else if (phase === 'signature') {
      addTimer(() => setPhase('catalogue'), 2600)        // signature done → catalogue
    }

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [phase])

  const beginUnlock = useCallback(() => {
    setPhase((current) => current === 'idle' ? 'darkening' : current)
  }, [])

  useEffect(() => {
    window.addEventListener(GOLD_KEY_UNLOCK_EVENT, beginUnlock)
    return () => window.removeEventListener(GOLD_KEY_UNLOCK_EVENT, beginUnlock)
  }, [beginUnlock])

  const close = () => {
    setPhase('idle')
    setLockOpening(false)
    setVeilClosed(false)
  }

  const gold = isDark ? '#c9a227' : '#b08d57'

  return (
    <>
      {/* ── BEAT 1 — the invitation plaque, in normal flow at the bottom. ── */}
      <div data-key-guide-end className="relative z-10 w-full flex flex-col items-center justify-center gap-5 py-28">
        <span
          aria-hidden
          className="block h-px w-24"
          style={{ background: `linear-gradient(to right, transparent, ${gold}, transparent)` }}
        />
        <button
          type="button"
          onClick={beginUnlock}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-sm transition-all duration-500 hover:-translate-y-0.5"
          style={{
            background: isDark ? '#251b11' : '#efe8d6',
            border: `1px solid ${isDark ? 'rgba(201,162,39,0.4)' : 'rgba(176,141,87,0.55)'}`,
            boxShadow: isDark
              ? 'inset 0 0 0 3px #251b11, inset 0 0 0 4px rgba(201,162,39,0.18)'
              : 'inset 0 0 0 3px #efe8d6, inset 0 0 0 4px rgba(176,141,87,0.25)',
            color: isDark ? '#e8c87a' : '#8c6b45',
          }}
        >
          <svg className="w-4 h-4 transition-transform duration-500 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <rect x="5" y="11" width="14" height="9" rx="1.5" />
            <path strokeLinecap="round" d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold">Enter the Atelier</span>
        </button>
        <span className="font-pinyon-script text-base md:text-lg" style={{ color: gold }}>
          a closing word
        </span>
      </div>

      {/* ── BEATS 2+ — full-screen finale overlay ── */}
      {phase !== 'idle' && (
        <div className="fixed inset-0 z-[1000] overflow-hidden bg-black/0">
          {/* BEAT 2 — the darkening vignette (closes from every corner inward).
              Mounts open, then `veilClosed` flips next frame to animate shut. */}
          <div className={`finale-veil absolute inset-0 ${veilClosed ? 'finale-veil--full' : ''}`} />

          {/* BEAT 3 — the 3D padlock, centred in the dark */}
          {phase === 'lock' && (
            <div className="absolute inset-0 flex items-center justify-center animate-[finaleFade_0.8s_ease_forwards]">
              <div className="w-[min(80vw,420px)] h-[min(80vw,420px)]">
                <PadlockScene opening={lockOpening} onOpened={() => {}} />
              </div>
            </div>
          )}

          {/* BEAT 4 — the signature is written */}
          {(phase === 'signature' || phase === 'catalogue') && (
            <div
              className={`absolute left-0 right-0 flex items-center justify-center transition-all duration-700 ${
                phase === 'catalogue' ? 'top-[12%]' : 'top-1/2 -translate-y-1/2'
              }`}
            >
              <Signature play done={phase === 'catalogue'} />
            </div>
          )}

          {/* BEAT 5 — the contact catalogue, one by one */}
          {phase === 'catalogue' && (
            <div className="absolute inset-0 flex items-end md:items-center justify-center pb-10 md:pb-0 pt-[34vh] md:pt-0 overflow-y-auto">
              <div className="w-full flex justify-center animate-[finaleFade_0.6s_ease_forwards]">
                <ContactCatalogue play isDark={isDark} />
              </div>
            </div>
          )}

          {/* Close — return to the gallery */}
          {(phase === 'signature' || phase === 'catalogue') && (
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ border: `1px solid ${gold}`, color: gold }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .finale-veil {
          background: radial-gradient(
            ellipse 120% 120% at center,
            rgba(0, 0, 0, 0) 60%,
            rgba(0, 0, 0, 0.85) 100%
          );
          transition: background 1.1s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .finale-veil--full {
          background: radial-gradient(
            ellipse 120% 120% at center,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) 100%
          );
        }
        @keyframes finaleFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
