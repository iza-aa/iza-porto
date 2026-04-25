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
// Diturunkan bertahap: Base (HP) -> md (Tablet) -> lg (Mac/Laptop) -> 2xl (Layar 2K)
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

// ─── Full Phone Mockup (Rasio 38/60) ─────────────────────────────────────────
export function FullPhoneMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    // Menggunakan aspect-[38/60] sebagai ganti h-[600px] w-[380px]
    <div className={`relative w-full aspect-[38/60] ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center rounded-xl">
        {/* Background Image */}
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Phone Mockup - Menggunakan persentase (60%) agar mengecil proporsional */}
        <div className="relative z-10 w-[60%] drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
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

// ─── Half Phone Mockup (Rasio 51/85) ─────────────────────────────────────────
export function HalfPhoneMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    // Padding dibuat responsif, rasio diatur ke 51/85
    <div className={`relative w-full aspect-[51/85] pt-1 px-1 md:pt-2 md:px-2 2xl:pt-2.5 2xl:px-2.5 pb-0 ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-end justify-center rounded-t-xl">
        {/* Background Image */}
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Phone Mockup - Menggunakan persentase (44%) agar proporsional dengan aslinya */}
        <div className="relative z-10 w-[44%] drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
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

// ─── Mac Mockup (Rasio 34/25) ────────────────────────────────────────────────
export function MacMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    // Padding responsif, rasio 1020x750 disederhanakan jadi 34/25
    <div className={`relative w-full aspect-[34/25] p-1.5 md:p-2 2xl:p-2.5 ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center rounded-xl">
        {/* Background Image */}
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Mac Mockup Placeholder */}
        <div className="relative z-10 w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] rounded-lg border border-gray-600 flex items-center justify-center">
          <div className="text-white/50 text-xs md:text-sm">Mac Mockup</div>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Random Mockup (Rasio 25/28) ─────────────────────────────────────────────
export function RandomMockup({ src, alt = 'Project mockup', className = '', children }: MockupProps) {
  return (
    // Rasio 500x560 disederhanakan jadi 25/28
    <div className={`relative w-full aspect-[25/28] ${className}`}>
      <div className="relative w-full h-full overflow-hidden bg-[#182725] flex items-center justify-center rounded-xl">
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
    // Memastikan kontainer memiliki lebar maksimal yang menyesuaikan layar
    <div className={`group flex flex-col items-start ${textStyles.width} ${textStyles.gap} cursor-pointer mx-auto ${className}`} onClick={onClick}>
      
      {/* Mockup Section */}
      <div className="w-full">
        {(() => {
          const mockupProps = { src, alt, className: 'group w-full', children }
          
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
      </div>

      {/* Text Content Section */}
      {(title || description) && (
        <div className={`flex flex-col ${textStyles.gap} w-full mt-2 md:mt-3`}>
          {/* Title */}
          {title && (
            <h3 className={`${textStyles.title} font-bold dark:text-white transition-colors`}>
              {title}
            </h3>
          )}
          
          {/* Description */}
          {description && (
            <p className={`${textStyles.description} dark:text-white/60 text-black/60 leading-relaxed`}>
              {description}
            </p>
          )}

          {/* Click for detail */}
          <div className={`${textStyles.button} self-start`}>
            {/* Asumsikan komponen LiquidGlass ini memiliki properti responsif untuk padding internalnya */}
            <LiquidGlass variant="navbar" animated padding="px-2 py-1 md:px-3 md:py-1.5">
              <span className="text-[10px] md:text-xs font-semibold dark:text-white/60 tracking-wide">
                Click for detail ↗
              </span>
            </LiquidGlass>
          </div>
        </div>
      )}
    </div>
  )
}