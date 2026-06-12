'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TitleHeading } from '../../components/TitleHeading'
import { ProjectCard } from '../../components/ProjectMockups'
import ContactSection from '../contact-section/ContactSection'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
    phoneBg: '/asset/experience-section/flower2.jpeg',
    mockupType: 'random' as const,
    overrideW: 'max-w-full w-full', 
    overrideH: 'aspect-[16/13]'
  },
  {
    title: 'Full Stack Engineer',
    desc: 'Developed scalable microservices and integrated payment gateways. Mentored junior engineers and conducted code reviews.',
    phoneBg: '/asset/experience-section/flower.jpeg',
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
        className="relative z-10 py-6 pr-6 lg:pl-[270px] md:py-6"
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
      <div className="relative z-10 py-16 pr-6 lg:pl-[270px] md:py-16">
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

export default function ExperienceSection() {
  const [isDark, setIsDark] = useState(false)
  
  // Ref untuk Animasi GSAP
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contactContainerRef = useRef<HTMLDivElement>(null)
  const bentoCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // GSAP ScrollTrigger Logic
  useEffect(() => {
    if (!wrapperRef.current || !contactContainerRef.current || !bentoCardRef.current) return;

    let ctx = gsap.context(() => {
      // Sekali sampai dasar halaman, kartu turun sendiri dengan durasi tetap —
      // tidak lagi mengikuti roda scroll (scrub) dan tanpa pin.
      // toggleActions: onEnter=play, onLeaveBack=reverse (scroll naik = kartu
      // kembali naik dengan animasi yang sama).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          // "bottom 110%" = terpicu saat sisa scroll tinggal 10vh. Tanpa pin,
          // titik di bawah "bottom bottom" tidak akan pernah tercapai — jangan
          // pakai persentase < 100% di sini.
          start: "bottom 110%",
          end: "bottom 105%",
          toggleActions: "play none none reverse",
        },
      });

      // Animasi 1: Tarik dari atas (y: -100%) ke tengah (y: 0)
      tl.to(contactContainerRef.current, {
        y: 0,
        duration: 1.5,
        ease: "power3.inOut",
      }, 0);

      // Animasi 2: Scale up untuk efek gap
      tl.to(bentoCardRef.current, {
        scale: 1,
        duration: 1.5,
        ease: "power3.inOut",
      }, 0);
    });

    return () => ctx.revert();
  }, []);

  const bgColor = isDark ? '#0d110f' : '#e6e4d8'

  return (
    // Tambahkan ref pada wrapper utama
    <div ref={wrapperRef} className="relative w-full transition-colors duration-300">
      
      {/* FIXED BACKGROUND IMAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0">
        <Image 
          src="/asset/experience-section/bg1.jpeg" 
          alt="Experience Background" 
          fill 
          sizes="100vw"
          quality={100}
          priority
          className="object-cover" 
        />
        <div/>
      </div>

      <div className="relative z-10 w-full" style={{ marginTop: '-100vh', paddingTop: '8rem' }}>
        <div className="mb-12 lg:pl-[320px] md:pl-[280px] px-6">
           <TitleHeading
              title="experience"
              subtitle="My professional journey and roles."
              className="mb-20 pt-20 text-white"
              titleClassName="text-4xl md:text-6xl"
              subtitleClassName="text-base md:text-lg mt-0 opacity-70"
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
      </div>

      {/* =========================================================
          THE DROP ANIMATION CONTAINER
          Trik overflow-hidden di sini menyembunyikan card sebelum ditarik
          ========================================================= */}
      <div className="absolute bottom-0 left-0 w-full h-screen overflow-hidden z-50 pointer-events-none">
        <div
          ref={contactContainerRef}
          className="w-full h-full flex items-center justify-center -translate-y-[100%] pointer-events-none"
        >
          {/* BENTO CARD AWAL — hanya kartu yang turun, tanpa dinding di belakangnya */}
          <div
            ref={bentoCardRef}
            className="pointer-events-auto w-[98vw] h-[96vh] bg-[#F5F0E6] dark:bg-[#1C1714] border border-[#b08d57]/40 dark:border-[#c9a227]/30 rounded-lg scale-[0.8] flex items-center justify-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)]"
          >
            <ContactSection />
          </div>
        </div>
      </div>

    </div>
  )
}