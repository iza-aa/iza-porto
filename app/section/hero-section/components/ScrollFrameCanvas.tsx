'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Props {
  frames: HTMLImageElement[]
  frameIndex: number
}

export default function ScrollFrameCanvas({ frames, frameIndex }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = container.offsetWidth
    const h = container.offsetHeight

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }

    const img = frames[frameIndex]
    if (!img || !img.complete || img.naturalWidth === 0) return

    // Cover fit: crop image to fill canvas proportionally
    const canvasAspect = w / h
    const imgAspect = img.naturalWidth / img.naturalHeight

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight

    if (imgAspect > canvasAspect) {
      sw = img.naturalHeight * canvasAspect
      sx = (img.naturalWidth - sw) / 2
    } else {
      sh = img.naturalWidth / canvasAspect
      sy = (img.naturalHeight - sh) / 2
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
  }, [frames, frameIndex])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    const handleResize = () => draw()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [draw])

  return (
    <div ref={containerRef} className="w-full h-full bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
