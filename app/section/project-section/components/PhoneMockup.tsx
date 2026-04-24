'use client'

import React from 'react'
import Image from 'next/image'

interface PhoneMockupProps {
  /** Content rendered inside the phone screen */
  children: React.ReactNode
  /** Optional atmospheric background image path (e.g. "/images/phone-bg.jpg") */
  bgSrc?: string
  className?: string
}

/**
 * iPhone 14 Pro mockup.
 * Place your iPhone PNG at  /public/images/iphone-mockup.png
 *
 * The PNG is overlaid with mix-blend-mode:multiply so the white screen area
 * becomes transparent, revealing the children behind it.
 * Works best on dark backgrounds (e.g. the LeopardBg project section).
 *
 * Screen inset values are calibrated for a standard iPhone 14 Pro mockup PNG.
 * Adjust top/left/right/bottom/borderRadius if your PNG has different proportions.
 */
export default function PhoneMockup({ children, bgSrc, className = '' }: PhoneMockupProps) {
  return (
    <div
      className={`relative select-none ${className}`}
      // iPhone 14 Pro mockup aspect ratio (frame included)
      style={{ aspectRatio: '390 / 845' }}
    >
      {/* ── Screen area: sits behind the PNG frame ── */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: '5%',
          left: '5.5%',
          right: '5.5%',
          bottom: '4.6%',
          /* clip-path works reliably even when children have transform: scale() */
          clipPath: 'inset(0 round 8%)',
        }}
      >
        {/* Optional atmospheric / app-screenshot background */}
        {bgSrc && (
          <Image
            src={bgSrc}
            alt=""
            fill
            className="object-cover object-center"
            draggable={false}
          />
        )}

        {/* Screen UI passed as children */}
        {children}
      </div>

      {/* ── iPhone frame PNG overlay ──
          mix-blend-mode:multiply makes white pixels (screen) transparent
          so the children content shows through.                        ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      >
        <Image
          src="/asset/project-section/projectbg/phone.png"
          alt="iPhone 14 Pro frame"
          fill
          className="object-contain"
          draggable={false}
          priority
        />
      </div>
    </div>
  )
}
