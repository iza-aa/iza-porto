'use client'

import { useEffect, useMemo, useRef, type ReactNode } from 'react'

function hash(x: number, y: number) {
  const px = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return px - Math.floor(px)
}

function smoothNoise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy
}

function fbm(x: number, y: number) {
  let v = 0
  let amp = 0.5
  for (let i = 0; i < 5; i++) {
    v += amp * smoothNoise(x, y)
    x *= 2.02
    y *= 2.02
    amp *= 0.5
  }
  return v
}

const MW = 160
const MH = 90

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function buildBurnMask(progress: number): string {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  canvas.width = MW
  canvas.height = MH
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const img = ctx.createImageData(MW, MH)
  const threshold = 1.12 - progress * 1.32
  const gate = smoothstep(0.02, 0.12, progress)

  for (let py = 0; py < MH; py++) {
    const vy = py / (MH - 1)
    for (let px = 0; px < MW; px++) {
      const vx = px / (MW - 1)
      const field = (1 - vy) * 0.72 + fbm(vx * 5.0, vy * 3.4) * 0.34
      const ash = smoothstep(threshold - 0.10, threshold + 0.08, field) * gate
      const i = (py * MW + px) * 4
      img.data[i] = 255
      img.data[i + 1] = 255
      img.data[i + 2] = 255
      img.data[i + 3] = Math.round((1 - ash) * 255)
    }
  }

  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

export default function BurnEdgeMask({
  className = '',
  burnProgress = 0,
  children,
}: {
  className?: string
  burnProgress?: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const step = useMemo(() => Math.round(Math.max(0, Math.min(1, burnProgress ?? 0)) * 40) / 40, [burnProgress])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (step <= 0) {
      el.style.webkitMaskImage = ''
      el.style.maskImage = ''
      return
    }

    const url = buildBurnMask(step)
    if (!url) return
    el.style.webkitMaskImage = `url("${url}")`
    el.style.maskImage = `url("${url}")`
    el.style.webkitMaskSize = '100% 100%'
    el.style.maskSize = '100% 100%'
    el.style.webkitMaskRepeat = 'no-repeat'
    el.style.maskRepeat = 'no-repeat'
  }, [step])

  return (
    <div ref={ref} className={`${className} relative overflow-hidden`}>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
