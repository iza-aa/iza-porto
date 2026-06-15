'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { TitleHeading } from '../../components/TitleHeading'
import { ProjectCard } from '../../components/ProjectMockups'
import FinaleUnlock from './components/FinaleUnlock'

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

const experienceData = [
  {
    title: 'Senior Frontend Developer',
    desc: 'Led a team of developers to build robust web applications. Implemented new architecture, improving performance by 40%.',
    phoneBg: '/asset/project-section/projectbg/newprojectbg/iklas-fjTNGAq2tVY-unsplash.jpg',
    mockupType: 'random' as const,
    overrideW: 'max-w-full w-full', 
    overrideH: 'aspect-[16/13]'
  },
  {
    title: 'Full Stack Engineer',
    desc: 'Developed scalable microservices and integrated payment gateways. Mentored junior engineers and conducted code reviews.',
    phoneBg: '/asset/project-section/projectbg/newprojectbg/ziming-zhang-0XWOWsRdlb8-unsplash.jpg',
    mockupType: 'random' as const,
    overrideW: 'max-w-full w-full', 
    overrideH: 'aspect-[16/13]'
  },
]

const experienceFeatures = [
  [{ title: 'Leadership', desc: 'Managed cross-functional teams and guided technical direction.' }, { title: 'Architecture', desc: 'Designed highly scalable micro-frontends.' }],
  [{ title: 'Microservices', desc: 'Built resilient backend services with Docker and Kubernetes.' }, { title: 'Mentorship', desc: 'Conducted code reviews and paired programming sessions.' }]
]

function ExtraCanvas({ data, cols = 3 }: { data: any[], cols?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef     = useRef<HTMLDivElement>(null)

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
      <div className="absolute inset-0 bg-gradient-to-b from-[#e9ede6] to-[#dce2d8] dark:from-[#121814] dark:to-[#080c0a] ml-60" />
      <div
        ref={innerRef}
        className="relative z-10 py-6 pr-6 pl-[270px] md:py-6"
        style={{
          opacity: 0,
          transform: 'translateY(60px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
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
              >
                {project.phoneImage ? (
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

function ConvinceLayer({ isDark, data, features, cols = 3 }: { isDark: boolean; data: any[]; features: any[][], cols?: number }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 ml-60 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#0d110f' : '#e6e4d8' }}
      />
      <div className="relative z-10 py-16 pr-6 pl-[270px] md:py-16">
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

export default function ExperienceSection({
  contactTitleRef,
}: {
  contactTitleRef?: (el: HTMLElement | null) => void
}) {
  const [isDark, setIsDark] = useState(false)
  
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    // Background is the shared WebGL backdrop in HeroSection, so this section
    // stays transparent and lets the living canvas show through.
    <div ref={wrapperRef} className="relative w-full transition-colors duration-300">
      <div className="relative z-10 w-full" >
        <div className="mb-12 pt-12 md:pt-20 md:pb-2 pl-[240px]">
           <TitleHeading
              title="experience"
              subtitle="My professional journey and roles."
              className="text-white"
              titleClassName="text-2xl pt-[42vh]"
              subtitleClassName="text-xl md:text-2xl mt-0 text-white/70"
            />
        </div>

        <div className="relative w-full">
          <div className="absolute inset-0 z-30 pointer-events-none ml-60 transition-all duration-500"
            style={{
              backgroundImage: 'url("/asset/project-section/projectbg/paper.jpg")',
              backgroundRepeat: 'repeat', backgroundPosition: 'top left', backgroundSize: '600px', 
              mixBlendMode: isDark ? 'soft-light' : 'multiply',
              filter: isDark ? 'invert(1) brightness(1.2) contrast(1.4)' : 'none',
              opacity: isDark ? 0.95 : 0.40,               
              imageRendering: 'crisp-edges', transform: 'translateZ(0)', 
            }}
          />
          <ExtraCanvas data={experienceData} cols={2} />
          <ConvinceLayer isDark={isDark} data={experienceData} features={experienceFeatures} cols={2} />
        </div>

        {/* ── THE FINALE — closing "wow": plaque button → gallery darkens →
            (3D lock → signature → contact catalogue). Replaces the old bento
            drop. In normal flow so it sits as the final full-stop of the page. ── */}
        <FinaleUnlock titleRef={contactTitleRef} />
      </div>
    </div>
  )
}
