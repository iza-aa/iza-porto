'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const BLOCK_SIZE = 4
// 6-step graduated greyscale — smooth dark → bright transitions
const PALETTE = [
  [10, 10, 10, 255],  // 0  – near-black
  [55, 55, 55, 255],  // 1  – dark
  [100, 100, 100, 255],  // 2  – mid-dark
  [150, 150, 150, 255],  // 3  – mid-bright
  [195, 195, 195, 255],  // 4  – light
  [235, 235, 235, 255],  // 5  – near-white
] as const
// Evenly-spaced luminance thresholds between stops
const STEPS = PALETTE.length              // 6
const STEP_SIZE = 256 / STEPS            // ≈ 42.7 per band

/**
 * Hook that returns canvas ref + imperative start/stop trigger.
 * Attach canvasRef to a <canvas> positioned absolute over the image.
 * Call startDither() on hover, stopDither() on leave.
 */
export function useDitheringCanvas(src: string | undefined) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgDataRef = useRef<ImageData | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [active, setActive] = useState(false)

  // Load source image into offscreen pixel data once
  useEffect(() => {
    if (!src) return
    const img = new window.Image()
    img.src = src
    img.onload = () => {
      const W = 600
      const H = Math.round(W * (img.height / img.width))
      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const ctx = off.getContext('2d')!
      ctx.drawImage(img, 0, 0, W, H)
      try {
        imgDataRef.current = ctx.getImageData(0, 0, W, H)
      } catch {
        // Fallback: if tainted, pixel data unavailable — canvas will stay blank
        console.warn('[useDithering] Could not read pixel data for', src)
      }
    }
  }, [src])

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return

    const renderFrame = () => {
      const imgData = imgDataRef.current
      if (!imgData) return

      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      // Physical pixel dimensions
      const physW = Math.round(rect.width * dpr)
      const physH = Math.round(rect.height * dpr)

      // Resize canvas to match physical size
      if (canvas.width !== physW || canvas.height !== physH) {
        canvas.width = physW
        canvas.height = physH
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      // No transform — putImageData works in raw physical pixels
      ctx.setTransform(1, 0, 0, 1, 0, 0)

      const srcW = imgData.width
      const srcH = imgData.height

      // Use BLOCK_SIZE scaled by dpr so blocks look the same physical size
      const block = Math.max(1, Math.round(BLOCK_SIZE * dpr))

      // ── object-cover math ────────────────────────────────────────────────
      // Match exactly what CSS object-cover does: scale to cover, center-crop.
      const scale = Math.max(physW / srcW, physH / srcH)
      const scaledSrcW = srcW * scale
      const scaledSrcH = srcH * scale
      const cropOffX = (scaledSrcW - physW) / 2   // px cropped from each side
      const cropOffY = (scaledSrcH - physH) / 2
      // ─────────────────────────────────────────────────────────────────────

      const out = ctx.createImageData(physW, physH)

      for (let y = 0; y < physH; y += block) {
        for (let x = 0; x < physW; x += block) {
          // Map physical canvas px → source image px (respecting object-cover crop)
          const sx = Math.floor((x + cropOffX) / scale)
          const sy = Math.floor((y + cropOffY) / scale)

          let rSum = 0, gSum = 0, bSum = 0, count = 0
          for (let by = 0; by < block; by++) {
            for (let bx = 0; bx < block; bx++) {
              const px = Math.min(sx + bx, srcW - 1)
              const py = Math.min(sy + by, srcH - 1)
              const i = (py * srcW + px) * 4
              rSum += imgData.data[i]
              gSum += imgData.data[i + 1]
              bSum += imgData.data[i + 2]
              count++
            }
          }

          const lum = 0.299 * (rSum / count) + 0.587 * (gSum / count) + 0.114 * (bSum / count)
          const noise = (Math.random() - 0.5) * 50
          const val = Math.max(0, Math.min(255, lum + noise))
          // Pick the palette stop whose band contains val
          const idx = Math.min(STEPS - 1, Math.floor(val / STEP_SIZE))
          const color = PALETTE[idx]

          for (let by = 0; by < block; by++) {
            for (let bx = 0; bx < block; bx++) {
              const ox = x + bx, oy = y + by
              if (ox >= physW || oy >= physH) continue
              const i = (oy * physW + ox) * 4
              out.data[i] = color[0]
              out.data[i + 1] = color[1]
              out.data[i + 2] = color[2]
              out.data[i + 3] = 255
            }
          }
        }
      }

      ctx.putImageData(out, 0, 0)
    }

    renderFrame()
    timerRef.current = setInterval(renderFrame, 350)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [active])

  return { canvasRef, active, setActive }
}

/**
 * Drop-in background that shows a dithering effect.
 * isHovered should be driven by the PARENT container (not this component),
 * because the phone/mockup layers on top intercept mouse events.
 */
export function DitheringBg({
  src,
  alt = '',
  className = '',
  isHovered = false,
}: {
  src?: string
  alt?: string
  className?: string
  isHovered?: boolean
}) {
  const { canvasRef, setActive } = useDitheringCanvas(src)

  // Sync parent's hover state into the canvas render loop
  useEffect(() => {
    setActive(isHovered)
  }, [isHovered, setActive])

  if (!src) return null

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Original image — fades out on hover */}
      <motion.img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        animate={{ opacity: isHovered ? 0 : 1, filter: isHovered ? 'grayscale(100%) blur(2px)' : 'grayscale(0%) blur(0px)' }}
        transition={{ duration: 0.35 }}
      />

      {/* Dithering canvas — fades in on hover */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* Corner label */}
      <motion.div
        className="absolute bottom-2 left-2 z-10 font-mono text-[9px] text-white/60 bg-black/70 px-1.5 py-0.5 border border-white/20 pointer-events-none select-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        [DITHER_ACTIVE]
      </motion.div>
    </div>
  )
}
