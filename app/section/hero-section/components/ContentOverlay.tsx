'use client'

import { motion, AnimatePresence } from 'framer-motion'

// ─── BREAKPOINT MAP ────────────────────────────────────────────────────────────
const CONTENT_BLOCKS = [
  {
    id: 'about',
    fromFrame: 40,
    toFrame: 90,
    label: '01 / About',
    heading: "Hi, I'm Iza",
    body: 'A software engineer who builds clean, fast, and meaningful digital experiences — from idea to production.',
    extra: null,
  },
  {
    id: 'skills',
    fromFrame: 100,
    toFrame: 148,
    label: '02 / Skills',
    heading: 'What I Work With',
    body: null,
    extra: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Supabase', 'Three.js'],
  },
  {
    id: 'cta',
    fromFrame: 158,
    toFrame: 192,
    label: '03 / Contact',
    heading: "Let's Build Something",
    body: "Have an idea? I'm open to new projects, collaborations, and opportunities. Let's make it real.",
    extra: null,
  },
]

interface Props {
  frameIndex: number
}

export default function ContentOverlay({ frameIndex }: Props) {
  const activeBlock = CONTENT_BLOCKS.find(
    b => frameIndex >= b.fromFrame && frameIndex < b.toFrame
  )

  // Scroll-driven scale: grow from 0.65 → 1.0 as user scrolls through the block
  const localProgress = activeBlock
    ? (frameIndex - activeBlock.fromFrame) / (activeBlock.toFrame - activeBlock.fromFrame)
    : 0

  // Opacity arc: fade in fast, stay full, fade out fast using sin curve
  const opacityArc = activeBlock
    ? Math.min(1, Math.sin(localProgress * Math.PI) * 2.5)
    : 0

  const scale = 0.65 + localProgress * 0.35

  return (
    <AnimatePresence mode="wait">
      {activeBlock && (
        <motion.div
          key={activeBlock.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {/* Radial vignette centered behind text */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)',
            }}
          />

          {/* Content — scroll-driven scale */}
          <div
            className="relative z-10 text-center text-white w-full px-8"
            style={{
              transform: `scale(${scale})`,
              opacity: opacityArc,
            }}
          >
            {/* Label */}
            <p className="text-xs font-mono tracking-[0.35em] text-white/40 mb-4 uppercase">
              {activeBlock.label}
            </p>

            {/* Heading */}
            <h2
              className="font-black leading-tight mb-5 tracking-tight whitespace-nowrap"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
            >
              {activeBlock.heading}
            </h2>

            {/* Body text */}
            {activeBlock.body && (
              <p className="text-white/60 text-base md:text-lg leading-relaxed">
                {activeBlock.body}
              </p>
            )}

            {/* Skills pills */}
            {activeBlock.extra && (
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {activeBlock.extra.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 border border-white/25 text-white/65 text-sm font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
