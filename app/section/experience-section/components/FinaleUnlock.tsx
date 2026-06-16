'use client'

import { useEffect, useState } from 'react'
import { TitleHeading } from '../../../components/TitleHeading'

const PAPER = '/asset/project-section/projectbg/paper.jpg'
const EMAIL = 'rezkyhaikal3@gmail.com'
const GITHUB = 'https://github.com/iza-aa'

const contacts = [
  {
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    note: 'Best for project briefs, collaboration, and focused technical conversations.',
  },
  {
    label: 'GitHub',
    value: 'github.com/iza-aa',
    href: GITHUB,
    note: 'Source work, experiments, and implementation details from recent builds.',
  },
  {
    label: 'Location',
    value: 'Depok, Yogyakarta',
    note: 'Available for remote work and selective on-site collaboration.',
  },
  {
    label: 'Resume',
    value: 'Download CV',
    href: '/resume.pdf',
    note: 'A compact overview of experience, stack, and project responsibility.',
  },
]

function ContactRow({
  label,
  value,
  href,
  note,
  isDark,
}: {
  label: string
  value: string
  href?: string
  note: string
  isDark: boolean
}) {
  const primary = '#f5f0e6'
  const secondary = 'rgba(245,240,230,0.62)'
  const gold = isDark ? 'rgba(232,200,122,0.68)' : 'rgba(140,107,69,0.72)'
  const Tag = (href ? 'a' : 'article') as 'a' | 'article'
  const linkProps = href
    ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noreferrer' }
    : {}

  return (
    <Tag
      {...linkProps}
      className={`group relative grid gap-3 border-t py-5 transition-colors duration-300 md:grid-cols-[160px_1fr_auto] md:items-start ${
        href ? 'hover:bg-white/[0.035]' : ''
      }`}
      style={{
        borderColor: isDark ? 'rgba(232,200,122,0.2)' : 'rgba(140,107,69,0.22)',
      }}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: secondary }}>
          {label}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold leading-snug md:text-xl" style={{ color: primary }}>
          {value}
        </h3>
        <p className="mt-1 max-w-[42ch] text-sm font-medium leading-relaxed" style={{ color: secondary }}>
          {note}
        </p>
      </div>

      {href && (
        <span className="justify-self-start text-[10px] font-semibold uppercase tracking-[0.22em] transition-transform duration-300 group-hover:translate-x-1 md:justify-self-end" style={{ color: gold }}>
          Open
        </span>
      )}
    </Tag>
  )
}

function ContactPanel({ isDark }: { isDark: boolean }) {
  const goldText = isDark ? '#e8c87a' : '#8c6b45'
  const primary = '#f5f0e6'
  const secondary = 'rgba(245,240,230,0.66)'

  return (
    <div className="grid max-w-6xl gap-14 md:grid-cols-[0.72fr_1.28fr]">
      <div className="flex flex-col justify-between gap-12 border-t border-[#c9a227]/45 pt-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: goldText }}>
            availability
          </p>
          <h3 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[0.95] md:text-5xl" style={{ color: primary }}>
            Build the next piece.
          </h3>
          <p className="mt-5 max-w-[32ch] text-sm font-medium leading-relaxed md:text-base" style={{ color: secondary }}>
            Send a concise brief, a rough direction, or a problem worth shaping into an interface.
          </p>
        </div>

        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex min-w-[240px] self-end justify-center border border-[#8c6b45]/60 px-5 py-2 text-center text-[10px] uppercase tracking-[0.22em] text-[#5c4738] transition-colors duration-300 hover:border-[#8c6b45] hover:bg-[#8c6b45]/10 dark:border-[#b08d57]/60 dark:text-[#d4c4a8] dark:hover:border-[#b08d57] dark:hover:bg-[#b08d57]/10 md:min-w-[280px] md:text-xs"
        >
          Start with email ↗
        </a>
      </div>

      <div className="border-t border-[#c9a227]/25 pt-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: secondary }}>
            catalogue
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: goldText }}>
            04 entries
          </p>
        </div>
        <div>
          {contacts.map((item) => (
            <ContactRow key={item.label} {...item} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FinaleUnlock({
  titleRef,
}: {
  titleRef?: (el: HTMLElement | null) => void
}) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" className="relative z-10 w-full overflow-hidden">
      <div ref={titleRef} className="mb-10 px-4 pt-12 sm:px-6 md:pt-20 md:pb-2 lg:mb-12 lg:pl-[240px] lg:pr-0">
        <TitleHeading
          title="contact"
          subtitle="For product interfaces, portfolio systems, and WebGL-heavy frontends."
          className="text-white"
          titleClassName="text-[clamp(3.25rem,16vw,12.5rem)] pt-[24vh] lg:pt-[28vh]"
          subtitleClassName="mt-0 text-white/70"
        />
      </div>

      <div className="relative w-full py-20 md:py-24">
        <div
          className="absolute inset-0 transition-colors duration-500 lg:ml-60"
          style={{ backgroundColor: isDark ? '#0d110f' : '#e6e4d8' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 transition-all duration-500 lg:ml-60"
          style={{
            backgroundImage: `url("${PAPER}")`,
            backgroundRepeat: 'repeat',
            backgroundPosition: 'top left',
            backgroundSize: '600px',
            mixBlendMode: isDark ? 'soft-light' : 'multiply',
            filter: isDark ? 'invert(1) brightness(1.2) contrast(1.4)' : 'none',
            opacity: isDark ? 0.75 : 0.34,
          }}
        />

        <div data-key-guide-end className="relative z-20 px-4 sm:px-6 lg:pl-[270px] lg:pr-6">
          <ContactPanel isDark={isDark} />
        </div>
      </div>
    </section>
  )
}
