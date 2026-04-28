'use client'

import { useEffect, useRef } from 'react'

// ─── Config (Diexport agar bisa dibaca oleh SkillsSection) ────────────────────
export const CANVAS_H = 160   // Tinggi fix canvas
export const BASE_Y   = 100   // Posisi baseline ombak di dalam canvas

// ─── Static Layered noise ─────────────────────────────────────────────────────
// Diexport agar tinggi garis vertikal bisa menyesuaikan lengkungan ombak
export function tornNoiseStatic(nx: number): number {
  return (
    Math.sin(nx * 3.1) * 16  +
    Math.sin(nx * 8.7) * 10  +
    Math.sin(nx * 21.3) * 5  +
    Math.sin(nx * 47.9) * 3  +
    Math.sin(nx * 103.1) * 1.5+
    Math.sin(nx * 223.7) * 0.7
  )
}

function widthNoiseStatic(nx: number): number {
  return 0.5 + 0.5 * (
    Math.sin(nx * 47.3) * 0.45 +
    Math.sin(nx * 123.7) * 0.30 +
    Math.sin(nx * 289.1) * 0.15 +
    Math.sin(nx * 541.3) * 0.10
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface TornEdgeProps {
  showGlow?: boolean
  color?: string
  clipPath?: string
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TornEdge({ showGlow = true, color = '#fafafa', clipPath }: TornEdgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cssHRef = useRef(CANVAS_H)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let edgeY = new Float32Array(0)
    let wnCache = new Float32Array(0)

    const draw = () => {
      const w = canvas.offsetWidth
      const fillW = Math.ceil(canvas.getBoundingClientRect().width) + 4
      const cssH = cssHRef.current

      ctx.clearRect(0, 0, w, cssH)

      const STEP = 2
      const cols = Math.ceil(w / STEP)

      if (edgeY.length !== cols) edgeY = new Float32Array(cols)
      if (wnCache.length !== cols) wnCache = new Float32Array(cols)

      for (let i = 0; i < cols; i++) {
        const nx = i / cols
        edgeY[i] = BASE_Y + tornNoiseStatic(nx)
        wnCache[i] = widthNoiseStatic(nx)
      }

      ctx.beginPath()
      ctx.moveTo(0, edgeY[0])
      for (let i = 1; i < cols; i++) ctx.lineTo(i * STEP, edgeY[i])

      ctx.lineTo(fillW, edgeY[cols - 1])
      ctx.lineTo(fillW, cssH)
      ctx.lineTo(0, cssH)

      ctx.closePath()
      ctx.fillStyle = color // Warna dinamis berdasarkan prop
      ctx.fill()

      if (showGlow) {
        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.shadowColor = 'rgba(255,255,255,0.5)'
        ctx.shadowBlur = 22
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'
        for (let i = 0; i < cols - 1; i++) {
          const wn = wnCache[i]
          ctx.lineWidth = (2 + wn * 9) + 5
          ctx.beginPath()
          ctx.moveTo(i * STEP, edgeY[i])
          ctx.lineTo((i + 1) * STEP, edgeY[i + 1])
          ctx.stroke()
        }

        ctx.shadowBlur = 5
        ctx.shadowColor = 'rgba(255,255,255,1)'
        ctx.strokeStyle = 'rgba(255,255,255,0.88)'
        for (let i = 0; i < cols - 1; i++) {
          const wn = wnCache[i]
          ctx.lineWidth = (2 + wn * 9) * 0.5
          ctx.beginPath()
          ctx.moveTo(i * STEP, edgeY[i])
          ctx.lineTo((i + 1) * STEP, edgeY[i + 1])
          ctx.stroke()
        }
        ctx.restore()
      }
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const cssH = rect.height > 0 ? rect.height : CANVAS_H
      cssHRef.current = cssH

      canvas.width = Math.round(rect.width > 0 ? rect.width * dpr : canvas.offsetWidth * dpr)
      canvas.height = Math.round(cssH * dpr)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    return () => ro.disconnect()
  }, [showGlow, color]) 

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: `-${CANVAS_H}px`, 
        left: 0,
        width: '100%',
        height: `${CANVAS_H}px`,
        zIndex: 10,
        pointerEvents: 'none',
        clipPath: clipPath, 
        willChange: clipPath ? 'clip-path' : 'auto'
      }}
    />
  )
}