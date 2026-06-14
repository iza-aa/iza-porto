'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TitleHeading } from '../../components/TitleHeading'
import LiquidGlass from '../../components/LiquidGlass'
import SkillWebGLBackground from './SkillWebGLBackground'


const LOCAL_EMOJIS = [
  'call-me-hand_1f919.png',
  'cold-face_1f976.png',
  'face-in-clouds_1f636-200d-1f32b-fe0f.png',
  'fire_1f525.png',
  'grinning-face-with-smiling-eyes_1f604.png',
  'hear-no-evil-monkey_1f649.png',
  'smiling-face-with-horns_1f608.png',
  'waving-hand_1f44b.png'
];

// ─── DATA SKILLS ──────────────────────────────────────────────────────────────
type SkillTier = 'Junior' | 'Senior' | 'Expert'

type SkillData = {
  id: string;
  name: string;
  category: string;
  tier: SkillTier;
  icon: string;
  description: string;
  pos: { x: number, y: number };
  defaultBlur?: boolean;
  nodeIcon?: string;
};

const skillsData: SkillData[] = [
  { id: 'react', name: 'React', category: 'Frontend', tier: 'Expert', icon: '/asset/skill-section/react.svg', description: 'UI Systems & State Management', pos: { x: 15, y: 15 } },
  { id: 'next', name: 'Next.js', category: 'Fullstack', tier: 'Senior', icon: '/asset/skill-section/nextjs.svg', description: 'SSR, SSG & API Routes', pos: { x: 40, y: 10 }, defaultBlur: true },
  { id: 'js', name: 'JavaScript', category: 'Foundation', tier: 'Expert', icon: '/asset/skill-section/js.svg', description: 'ES6+, DOM manipulation', pos: { x: 75, y: 20 } },
  { id: 'css', name: 'CSS3', category: 'Foundation', tier: 'Expert', icon: '/asset/skill-section/css.svg', description: 'Advanced layouts & animations', pos: { x: 10, y: 50 }, defaultBlur: true, nodeIcon: '/asset/skill-section/csshover.png' },
  { id: 'html', name: 'HTML5', category: 'Foundation', tier: 'Expert', icon: '/asset/skill-section/HTML5.svg', description: 'Semantic structure & accessibility', pos: { x: 35, y: 40 }, nodeIcon: '/asset/skill-section/htmlhover.png' },
  { id: 'vue', name: 'Vue.js', category: 'Frontend', tier: 'Senior', icon: '/asset/skill-section/Vue.js.svg', description: 'Reactive components', pos: { x: 60, y: 55 }, defaultBlur: true },
  { id: 'angular', name: 'Angular', category: 'Frontend', tier: 'Junior', icon: '/asset/skill-section/Angular.svg', description: 'Enterprise applications', pos: { x: 85, y: 40 } },
  { id: 'laravel', name: 'Laravel', category: 'Backend', tier: 'Senior', icon: '/asset/skill-section/Laravel.svg', description: 'MVC architecture & Eloquent', pos: { x: 20, y: 85 }, defaultBlur: true },
  { id: 'php', name: 'PHP', category: 'Backend', tier: 'Junior', icon: '/asset/skill-section/php.svg', description: 'Server-side processing', pos: { x: 45, y: 75 } },
  { id: 'docker', name: 'Docker', category: 'DevOps', tier: 'Junior', icon: '/asset/skill-section/docker.svg', description: 'Containerization & CI/CD', pos: { x: 70, y: 85 }, defaultBlur: true },
  { id: 'swift', name: 'Swift', category: 'Mobile', tier: 'Junior', icon: '/asset/skill-section/Swift.svg', description: 'iOS native development', pos: { x: 90, y: 70 }, nodeIcon: '/asset/skill-section/swifthover.png' },
  { id: 'python', name: 'Python', category: 'Backend/AI', tier: 'Junior', icon: '/asset/skill-section/python.svg', description: 'Data processing & scripting', pos: { x: 50, y: 30 }, defaultBlur: true },
];

// Tier badge palette — Expert = bright gold, Senior = muted gold, Junior = bronze
const TIER_STYLE: Record<SkillTier, { label: string; color: string; bg: string }> = {
  Expert: { label: 'EXPERT', color: '#f2d98b', bg: 'rgba(201,162,39,0.22)' },
  Senior: { label: 'SENIOR', color: '#d8c08a', bg: 'rgba(176,141,87,0.20)' },
  Junior: { label: 'JUNIOR', color: '#b89f82', bg: 'rgba(120,100,70,0.20)' },
}

// Two-column description pairs below the network card (same shape as the
// project ConvinceLayer feature pairs).
const SKILL_FEATURES: { title: string; desc: string }[][] = [
  [
    { title: 'Frontend Craft', desc: 'React, Next.js, Vue & Angular for interfaces that stay clear under complexity.' },
    { title: 'Strong Foundations', desc: 'Expert-level HTML, CSS & JavaScript underpinning every build.' },
  ],
  [
    { title: 'Backend & Data', desc: 'Laravel, PHP and Python for reliable server-side logic and processing.' },
    { title: 'Tooling & Delivery', desc: 'Docker and modern workflows to ship and scale with confidence.' },
  ],
]

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────────

const TierBadge = ({ tier }: { tier: SkillTier }) => {
  const t = TIER_STYLE[tier]
  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-sm border px-3 py-2"
      style={{ color: t.color, backgroundColor: t.bg, borderColor: t.color + '55' }}
    >
      <span className="font-inknut-antiqua text-[11px] font-bold tracking-[0.22em] whitespace-nowrap">
        {t.label}
      </span>
    </div>
  )
}

const TechNode = ({
  skill, isHovered, isAnotherHovered, hoveredSkillPos, onHover, onLeave, isDark
}: {
  skill: SkillData, isHovered: boolean, isAnotherHovered: boolean, hoveredSkillPos: { x: number, y: number } | null, onHover: () => void, onLeave: () => void, isDark: boolean
}) => {
  const scale = isHovered ? 1.15 : 1;
  const filter = isHovered ? 'blur(0px)' : isAnotherHovered ? 'blur(3px)' : skill.defaultBlur ? 'blur(2px)' : 'blur(0px)';
  const opacity = isHovered ? 1 : isAnotherHovered ? 0.3 : skill.defaultBlur ? 0.5 : 0.8;
  const zIndex = isHovered ? 50 : 10;

  // Repulsion logic
  let repulseX = 0;
  let repulseY = 0;
  if (isAnotherHovered && hoveredSkillPos) {
    const dx = skill.pos.x - hoveredSkillPos.x;
    const dy = skill.pos.y - hoveredSkillPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Repel distance radius (percentage based, roughly 25%)
    if (dist > 0 && dist < 25) {
      const force = (25 - dist) / 25; // 0 to 1
      const strength = 120; // max px to move
      repulseX = (dx / dist) * force * strength;
      repulseY = (dy / dist) * force * strength;
    }
  }

  return (
    <div
      className="absolute w-20 h-20 ml-3"
      style={{ left: `${skill.pos.x}%`, top: `${skill.pos.y}%`, zIndex }}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        initial={{ x: '-50%', y: '-50%' }}
        animate={{ scale, filter, opacity, x: `calc(-50% + ${repulseX}px)`, y: `calc(-50% + ${repulseY}px)` }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className={`relative z-10 w-20 h-20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          {/* Background texture removed as requested */}
          {/* eslint-disable-next-line @next/next/no-img-element -- small SVG icon inside physics-animated node; next/image breaks tuned sizing */}
          <img
            src={skill.nodeIcon || skill.icon}
            alt={skill.name}
            className={`object-contain filter drop-shadow-md pointer-events-none ${skill.nodeIcon ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 md:w-32 max-w-none z-20' : 'w-12 h-12'}`}
          />
        </div>

        {/* Pop-up Emojis (Pure CSS Animation) */}
        <AnimatePresence>
          {isHovered && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex justify-center z-50 pointer-events-none w-full">
              {Array.from({ length: 2 }).map((_, i) => {
                const charCodeSum = skill.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
                const emojiIndex = (charCodeSum + i) % LOCAL_EMOJIS.length;
                const emojiFilename = LOCAL_EMOJIS[emojiIndex];

                return (
                  // eslint-disable-next-line @next/next/no-img-element -- tiny emoji PNG driven by CSS fly animation
                  <img
                    key={`emoji-${i}`}
                    src={`/asset/skill-section/emojis/${emojiFilename}`}
                    className={`w-10 h-10 drop-shadow-xl absolute opacity-0 ${i === 0 ? 'emoji-fly-0' : 'emoji-fly-1'}`}
                    alt="emoji"
                  />
                )
              })}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, originX: 0, originY: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute top-1 left-1 z-50 pointer-events-none flex items-center gap-4"
            >
              {/* Dark Sharp Card */}
              <LiquidGlass
                padding="p-3"
                className={`w-64 !rounded-none border shadow-2xl shrink-0 ${isDark ? '!bg-[#1a1612] !border-[#3a2e24] !text-[#e6dfce]' : '!bg-[#2c241c] !border-[#1a1612] !text-[#f0eae1]'}`}
                variant="navbar"
                animated={true}
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- small SVG icon in hover card */}
                  <img src={skill.icon} alt={skill.name} className="w-12 h-12 object-contain drop-shadow-md shrink-0" />
                  <div>
                    <h4 className="font-bold text-xl mb-1 tracking-tight leading-none">{skill.name}</h4>
                    <p className="text-xs opacity-80 leading-snug">{skill.description}</p>
                  </div>
                </div>
              </LiquidGlass>

              {/* Tier badge (Outside Right) */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              >
                <TierBadge tier={skill.tier} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ─── LAYERS ──────────────────────────────────────────────────────────────

// Network graph of skill nodes — lives inside the content card.
const SkillNetwork = ({ isDark }: { isDark: boolean }) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const hoveredData = skillsData.find(s => s.id === hoveredSkill);
  const hoveredSkillPos = hoveredData ? hoveredData.pos : null;

  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[560px]">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative art positioned by percentage transforms */}
      <img
        src="/asset/skill-section/background.png"
        alt=""
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] max-w-none object-contain opacity-70 pointer-events-none z-0"
      />

      {skillsData.map(skill => (
        <TechNode
          key={skill.id}
          skill={skill}
          isHovered={hoveredSkill === skill.id}
          isAnotherHovered={hoveredSkill !== null && hoveredSkill !== skill.id}
          hoveredSkillPos={hoveredSkillPos}
          onHover={() => setHoveredSkill(skill.id)}
          onLeave={() => setHoveredSkill(null)}
          isDark={isDark}
        />
      ))}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
interface SkillsSectionProps {
  isVisible?: boolean
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ isVisible = true }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  if (!isVisible) return null

  return (
    <section className="relative w-full bg-[#1b1309]">
      <SkillWebGLBackground />
      {/* Opaque atmospheric backdrop so the fixed hero stage never shows
          through — same leopard + grain language as the project section. */}
      <div aria-hidden className="hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative full-bleed backdrop */}
        <img
          src="/asset/project-section/projectbg/leopardbg.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-24 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3f3320]/82 via-[#1b1309]/88 to-[#120a04]/94" />
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{ backgroundImage: 'url("/asset/noise.png")', backgroundRepeat: 'repeat' }}
        />
      </div>
      <div className="relative ">
      <style>{`
        @keyframes emoji-waterfall {
          0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
          20% { opacity: 1; transform: translate(15px, -20px) scale(1.1); }
          80% { opacity: 1; transform: translate(-15px, -80px) scale(1); }
          100% { opacity: 0; transform: translate(0, -120px) scale(0.8); }
        }
        @keyframes emoji-waterfall-alt {
          0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
          20% { opacity: 1; transform: translate(-15px, -20px) scale(1.1); }
          80% { opacity: 1; transform: translate(15px, -80px) scale(1); }
          100% { opacity: 0; transform: translate(0, -120px) scale(0.8); }
        }
        .emoji-fly-0 { animation: emoji-waterfall 2.5s infinite ease-in-out; }
        .emoji-fly-1 { animation: emoji-waterfall-alt 2.8s infinite ease-in-out 0.4s; }
      `}</style>

      {/* Title — outside/above the card, identical to the project sections */}
      <div className="mb-12 px-6 pt-[6vh] md:pl-[280px] lg:pl-[320px]">
        <TitleHeading
          title="skills"
          subtitle="The capabilities behind the craft."
          className="text-white mb-10 pb-1"
          titleClassName="text-4xl md:text-6xl"
          subtitleClassName="text-base md:text-lg mt-0 text-white/70"
        />
      </div>

      {/* ── ExtraCanvas equivalent: solid card holding the node network ── */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e9ede6] to-[#dce2d8] dark:from-[#121814] dark:to-[#080c0a] ml-60" />
        <div
          aria-hidden
          className="absolute inset-0 z-30 pointer-events-none ml-60 transition-all duration-500"
          style={{
            backgroundImage: 'url("/asset/project-section/projectbg/paper.jpg")',
            backgroundRepeat: 'repeat', backgroundPosition: 'top left', backgroundSize: '600px',
            mixBlendMode: isDark ? 'soft-light' : 'multiply',
            filter: isDark ? 'invert(1) brightness(1.2) contrast(1.4)' : 'none',
            opacity: isDark ? 0.95 : 0.40,
            imageRendering: 'crisp-edges', transform: 'translateZ(0)',
          }}
        />
        <div className="relative z-10 py-6 pr-6 lg:pl-[270px] md:py-6">
          <SkillNetwork isDark={isDark} />
        </div>
      </div>

      {/* ── ConvinceLayer equivalent: description pairs below the card ── */}
      <div className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 ml-60 transition-colors duration-500"
          style={{ backgroundColor: isDark ? '#0d110f' : '#e6e4d8' }}
        />
        <div className="relative z-10 py-16 pr-6 lg:pl-[270px] md:py-16">
          <div className="grid grid-cols-1 gap-6 justify-start md:grid-cols-2">
            {SKILL_FEATURES.map((column, idx) => (
              <div key={idx} className="w-full max-w-full flex flex-col gap-10 pr-4">
                {column.map((feature, fIdx) => (
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
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}

export default SkillsSection
