'use client'

import { useEffect, useRef, useCallback } from 'react'

const TOTAL = 90
// Frames per second for the animation
const FPS = 17

export default function LeopardBg() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const framesRef    = useRef<HTMLImageElement[]>([])
  const idxRef       = useRef(0)
  const dirRef       = useRef(1)
  const lastTimeRef  = useRef<number>(0)
  const rafRef       = useRef<number>(0)
  const mouseRef     = useRef({ x: 0.5, y: 0.5 })   // raw 0–1
  const smoothMouse  = useRef({ x: 0.5, y: 0.5 })   // lerped

  // ── Preload all frames ─────────────────────────────────────────────
  useEffect(() => {
    const imgs: HTMLImageElement[] = []
    for (let i = 1; i <= TOTAL; i++) {
      const img = new Image()
      img.src = `/asset/project-section/frame_${String(i).padStart(4, '0')}.png`
      imgs.push(img)
    }
    framesRef.current = imgs
  }, [])

  // ── Draw current frame to canvas ───────────────────────────────────
  const draw = useCallback(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = container.offsetWidth
    const h = container.offsetHeight

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w
      canvas.height = h
    }

    const idx = Math.round(idxRef.current)
    const img = framesRef.current[idx]
    if (!img?.complete || img.naturalWidth === 0) return

    // Crop bottom 55px from source to hide watermark
    const CROP_BOTTOM = 55
    const srcW = img.naturalWidth
    const srcH = img.naturalHeight - CROP_BOTTOM

    // Cover-fit
    const canvasAspect = w / h
    const imgAspect    = srcW / srcH
    let sx = 0, sy = 0, sw = srcW, sh = srcH

    if (imgAspect > canvasAspect) {
      sw = srcH * canvasAspect
      sx = (srcW - sw) / 2
    } else {
      sh = srcW / canvasAspect
      sy = (srcH - sh) / 2
    }

    // Parallax pan — shift source rect based on mouse position
    const PAN_X = (srcW - sw) * 0.25   // max horizontal pan (25% of spare width)
    const PAN_Y = (srcH - sh) * 0.25   // max vertical pan
    const mx = smoothMouse.current.x - 0.5   // -0.5 → +0.5
    const my = smoothMouse.current.y - 0.5
    sx = Math.max(0, Math.min(srcW - sw, sx + mx * PAN_X * 2))
    sy = Math.max(0, Math.min(srcH - sh, sy + my * PAN_Y * 2))

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
  }, [])

  // ── Auto-animate RAF loop (ping-pong) ──────────────────────────────
  useEffect(() => {
    const interval = 1000 / FPS

    const loop = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(loop)

      const delta = timestamp - lastTimeRef.current
      if (delta < interval) return
      lastTimeRef.current = timestamp - (delta % interval)

      // Lerp mouse toward target
      smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.05
      smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.05

      idxRef.current += dirRef.current
      if (idxRef.current >= TOTAL - 1) {
        idxRef.current = TOTAL - 1
        dirRef.current = -1
      } else if (idxRef.current <= 0) {
        idxRef.current = 0
        dirRef.current = 1
      }

      draw()
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  // ── Mouse tracking ────────────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth
      mouseRef.current.y = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // ── Resize ────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => draw()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [draw])

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Dark gradient overlay — keeps text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
    </div>
  )
}
