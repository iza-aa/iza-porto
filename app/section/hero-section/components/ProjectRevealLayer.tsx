'use client'

import Image from 'next/image'
import { TitleHeading } from '../../../components/TitleHeading'

/**
 * Pinned backdrop revealed by the project burn: atmosphere + section title.
 * The actual project card content lives in ProjectRevealContent, which
 * scrolls natively OVER this layer in normal document flow.
 */
export default function ProjectRevealLayer({ progress }: { progress: number }) {
  const cardProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.62))

  return (
    <div className="absolute inset-0 overflow-hidden text-black">
      <div className="absolute inset-0 overflow-hidden bg-[#1b1309]">
        <Image
          src="/asset/project-section/projectbg/leopardbg.jpeg"
          alt=""
          fill
          sizes="(min-width: 1024px) calc(100vw - 300px), (min-width: 768px) calc(100vw - 260px), 100vw"
          className="object-cover opacity-24 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3f3320]/82 via-[#1b1309]/88 to-[#120a04]/94" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{ backgroundImage: 'url("/asset/noise.png")', backgroundRepeat: 'repeat' }}
        />
      </div>

      <div className="absolute inset-y-0 left-0 right-0 px-6 pt-[6vh] md:left-[260px] md:px-9 lg:left-[300px] lg:px-[52px]">
        <div
          className="relative z-30 shrink-0 transition-all duration-700 ease-out"
          style={{
            opacity: cardProgress,
            transform: `translateY(${(1 - cardProgress) * 24}px)`,
          }}
        >
          <TitleHeading
            title="extended labs"
            subtitle="Dual-column showcase for detailed project exploration."
            className="text-white"
            titleClassName="text-4xl md:text-6xl"
            subtitleClassName="text-base md:text-lg mt-0 text-white/70"
          />
        </div>
      </div>
    </div>
  )
}
