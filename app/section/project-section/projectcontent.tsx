'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import LeopardBg from './components/LeopardBg'
import { SubTitle, TitleHeading } from '../../components/TitleHeading'
import { ProjectCard } from '../../components/ProjectMockups'

const IFRAME_W = 430
const IFRAME_H = 932
const SCROLL_PX = 900

function getColumnWidth(size: 'full' | 'half' | 'mac' | 'random' = 'full') {
  switch (size) {
    case 'half':
      return 'w-full max-w-[340px] sm:max-w-[400px] md:max-w-[460px] 2xl:max-w-[510px]'
    case 'mac':
      return 'w-full max-w-[340px] sm:max-w-[600px] md:max-w-[800px] 2xl:max-w-[1020px]'
    case 'random':
      return 'w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px] 2xl:max-w-[500px]'
    case 'full':
    default:
      return 'w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] 2xl:max-w-[380px]'
  }
}

function ScaledIframe({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  // Live iframe = a whole website running its own JS. Mount it only once the
  // card approaches the viewport, and pause the auto-scroll animation while
  // offscreen so it costs nothing when not visible.
  const [shouldMount, setShouldMount] = useState(false)
  const [inView, setInView] = useState(false)

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

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setShouldMount(true) // mount once, keep alive
      },
      { rootMargin: '300px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
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
        <div
          style={{
            animation: 'phone-auto-scroll 18s ease-in-out infinite',
            animationPlayState: inView ? 'running' : 'paused',
          }}
        >
          {shouldMount && (
            <iframe
              src={src}
              title={title}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              style={{
                border: 'none',
                width: IFRAME_W,
                height: IFRAME_H + SCROLL_PX,
                display: 'block',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>
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

// ─── DATA PROJECTS ───────────────────────────────────────────────────────────
const projectsBatch1 = [
  {
    title: 'Hidro',
    desc: 'Modern platform specializing in premium water and fluid solutions, combining efficiency, innovation, and reliability.',
    phoneBg: '/asset/project-section/projectbg/whiteyellow.jpeg',
    iframeUrl: 'https://hidro-phi.vercel.app',
    mockupType: 'full' as const,
    showHoverHint: true,
  },
  {
    title: 'iza Point of Sale',
    desc: 'Smart point-of-sale system with AI insights, integrated inventory and ordering, and secure role-based access control.',
    phoneImage: '/asset/project-section/projectbg/izapos.png',
    phoneBg: '/asset/project-section/projectbg/redcape.jpeg',
    mockupType: 'random' as const,
  },
  {
    title: "UII Management Information System",
    desc: "A network and data center asset management system with maintenance tracking and OCR for fast, accurate data capture.",
    phoneImage: "/asset/project-section/projectbg/uii.png",
    phoneBg: "/asset/project-section/projectbg/hall.jpeg",
    mockupType: "random" as const,
  },
]


// ─── KOMPONEN EXTRA CANVAS ────────────────────────────────────────────────────
function ExtraCanvas({ data, cols = 3 }: { data: any[], cols?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const inner = innerRef.current
    if (!inner) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inner.style.opacity = '1'
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#e9ede6] to-[#dce2d8] dark:from-[#121814] dark:to-[#080c0a] " />
      <div
        ref={innerRef}
        className="relative z-10 py-6 pr-6 pl-[240px] md:py-6"
        style={{
          opacity: 0,
          transform: 'translateY(60px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {/* FIX: Menghapus md:pr-24 agar tidak ada space kosong di kanan */}
        <div className={`grid grid-cols-1 gap-6 justify-start ${cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-[auto_auto_auto]'}`}>
          {data.map((project, i) => {
            const mockupType = project.mockupType || 'full'
            return (
              <ProjectCard
                key={i}
                size={mockupType}
                src={project.phoneBg}
                alt={`${project.title} background`}
                title={project.title}
                description={project.desc}
                className="group"
                overrideW={project.overrideW}
                overrideH={project.overrideH}
                showHoverHint={project.showHoverHint}
              >
                {project.iframeUrl ? (
                  <ScaledIframe src={project.iframeUrl} title={project.title} />
                ) : project.phoneImage ? (
                  <Image
                    src={project.phoneImage}
                    alt={project.title}
                    fill
                    className={mockupType === 'random' ? "object-contain p-6 md:p-10 drop-shadow-2xl" : "object-cover object-top opacity-90"}
                    draggable={false}
                  />
                ) : null}
              </ProjectCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── KOMPONEN CONVINCE LAYER ─────────────────────────────────────────────────
function ConvinceLayer({ isDark, data, features, cols = 3 }: { isDark: boolean; data: any[]; features: any[][], cols?: number }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#0d110f' : '#e6e4d8' }}
      />
      <div className="relative z-10 py-16 pr-6 pl-[240px] md:py-16">
        {/* FIX: Menghapus md:pr-24 agar sejajar dengan ExtraCanvas */}
        <div className={`grid grid-cols-1 gap-6 justify-start ${cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-[auto_auto_auto]'}`}>
          {data.map((project, idx) => {
            const mockupType = project.mockupType || 'full'
            const colWidthClass = project.overrideW
              ? `w-full ${project.overrideW}`
              : getColumnWidth(mockupType)

            const columnFeatures = features[idx] || []

            return (
              <div key={idx} className={`${colWidthClass} flex flex-col gap-10 pr-4`}>
                {columnFeatures.map((feature, fIdx) => (
                  <div key={fIdx} className="flex flex-col xl:flex-row gap-2 xl:gap-4 items-start pr-4">
                    <div className="w-full xl:w-[45%]">
                      <h4 className={`font-bold text-[15px] leading-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
                        {feature.title}
                      </h4>
                    </div>
                    <div className="w-full xl:w-[55%]">
                      <p className={`text-sm leading-relaxed font-medium transition-colors duration-500 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
interface ProjectContentProps {
  cinematicShell?: boolean
  skipIntro?: boolean
  skipFirstBatch?: boolean
}

export default function ProjectContent({
  cinematicShell = false,
  skipIntro = false,
  skipFirstBatch = false,
}: ProjectContentProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const featuresBatch1 = [
    [{ title: 'Seamless Integration', desc: 'Connects directly with your existing infrastructure.' }, { title: 'Zero downtime', desc: 'Move from third-party processors without interrupting checkout.' }],
    [{ title: 'AI-Powered Insights', desc: 'Automatically notifies administrators before bottlenecks occur.' }, { title: 'Streamlined onboarding', desc: 'Set up your workflow faster.' }],
    [{ title: 'Global Scalability', desc: 'Use our architecture in every market.' }, { title: 'Cross-border ready', desc: 'Accept payments across different global platforms.' }]
  ]


  return (
    <div className="relative w-full">
      {cinematicShell && !skipIntro && (
        <div className="absolute inset-x-0 top-0 h-[110vh] overflow-hidden pointer-events-none z-0">
          <LeopardBg />
        </div>
      )}

      {!cinematicShell && (
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0">
          <LeopardBg />
        </div>
      )}

      <div className="relative z-10 w-full" style={{ marginTop: cinematicShell ? 0 : '-90vh' }}>

        {!skipIntro && (
          <div className="pt-40 mb-12 pl-[240px] pointer-events-none">
            <TitleHeading
              title="project labs"
              subtitle="Standard 3-column architecture."
              className="text-white mb-20 pb-1"
              titleClassName="text-4xl md:text-6xl"
              subtitleClassName="text-base md:text-lg mt-0 text-white/70"
            />
          </div>
        )}

        {!skipFirstBatch && (
          <div className="relative w-full">
            <div className="absolute inset-0 z-30 pointer-events-none transition-all duration-500"
              style={{
                backgroundImage: 'url("/asset/project-section/projectbg/paper.jpg")',
                backgroundRepeat: 'repeat', backgroundPosition: 'top left', backgroundSize: '600px',
                mixBlendMode: isDark ? 'soft-light' : 'multiply',
                filter: isDark ? 'invert(1) brightness(1.2) contrast(1.4)' : 'none',
                opacity: isDark ? 0.95 : 0.40,
                imageRendering: 'crisp-edges', transform: 'translateZ(0)',
              }}
            />
            <ExtraCanvas data={projectsBatch1} cols={3} />
            <ConvinceLayer isDark={isDark} data={projectsBatch1} features={featuresBatch1} cols={3} />
          </div>
        )}

        {/* Space extra untuk memperlihatkan LeopardBg tanpa overlay paper */}
        <div className="w-full h-[20vh] pointer-events-none" />
      </div>
    </div>
  )
}
