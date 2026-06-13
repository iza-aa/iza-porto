'use client'

import type { ReactNode } from 'react'

export default function BurnEdgeMask({
  className = '',
  children,
}: {
  className?: string
  burnProgress?: number
  children: ReactNode
}) {
  return (
    <div className={`${className} relative overflow-hidden`}>
      <div className="pointer-events-none absolute inset-0 bg-[#120b05]/45" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
