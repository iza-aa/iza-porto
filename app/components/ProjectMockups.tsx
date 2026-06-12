'use client'

import React, { useState } from 'react'
import PhoneMockup from '../section/project-section/components/PhoneMockup'
import RenaissanceFrame from './renaissance/RenaissanceFrame'
import { DitheringBg } from './useDithering'

interface MockupProps {
  src?: string
  alt?: string
  className?: string
  children?: React.ReactNode
  title?: string
  description?: string
  onClick?: () => void
  size?: 'full' | 'half' | 'mac' | 'random'
  overrideW?: string
  overrideH?: string
  showHoverHint?: boolean
}

function getTextStyles(size: 'full' | 'half' | 'mac' | 'random' = 'full') {
  switch (size) {
    case 'full':
      return {
        title: 'text-lg md:text-xl 2xl:text-2xl',
        description: 'text-xs md:text-sm',
        gap: 'gap-1.5 md:gap-2',
        button: 'mt-1 2xl:mt-1.5',
        width: 'w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] 2xl:max-w-[380px]'
      }
    case 'half':
      return {
        title: 'text-xl md:text-2xl 2xl:text-3xl',
        description: 'text-xs md:text-sm',
        gap: 'gap-1 md:gap-1.5',
        button: 'mt-1.5 md:mt-2',
        width: 'w-full max-w-[340px] sm:max-w-[400px] md:max-w-[460px] 2xl:max-w-[510px]'
      }
    case 'mac':
      return {
        title: 'text-xl md:text-2xl lg:text-3xl',
        description: 'text-xs sm:text-sm md:text-base',
        gap: 'gap-1.5 md:gap-2 2xl:gap-3',
        button: 'mt-1.5 md:mt-2',
        width: 'w-full max-w-[340px] sm:max-w-[600px] md:max-w-[800px] 2xl:max-w-[1020px]'
      }
    case 'random':
      return {
        title: 'text-lg md:text-xl lg:text-2xl',
        description: 'text-xs md:text-sm',
        gap: 'gap-1 2xl:gap-2',
        button: 'mt-1 md:mt-2',
        width: 'w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px] 2xl:max-w-[500px]'
      }
    default:
      return {
        title: 'text-lg md:text-xl 2xl:text-2xl',
        description: 'text-xs md:text-sm',
        gap: 'gap-1.5 md:gap-2',
        button: 'mt-1.5 2xl:mt-3',
        width: 'w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] 2xl:max-w-[380px]'
      }
  }
}

export function FullPhoneMockup({ src, alt = 'Project mockup', className = '', children, showHoverHint = false }: MockupProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`relative z-[60] w-full aspect-[38/60] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center">
        <DitheringBg src={src} alt={alt} className="opacity-80" isHovered={hovered} />
        <div className="relative z-10 w-[60%] drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
          <PhoneMockup className="w-full h-full">
            <div className="relative w-full h-full bg-gradient-to-b from-[#0d1b2a] to-[#1b2838] overflow-hidden">{children}</div>
          </PhoneMockup>
        </div>

        {/* Hover hint badge — top right corner, fades out on hover */}
        {showHoverHint && (
          <div
            className="absolute top-3 right-3 z-20 pointer-events-none"
            style={{ opacity: hovered ? 0 : 1, transition: 'opacity 0.3s ease' }}
          >
            <div className="bg-[#f5efe0] px-3 py-1.5 flex items-center gap-2 border border-[#b08d57]/70 shadow-[2px_2px_0_rgba(176,141,87,0.35)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#8c6b45] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
              </svg>
              <span className="text-[#8c6b45] text-[11px] tracking-tight whitespace-nowrap">
                Action <span className="mx-0.5">/</span> <span className="text-[#5c4738] font-bold italic">Hover me!</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function HalfPhoneMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`relative z-[60] w-full aspect-[51/85] pt-1 px-1 md:pt-2 md:px-2 2xl:pt-2.5 2xl:px-2.5 pb-0 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-end justify-center">
        <DitheringBg src={src} alt={alt} className="opacity-80" isHovered={hovered} />
        <div className="relative z-10 w-[44%] drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
          <PhoneMockup className="w-full h-full">
            <div className="relative w-full h-full bg-gradient-to-b from-[#0d1b2a] to-[#1b2838] overflow-hidden">{children}</div>
          </PhoneMockup>
        </div>
      </div>
    </div>
  )
}

export function MacMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`relative z-[60] w-full aspect-[34/25] p-1.5 md:p-2 2xl:p-2.5 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center">
        <DitheringBg src={src} alt={alt} className="opacity-80" isHovered={hovered} />
        <div className="relative z-10 w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] rounded-lg border border-gray-600 flex items-center justify-center">
          <div className="text-white/50 text-xs md:text-sm">Mac Mockup</div>
          {children}
        </div>
      </div>
    </div>
  )
}

export function RandomMockup({ src, alt = 'Project mockup', className = '', children, overrideH }: MockupProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`relative z-[60] w-full ${overrideH ? overrideH : 'aspect-[25/28]'} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center">
        <DitheringBg src={src} alt={alt} className="opacity-80" isHovered={hovered} />
        <div className="relative z-10 w-full h-full flex items-center justify-center">{children}</div>
      </div>
    </div>
  )
}

// ─── UPDATE PROJECT CARD ─────────────────────────────────────────────────────
export function ProjectCard({
  src,
  alt = 'Project mockup',
  className = '',
  children,
  title,
  description,
  onClick,
  size = 'full',
  overrideW,
  overrideH,
  showHoverHint = false
}: MockupProps) {
  const textStyles = getTextStyles(size)

  // Jika ada overrideW, gunakan nilai tersebut, jika tidak gunakan default dari helper
  const finalWidth = overrideW ? `w-full ${overrideW}` : textStyles.width

  return (
    <div className={`group flex flex-col items-start ${finalWidth} ${textStyles.gap} cursor-pointer mx-auto ${className}`} onClick={onClick}>
      <RenaissanceFrame className="w-full bg-[#ece3cf]/60 dark:bg-[#241508]/60">
        {(() => {
          const mockupProps = { src, alt, className: 'group w-full', children, overrideW, overrideH, showHoverHint }
          switch (size) {
            case 'half': return <HalfPhoneMockup {...mockupProps} />
            case 'mac': return <MacMockup {...mockupProps} />
            case 'random': return <RandomMockup {...mockupProps} />
            case 'full':
            default: return <FullPhoneMockup {...mockupProps} />
          }
        })()}
      </RenaissanceFrame>

      {(title || description) && (
        <div className={`flex flex-col ${textStyles.gap} w-full mt-2 md:mt-3`}>
          {title && <h3 className={`${textStyles.title} font-bold dark:text-white transition-colors`}>{title}</h3>}
          {description && <p className={`${textStyles.description} dark:text-white/60 text-black/60 leading-relaxed`}>{description}</p>}
          <div className={`${textStyles.button} self-start`}>
            <span className="inline-block border border-[#b08d57]/60 px-3 py-1 text-[10px] md:text-xs tracking-[0.18em] uppercase text-[#7a5c3a] dark:text-[#d4c4a8] transition-colors duration-300 group-hover:border-[#b08d57] group-hover:bg-[#b08d57]/10">
              View the piece ↗
            </span>
          </div>
        </div>
      )}
    </div>
  )
}