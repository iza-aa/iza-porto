'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import RenaissanceFrame from '../../components/renaissance/RenaissanceFrame'

const capabilityRows = [
  ['Interface systems', 'Next.js, React, Tailwind, Motion'],
  ['Operational tools', 'POS, asset tracking, internal dashboards'],
  ['Data layer', 'Supabase, PostgreSQL, API integration'],
]

interface AboutContentProps {
  contentProgress?: number
  showBackground?: boolean
}

export default function AboutContent({ contentProgress = 1, showBackground = true }: AboutContentProps) {
  const easedProgress = Math.max(0, Math.min(1, contentProgress))
  const panelOpacity = easedProgress
  const panelY = (1 - easedProgress) * 22

  return (
    <section
      id="about"
      className="relative min-h-[100vh] w-full overflow-hidden px-5 py-24 md:py-28  md:pr-12 pl-[240px] lg:pr-20"
    >
      {/* Background package — skipped entirely when the WebGL canvas behind
          this section is the backdrop (showBackground=false), so the living
          painting stays visible around the card */}
      {showBackground && (
        <>
          <Image
            src="/asset/project-section/projectbg/lacrescenza.jpg"
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-30 object-cover"
            style={{ opacity: easedProgress > 0 ? 1 : 0 }}
            priority
          />
          <div className="absolute inset-0 -z-20 bg-[#080604]/68" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.08] mix-blend-overlay"
            style={{ backgroundImage: 'url("/asset/project-section/projectbg/paper.jpg")', backgroundSize: '520px' }}
          />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_35%,rgba(212,168,78,0.16),transparent_42%),linear-gradient(90deg,rgba(0,0,0,0.34),transparent_42%,rgba(0,0,0,0.38))]" />
        </>
      )}

      <div className="mx-auto grid min-h-[calc(100dvh-12rem)] w-full max-w-7xl grid-cols-1 content-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
        <motion.div
          className="relative hidden lg:block"
          style={{
            opacity: panelOpacity,
            transform: `translateY(${panelY}px)`,
            transition: 'opacity 520ms ease, transform 720ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div className="absolute -left-5 top-10 h-[74%] w-px bg-[#c9a227]/35" />
          <p className="font-inknut-antiqua text-[10px] uppercase tracking-[0.28em] text-[#c9a227]/70">
            No. II / Profile
          </p>
          <h2 className="mt-5 max-w-[9ch] font-anton text-[clamp(4.5rem,8vw,8rem)] uppercase leading-[0.86] text-[#f3eee5]">
            Builder of practical interfaces
          </h2>
        </motion.div>

        <motion.div
          className="relative"
          style={{
            opacity: panelOpacity,
            transform: `translateY(${panelY * 1.2}px)`,
            transition: 'opacity 620ms ease 120ms, transform 820ms cubic-bezier(0.22, 1, 0.36, 1) 120ms',
          }}
        >
          <div className="mb-6 lg:hidden">
            <p className="font-inknut-antiqua text-[10px] uppercase tracking-[0.28em] text-[#c9a227]/70">
              No. II / Profile
            </p>
            <h2 className="mt-3 font-anton text-5xl uppercase leading-[0.9] text-[#f3eee5] sm:text-7xl">
              Builder of practical interfaces
            </h2>
          </div>

          <div className="relative border border-[#c9a227]/35 bg-[#120d09]/58 p-4 shadow-[0_26px_90px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-6">
            <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l border-t border-[#c9a227]/70" />
            <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r border-t border-[#c9a227]/70" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b border-l border-[#c9a227]/70" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b border-r border-[#c9a227]/70" />

            <div className="grid gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr]">
              <div className="mx-auto w-full max-w-[230px] md:mx-0">
                <RenaissanceFrame className="bg-[#17100b]/70" innerClassName="overflow-hidden">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#241508]">
                    <Image
                      src="/asset/about-section/Fotosaya.jpg"
                      alt="Portrait of Rezky Haikal Izami"
                      fill
                      sizes="260px"
                      className="object-cover sepia-[0.28] contrast-[1.02]"
                    />
                  </div>
                </RenaissanceFrame>
              </div>

              <div className="flex flex-col justify-between gap-7 py-1">
                <div>
                  <div className="relative mb-4 h-14 w-full sm:h-20">
                    <Image
                      src="/asset/about-section/namasaya.png"
                      alt="Rezky Haikal Izami signature"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <p className="max-w-[58ch] font-serif text-lg leading-relaxed text-[#f2eadc]/82 md:text-xl">
                    I design and build practical digital systems with a focus on clarity, structure, and reliable execution. My work sits between interface craft and real operational needs.
                  </p>
                </div>

                <div className="grid gap-3">
                  {capabilityRows.map(([label, value]) => (
                    <div key={label} className="grid gap-1 border-t border-[#c9a227]/18 pt-3 sm:grid-cols-[150px_1fr]">
                      <span className="font-inknut-antiqua text-[10px] uppercase tracking-[0.22em] text-[#c9a227]/62">
                        {label}
                      </span>
                      <span className="text-sm leading-relaxed text-[#f4eee4]/76">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
