'use client'

import React from 'react'
import Image from 'next/image'
import PhoneMockup from '../section/project-section/components/PhoneMockup'
import LiquidGlass from './LiquidGlass'

interface MockupProps {
  src?: string
  alt?: string
  className?: string
  children?: React.ReactNode
  title?: string
  description?: string
  onClick?: () => void
  size?: 'full' | 'half' | 'mac' | 'random'
  // TAMBAHKAN DUA PROP INI
  overrideW?: string 
  overrideH?: string
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

export function FullPhoneMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    <div className={`relative z-[60] w-full aspect-[38/60] ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center">
        {src && <Image src={src} alt={alt} fill className="object-cover absolute inset-0 z-0 opacity-80" />}
        <div className="relative z-10 w-[60%] drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
          <PhoneMockup className="w-full h-full">
            <div className="relative w-full h-full bg-gradient-to-b from-[#0d1b2a] to-[#1b2838] overflow-hidden">{children}</div>
          </PhoneMockup>
        </div>
      </div>
    </div>
  )
}

export function HalfPhoneMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    <div className={`relative z-[60] w-full aspect-[51/85] pt-1 px-1 md:pt-2 md:px-2 2xl:pt-2.5 2xl:px-2.5 pb-0 ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-end justify-center ">
        {src && <Image src={src} alt={alt} fill className="object-cover absolute inset-0 z-0 opacity-80" />}
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
  return (
    <div className={`relative z-[60] w-full aspect-[34/25] p-1.5 md:p-2 2xl:p-2.5 ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center ">
        {src && <Image src={src} alt={alt} fill className="object-cover absolute inset-0 z-0 opacity-80" />}
        <div className="relative z-10 w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] rounded-lg border border-gray-600 flex items-center justify-center">
          <div className="text-white/50 text-xs md:text-sm">Mac Mockup</div>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── UPDATE RANDOM MOCKUP ───────────────────────────────────────────────────
export function RandomMockup({ src, alt = 'Project mockup', className = '', children, overrideH }: MockupProps) {
  return (
    // Gunakan overrideH jika ada, jika tidak gunakan default aspect ratio
    <div className={`relative z-[60] w-full ${overrideH ? overrideH : 'aspect-[25/28]'} ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center ">
        {src && <Image src={src} alt={alt} fill className="object-cover absolute inset-0 z-0 opacity-80" />}
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
  overrideH
}: MockupProps) {
  const textStyles = getTextStyles(size)
  
  // Jika ada overrideW, gunakan nilai tersebut, jika tidak gunakan default dari helper
  const finalWidth = overrideW ? `w-full ${overrideW}` : textStyles.width

  return (
    <div className={`group flex flex-col items-start ${finalWidth} ${textStyles.gap} cursor-pointer mx-auto ${className}`} onClick={onClick}>
      <div className="w-full">
        {(() => {
          const mockupProps = { src, alt, className: 'group w-full', children, overrideW, overrideH }
          switch (size) {
            case 'half': return <HalfPhoneMockup {...mockupProps} />
            case 'mac': return <MacMockup {...mockupProps} />
            case 'random': return <RandomMockup {...mockupProps} />
            case 'full':
            default: return <FullPhoneMockup {...mockupProps} />
          }
        })()}
      </div>

      {(title || description) && (
        <div className={`flex flex-col ${textStyles.gap} w-full mt-2 md:mt-3`}>
          {title && <h3 className={`${textStyles.title} font-bold dark:text-white transition-colors`}>{title}</h3>}
          {description && <p className={`${textStyles.description} dark:text-white/60 text-black/60 leading-relaxed`}>{description}</p>}
          <div className={`${textStyles.button} self-start`}>
            <LiquidGlass variant="navbar" animated padding="px-2 py-1 md:px-3 md:py-1.5">
              <span className="text-[10px] md:text-xs font-semibold dark:text-white/60 tracking-wide">Click for detail ↗</span>
            </LiquidGlass>
          </div>
        </div>
      )}
    </div>
  )
}