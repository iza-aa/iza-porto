'use client'

import { useEffect, useRef, useState } from 'react'

interface VirtualSectionProps {
  /** Anchor id — lives on the always-present wrapper so nav links keep working
      even while the section itself is unmounted */
  id?: string
  children: React.ReactNode
}

/**
 * Section virtualization: children are mounted only while the wrapper is
 * within 150% of the viewport. When the user scrolls far away, the section
 * unmounts and is replaced by a placeholder of the exact same measured height,
 * so document height and scroll position never shift.
 *
 * Starts mounted (SSR/SEO + correct first measurement); the observer prunes
 * far-away sections right after hydration.
 */
export default function VirtualSection({ id, children }: VirtualSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lastHeightRef = useRef<number>(0)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
        } else {
          // Capture the real rendered height before swapping in the placeholder
          if (el.offsetHeight > 0) lastHeightRef.current = el.offsetHeight
          setMounted(false)
        }
      },
      // Mount well before arrival so fast scrolling never shows a blank gap
      { rootMargin: '150% 0px 150% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapperRef} id={id}>
      {mounted ? (
        children
      ) : (
        <div style={{ height: `${lastHeightRef.current}px` }} aria-hidden />
      )}
    </div>
  )
}
