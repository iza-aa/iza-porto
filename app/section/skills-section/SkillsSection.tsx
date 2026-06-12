'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion'
import TornEdge, { CANVAS_H, BASE_Y, tornNoiseStatic } from '../../components/tornedge2'
import { TitleHeading } from '../../components/TitleHeading'
import LiquidGlass from '../../components/LiquidGlass'
import TornEdgeInverted from '../../components/tornedge-inverted'


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
  pos: { x: number, y: number };
  defaultBlur?: boolean;
  nodeIcon?: string;
};

const skillsData: SkillData[] = [
  { id: 'react', name: 'React', category: 'Frontend', level: 92, icon: '/asset/skill-section/react.svg', description: 'UI Systems & State Management', pos: { x: 15, y: 15 } },
  { id: 'next', name: 'Next.js', category: 'Fullstack', level: 88, icon: '/asset/skill-section/nextjs.svg', description: 'SSR, SSG & API Routes', pos: { x: 40, y: 10 }, defaultBlur: true },
  { id: 'js', name: 'JavaScript', category: 'Foundation', level: 90, icon: '/asset/skill-section/js.svg', description: 'ES6+, DOM manipulation', pos: { x: 75, y: 20 } },
  { id: 'css', name: 'CSS3', category: 'Foundation', level: 95, icon: '/asset/skill-section/css.svg', description: 'Advanced layouts & animations', pos: { x: 10, y: 50 }, defaultBlur: true, nodeIcon: '/asset/skill-section/csshover.png' },
  { id: 'html', name: 'HTML5', category: 'Foundation', level: 95, icon: '/asset/skill-section/HTML5.svg', description: 'Semantic structure & accessibility', pos: { x: 35, y: 40 }, nodeIcon: '/asset/skill-section/htmlhover.png' },
  { id: 'vue', name: 'Vue.js', category: 'Frontend', level: 80, icon: '/asset/skill-section/Vue.js.svg', description: 'Reactive components', pos: { x: 60, y: 55 }, defaultBlur: true },
  { id: 'angular', name: 'Angular', category: 'Frontend', level: 75, icon: '/asset/skill-section/Angular.svg', description: 'Enterprise applications', pos: { x: 85, y: 40 } },
  { id: 'laravel', name: 'Laravel', category: 'Backend', level: 85, icon: '/asset/skill-section/Laravel.svg', description: 'MVC architecture & Eloquent', pos: { x: 20, y: 85 }, defaultBlur: true },
  { id: 'php', name: 'PHP', category: 'Backend', level: 80, icon: '/asset/skill-section/php.svg', description: 'Server-side processing', pos: { x: 45, y: 75 } },
  { id: 'docker', name: 'Docker', category: 'DevOps', level: 75, icon: '/asset/skill-section/docker.svg', description: 'Containerization & CI/CD', pos: { x: 70, y: 85 }, defaultBlur: true },
  { id: 'swift', name: 'Swift', category: 'Mobile', level: 65, icon: '/asset/skill-section/Swift.svg', description: 'iOS native development', pos: { x: 90, y: 70 }, nodeIcon: '/asset/skill-section/swifthover.png' },
  { id: 'python', name: 'Python', category: 'Backend/AI', level: 70, icon: '/asset/skill-section/python.svg', description: 'Data processing & scripting', pos: { x: 50, y: 30 }, defaultBlur: true },
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
    </div>
  )
}

// ─── LAYERS ──────────────────────────────────────────────────────────────

const ArtGalleryLayer = ({ isDark }: { isDark: boolean }) => {
  const textColor = isDark ? '#d4c4a8' : '#f2eadc'

  const rotations = useMemo(() => skillsData.map(() => Math.random() * 14 - 7), []);

  return (
    <div
      className="absolute inset-0 w-full h-full transition-colors duration-300"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgba(5,4,3,0.88), rgba(11,8,5,0.52) 48%, rgba(4,3,2,0.82)), url("/asset/project-section/projectbg/redcape.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: 'url("/asset/project-section/projectbg/paper.jpg")', backgroundSize: '520px' }}
      />
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

  const hoveredData = skillsData.find(s => s.id === hoveredSkill);
  const hoveredSkillPos = hoveredData ? hoveredData.pos : null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden transition-colors duration-300"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 68% 42%, rgba(175,45,58,0.18), transparent 42%), linear-gradient(90deg, rgba(8,6,4,0.88), rgba(17,10,8,0.58) 50%, rgba(7,5,3,0.9)), url("/asset/project-section/projectbg/redcape.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: 'url("/asset/project-section/projectbg/paper.jpg")', backgroundSize: '520px' }}
      />
      <div className="w-full h-full flex flex-col lg:flex-row items-center pt-24 pb-16">
        
        {/* Left Side: Title */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 lg:pl-[320px] md:pl-[280px] px-6 pr-4">
          <div className="pointer-events-none relative z-10 mb-8 lg:mb-0">
            <TitleHeading
              title="tech network"
              subtitle="Worldwide connections."
              titleClassName="tracking-tight"
              subtitleClassName=""
            />
          </div>
        </div>

        {/* Right Side: Network Graph */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10 mt-12 lg:mt-0">
          <div className="relative w-full max-w-lg lg:max-w-xl flex-1 min-h-[400px]">
            
            {/* 
              BACKGROUND IMAGE UNTUK IKON
              - Untuk mengubah posisi: ubah 'top-1/2' atau 'left-1/2' dan '-translate-y-1/2'.
                Misal mau digeser ke atas, ganti 'top-1/2' jadi 'top-0' atau '-top-10'.
              - Untuk memperbesar/memperkecil: ubah 'w-[120%]' (120% dari lebar container) atau 'scale-100'.
                Misal mau lebih besar, ganti jadi 'w-[150%]' atau tambahkan 'scale-125'.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative art positioned by percentage transforms */}
            <img
              src="/asset/skill-section/background.png"
              alt="Skills Background"
              className="absolute top-[44%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-none object-contain opacity-80 pointer-events-none z-0"
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

  // Semua nilai turunan scroll dihitung sebagai MotionValue dan ditulis
  // langsung ke style elemen — komponen ini tidak pernah re-render saat scroll.
  const clipPathMV = useTransform(scrollYProgress, (v) =>
    `polygon(0 0, ${v * 100}% 0, ${v * 100}% 100%, 0 100%)`
  )
  const lineLeft = useTransform(scrollYProgress, (v) => `${Math.min(v * 100, 99.9)}%`)
  const lineOpacity = useTransform(scrollYProgress, (v) => (v * 100 >= 100 ? 0 : 1))
  const lineBoxShadow = useTransform(scrollYProgress, (v) =>
    v * 100 < 99
      ? `0 0 15px ${isDark ? 'rgba(199,185,159,0.5)' : 'rgba(140,107,69,0.5)'}`
      : 'none'
  )
  const extensionHeight = useTransform(scrollYProgress, (v) =>
    `${CANVAS_H - (BASE_Y + tornNoiseStatic(v))}px`
  )

  if (!isVisible) return null

  const lineColor = isDark ? '#c7b99f' : '#8c6b45';

  return (
    <div ref={containerRef} className="relative w-full h-[200vh] overflow-x-clip">

      {/* ─── 1. TORN EDGE 2 LAPIS ─── */}
      <div className="absolute top-0 w-full z-20 pointer-events-none">
        {/* Lapis Dasar (Art Gallery) */}
        <TornEdge color="rgba(10,7,5,0.24)" showGlow={true} />

        {/* Lapis Atas (Node Graph) */}
        <TornEdge
          color="rgba(10,7,5,0.2)"
          showGlow={false}
          clipPath={clipPathMV}
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
      <div className="sticky top-0 w-full h-screen z-30">

        {/* Layer 1: Art Gallery / Canvas Placeholders */}
        <ArtGalleryLayer isDark={isDark} />

        {/* Layer 2: Awakened Tech Universe */}
        <motion.div
          className="absolute inset-0 z-10 select-none pointer-events-none"
          style={{ clipPath: clipPathMV, willChange: 'clip-path' }}
        >
          <AwakenedLayer isDark={isDark} />
        </motion.div>

        {/* ─── GARIS VERTIKAL & EKSTENSI DINAMIS ─── */}
        {/* The line fades out when slider reaches 100% */}
        <motion.div
          className="absolute top-0 bottom-0 z-40 w-[2px] pointer-events-none transition-opacity duration-300"
          style={{
            left: lineLeft,
            opacity: lineOpacity,
            backgroundColor: lineColor,
            boxShadow: lineBoxShadow,
          }}
        >
          <motion.div
            className="absolute bottom-full left-0 w-full"
            style={{ height: extensionHeight, backgroundColor: lineColor }}
          />

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 border-2 flex items-center justify-center rounded-sm"
            style={{
              backgroundColor: 'rgba(18,13,9,0.82)',
              borderColor: lineColor,
              boxShadow: `0 0 10px ${isDark ? 'rgba(199,185,159,0.3)' : 'rgba(140,107,69,0.3)'}`
            }}
          >
            <div className="flex gap-[3px]">
              <div className="w-[2px] h-4" style={{ backgroundColor: lineColor }}></div>
              <div className="w-[2px] h-4" style={{ backgroundColor: lineColor }}></div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ─── 3. TORN EDGE BAWAH ─── */}
      <TornEdgeInverted color="rgba(10,7,5,0.28)" />
    </div>
  )
}

export default SkillsSection
