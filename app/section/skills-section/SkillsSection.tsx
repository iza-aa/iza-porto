'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { LiquidGlass } from '../../components/LiquidGlass'

interface Skill {
  name: string
  category: 'Frontend' | 'Backend' | 'Tools' | 'Other'
  level: number // 0-100
  icon?: string
}

const skillsData: Skill[] = [
  // Frontend
  { name: 'React', category: 'Frontend', level: 90, icon: '⚛️' },
  { name: 'Next.js', category: 'Frontend', level: 85, icon: '▲' },
  { name: 'TypeScript', category: 'Frontend', level: 80, icon: '📘' },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90, icon: '🎨' },
  { name: 'Three.js', category: 'Frontend', level: 70, icon: '🎭' },
  { name: 'Framer Motion', category: 'Frontend', level: 85, icon: '✨' },
  // Backend
  { name: 'Node.js', category: 'Backend', level: 75, icon: '📦' },
  { name: 'Python', category: 'Backend', level: 70, icon: '🐍' },
  { name: 'PostgreSQL', category: 'Backend', level: 65, icon: '🗄️' },
  { name: 'API Design', category: 'Backend', level: 80, icon: '🔌' },
  // Tools
  { name: 'Git', category: 'Tools', level: 85, icon: '🔧' },
  { name: 'Docker', category: 'Tools', level: 60, icon: '🐳' },
  { name: 'AWS', category: 'Tools', level: 55, icon: '☁️' },
  { name: 'Figma', category: 'Tools', level: 75, icon: '🖌️' },
]

const categoryColors = {
  Frontend: 'from-cyan-400 to-blue-500',
  Backend: 'from-purple-400 to-pink-500',
  Tools: 'from-green-400 to-emerald-500',
  Other: 'from-orange-400 to-amber-500',
}

const categoryBorderColors = {
  Frontend: 'border-cyan-400/50',
  Backend: 'border-purple-400/50',
  Tools: 'border-green-400/50',
  Other: 'border-orange-400/50',
}

interface SkillCardProps {
  skill: Skill
  index: number
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="group"
    >
      <LiquidGlass padding="p-4" variant="default">
        <div className={`relative overflow-hidden rounded-lg border ${categoryBorderColors[skill.category]} transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}>
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-white/70">{skill.category}</span>
            <span className="text-xl">{skill.icon}</span>
          </div>

          {/* Skill Name */}
          <h3 className="text-lg font-semibold text-white mb-3">{skill.name}</h3>

          {/* Progress Bar Container */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            {/* Animated Progress Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${skill.level}%` } : {}}
              transition={{
                duration: 1,
                delay: index * 0.05 + 0.3,
                ease: [0.23, 1, 0.32, 1],
              }}
              className={`h-full bg-gradient-to-r ${categoryColors[skill.category]} rounded-full`}
            />
          </div>

          {/* Level Percentage */}
          <div className="flex justify-end mt-2">
            <span className="text-xs text-white/60 font-mono">{skill.level}%</span>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </LiquidGlass>
    </motion.div>
  )
}

interface SkillsSectionProps {
  isVisible: boolean
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ isVisible }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Group skills by category
  const groupedSkills = {
    Frontend: skillsData.filter((s) => s.category === 'Frontend'),
    Backend: skillsData.filter((s) => s.category === 'Backend'),
    Tools: skillsData.filter((s) => s.category === 'Tools'),
  }

  if (!isVisible) return null

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 px-4 md:px-8 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      }}
    >
      {/* Background Texture/Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Skills & Expertise
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {skillsData.map((skill, index) => (
            <SkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 flex justify-center"
        >
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}

export default SkillsSection
