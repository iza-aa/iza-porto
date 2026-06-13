'use client'

import Image from 'next/image'

/**
 * Pinned atmospheric backdrop revealed by the project burn. The section title
 * and the project card content both live in ProjectRevealContent, which
 * scrolls natively OVER this layer in normal document flow.
 */
export default function ProjectRevealLayer() {
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
    </div>
  )
}
