import React from 'react'

interface RenaissanceFrameProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  corners?: boolean
}

/**
 * Museum-style double frame: thin antique-gold outer border, hairline inner
 * border (the "mat"), and four corner accents. Purely decorative — the
 * ornaments never intercept pointer events.
 */
export default function RenaissanceFrame({
  children,
  className = '',
  innerClassName = '',
  corners = true,
}: RenaissanceFrameProps) {
  return (
    <div className={`relative border border-[#b08d57]/60 dark:border-[#c9a227]/40 p-1.5 md:p-2 ${className}`}>
      <div className={`relative border border-[#b08d57]/30 dark:border-[#c9a227]/20 ${innerClassName}`}>
        {children}
      </div>
      {corners && (
        <>
          <span aria-hidden className="absolute -top-px -left-px w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-[#b08d57] dark:border-[#c9a227]/80 pointer-events-none" />
          <span aria-hidden className="absolute -top-px -right-px w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-[#b08d57] dark:border-[#c9a227]/80 pointer-events-none" />
          <span aria-hidden className="absolute -bottom-px -left-px w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-[#b08d57] dark:border-[#c9a227]/80 pointer-events-none" />
          <span aria-hidden className="absolute -bottom-px -right-px w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-[#b08d57] dark:border-[#c9a227]/80 pointer-events-none" />
        </>
      )}
    </div>
  )
}
