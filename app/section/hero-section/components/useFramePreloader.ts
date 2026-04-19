'use client'

import { useState, useEffect, useRef } from 'react'

const TOTAL_FRAMES = 192

export function useFramePreloader() {
  const framesRef = useRef<HTMLImageElement[]>([])
  const [frames, setFrames] = useState<HTMLImageElement[]>([])
  const [loadedCount, setLoadedCount] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES)
    let count = 0

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image()
      const num = String(i).padStart(4, '0')
      img.src = `/asset/hero-section/frame_${num}.png`

      const onComplete = () => {
        count++
        setLoadedCount(count)
        if (count === TOTAL_FRAMES) {
          framesRef.current = images
          setFrames(images)
          setIsReady(true)
        }
      }

      img.onload = onComplete
      img.onerror = onComplete
      images[i - 1] = img
    }

    framesRef.current = images
  }, [])

  return {
    frames,
    loadedCount,
    totalFrames: TOTAL_FRAMES,
    isReady,
  }
}
