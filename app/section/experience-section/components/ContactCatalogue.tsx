'use client'

/**
 * ContactCatalogue — the finale's closing beat. After the signature is written,
 * the contact details appear one by one as museum-catalogue plaques: each is a
 * solid panel overlaid with the same paper texture used across the portfolio
 * (paper.jpg) and framed in a gold hairline, so it stays of-a-piece with every
 * other content card. Items reveal in sequence (stagger) on `play`.
 */

const PAPER = '/asset/project-section/projectbg/paper.jpg'
const EMAIL = 'nurashaiwang@gmail.com'
const GITHUB = 'https://github.com/iza-aa'

type Item = {
  no: string
  label: string
  value: string
  href?: string
  icon: React.ReactNode
}

const ICON = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M9 12h6m-6 4h6M7 21h10a2 2 0 0 0 2-2V8.5L13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" strokeLinejoin="round" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
}

const ITEMS: Item[] = [
  { no: 'I', label: 'Correspondence', value: EMAIL, href: `mailto:${EMAIL}`, icon: ICON.mail },
  { no: 'II', label: 'Atelier', value: 'Depok, Yogyakarta', icon: ICON.pin },
  { no: 'III', label: 'Repository', value: 'github.com/iza-aa', href: GITHUB, icon: ICON.github },
  { no: 'IV', label: 'Curriculum Vitae', value: 'Download Resume', href: '/resume.pdf', icon: ICON.doc },
]

export default function ContactCatalogue({ play, isDark }: { play: boolean; isDark: boolean }) {
  const solid = isDark ? '#251b11' : '#efe8d6'
  const gold = isDark ? 'rgba(201,162,39,0.45)' : 'rgba(176,141,87,0.55)'
  const goldText = isDark ? '#e8c87a' : '#8c6b45'
  const primary = isDark ? '#F5F0E6' : '#2B2118'
  const secondary = isDark ? 'rgba(245,240,230,0.6)' : '#5C4B3A'

  return (
    <div className="w-full max-w-3xl px-6 flex flex-col gap-4">
      {ITEMS.map((it, i) => {
        const Tag = (it.href ? 'a' : 'div') as 'a' | 'div'
        const linkProps = it.href
          ? { href: it.href, target: it.href.startsWith('http') ? '_blank' : undefined, rel: 'noreferrer' }
          : {}
        return (
          <Tag
            key={it.no}
            {...linkProps}
            className={`group relative flex items-center gap-5 rounded-sm px-6 py-5 overflow-hidden transition-transform duration-500 ${play ? 'cat-in' : 'opacity-0'} ${it.href ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
            style={{
              background: solid,
              border: `1px solid ${gold}`,
              boxShadow: `inset 0 0 0 3px ${solid}, inset 0 0 0 4px ${gold}`,
              animationDelay: play ? `${i * 0.18}s` : '0s',
            }}
          >
            {/* paper texture overlay — keeps it of-a-piece with the rest */}
            <span
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("${PAPER}")`,
                backgroundSize: '500px',
                backgroundRepeat: 'repeat',
                mixBlendMode: isDark ? 'soft-light' : 'multiply',
                filter: isDark ? 'invert(1) brightness(1.2) contrast(1.3)' : 'none',
                opacity: isDark ? 0.5 : 0.28,
              }}
            />
            <span aria-hidden className="absolute top-2.5 left-3.5 text-[9px] tracking-[0.25em] uppercase opacity-50 select-none z-10" style={{ color: goldText }}>
              No. {it.no}
            </span>

            <span
              className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full shrink-0"
              style={{ border: `1px solid ${gold}`, color: primary }}
            >
              {it.icon}
            </span>
            <span className="relative z-10 flex flex-col">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em]" style={{ color: secondary }}>
                {it.label}
              </span>
              <span className="text-lg md:text-xl font-semibold break-all" style={{ color: primary }}>
                {it.value}
              </span>
            </span>
          </Tag>
        )
      })}

      <style jsx>{`
        .cat-in {
          opacity: 0;
          animation: catIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes catIn {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
