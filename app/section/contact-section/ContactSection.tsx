'use client'

import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'

// ─── Manuscript panel styles (Renaissance) ────────────────────────────────────
// Solid parchment / aged-wood panels with a double gold hairline frame —
// no glassmorphism. Hover lifts the panel gently like a hung painting.
const panelDark =
  'relative rounded-sm bg-[#251b11] border border-[#c9a227]/30 ' +
  'shadow-[inset_0_0_0_3px_#251b11,inset_0_0_0_4px_rgba(201,162,39,0.18)] ' +
  'transition-all duration-500 ease-out'

const panelLight =
  'relative rounded-sm bg-[#efe8d6] border border-[#b08d57]/50 ' +
  'shadow-[inset_0_0_0_3px_#efe8d6,inset_0_0_0_4px_rgba(176,141,87,0.25)] ' +
  'transition-all duration-500 ease-out'

const panelDarkHover =
  'hover:border-[#c9a227]/70 hover:-translate-y-1 hover:shadow-[inset_0_0_0_3px_#251b11,inset_0_0_0_4px_rgba(201,162,39,0.35),0_10px_30px_rgba(0,0,0,0.45)]'

const panelLightHover =
  'hover:border-[#b08d57] hover:-translate-y-1 hover:shadow-[inset_0_0_0_3px_#efe8d6,inset_0_0_0_4px_rgba(176,141,87,0.45),0_10px_30px_rgba(62,44,28,0.18)]'

const CONTACT_EMAIL = 'nurashaiwang@gmail.com'
const GITHUB_URL = 'https://github.com/iza-aa'

// Museum catalogue numbering for the small panels
function CatalogueNo({ n, className = '' }: { n: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute top-2.5 left-3.5 text-[9px] tracking-[0.25em] uppercase opacity-50 select-none ${className}`}
    >
      No. {n}
    </span>
  )
}

// Gold corner accents for the featured panels
function GoldCorners({ color = '#c9a227' }: { color?: string }) {
  const base = 'absolute w-3 h-3 md:w-4 md:h-4 pointer-events-none'
  return (
    <>
      <span aria-hidden className={`${base} top-2 left-2 border-t border-l`} style={{ borderColor: color }} />
      <span aria-hidden className={`${base} top-2 right-2 border-t border-r`} style={{ borderColor: color }} />
      <span aria-hidden className={`${base} bottom-2 left-2 border-b border-l`} style={{ borderColor: color }} />
      <span aria-hidden className={`${base} bottom-2 right-2 border-b border-r`} style={{ borderColor: color }} />
    </>
  )
}

function useJakartaTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date())
      )
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [])
  return time
}

// Slow, stately reveal — panels rise one after another like pieces being hung
const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const panelVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function ContactSection() {
  const [isDark, setIsDark] = useState(true)
  const time = useJakartaTime()

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark')
    setIsDark(dark)
  }, [])

  const panel = isDark ? panelDark : panelLight
  const panelHover = isDark ? panelDarkHover : panelLightHover
  const textPrimary = isDark ? 'text-[#F5F0E6]' : 'text-[#2B2118]'
  const textSecondary = isDark ? 'text-[#F5F0E6]/60' : 'text-[#5C4B3A]'
  const textGold = isDark ? 'text-[#c9a227]' : 'text-[#8c6b45]'
  const chipBg = isDark
    ? 'bg-[#1c1409] border border-[#c9a227]/25 text-[#e6dfce]'
    : 'bg-[#e6dcc3] border border-[#b08d57]/35 text-[#3E2C1C]'
  const iconBubble = isDark
    ? 'bg-[#1c1409] border border-[#c9a227]/25'
    : 'bg-[#e6dcc3] border border-[#b08d57]/35'

  return (
    <section className="relative w-full h-full p-5 flex flex-col overflow-hidden">
      {/* Aged-paper vignette + canvas noise, replacing the old neon glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)'
            : 'radial-gradient(ellipse at center, transparent 55%, rgba(140,107,69,0.18) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("/asset/noise.png")' }}
      />

      {/*
        ─── CUSTOM HEIGHT GRID ───────────────────────────────────────────
        Baris 1 = 1.4fr (DIPENDEKKAN: GitHub menyusut)
        Baris 2 = 1.6fr (DITINGGIKAN: Current Base naik ke atas & membesar)
        Baris 3 = 0.75fr
        Baris 4 = 0.75fr
      */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-12 auto-rows-[140px] md:grid-rows-[1.4fr_1.6fr_0.75fr_0.75fr] gap-4 w-full h-full overflow-y-auto md:overflow-hidden pb-8 md:pb-0"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >

        {/* BARIS 1 (1.4fr - LEBIH PENDEK) */}
        {/* 1. Kiri Atas (GitHub) */}
        <motion.a variants={panelVariants} href={GITHUB_URL} target="_blank" rel="noreferrer" className={`${panel} ${panelHover} md:col-span-4 md:row-span-1 flex flex-col items-center justify-center p-4 cursor-pointer group`}>
          <CatalogueNo n="I" className={textGold} />
          <svg viewBox="0 0 24 24" className={`w-10 h-10 md:w-12 md:h-12 fill-current ${textPrimary} group-hover:scale-110 transition-transform duration-500`}>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span className={`text-[11px] md:text-xs mt-3 font-bold tracking-widest uppercase ${textSecondary}`}>GitHub — @iza-aa</span>
        </motion.a>

        {/* 2. Hero Tengah Atas (Burgundy Commission Card) */}
        <motion.a variants={panelVariants} href={`mailto:${CONTACT_EMAIL}`} className={`rounded-sm md:col-span-4 md:row-span-2 p-8 md:p-10 flex flex-col justify-end group overflow-hidden relative cursor-pointer transition-all duration-500 hover:-translate-y-1 border ${isDark ? 'bg-gradient-to-b from-[#5d1b26] to-[#310c12] border-[#c9a227]/40 hover:border-[#c9a227]/70' : 'bg-gradient-to-b from-[#6e1f2c] to-[#3e1018] border-[#c9a227]/50 hover:border-[#c9a227]/80'} shadow-[0_10px_40px_rgba(0,0,0,0.3)]`}>
          {/* Inner gold frame + corner accents — painting treatment */}
          <span aria-hidden className="absolute inset-3 border border-[#c9a227]/35 pointer-events-none" />
          <GoldCorners />

          <div className="absolute top-7 left-0 w-full flex justify-center gap-2 md:gap-4 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-medium text-[#e8c87a]/70 z-20">
            <span>Depok, ID</span>
            <span aria-hidden>❦</span>
            <span>{time || '--:--'} WIB</span>
            <span aria-hidden>❦</span>
            <span>4 Works</span>
          </div>

          {/* Wax-seal arrow */}
          <div className="absolute top-7 right-7 md:top-9 md:right-9 w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#e8c87a]/60 bg-[#e8c87a]/10 flex items-center justify-center transition-colors duration-500 group-hover:bg-[#e8c87a]/25">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-[#e8c87a] -rotate-45 group-hover:rotate-0 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          <div className="relative z-10">
            <p className="font-pinyon-script text-2xl md:text-3xl text-[#e8c87a] mb-1">Get in touch</p>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-2 md:mb-3 text-[#F5F0E6]">Let&apos;s Talk</h3>
            <p className="text-[#F5F0E6]/70 text-sm md:text-base tracking-wide break-all">{CONTACT_EMAIL}</p>
          </div>
        </motion.a>

        {/* 3. Kanan Atas (Status) */}
        <motion.div variants={panelVariants} className={`${panel} ${panelHover} md:col-span-4 md:row-span-1 p-6 flex items-center justify-between`}>
          <CatalogueNo n="II" className={textGold} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9CAF6E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7A8B52]"></span>
              </span>
              <span className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ${textSecondary}`}>Status</span>
            </div>
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Available for Work</h3>
          </div>
        </motion.div>


        {/* BARIS 2 (1.6fr - LEBIH TINGGI) */}
        {/* 4. Kiri Tengah (Current Base) */}
        <motion.div variants={panelVariants} className={`${panel} ${panelHover} md:col-span-4 md:row-span-1 p-6 lg:p-8 flex items-center gap-5`}>
          <CatalogueNo n="III" className={textGold} />
          <div className={`p-4 rounded-full ${iconBubble}`}>
            <svg className={`w-7 h-7 md:w-9 md:h-9 ${textPrimary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className={`text-xs md:text-sm ${textSecondary} mb-1 uppercase tracking-[0.15em]`}>Current Base</p>
            <h3 className={`text-xl lg:text-2xl font-semibold leading-tight ${textPrimary}`}>Depok, Yogyakarta</h3>
          </div>
        </motion.div>

        {/* 5. Kanan Tengah (Resume) */}
        <motion.a variants={panelVariants} href="/resume.pdf" className={`${panel} ${panelHover} md:col-span-4 md:row-span-2 p-8 flex flex-col items-center justify-center text-center cursor-pointer group`}>
          <CatalogueNo n="IV" className={textGold} />
          <GoldCorners color={isDark ? 'rgba(201,162,39,0.5)' : 'rgba(176,141,87,0.6)'} />
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-sm flex items-center justify-center mb-4 transition-transform duration-500 group-hover:-translate-y-2 ${iconBubble}`}>
            <svg className={`w-7 h-7 md:w-8 md:h-8 ${textPrimary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={`text-lg md:text-xl font-bold ${textPrimary}`}>Download Resume</h3>
          <p className={`font-pinyon-script text-lg md:text-xl mt-1 ${textGold}`}>Curriculum Vitae</p>
        </motion.a>


        {/* BARIS 3 & 4 */}
        {/* 6. Tech Stack */}
        <motion.div variants={panelVariants} className={`${panel} ${panelHover} md:col-span-2 md:row-span-2 p-5 flex flex-col justify-center items-center text-center`}>
          <CatalogueNo n="V" className={textGold} />
          <p className={`text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] mb-3 ${textSecondary}`}>Tech Stack</p>
          <div className="flex flex-col gap-2 w-full">
            <span className={`px-3 py-1.5 rounded-sm text-xs font-semibold ${chipBg}`}>Next.js</span>
            <span className={`px-3 py-1.5 rounded-sm text-xs font-semibold ${chipBg}`}>Tailwind</span>
            <span className={`px-3 py-1.5 rounded-sm text-xs font-semibold ${chipBg}`}>Supabase</span>
          </div>
        </motion.div>

        {/* 7. Role */}
        <motion.div variants={panelVariants} className={`${panel} ${panelHover} md:col-span-4 md:row-span-2 p-6 md:p-8 flex flex-col justify-center`}>
          <CatalogueNo n="VI" className={textGold} />
          <div className={`w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 rounded-sm flex items-center justify-center ${iconBubble}`}>
            <svg className={`w-5 h-5 md:w-6 md:h-6 ${textPrimary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className={`text-[10px] md:text-xs uppercase font-bold tracking-[0.2em] mb-1 md:mb-2 ${textSecondary}`}>Current Role</p>
          <h3 className={`text-lg md:text-2xl font-bold leading-tight ${textPrimary}`}>Junior Staff @ BSI UII</h3>
        </motion.div>

        {/* 8. Music */}
        <motion.div variants={panelVariants} className={`${panel} ${panelHover} md:col-span-2 md:row-span-2 p-5 flex flex-col items-center justify-center text-center`}>
          <CatalogueNo n="VII" className={textGold} />
          <div className={`p-3 md:p-4 rounded-full mb-3 ${iconBubble}`}>
            <svg className={`w-5 h-5 md:w-6 md:h-6 ${textPrimary}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.587 14.424a.611.611 0 0 1-.84.204c-2.302-1.406-5.2-1.72-8.61-0.94a.613.613 0 0 1-.264-1.196c3.712-.85 6.91-.48 9.51 1.11.3.18.39.56.204.822zm1.206-2.695a.763.763 0 0 1-1.048.252c-2.63-1.616-6.66-2.067-9.67-1.132a.765.765 0 0 1-.45-1.46c3.44-.107 7.91.4 10.916 2.244a.764.764 0 0 1 .252 1.046zm.135-2.83c-3.15-1.87-8.34-2.043-11.35-1.13a.92.92 0 1 1-.532-1.76c3.45-1.04 9.24-.83 12.82 1.29a.918.918 0 1 1-.938 1.6z"/>
            </svg>
          </div>
          <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] ${textSecondary} mb-1`}>On Repeat</p>
          <h3 className={`text-xs md:text-sm font-semibold ${textPrimary}`}>Daniel Caesar</h3>
        </motion.div>

        {/* 9. Gaming */}
        <motion.div variants={panelVariants} className={`${panel} ${panelHover} md:col-span-2 md:row-span-1 flex flex-col items-center justify-center p-3 text-center`}>
          <CatalogueNo n="VIII" className={textGold} />
          <span className="text-xl md:text-2xl mb-1">⚔️</span>
          <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] ${textSecondary}`}>Sword of<br/>Convallaria</span>
        </motion.div>

        {/* 10. Coffee */}
        <motion.div variants={panelVariants} className={`${panel} ${panelHover} md:col-span-2 md:row-span-1 flex flex-col items-center justify-center p-3 text-center`}>
          <CatalogueNo n="IX" className={textGold} />
          <span className="text-xl md:text-2xl mb-1">☕</span>
          <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] ${textSecondary}`}>Awor<br/>Coffee</span>
        </motion.div>

      </motion.div>
    </section>
  )
}
