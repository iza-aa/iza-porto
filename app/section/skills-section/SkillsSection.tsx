'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion'
import TornEdge, { CANVAS_H, BASE_Y, tornNoiseStatic } from '../../components/tornedge2'
import { TitleHeading } from '../../components/TitleHeading'
import LiquidGlass from '../../components/LiquidGlass'

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
type SkillData = {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  description: string;
};

const skillsData: SkillData[] = [
  { id: 'react', name: 'React', category: 'Frontend', level: 92, icon: '/asset/skill-section/react.svg', description: 'UI Systems & State Management' },
  { id: 'next', name: 'Next.js', category: 'Fullstack', level: 88, icon: '/asset/skill-section/nextjs.svg', description: 'SSR, SSG & API Routes' },
  { id: 'js', name: 'JavaScript', category: 'Foundation', level: 90, icon: '/asset/skill-section/js.svg', description: 'ES6+, DOM manipulation' },
  { id: 'css', name: 'CSS3', category: 'Foundation', level: 95, icon: '/asset/skill-section/css.svg', description: 'Advanced layouts & animations' },
  { id: 'html', name: 'HTML5', category: 'Foundation', level: 95, icon: '/asset/skill-section/HTML5.svg', description: 'Semantic structure & accessibility' },
  { id: 'vue', name: 'Vue.js', category: 'Frontend', level: 80, icon: '/asset/skill-section/Vue.js.svg', description: 'Reactive components' },
  { id: 'angular', name: 'Angular', category: 'Frontend', level: 75, icon: '/asset/skill-section/Angular.svg', description: 'Enterprise applications' },
  { id: 'laravel', name: 'Laravel', category: 'Backend', level: 85, icon: '/asset/skill-section/Laravel.svg', description: 'MVC architecture & Eloquent' },
  { id: 'php', name: 'PHP', category: 'Backend', level: 80, icon: '/asset/skill-section/php.svg', description: 'Server-side processing' },
  { id: 'docker', name: 'Docker', category: 'DevOps', level: 75, icon: '/asset/skill-section/docker.svg', description: 'Containerization & CI/CD' },
  { id: 'swift', name: 'Swift', category: 'Mobile', level: 65, icon: '/asset/skill-section/Swift.svg', description: 'iOS native development' },
  { id: 'python', name: 'Python', category: 'Backend/AI', level: 70, icon: '/asset/skill-section/python.svg', description: 'Data processing & scripting' },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────────

const CircularProgress = ({ level, isDark }: { level: number, isDark: boolean }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="3" fill="none" />
        <motion.circle
          cx="22" cy="22" r={radius}
          stroke={isDark ? "#c7b99f" : "#8c6b45"}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-bold font-mono">{level}%</span>
    </div>
  )
}

const TechNode = ({
  skill, isHovered, isAnotherHovered, onHover, onLeave, isDark
}: {
  skill: SkillData, isHovered: boolean, isAnotherHovered: boolean, onHover: () => void, onLeave: () => void, isDark: boolean
}) => {
  const scale = isHovered ? 1.15 : 1;
  const filter = isHovered ? 'blur(0px)' : isAnotherHovered ? 'blur(4px)' : 'blur(2px)';
  const opacity = isHovered ? 1 : isAnotherHovered ? 0.3 : 0.6;
  const zIndex = isHovered ? 50 : 10;

  return (
    <motion.div
      className="relative flex items-center justify-center cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ zIndex }}
      animate={{ scale, filter, opacity }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className={`relative z-10 w-20 h-20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        {/* Background texture specific to each icon */}
        <img
          src="/asset/skill-section/techbg.png"
          alt="tech bg"
          className="absolute inset-0 w-full h-full object-contain -z-10 opacity-60 scale-150 mix-blend-multiply dark:mix-blend-lighten pointer-events-none"
        />
        <img
          src={skill.icon}
          alt={skill.name}
          className="w-12 h-12 object-contain filter drop-shadow-md pointer-events-none"
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
              animated={false}
            >
              <div className="flex items-center gap-4">
                <img src={skill.icon} alt={skill.name} className="w-12 h-12 object-contain drop-shadow-md shrink-0" />
                <div>
                  <h4 className="font-bold text-xl mb-1 tracking-tight leading-none">{skill.name}</h4>
                  <p className="text-xs opacity-80 leading-snug">{skill.description}</p>
                </div>
              </div>
            </LiquidGlass>

            {/* Circular Progress (Outside Right) */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="shrink-0 bg-white/5 backdrop-blur-md rounded-full p-2 border border-white/10 shadow-lg"
            >
              <CircularProgress level={skill.level} isDark={isDark} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── LAYERS ──────────────────────────────────────────────────────────────

const ArtGalleryLayer = ({ isDark }: { isDark: boolean }) => {
  const bgColor = isDark ? '#1a1612' : '#e6dfce'
  const textColor = isDark ? '#d4c4a8' : '#5c4738'
  const dotColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)'

  const rotations = useMemo(() => skillsData.map(() => Math.random() * 14 - 7), []);

  return (
    <div
      className="absolute inset-0 w-full h-full transition-colors duration-300"
      style={{
        backgroundColor: bgColor,
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }}
    >
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col px-8 md:px-16 pt-24">
        <div className="mb-12 opacity-70">
          <h2 className="text-4xl md:text-6xl font-serif italic mb-2 tracking-wide" style={{ color: textColor }}>Gallery of Mastery</h2>
          <p className="text-lg md:text-xl font-serif" style={{ color: textColor }}>The art of crafting digital experiences.</p>
        </div>

        <div className="flex flex-wrap gap-12 items-center justify-start mt-8">
          {skillsData.map((skill, i) => (
            <div
              key={skill.id}
              className="relative w-24 h-28 bg-[#e6dfce] dark:bg-[#1f1a14] p-2 shadow-xl border border-[#b89f82] dark:border-[#5c4738] transition-transform duration-500"
              style={{ transform: `rotate(${rotations[i]}deg)` }}
            >
              <div className="w-full h-full border border-[#8c6b45]/30 bg-[#d4c4a8] dark:bg-[#2c241c] flex flex-col items-center justify-center opacity-80 shadow-inner overflow-hidden relative">
                <div className="absolute inset-0 bg-black/5 mix-blend-multiply"></div>
                <span className="font-serif italic text-[10px] text-[#8c6b45] px-1 text-center relative z-10 leading-tight">Art<br />Canvas</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AwakenedLayer = ({ isDark }: { isDark: boolean }) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const bgColor = isDark ? '#231e18' : '#f9f6f0';

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col px-8 md:px-16 pt-24">

        <div className="mb-12 pointer-events-none">
          <TitleHeading
            title="TECH NETWORK"
            subtitle="Worldwide connections."
            titleClassName="tracking-tight"
            subtitleClassName=""
          />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 mt-8 w-fit justify-items-center sm:justify-items-start">
          {skillsData.map(skill => (
            <TechNode
              key={skill.id}
              skill={skill}
              isHovered={hoveredSkill === skill.id}
              isAnotherHovered={hoveredSkill !== null && hoveredSkill !== skill.id}
              onHover={() => setHoveredSkill(skill.id)}
              onLeave={() => setHoveredSkill(null)}
              isDark={isDark}
            />
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
    setSliderPos(latest * 100)
  })

  if (!isVisible) return null

  const nx = sliderPos / 100
  const waveY = BASE_Y + tornNoiseStatic(nx)
  const extensionHeight = CANVAS_H - waveY

  const lineColor = isDark ? '#c7b99f' : '#8c6b45';

  return (
    <div id="skills" ref={containerRef} className="relative w-full h-[200vh]">

      {/* ─── 1. TORN EDGE 2 LAPIS ─── */}
      <div className="absolute top-0 w-full z-20 pointer-events-none">
        {/* Lapis Dasar (Art Gallery) */}
        <TornEdge color={isDark ? "#1a1612" : "#e6dfce"} showGlow={false} />

        {/* Lapis Atas (Node Graph) */}
        <TornEdge
          color={isDark ? "#231e18" : "#f9f6f0"}
          showGlow={false}
          clipPath={`polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`}
        />
      </div>

      {/* ─── 2. KONTEN STICKY UTAMA ─── */}
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
      <div className="sticky top-0 w-full h-screen z-30 overflow-hidden">

        {/* Layer 1: Art Gallery / Canvas Placeholders */}
        <ArtGalleryLayer isDark={isDark} />

        {/* Layer 2: Awakened Tech Universe */}
        <div
          className="absolute inset-0 z-10 select-none pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
            willChange: 'clip-path'
          }}
        >
          <AwakenedLayer isDark={isDark} />
        </div>

        {/* ─── GARIS VERTIKAL & EKSTENSI DINAMIS ─── */}
        {/* The line fades out when slider reaches 100% */}
        <div
          className={`absolute top-0 bottom-0 z-40 w-[2px] pointer-events-none transition-opacity duration-300 ${sliderPos >= 100 ? 'opacity-0' : 'opacity-100'}`}
          style={{
            left: `${sliderPos}%`,
            backgroundColor: lineColor,
            boxShadow: `0 0 15px ${isDark ? 'rgba(199,185,159,0.5)' : 'rgba(140,107,69,0.5)'}`
          }}
        >
          <div
            className="absolute bottom-full left-0 w-full"
            style={{ height: `${extensionHeight}px`, backgroundColor: lineColor }}
          />

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 border-2 flex items-center justify-center rounded-sm"
            style={{
              backgroundColor: isDark ? '#1a1612' : '#e6dfce',
              borderColor: lineColor,
              boxShadow: `0 0 10px ${isDark ? 'rgba(199,185,159,0.3)' : 'rgba(140,107,69,0.3)'}`
            }}
          >
            <div className="flex gap-[3px]">
              <div className="w-[2px] h-4" style={{ backgroundColor: lineColor }}></div>
              <div className="w-[2px] h-4" style={{ backgroundColor: lineColor }}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SkillsSection