'use client'

import { useEffect, useRef } from 'react'

interface BinaryBackgroundProps {
  className?: string;
  excludeRects?: { x: number, y: number, width: number, height: number }[]; // Area yang tidak boleh ada binary
}

export default function BinaryBackground({ className = '', excludeRects = [] }: BinaryBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
    }

    updateCanvasSize()

    const CELL_SIZE = 48
    const FONT_SIZE = 32
    const cols = Math.ceil(canvas.width / CELL_SIZE)
    const rows = Math.ceil(canvas.height / CELL_SIZE)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT_SIZE}px monospace`
      ctx.fillStyle = 'rgba(180,180,180,0.18)'

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // 30% chance to draw
          if (Math.random() > 0.7) continue

          const px = x * CELL_SIZE
          const py = y * CELL_SIZE

          // Cek apakah posisi ini masuk area exclude
          const inExcluded = excludeRects.some(rect =>
            px + FONT_SIZE > rect.x &&
            px < rect.x + rect.width &&
            py + FONT_SIZE > rect.y &&
            py < rect.y + rect.height
          )
          if (inExcluded) continue

          const binary = Math.random() > 0.5 ? '1' : '0'
          ctx.fillText(binary, px, py + FONT_SIZE)
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      resizeObserver.disconnect()
    }
  }, [excludeRects])

  return (
    <div ref={containerRef} className={`w-full h-full absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  )
}