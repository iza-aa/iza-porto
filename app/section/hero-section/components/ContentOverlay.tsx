'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const TECH_ICONS = [
  { name: 'React',   file: 'react.svg'  },
  { name: 'Next.js', file: 'nextjs.svg' },
  { name: 'JS',      file: 'js.svg'     },
  { name: 'Python',  file: 'python.svg' },
  { name: 'Swift',   file: 'swift.svg'  },
  { name: 'Docker',  file: 'docker.svg' },
  { name: 'GitHub',  file: 'github.svg' },
  { name: 'CSS',     file: 'css.svg'    },
  { name: 'HTML',    file: 'html.svg'   },
]

const CONTENT_BLOCKS = [
  {
    id:        'skills',
    fromFrame: 79,
    toFrame:   116,
    type:      'skills' as const,
  },
]

interface Props {
  frameIndex: number
}

export default function ContentOverlay({ frameIndex }: Props) {
  const activeBlock = CONTENT_BLOCKS.find(
    b => frameIndex >= b.fromFrame && frameIndex < b.toFrame
  )
  return (
    <AnimatePresence mode="wait">
      {activeBlock && (
        <motion.div
          key={activeBlock.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {activeBlock.type === 'skills' && (
            <>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p
                  className="text-white tracking-[0.2em] uppercase mb-8"
                  style={{
                    fontFamily: 'var(--font-inknut-antiqua)',
                    fontSize: 'clamp(0.65rem, 1vw, 0.9rem)',
                    opacity: 0,
                    animation: 'fadeUpIn 0.5s ease forwards',
                    animationDelay: '0.1s',
                  }}
                >
                  What I Work With
                </p>
                <div className="flex flex-wrap justify-center gap-6 max-w-sm px-6">
                  {TECH_ICONS.map((icon, i) => (
                    <div
                      key={icon.name}
                      style={{
                        opacity: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        animation: 'fadeUpIn 0.4s ease forwards',
                        animationDelay: `${0.2 + i * 0.07}s`,
                      }}
                    >
                      <Image src={`/images/icons/${icon.file}`} alt={icon.name} width={36} height={36} style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
                      <span style={{ fontFamily: 'var(--font-inknut-antiqua)', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{icon.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
