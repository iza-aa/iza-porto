'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useAppLoading } from '../context/LoadingContext'

const glassDark =
  'backdrop-blur-sm bg-[#241508]/70 border border-[#c9a227]/40 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200'
const glassLight =
  'backdrop-blur-sm bg-[#f0e9d8]/80 border border-[#b08d57]/50 shadow-[0_4px_24px_rgba(92,71,56,0.12)] transition-all duration-200'

const glassDarkHover =
  'hover:bg-[#241508]/90 hover:border-[#c9a227]/70 hover:shadow-[0_6px_28px_rgba(0,0,0,0.4)]'
const glassLightHover =
  'hover:bg-[#ece3cf] hover:border-[#b08d57] hover:shadow-[0_6px_28px_rgba(92,71,56,0.2)]'

const mobileNavItems = ['home', 'about', 'project', 'skills', 'experience', 'contact']

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Navbar() {
  const [isDark, setIsDark] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { isAppLoading } = useAppLoading()

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark')
    setIsDark(dark)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navigateMobile = (id: string) => {
    setDrawerOpen(false)

    if (id === 'home' || id === 'about' || id === 'project') {
      window.dispatchEvent(new CustomEvent('portfolio:navigate-stage', { detail: { label: id } }))
      return
    }

    const el = document.getElementById(id)
    if (el && window.scrollY > 2) {
      scrollTo(id)
      return
    }

    window.dispatchEvent(new CustomEvent('portfolio:navigate-stage', {
      detail: { label: 'project', scrollTarget: id },
    }))
  }

  const glass = isDark ? glassDark : glassLight
  const glassHover = isDark ? glassDarkHover : glassLightHover
  const iconColor = isDark
    ? 'text-[#e6dfce]/80 hover:text-[#e6dfce]'
    : 'text-[#5c4738]/80 hover:text-[#5c4738]'

  return (
    <nav
      className="fixed right-4 top-4 z-[1000] flex items-start justify-end sm:right-6 sm:top-5 lg:left-0 lg:right-0 lg:top-0 lg:justify-between lg:px-6 lg:pt-5"
      style={{
        opacity: isAppLoading ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: isAppLoading ? 'none' : 'auto',
      }}
    >
      <div />

      <div className="pointer-events-auto hidden items-center gap-2 lg:flex">
        <a
          href="https://github.com/iza-aa"
          target="_blank"
          rel="noopener noreferrer"
          className={`${glass} ${glassHover} flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl ${iconColor}`}
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>

        <button
          type="button"
          onClick={toggleTheme}
          className={`${glass} ${glassHover} flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl ${iconColor}`}
          aria-label="Toggle theme"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className={`${glass} ${glassHover} pointer-events-auto flex h-12 w-12 items-center justify-center rounded-xl ${isDark ? 'text-[#e6dfce]' : 'text-[#5c4738]'} transition-transform active:scale-95 lg:hidden`}
        aria-label="Open navigation"
        aria-expanded={drawerOpen}
      >
        <Menu className="h-6 w-6" aria-hidden />
      </button>

      <div
        className={`fixed inset-0 z-[1010] transition-opacity duration-300 lg:hidden ${
          drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          aria-label="Close navigation"
          className="absolute inset-0 bg-[#090604]/55 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
        />

        <aside
          className={`absolute right-0 top-0 flex h-[100dvh] w-[min(92vw,390px)] flex-col border-l px-6 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)] transition-transform duration-300 ease-out ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          } ${
            isDark
              ? 'border-[#c9a227]/25 bg-[#150f08]/95 text-[#f0ece4]'
              : 'border-[#b08d57]/35 bg-[#f0e9d8]/95 text-[#3d2d1f]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-anton text-lg leading-none">iza creation labs</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.24em] opacity-55">navigation</p>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors active:scale-95 ${
                isDark
                  ? 'border-[#c9a227]/35 bg-[#241508]/65 text-[#e6dfce]'
                  : 'border-[#b08d57]/40 bg-[#f6eddc]/80 text-[#5c4738]'
              }`}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="mt-12 flex flex-1 flex-col justify-center gap-1">
            {mobileNavItems.map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => navigateMobile(item)}
                className="group flex min-h-12 items-baseline justify-between border-t border-current/15 py-3 text-left transition-colors hover:text-[#e8c87a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]/70"
              >
                <span className="font-anton text-[2.6rem] leading-[0.9] tracking-normal">
                  {item}
                </span>
                <span className="font-inknut-antiqua text-xs font-bold opacity-45 transition-opacity group-hover:opacity-80">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-current/15 pt-5">
            <a
              href="https://github.com/iza-aa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-3 border border-current/20 px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-[#c9a227]/70"
            >
              <GitHubIcon />
              GitHub
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center border border-current/20 transition-colors hover:border-[#c9a227]/70 active:scale-95"
              aria-label="Toggle theme"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </aside>
      </div>
    </nav>
  )
}
