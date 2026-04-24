'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import LeopardBg from './components/LeopardBg'
import { SubTitle, TitleHeading } from '../../components/TitleHeading'
import { ProjectCard } from '../../components/ProjectMockups'

const IFRAME_W  = 430
const IFRAME_H  = 932
/** Extra pixels the iframe renders below the fold so scroll animation has content */
const SCROLL_PX = 900

/**
 * Renders an iframe at 430×(IFRAME_H+SCROLL_PX), scales it to fill the container,
 * blocks all pointer interaction, and auto-scrolls down then back in a loop.
 */
function ScaledIframe({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      setScale(Math.min(width / IFRAME_W, height / IFRAME_H))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* scale wrapper */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: IFRAME_W,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}
      >
        {/* scroll animation wrapper — moves the iframe upward */}
        <div style={{ animation: 'phone-auto-scroll 18s ease-in-out infinite' }}>
          <iframe
            src={src}
            title={title}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            style={{
              border: 'none',
              width: IFRAME_W,
              /* tall enough to contain scrolled content */
              height: IFRAME_H + SCROLL_PX,
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* keyframes defined once per render — harmless duplicate in dev HMR */}
      <style>{`
        @keyframes phone-auto-scroll {
          0%,  8%  { transform: translateY(0px); }
          42%, 58% { transform: translateY(-${SCROLL_PX}px); }
          92%, 100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  )
}

const projects = [
  {
    title: 'Hidro',
    desc: 'Modern platform specializing in premium water and fluid solutions, combining efficiency, innovation, and reliability.',
    year: '2026',
    /** Image shown inside the phone mockup (fallback when no iframeUrl) */
    phoneImage: '',
    /** Atmospheric background for the phone screen */
    phoneBg: '/asset/project-section/projectbg/whiteyellow.jpeg',
    /** Live site shown in an iframe inside the phone */
    iframeUrl: 'https://hidro-phi.vercel.app',
    featured: true,
    mockupType: 'full' as const,
  },
  {
    title: 'iza Point of Sale',
    desc: 'Smart point-of-sale system with AI insights, integrated inventory and ordering, and secure role-based access control.',
    year: '2025',
    phoneImage: '/asset/project-section/projectbg/IZA-POS.png',
    phoneBg: '/asset/project-section/projectbg/redcape.jpeg',
    mockupType: 'random' as const,
  },
{
  title: "UII Management Information System",
  desc: "A network and data center asset management system with maintenance tracking and OCR for fast, accurate data capture.",
  year: "2026",
  phoneImage: "/asset/project-section/projectbg/uii.png",
  phoneBg: "/asset/project-section/projectbg/hall.jpeg",
  mockupType: "random" as const,
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
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Dark bg gradient */}
      <div className="absolute inset-0 bg-[#DDDDD1] ml-60" />

      {/* Content — slides up from below */}
      <div
        ref={innerRef}
        className="relative z-10 py-6 md:pr-6 lg:pl-[270px] md:py-6"
        style={{
          opacity: 0,
          transform: 'translateY(60px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {/* 2-Columns Project Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_auto_auto] justify-start">
          {projects.map((project, i) => {
            const mockupType = 'mockupType' in project ? project.mockupType : 'full'

            return (
              <ProjectCard
                key={i}
                size={mockupType}
                src={project.phoneBg}
                alt={`${project.title} background`}
                title={project.title}
                description={project.desc}
                className="group"
              >
                {'iframeUrl' in project && project.iframeUrl ? (
                  <ScaledIframe src={project.iframeUrl} title={project.title} />
                ) : 'phoneImage' in project && project.phoneImage ? (
                  mockupType === 'random' ? (
                    <Image
                      src={project.phoneImage}
                      alt={project.title}
                      width={450}
                      height={550}
                      className="object-contain"
                      draggable={false}
                    />
                  ) : (
                    <Image
                      src={project.phoneImage}
                      alt={project.title}
                      fill
                      className="object-cover object-top opacity-90"
                      draggable={false}
                    />
                  )
                ) : null}
              </ProjectCard>
            )
          })}
        </div>
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
      <div className="mb-12">
        <TitleHeading
          title="project labs"
          subtitle="Projects centered on application development, robust system design, and scalable, high-performance architecture, with an emphasis on efficiency, maintainability, and seamless user experience."
          className="text-white line-height-0"
          titleClassName="text-4xl md:text-6xl"
          subtitleClassName="text-base md:text-lg mt-0 text-white/70"
        />
      </div>

      </div>{/* end z-10 wrapper */}
    </section>

      {/* Extra 100vh canvas section (Tidak diubah, untuk Next Col BG) */}
      <ExtraCanvas/>
      
    </>
  )
}