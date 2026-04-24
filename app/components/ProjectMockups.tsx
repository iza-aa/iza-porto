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
  // Additional props for complete project card
  title?: string
  description?: string
  onClick?: () => void
  // Size variant for responsive text sizing
  size?: 'full' | 'half' | 'mac' | 'random'
}

// ─── Helper function for size-based styling ────────────────────────────────────
function getTextStyles(size: 'full' | 'half' | 'mac' | 'random' = 'full') {
  switch (size) {
    case 'full':
      return {
        title: 'text-2xl md:text-3xl',
        description: 'text-sm',
        gap: 'gap-2',
        button: 'mt-1',
        width: 'w-[380px]'
      }
    case 'half':
      return {
        title: 'text-xl md:text-2xl',
        description: 'text-xs',
        gap: 'gap-1.5',
        button: 'mt-2',
        width: 'w-[510px]'
      }
    case 'mac':
      return {
        title: 'text-2xl md:text-3xl',
        description: 'text-base',
        gap: 'gap-3',
        button: 'mt-2',
        width: 'w-[1020px]'
      }
    case 'random':
      return {
        title: 'text-2xl md:text-3xl',
        description: 'text-sm',
        gap: 'gap-1',
        button: 'mt-2',
        width: 'w-[500px]'
      }
    default:
      return {
        title: 'text-2xl md:text-3xl',
        description: 'text-sm',
        gap: 'gap-2',
        button: 'mt-3',
        width: 'w-[380px]'
      }
  }
}

// ─── Full Phone Mockup (1055x666, padding 10) ────────────────────────────────
export function FullPhoneMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    <div className={`relative w-[380px] h-[600px] ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center">
        {/* Background Image */}
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Phone Mockup */}
        <div className="relative z-10 w-44 md:w-56 drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
          <PhoneMockup className="w-full h-full">
            <div className="relative w-full h-full bg-gradient-to-b from-[#0d1b2a] to-[#1b2838] overflow-hidden">
              {children}
            </div>
          </PhoneMockup>
        </div>
      </div>
    </div>
  )
}

// ─── Half Phone Mockup (510x850, padding top/left/right 10, no bottom) ────────
export function HalfPhoneMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    <div className={`relative w-[510px] h-[850px] pt-2.5 px-2.5 pb-0 ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center">
        {/* Background Image */}
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Phone Mockup */}
        <div className="relative z-10 w-44 md:w-56 drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
          <PhoneMockup className="w-full h-full">
            <div className="relative w-full h-full bg-gradient-to-b from-[#0d1b2a] to-[#1b2838] overflow-hidden">
              {children}
            </div>
          </PhoneMockup>
        </div>
      </div>
    </div>
  )
}

// ─── Mac Mockup (1020x750, padding 10) ────────────────────────────────────────
export function MacMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    <div className={`relative w-[1020px] h-[750px] p-2.5 ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center">
        {/* Background Image */}
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Mac Mockup Placeholder - Anda bisa ganti dengan komponen MacMockup yang sebenarnya */}
        <div className="relative z-10 w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] rounded-lg border border-gray-600 flex items-center justify-center">
          <div className="text-white/50 text-sm">Mac Mockup</div>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Random Mockup (500x560, no padding) ──────────────────────────────────────
export function RandomMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    <div className={`relative w-[500px] h-[560px] ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center">
        {/* Background Image */}
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Custom Content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Complete Project Card (Mockup + Text Content) ────────────────────────────
// Usage examples:
// <ProjectCard size="full" title="..." description="..." />    // 1055x666px mockup + large text
// <ProjectCard size="half" title="..." description="..." />    // 510x850px mockup + medium text  
// <ProjectCard size="mac" title="..." description="..." />     // 1020x750px mockup + extra large text
// <ProjectCard size="random" title="..." description="..." />  // 500x560px mockup + small text
export function ProjectCard({ 
  src, 
  alt = 'Project mockup', 
  className = '', 
  children,
  title,
  description,
  onClick,
  size = 'full'
}: MockupProps) {
  const textStyles = getTextStyles(size)
  
  return (
    <div className={`group flex flex-col items-start ${textStyles.width} ${textStyles.gap} cursor-pointer ${className}`} onClick={onClick}>
      
      {/* Mockup Section - Render appropriate mockup based on size */}
      {(() => {
        const mockupProps = { src, alt, className: 'group', children }
        
        switch (size) {
          case 'half':
            return <HalfPhoneMockup {...mockupProps} />
          case 'mac':
            return <MacMockup {...mockupProps} />
          case 'random':
            return <RandomMockup {...mockupProps} />
          case 'full':
          default:
            return <FullPhoneMockup {...mockupProps} />
        }
      })()}

      {/* Text Content Section */}
      {(title || description) && (
        <div className={`flex flex-col ${textStyles.gap} w-full`}>
          {/* Title */}
          {title && (
            <h3 className={`${textStyles.title} font-bold text-black transition-colors`}>
              {title}
            </h3>
          )}
          
          {/* Description */}
          {description && (
            <p className={`${textStyles.description} text-black/60 leading-relaxed`}>
              {description}
            </p>
          )}

          {/* Click for detail */}
          <div className={`${textStyles.button} self-start`}>
            <LiquidGlass variant="navbar" animated padding="px-3">
              <span className="text-xs font-semibold text-black tracking-wide">
                Click for detail ↗
              </span>
            </LiquidGlass>
          </div>
        </div>
      )}
    </div>
  )
}