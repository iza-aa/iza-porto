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
      <div className="relative z-10">{children}</div>
    </div>
  )
}
