'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import LeopardBg from './components/LeopardBg'
import PhoneMockup from './components/PhoneMockup'
import LiquidGlass from '../../components/LiquidGlass'

const projects = [
  {
    title: 'IZA POS',
    desc: 'Point-of-sale system with inventory management, real-time sales analytics, and multi-outlet support.',
    tech: ['Next.js', 'Supabase', 'Tailwind'],
    year: '2024',
    /** Image shown inside the phone mockup */
    phoneImage: '/images/IZA-POS-V2.png',
    /** Atmospheric background for the phone screen */
    phoneBg: '/images/phone-bg.jpg',
    featured: true,
  },
  {
    title: 'E-Commerce App',
    desc: 'Full-stack online store with cart, checkout, and admin dashboard.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    year: '2024',
  },
  {
    title: 'Chat App',
    desc: 'Real-time messaging app with rooms and presence indicators.',
    tech: ['Socket.io', 'Express', 'MongoDB'],
    year: '2023',
  },
  {
    title: 'Task Manager',
    desc: 'Drag-and-drop kanban board with authentication and team support.',
    tech: ['Next.js', 'Supabase', 'DnD Kit'],
    year: '2023',
  },
] as const

function ExtraCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef     = useRef<HTMLDivElement>(null)

  // Slide-up on scroll into view
  useEffect(() => {
    const inner = innerRef.current
    if (!inner) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inner.style.opacity   = '1'
          inner.style.transform = 'translateY(0)'
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(inner)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden pointer-events-none">
      {/* Kiri 280px: transparan — kanan: dark brown */}
      <div className="absolute inset-y-0 left-0 md:left-[280px] right-0 bg-gradient-to-b from-[#091716] to-[#182725]" />

      {/* Content — slides up from below */}
      <div
        ref={innerRef}
        className="relative z-10 h-full flex flex-col justify-center px-6 py-24 md:pr-16 md:pl-[280px] lg:pr-24 lg:pl-[320px] md:py-32"
        style={{
          opacity: 0,
          transform: 'translateY(60px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {/* Placeholder — replace with real content */}
        <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Next</p>
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">More Coming</h2>
      </div>
    </div>
  )
}

export default function ProjectContent() {
  return (
    <>
      <section
        id="project"
        className="relative w-full"
      >
      {/* Sticky bg — tetap di tempat saat content scroll */}
      <div className="sticky top-0 h-screen pointer-events-none" style={{ marginBottom: '-100vh' }}>
        <LeopardBg />
      </div>

      {/* Content sits above the sticky bg */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 py-24 md:pr-16 md:pl-[280px] lg:pr-24 lg:pl-[320px] md:py-32 pointer-events-none">

      {/* Heading */}
      <div className="mb-16">
        <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Selected Work</p>
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Projects
        </h2>
      </div>

      {/* Project list */}
      <div className="flex flex-col divide-y divide-white/20 pointer-events-auto">
        {projects.map((project, i) => {
          const isFeatured = 'featured' in project && project.featured

          /* ── Featured card — wide layout with phone mockup ── */
          if (isFeatured) {
            return (
              <div
                key={i}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 cursor-pointer"
              >
                {/* Left: text */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs text-white/40">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white group-hover:translate-x-2 transition-transform duration-300">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/60 max-w-md mb-4">{project.desc}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-white/40">{project.year}</span>
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-full border border-white/30 text-white/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: phone mockup */}
                <div className="w-36 md:w-44 shrink-0 mx-auto md:mx-0">
                  <PhoneMockup
                    bgSrc={'phoneBg' in project ? project.phoneBg : undefined}
                    className="drop-shadow-2xl"
                  >
                    {/* Phone screen content */}
                    <div className="relative w-full h-full bg-gradient-to-b from-[#0d1b2a] to-[#1b2838] overflow-hidden">
                      {/* Project screenshot fills the screen */}
                      {'phoneImage' in project && project.phoneImage && (
                        <Image
                          src={project.phoneImage}
                          alt={project.title}
                          fill
                          className="object-cover object-top opacity-70"
                          draggable={false}
                        />
                      )}

                      {/* LiquidGlass caption pinned to bottom */}
                      <div className="absolute bottom-4 left-2 right-2">
                        <LiquidGlass animated padding="p-3">
                          <p className="text-white font-semibold text-xs leading-tight">{project.title}</p>
                          <p className="text-white/60 text-[10px] mt-0.5">{project.tech.join(' · ')}</p>
                        </LiquidGlass>
                      </div>
                    </div>
                  </PhoneMockup>
                </div>
              </div>
            )
          }

          /* ── Regular minimal card ── */
          return (
            <div
              key={i}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 cursor-pointer"
            >
              {/* Left */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs text-white/40">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white group-hover:translate-x-2 transition-transform duration-300">
                    {project.title}
                  </h3>
                </div>
                <p className="text-sm text-white/60 max-w-lg">{project.desc}</p>
              </div>

              {/* Right */}
              <div className="flex flex-col items-start md:items-end gap-2">
                <span className="text-xs text-white/40">{project.year}</span>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded-full border border-white/30 text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      </div>{/* end z-10 wrapper */}
    </section>

      {/* Extra 100vh canvas section */}
      <ExtraCanvas 
      />
      
    </>
  )
}
