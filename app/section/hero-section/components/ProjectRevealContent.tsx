'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProjectCard } from '../../../components/ProjectMockups'
import { TitleHeading } from '../../../components/TitleHeading'

/**
 * Project card content that scrolls NATIVELY over the pinned reveal backdrop
 * after the project burn completes. Lives in normal document flow (no inner
 * scrollbar) — page scroll consumes it until the end, then the sticky stage
 * unpins and the page flows on.
 *
 * Mirrors the "extended labs" batch: each content card is an ExtraCanvas row
 * of two mockups above a ConvinceLayer row of two feature pairs. The title
 * scrolls together with the cards (it is NOT on the pinned backdrop).
 */

type Project = {
  title: string
  desc: string
  phoneBg: string
  phoneImage: string
}

type FeaturePair = { title: string; desc: string }[]

// Two content cards, two projects each
const contentCards: { projects: Project[]; features: FeaturePair[] }[] = [
  {
    projects: [
      {
        title: 'Dummy Project 4',
        desc: 'First dummy project for the half-width column layout.',
        phoneBg: '/asset/project-section/projectbg/hall.jpeg',
        phoneImage: '/asset/project-section/projectbg/uii.png',
      },
      {
        title: 'Dummy Project 5',
        desc: 'Second dummy project for the half-width column layout.',
        phoneBg: '/asset/project-section/projectbg/redcape.jpeg',
        phoneImage: '/asset/project-section/projectbg/izapos.png',
      },
    ],
    features: [
      [
        { title: 'Dual-Column Layout', desc: 'Optimized for larger project previews.' },
        { title: 'Maximized Space', desc: 'Takes 50% of the screen width for better detail.' },
      ],
      [
        { title: 'Full Responsive', desc: 'Still stacks perfectly on mobile devices.' },
        { title: 'Custom Aspect', desc: '16:9 ratio used for a cinematic feel.' },
      ],
    ],
  },
  {
    projects: [
      {
        title: 'Dummy Project 6',
        desc: 'Third dummy project extending the dual-column showcase.',
        phoneBg: '/asset/project-section/projectbg/whiteyellow.jpeg',
        phoneImage: '/asset/project-section/projectbg/izapos.png',
      },
      {
        title: 'Dummy Project 7',
        desc: 'Fourth dummy project completing the second content card.',
        phoneBg: '/asset/project-section/projectbg/hall.jpeg',
        phoneImage: '/asset/project-section/projectbg/uii.png',
      },
    ],
    features: [
      [
        { title: 'Extended Showcase', desc: 'Room for a growing portfolio of work.' },
        { title: 'Consistent Rhythm', desc: 'Same grid language across every card.' },
      ],
      [
        { title: 'Modular Cards', desc: 'Each content card stands on its own.' },
        { title: 'Scales Cleanly', desc: 'Add more cards without breaking the flow.' },
      ],
    ],
  },
]

function ContentCard({
  projects,
  features,
  isDark,
  onOpen,
}: {
  projects: Project[]
  features: FeaturePair[]
  isDark: boolean
  onOpen: () => void
}) {
  return (
    <div className="relative w-full">
      {/* ── ExtraCanvas equivalent: two mockup cards ── */}
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
          <div className="grid grid-cols-1 gap-6 justify-start md:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectCard
                key={i}
                size="random"
                src={project.phoneBg}
                alt={`${project.title} background`}
                title={project.title}
                description={project.desc}
                className="group"
                overrideW="max-w-full w-full"
                overrideH="aspect-[16/13]"
                onClick={onOpen}
              >
                <Image
                  src={project.phoneImage}
                  alt={project.title}
                  fill
                  className="object-contain p-6 md:p-10 drop-shadow-2xl"
                  draggable={false}
                />
              </ProjectCard>
            ))}
          </div>
        </div>
      </div>

      {/* ── ConvinceLayer equivalent: two feature pairs ── */}
      <div className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 ml-60 transition-colors duration-500"
          style={{ backgroundColor: isDark ? '#0d110f' : '#e6e4d8' }}
        />
        <div className="relative z-10 py-16 pr-6 lg:pl-[270px] md:py-16">
          <div className="grid grid-cols-1 gap-6 justify-start md:grid-cols-2">
            {projects.map((_, idx) => {
              const columnFeatures = features[idx] || []
              return (
                <div key={idx} className="w-full max-w-full flex flex-col gap-10 pr-4">
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
    </div>
  )
}

/** Shared section title — identical in the flow content and the burn overlay */
function RevealHeading() {
  return (
    <div className="mb-12 px-6 pt-[11vh] md:pl-[280px] lg:pl-[320px]">
      <TitleHeading
        title="extended labs"
        subtitle="Dual-column showcase for detailed project exploration."
        className="text-white mb-10 pb-1"
        titleClassName="text-4xl md:text-6xl"
        subtitleClassName="text-base md:text-lg mt-0 text-white/70"
      />
    </div>
  )
}

function useIsDark() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return isDark
}

export default function ProjectRevealContent() {
  const isDark = useIsDark()

  const openProjectSection = () => {
    document.getElementById('project')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative w-full">
      <RevealHeading />
      {contentCards.map((card, i) => (
        <ContentCard
          key={i}
          projects={card.projects}
          features={card.features}
          isDark={isDark}
          onOpen={openProjectSection}
        />
      ))}
    </div>
  )
}
