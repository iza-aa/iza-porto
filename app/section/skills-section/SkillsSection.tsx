'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
// IMPORT RUMUS DARI TORN EDGE
import TornEdge, { CANVAS_H, BASE_Y, tornNoiseStatic } from '../../components/tornedge2' 

// ─── DATA SKILLS ──────────────────────────────────────────────────────────────
interface Skill {
  name: string
  category: string
  level: number
}

const skillsData: Skill[] = [
  { name: 'React', category: 'Frontend', level: 90 },
  { name: 'Next.js', category: 'Frontend', level: 85 },
  { name: 'TypeScript', category: 'Frontend', level: 80 },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90 },
  { name: 'Node.js', category: 'Backend', level: 75 },
  { name: 'PostgreSQL', category: 'Backend', level: 65 },
  { name: 'Git', category: 'Tools', level: 85 },
  { name: 'Figma', category: 'Tools', level: 75 },
]

// ─── KOMPONEN LAYER MODERN (PUTIH) ──────────────────────────────────────────
const ModernLayer = () => (
  <div className="absolute inset-0 bg-[#fafafa] dark:bg-[#1a1209] text-zinc-900 dark:text-zinc-100 w-full h-full flex flex-col justify-center px-8 md:px-16 pt-20 transition-colors duration-300">
    <div className="max-w-6xl mx-auto w-full">
      <h2 className="text-4xl md:text-6xl font-bold font-sans tracking-tight mb-2">
        Skills & Expertise
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-sans mb-12 transition-colors duration-300">
        Modern tech stack mapped for scalable solutions.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {skillsData.map((skill, i) => (
          <div key={i} className="bg-white dark:bg-[#241508] border border-gray-200 dark:border-[#2e1f0e] rounded-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:border-[#8a7560]">
            <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold uppercase tracking-wider mb-2">{skill.category}</p>
            <h3 className="text-xl font-bold font-sans mb-4 text-zinc-900 dark:text-zinc-100">{skill.name}</h3>
            <div className="w-full bg-gray-100 dark:bg-[#2e1f0e] h-1.5 rounded-full overflow-hidden">
              <div className="bg-zinc-800 dark:bg-[#e6dfce] h-full rounded-full transition-colors duration-300" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// ─── KOMPONEN LAYER RENAISSANCE (KLASIK) ────────────────────────────────────
const RenaissanceLayer = ({ isDark }: { isDark: boolean }) => {
  const bgColor = isDark ? '#1f1a14' : '#e6dfce'
  const dotColor = isDark ? '#14100c' : '#c7b99f'
  const textColor = isDark ? '#d4c4a8' : '#2c1e16'
  const cardBg = isDark ? 'rgba(38, 32, 26, 0.6)' : 'rgba(240, 234, 221, 0.6)'
  const borderColor = isDark ? '#5c4738' : '#9e866b'
  const categoryColor = isDark ? '#a68b6c' : '#8c6b45'
  const titleColor = isDark ? '#e6dfce' : '#5c4738'

  return (
    <div 
      className="absolute inset-0 w-full h-full flex flex-col justify-center px-8 md:px-16 pt-20 transition-colors duration-300"
      style={{
        backgroundColor: bgColor, 
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`, 
        backgroundSize: '24px 24px',
        color: textColor 
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-6xl font-serif italic mb-2 tracking-wide transition-colors duration-300" style={{ color: titleColor }}>
          The Arts & Sciences
        </h2>
        <p className="text-lg md:text-xl font-serif mb-12 transition-colors duration-300" style={{ color: titleColor }}>
          A catalog of crafted disciplines and scholarly instruments.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skillsData.map((skill, i) => (
            <div key={i} className="border-2 border-double p-5 relative group transition-colors duration-300" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l opacity-40 transition-colors duration-300" style={{ borderColor: textColor }}></div>
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r opacity-40 transition-colors duration-300" style={{ borderColor: textColor }}></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l opacity-40 transition-colors duration-300" style={{ borderColor: textColor }}></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r opacity-40 transition-colors duration-300" style={{ borderColor: textColor }}></div>

              <p className="text-xs font-serif uppercase tracking-[0.2em] mb-2 transition-colors duration-300" style={{ color: categoryColor }}>{skill.category}</p>
              <h3 className="text-xl font-serif font-semibold mb-4 transition-colors duration-300" style={{ color: textColor }}>{skill.name}</h3>
              
              <div className="w-full border-b border-dashed relative transition-colors duration-300" style={{ borderColor: textColor }}>
                <div 
                  className="absolute top-0 left-0 h-[2px] -mt-[1px] transition-colors duration-300" 
                  style={{ width: `${skill.level}%`, backgroundColor: textColor }} 
                />
              </div>
              <p className="text-right text-[10px] font-serif mt-2 italic opacity-70 transition-colors duration-300" style={{ color: textColor }}>Vol. {skill.level}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
interface SkillsSectionProps {
  isVisible?: boolean
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ isVisible = true }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [sliderPos, setSliderPos] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 120%', 'end end']
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isDragging) {
      setSliderPos(latest * 100)
    }
  })

  if (!isVisible) return null

  // --- HITUNG PRESISI TINGGI GARIS EKSTENSI ---
  const nx = sliderPos / 100 
  const waveY = BASE_Y + tornNoiseStatic(nx) 
  const extensionHeight = CANVAS_H - waveY 

  return (
    <div id="skills" ref={containerRef} className="relative w-full h-[200vh]">
      
      {/* ─── 1. TORN EDGE 2 LAPIS ─── */}
      <div className="absolute top-0 w-full z-20 pointer-events-none">
        {/* Lapis Putih (Modern) */}
        <TornEdge color={isDark ? "#1a1209" : "#fafafa"} showGlow={false} /> 

        {/* Lapis Krem (Renaissance) */}
        <TornEdge 
          color={isDark ? "#1f1a14" : "#e6dfce"} 
          showGlow={false} 
          clipPath={`polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`} 
        />
      </div>

      {/* ─── 2. KONTEN STICKY UTAMA ─── */}
      <div className="sticky top-0 w-full h-screen z-30">
        
        {/* Layer 1: Modern */}
        <ModernLayer />

        {/* Layer 2: Renaissance */}
        <div 
          className="absolute inset-0 z-10 select-none pointer-events-none"
          style={{ 
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
            willChange: 'clip-path'
          }}
        >
          <RenaissanceLayer isDark={isDark} />
        </div>

        {/* Input untuk kontrol manual garis */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchEnd={() => setIsDragging(false)}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-ew-resize m-0 touch-pan-y"
        />

        {/* ─── GARIS VERTIKAL & EKSTENSI DINAMIS ─── */}
        <div 
          className="absolute top-0 bottom-0 z-30 w-[2px] bg-zinc-900 shadow-[0_0_10px_rgba(0,0,0,0.3)] pointer-events-none"
          style={{ left: `${sliderPos}%`, transition: 'none' }}
        >
          {/* Ekstensi garis menembak ke atas dengan tinggi sesuai lekukan ombak */}
          <div 
            className="absolute bottom-full left-0 w-full bg-zinc-900" 
            style={{ height: `${extensionHeight}px` }} 
          />

          {/* Kotak Handle di tengah garis */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-zinc-900 border-2 border-white flex items-center justify-center rounded-sm">
            <div className="flex gap-[3px]">
              <div className="w-[2px] h-4 bg-white/60"></div>
              <div className="w-[2px] h-4 bg-white/60"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SkillsSection