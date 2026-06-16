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
type ContentBatch = {
  heading: string
  subtitle: string
  projects: Project[]
  features: FeaturePair[]
}

// Two content cards, two projects each
const contentCards: ContentBatch[] = [
  {
    heading: 'labs',
    subtitle: 'Dual-column showcase for detailed project exploration.',
    projects: [
      {
        title: 'Dummy Project 4',
        desc: 'First dummy project for the half-width column layout.',
        phoneBg: '/asset/project-section/projectbg/newprojectbg/codioful-formerly-gradienta-2-GrvmAcF1g-unsplash.jpg',
        phoneImage: '/asset/project-section/projectbg/uii.png',
      },
      {
        title: 'Dummy Project 5',
        desc: 'Second dummy project for the half-width column layout.',
        phoneBg: '/asset/project-section/projectbg/newprojectbg/codioful-formerly-gradienta-CgpPJObA9Q0-unsplash.jpg',
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
    heading: 'second labs',
    subtitle: 'Second pass through deeper builds, reusable patterns, and production polish.',
    projects: [
      {
        title: 'Dummy Project 6',
        desc: 'Third dummy project extending the dual-column showcase.',
        phoneBg: '/asset/project-section/projectbg/newprojectbg/codioful-formerly-gradienta-KZ5EIdidXSk-unsplash.jpg',
        phoneImage: '/asset/project-section/projectbg/izapos.png',
      },
      {
        title: 'Dummy Project 7',
        desc: 'Fourth dummy project completing the second content card.',
        phoneBg: '/asset/project-section/projectbg/newprojectbg/iklas-f8j9du8HWdQ-unsplash.jpg',
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#e9ede6] to-[#dce2d8] dark:from-[#121814] dark:to-[#080c0a] lg:ml-60" />
        <div
          aria-hidden
          className="absolute inset-0 z-30 pointer-events-none transition-all duration-500 lg:ml-60"
          style={{
            backgroundImage: 'url("/asset/project-section/projectbg/paper.jpg")',
            backgroundRepeat: 'repeat', backgroundPosition: 'top left', backgroundSize: '600px',
            mixBlendMode: isDark ? 'soft-light' : 'multiply',
            filter: isDark ? 'invert(1) brightness(1.2) contrast(1.4)' : 'none',
            opacity: isDark ? 0.95 : 0.40,
            imageRendering: 'crisp-edges', transform: 'translateZ(0)',
          }}
        />
        <div className="relative z-10 px-4 py-5 sm:px-6 md:py-6 lg:pl-[270px] lg:pr-6">
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
          className="absolute inset-0 transition-colors duration-500 lg:ml-60"
          style={{ backgroundColor: isDark ? '#0d110f' : '#e6e4d8' }}
        />
        <div className="relative z-10 px-4 py-12 sm:px-6 md:py-16 lg:pl-[270px] lg:pr-6">
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
function RevealHeading({
  title = 'extended labs',
  subtitle = 'Dual-column showcase for detailed project exploration.',
  className = '',
}: {
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={`mb-10 px-4 sm:px-6 lg:mb-12 lg:pl-[240px] lg:pr-0 ${className}`}>
      <TitleHeading
        title={title}
        subtitle={subtitle}
        className="text-white"
        titleClassName="text-[clamp(3.25rem,16vw,12.5rem)] pt-[32vh] lg:pt-[42vh]"
        subtitleClassName="mt-0 text-white/70"
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

export default function ProjectRevealContent({
  titleRefs = [],
}: {
  // One sentinel-ref setter per heading, in order (extended labs, selected
  // systems). Used by the scroll-driven WebGL backdrop to burn between paintings
  // as each title rises into view.
  titleRefs?: ((el: HTMLElement | null) => void)[]
}) {
  const isDark = useIsDark()

  const openProjectSection = () => {
    document.getElementById('project')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative w-full">
      {contentCards.map((card, i) => (
        <div key={i} className="relative" data-key-guide-start={i === 0 ? true : undefined}>
          {/* sentinel sits exactly at the heading so the burn for this title
              starts as the heading enters from the bottom of the viewport */}
          <span ref={titleRefs[i]} aria-hidden className="absolute top-0 h-px w-px" />
          <RevealHeading
            title={card.heading}
            subtitle={card.subtitle}
            className={i === 0 ? 'pt-1' : 'pt-12 md:pt-20 md:pb-2'}
          />
          <ContentCard
            projects={card.projects}
            features={card.features}
            isDark={isDark}
            onOpen={openProjectSection}
          />
        </div>
      ))}
    </div>
  )
}
