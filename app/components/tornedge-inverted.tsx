'use client'

import { useEffect, useRef, useState } from 'react'
import { CANVAS_H, BASE_Y, tornNoiseStatic } from './tornedge2'

interface TornEdgeInvertedProps {
  showGlow?: boolean
  color?: string
}

export default function TornEdgeInverted({ showGlow = false, color: propColor }: TornEdgeInvertedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cssHRef = useRef(CANVAS_H)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const color = propColor || (isDark ? '#0f0a08' : '#e8e0d4')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let edgeY = new Float32Array(0)

    const draw = () => {
      const w = canvas.offsetWidth
      const fillW = Math.ceil(canvas.getBoundingClientRect().width) + 4
      const cssH = cssHRef.current

      ctx.clearRect(0, 0, w, cssH)

      const STEP = 2
      const cols = Math.ceil(w / STEP)

      if (edgeY.length !== cols) edgeY = new Float32Array(cols)

      for (let i = 0; i < cols; i++) {
        const nx = i / cols
        edgeY[i] = BASE_Y + tornNoiseStatic(nx)
      }

      ctx.beginPath()
      ctx.moveTo(0, edgeY[0])
      for (let i = 1; i < cols; i++) ctx.lineTo(i * STEP, edgeY[i])

      // Instead of drawing DOWN to cssH, draw UP to 0
      ctx.lineTo(fillW, edgeY[cols - 1])
      ctx.lineTo(fillW, 0)
      ctx.lineTo(0, 0)

      ctx.closePath()
      ctx.fillStyle = color 
      ctx.fill()

      if (showGlow) {
        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.shadowBlur = 5
        ctx.shadowColor = 'rgba(255,255,255,1)'
        ctx.strokeStyle = 'rgba(255,255,255,0.88)'
        for (let i = 0; i < cols - 1; i++) {
          ctx.lineWidth = 1
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
        top: '100%', // Position it exactly BELOW the container!
        left: 0,
        width: '100%',
        height: `${CANVAS_H}px`,
        zIndex: 10,
        pointerEvents: 'none',
        // Slight negative margin-top to prevent any 1px gap
        marginTop: '-1px'
      }}
    />
  )
}
