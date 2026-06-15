'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from '@studio-freight/react-lenis'
import ContactCatalogue from './ContactCatalogue'

const KEY_ARRIVED_EVENT = 'portfolio:gold-key-arrived'
const KEY_UNLOCK_EVENT = 'portfolio:gold-key-unlock'
const KEY_UNLOCK_COMPLETE_EVENT = 'portfolio:gold-key-unlock-complete'
const KEY_RESET_EVENT = 'portfolio:gold-key-reset'
const KEY_RESET_COMPLETE_EVENT = 'portfolio:gold-key-reset-complete'
const FINALE_FLIPBOOK_COMPLETE = 'portfolio:finale-flipbook-complete'
const FINALE_SOBEL_ON = 'portfolio:finale-sobel-on'
const FINALE_SOBEL_OFF = 'portfolio:finale-sobel-off'

export default function FinaleUnlock() {
  const lenis = useLenis()
  const sectionRef = useRef<HTMLElement>(null)
  const [isDark, setIsDark] = useState(true)
  const [keyArrived, setKeyArrived] = useState(false)
  const [bottomReached, setBottomReached] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [backing, setBacking] = useState(false)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!unlocking && !opened) return
    const scrollY = window.scrollY || window.pageYOffset
    const body = document.body
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    }
    const prevent = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      if ('stopImmediatePropagation' in event) {
        event.stopImmediatePropagation()
      }
    }

    lenis?.stop()
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    window.addEventListener('wheel', prevent, { passive: false, capture: true })
    window.addEventListener('touchmove', prevent, { passive: false, capture: true })

    return () => {
      window.removeEventListener('wheel', prevent, { capture: true })
      window.removeEventListener('touchmove', prevent, { capture: true })
      body.style.overflow = prev.overflow
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      window.scrollTo(0, scrollY)
      lenis?.start()
    }
  }, [unlocking, opened, lenis])

  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent(FINALE_SOBEL_OFF))
    }
  }, [])

  const handleKeyArrived = useCallback(() => {
    if (opened) return
    setKeyArrived(true)
  }, [opened])

  useEffect(() => {
    const updateBottomReached = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const viewportH = window.innerHeight || 1
      const pageH = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      )
      setBottomReached(scrollY + viewportH >= pageH - 36)
    }

    updateBottomReached()
    window.addEventListener('scroll', updateBottomReached, { passive: true })
    window.addEventListener('resize', updateBottomReached)
    return () => {
      window.removeEventListener('scroll', updateBottomReached)
      window.removeEventListener('resize', updateBottomReached)
    }
  }, [])

  useEffect(() => {
    const handleFlipbookComplete = () => {
      setUnlocking(false)
      setRevealing(false)
      setOpened(true)
    }
    const handleKeyUnlockComplete = () => {
      setRevealing(true)
      window.dispatchEvent(new CustomEvent(FINALE_SOBEL_ON))
    }
    const handleKeyResetComplete = () => {
      setOpened(false)
      setUnlocking(false)
      setRevealing(false)
      setBacking(false)
      setKeyArrived(true)
      window.dispatchEvent(new CustomEvent(FINALE_SOBEL_OFF))
    }

    window.addEventListener(KEY_ARRIVED_EVENT, handleKeyArrived)
    window.addEventListener(KEY_UNLOCK_COMPLETE_EVENT, handleKeyUnlockComplete)
    window.addEventListener(KEY_RESET_COMPLETE_EVENT, handleKeyResetComplete)
    window.addEventListener(FINALE_FLIPBOOK_COMPLETE, handleFlipbookComplete)
    return () => {
      window.removeEventListener(KEY_ARRIVED_EVENT, handleKeyArrived)
      window.removeEventListener(KEY_UNLOCK_COMPLETE_EVENT, handleKeyUnlockComplete)
      window.removeEventListener(KEY_RESET_COMPLETE_EVENT, handleKeyResetComplete)
      window.removeEventListener(FINALE_FLIPBOOK_COMPLETE, handleFlipbookComplete)
    }
  }, [handleKeyArrived])

  const beginUnlock = () => {
    if (!keyArrived || !bottomReached || unlocking || opened) return
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setUnlocking(true)
    window.dispatchEvent(new CustomEvent(KEY_UNLOCK_EVENT))
  }

  const resetFinale = () => {
    if (backing) return
    setBacking(true)
    window.dispatchEvent(new CustomEvent(KEY_RESET_EVENT))
  }

  const gold = isDark ? '#c9a227' : '#b08d57'
  const surface = isDark ? '#251b11' : '#efe8d6'
  const canUnlock = keyArrived && bottomReached
  const buttonDisabled = !canUnlock || unlocking || opened
  const buttonLabel = unlocking ? 'Unlocking' : canUnlock ? 'Unlock' : 'Locked'

  return (
    <section ref={sectionRef} id="contact" className="relative z-10 flex min-h-screen w-full items-center justify-center py-24">
      {!opened && (
        <div
          data-key-guide-end
          className={`relative mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 transition-all duration-700 ${
            revealing ? 'opacity-0 scale-95 blur-sm pointer-events-none' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          <span
            aria-hidden
            className="block h-px w-24"
            style={{ background: `linear-gradient(to right, transparent, ${gold}, transparent)` }}
          />

          <button
            type="button"
            data-key-unlock-button
            disabled={buttonDisabled}
            onClick={beginUnlock}
            className="group relative inline-flex items-center gap-3 rounded-sm px-8 py-4 transition-all duration-500 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
            style={{
              background: surface,
              border: `1px solid ${isDark ? 'rgba(201,162,39,0.4)' : 'rgba(176,141,87,0.55)'}`,
              boxShadow: isDark
                ? 'inset 0 0 0 3px #251b11, inset 0 0 0 4px rgba(201,162,39,0.18)'
                : 'inset 0 0 0 3px #efe8d6, inset 0 0 0 4px rgba(176,141,87,0.25)',
              color: isDark ? '#e8c87a' : '#8c6b45',
            }}
          >
            <svg className="h-4 w-4 transition-transform duration-500 group-enabled:group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <rect x="5" y="11" width="14" height="9" rx="1.5" />
              <path strokeLinecap="round" d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] md:text-sm">
              {buttonLabel}
            </span>
          </button>

          <span className="font-pinyon-script text-base md:text-lg" style={{ color: gold }}>
            {canUnlock ? 'turn the key' : 'guide the key to the bottom'}
          </span>
        </div>
      )}

      {opened && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden px-4 py-8">
          <div className="relative flex w-full max-w-4xl flex-col items-center gap-6 animate-[contactReveal_0.7s_cubic-bezier(0.22,1,0.36,1)_forwards]">
            <button
              type="button"
              disabled={backing}
              onClick={resetFinale}
              className="self-start rounded-sm px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition-transform duration-300 enabled:hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-55"
              style={{
                border: `1px solid ${isDark ? 'rgba(201,162,39,0.45)' : 'rgba(176,141,87,0.55)'}`,
                color: isDark ? '#e8c87a' : '#8c6b45',
                background: isDark ? 'rgba(37,27,17,0.72)' : 'rgba(239,232,214,0.78)',
              }}
            >
              {backing ? 'Returning' : 'Back'}
            </button>
            <ContactCatalogue play isDark={isDark} />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes contactReveal {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
