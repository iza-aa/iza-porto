'use client'

import { useEffect, useRef } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const CANVAS_H   = 160   // CSS px canvas height
const OVERLAP_PX = 95    // canvas extends this far above text zone into video zone
const BASE_Y     = 95    // wave baseline in canvas space = text zone top
const SPEED      = 0.003

// ─── Layered noise ────────────────────────────────────────────────────────────
function tornNoise(nx: number, t: number): number {
  return (
    Math.sin(nx *  3.1  + t * 1.20) * 16  +
    Math.sin(nx *  8.7  - t * 0.85) * 10  +
    Math.sin(nx * 21.3  + t * 1.55) *  5  +
    Math.sin(nx * 47.9  - t * 0.70) *  3  +
    Math.sin(nx * 103.1 + t * 1.30) *  1.5+
    Math.sin(nx * 223.7 - t * 0.45) *  0.7
  )
}



// ─── Grain dots ───────────────────────────────────────────────────────────────
interface GrainDot {
  nx: number; dy: number; size: number
  baseOpacity: number; r: number; g: number; b: number
  paletteIdx: number  // C: for sorting by color
}

const PALETTE: [number, number, number][] = [
  [240, 236, 228],
  [255, 255, 255],
  [201, 168,  76],
  [232, 212, 138],
  [218, 196,  92],
]

function buildGrain(count: number): GrainDot[] {
  const dots: GrainDot[] = []
  for (let i = 0; i < count; i++) {
    const dy      = Math.random() * 62 - 32
    const falloff = Math.max(0, 1 - Math.abs(dy) / 33)
    if (falloff < 0.02) continue
    const paletteIdx        = Math.floor(Math.random() * PALETTE.length)
    const [r, g, b] = PALETTE[paletteIdx]
    dots.push({
      nx: Math.random(), dy,
      size: 0.8 + Math.random() * 1.7,
      baseOpacity: falloff * (0.18 + Math.random() * 0.62),
      r, g, b, paletteIdx,
    })
  }
  // C: sort by color so we can set fillStyle once per color group
  dots.sort((a, b) => a.paletteIdx - b.paletteIdx)
  return dots
}

// C: pre-built fillStyle strings — set once per frame per color, not per dot
const PALETTE_FILL = PALETTE.map(([r, g, b]) => `rgb(${r},${g},${b})`)

const GRAIN = buildGrain(1100)

// ─── Extra micro-jitter for the border stroke only ──────────────────────────
// Returns a 0..1 value used to modulate stroke width
function widthNoise(nx: number, t: number): number {
  return 0.5 + 0.5 * (
    Math.sin(nx * 47.3  + t * 0.90) * 0.45 +
    Math.sin(nx * 123.7 - t * 1.40) * 0.30 +
    Math.sin(nx * 289.1 + t * 2.10) * 0.15 +
    Math.sin(nx * 541.3 - t * 1.70) * 0.10
  )
}
// ─── Props ────────────────────────────────────────────────────────────────────
interface TornEdgeProps {
  clipTargetRef?: React.RefObject<HTMLDivElement>
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TornEdge({ clipTargetRef }: TornEdgeProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const tRef          = useRef(0)
  const rafRef        = useRef<number>(0)
  const cssHRef       = useRef(CANVAS_H)  // actual CSS height, updated by ResizeObserver
  const frameCountRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr     = window.devicePixelRatio || 1
      const rect    = canvas.getBoundingClientRect()
      const cssH    = rect.height > 0 ? rect.height : CANVAS_H
      cssHRef.current = cssH
      canvas.width  = Math.round(rect.width  > 0 ? rect.width  * dpr : canvas.offsetWidth * dpr)
      canvas.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // B: arrays di-reuse lintas frame, tidak di-alloc ulang tiap tick
    let edgeY   = new Float32Array(0)
    let wnCache = new Float32Array(0)

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      frameCountRef.current++
      if (frameCountRef.current % 2 !== 0) return  // 30fps throttle

      const w     = canvas.offsetWidth
      const fillW  = Math.ceil(canvas.getBoundingClientRect().width) + 4  // cover subpixel gap
      const cssH = cssHRef.current
      tRef.current += SPEED * 2  // ×2 kompensasi skip frame
      const t = tRef.current

      ctx.clearRect(0, 0, w, cssH)

      // 1. Per-column edge Y (CSS-px space)
      const STEP = 2
      const cols = Math.ceil(w / STEP)
      // B: reuse array, hanya alloc ulang kalau cols berubah (resize)
      if (edgeY.length !== cols)   edgeY   = new Float32Array(cols)
      if (wnCache.length !== cols) wnCache = new Float32Array(cols)
      for (let i = 0; i < cols; i++) {
        edgeY[i]   = BASE_Y + tornNoise(i / cols, t)
        wnCache[i] = widthNoise(i / cols, t)  // B: hitung sekali, pakai di 2 pass
      }

      // 2. Fill from wave to canvas bottom — color follows dark/light mode
      const isDark  = document.documentElement.classList.contains('dark')
      const bgColor = isDark ? '#1a1209' : '#f0ece4'
      ctx.beginPath()
      ctx.moveTo(0, edgeY[0])
      for (let i = 1; i < cols; i++) ctx.lineTo(i * STEP, edgeY[i])
      // Extend wave horizontally to fillW before dropping down — prevents diagonal gap
      ctx.lineTo(fillW, edgeY[cols - 1])
      ctx.lineTo(fillW, cssH)
      ctx.lineTo(0, cssH)
      ctx.closePath()
      ctx.fillStyle = bgColor
      ctx.fill()

      // 3. Glowing white border — 2 separate passes, shadowBlur konstan per pass
      ctx.save()
      ctx.lineCap  = 'round'
      ctx.lineJoin = 'round'

      // Pass 1: outer glow — shadowBlur set sekali, lineWidth variabel
      ctx.shadowColor = 'rgba(255,255,255,0.5)'
      ctx.shadowBlur  = 22
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'
      for (let i = 0; i < cols - 1; i++) {
        const wn  = wnCache[i]  // B: dari cache
        const x0  = i * STEP;       const y0 = edgeY[i]
        const x1  = (i + 1) * STEP; const y1 = edgeY[i + 1]
        ctx.lineWidth = (2 + wn * 9) + 5
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke()
      }

      // Pass 2: core bright line — shadowBlur set sekali, lineWidth variabel
      ctx.shadowBlur  = 5
      ctx.shadowColor = 'rgba(255,255,255,1)'
      ctx.strokeStyle = 'rgba(255,255,255,0.88)'
      for (let i = 0; i < cols - 1; i++) {
        const wn  = wnCache[i]  // B: dari cache
        const x0  = i * STEP;       const y0 = edgeY[i]
        const x1  = (i + 1) * STEP; const y1 = edgeY[i + 1]
        ctx.lineWidth = (2 + wn * 9) * 0.5
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke()
      }

      ctx.restore()
      // C: fillStyle set sekali per color group (5x total), bukan per dot (1100x)
      let currentPaletteIdx = -1
      for (const dot of GRAIN) {
        const col  = Math.min(cols - 1, Math.floor(dot.nx * cols))
        const py   = edgeY[col] + dot.dy
        if (py < -4 || py > cssH + 4) continue
        const fade  = 1 - Math.abs(dot.dy) / 33
        const side  = dot.dy > 0 ? 0.5 : 1.0
        const alpha = dot.baseOpacity * fade * side
        if (alpha < 0.015) continue
        if (dot.paletteIdx !== currentPaletteIdx) {
          ctx.fillStyle = PALETTE_FILL[dot.paletteIdx]  // C: hanya set saat warna berubah
          currentPaletteIdx = dot.paletteIdx
        }
        ctx.globalAlpha = alpha
        ctx.fillRect(Math.round(dot.nx * w), Math.round(py), dot.size, dot.size)
      }
      ctx.globalAlpha = 1

      // 4. Update clip-path polygon on text wrapper (direct DOM — no re-render)
      // Wave in text-wrapper space = edgeY[i] - OVERLAP_PX
      // Since BASE_Y === OVERLAP_PX: waveY = tornNoise(i/cols, t), oscillates ±36px around 0
      if (clipTargetRef?.current) {
        const CLIP_STEP = 6
        let poly = ''
        for (let i = 0; i * CLIP_STEP <= fillW; i++) {
          const col   = Math.min(cols - 1, Math.floor((i * CLIP_STEP) / STEP))
          const waveY = edgeY[col] - OVERLAP_PX
          poly += (poly ? ',' : '') + `${i * CLIP_STEP}px ${waveY.toFixed(1)}px`
        }
        // Extend to fillW at last wave Y, then sweep bottom — matches canvas fill exactly
        poly += `,${fillW}px ${(edgeY[cols - 1] - OVERLAP_PX).toFixed(1)}px`
        poly += `,${fillW}px 9999px,0px 9999px`
        clipTargetRef.current.style.clipPath = `polygon(${poly})`
      }
    }

    tick()
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [clipTargetRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      'absolute',
        top:           `-${OVERLAP_PX}px`,
        left:          0,
        width:         '100%',
        height:        `calc(100% + ${OVERLAP_PX}px)`,
        zIndex:        10,
        pointerEvents: 'none',
      }}
    />
  )
}