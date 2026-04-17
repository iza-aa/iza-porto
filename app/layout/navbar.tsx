'use client'

import { useEffect, useState } from 'react'
import { useAppLoading } from '../context/LoadingContext'

// ─── Liquid Glass base styles ─────────────────────────────────────────────────
const glass =
  'backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_4px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-200'

const glassHover =
  'hover:bg-white/20 hover:border-white/35 hover:shadow-[0_6px_36px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.45)]'

// ─── GitHub SVG ───────────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

// ─── Sun / Moon icons ─────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" aria-hidden>
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
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isDark, setIsDark] = useState(true)
  const { isAppLoading } = useAppLoading()

  // Sync with html class on mount
  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark')
    setIsDark(dark)
  }, [])

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

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-start justify-between px-6 pt-5 pointer-events-none"
      style={{
        opacity: isAppLoading ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: isAppLoading ? 'none' : undefined,
      }}
    >

      {/* ── LEFT: Hire me pill ─────────────────────────────────────────────── */}
      <div className="pointer-events-auto">
        <button
          className={`${glass} ${glassHover} rounded-full px-5 py-2.5 flex items-center gap-2.5 cursor-pointer text-white`}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-sm font-medium text-white/80 whitespace-nowrap">
            Available for freelance work
          </span>
          <span className="text-sm font-semibold text-white">→ Hire me</span>
        </button>
      </div>

      {/* ── RIGHT: Nav group ───────────────────────────────────────────────── */}
      <div className="pointer-events-auto flex items-center gap-2">

        {/* Nav links card */}
        <div className={`${glass} rounded-full px-1.5 py-1.5 flex items-center gap-0.5`}>
          {(['About', 'Work', 'Contact'] as const).map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className={`${glassHover} rounded-full px-4 h-7 text-sm font-medium text-white/80 hover:text-white cursor-pointer`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* LinkedIn card */}
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`${glass} ${glassHover} rounded-full w-10 h-10 flex items-center justify-center text-white/80 hover:text-white cursor-pointer`}
          aria-label="LinkedIn"
        >
          <span className="text-xs font-black tracking-tight leading-none">in</span>
        </a>

        {/* GitHub card */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`${glass} ${glassHover} rounded-full w-10 h-10 flex items-center justify-center text-white/80 hover:text-white cursor-pointer`}
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>

        {/* Theme toggle card */}
        <button
          onClick={toggleTheme}
          className={`${glass} ${glassHover} rounded-full w-10 h-10 flex items-center justify-center text-white/80 hover:text-white cursor-pointer`}
          aria-label="Toggle theme"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

      </div>
    </nav>
  )
}
