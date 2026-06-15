'use client'

import { MutableRefObject, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'

const KEY_MODEL_URL = '/asset/3dobj/keys.obj'

type ScrollState = {
  progress: number
  active: boolean
}

type KeyPoint = {
  x: number
  y: number
  z: number
  loop: number
  spiralFade: number
  settle: number
}

type PointerState = {
  x: number
  y: number
  active: boolean
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp01((value - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function closestAngleTarget(current: number, target: number) {
  const fullTurn = Math.PI * 2
  return target + Math.round((current - target) / fullTurn) * fullTurn
}

function getKeyPoint(progress: number): KeyPoint {
  const t = progress
  const loop = Math.PI * 2 * 3.25
  const phase = t * loop + Math.PI / 2
  const spiralFade = 1 - smoothstep(0.94, 1, t)
  const settle = smoothstep(0.86, 1, t)
  const exit = smoothstep(0.91, 1, t)
  const centerX = THREE.MathUtils.lerp(2.25, -2.25, smoothstep(0, 1, t))
  const ampX = THREE.MathUtils.lerp(1.52, 0.72, t) * spiralFade
  const ampZ = THREE.MathUtils.lerp(0.46, 0.14, t) * spiralFade
  const pathX = centerX + Math.sin(phase) * ampX
  const pathY = THREE.MathUtils.lerp(1.5, -1.34, t) + Math.cos(phase) * 0.22 * spiralFade

  return {
    x: THREE.MathUtils.lerp(pathX, -3.15, exit),
    y: THREE.MathUtils.lerp(pathY, -2.2, exit),
    z: Math.cos(phase) * ampZ,
    loop,
    spiralFade,
    settle,
  }
}

function getPathLean(progress: number) {
  const current = getKeyPoint(progress)
  const next = getKeyPoint(clamp01(progress + 0.006))
  const dx = next.x - current.x
  return THREE.MathUtils.clamp(dx * 3.5, -0.62, 0.62)
}

function useKeyScrollProgress() {
  const [state, setState] = useState<ScrollState>({ progress: 0, active: false })

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const start = document.querySelector<HTMLElement>('[data-key-guide-start]')
      const end = document.querySelector<HTMLElement>('[data-key-guide-end]')
      if (!start || !end) return

      const scrollY = window.scrollY || window.pageYOffset
      const viewportH = window.innerHeight || 1
      const startY = start.getBoundingClientRect().top + scrollY - viewportH * 0.35
      const endY = end.getBoundingClientRect().top + scrollY - viewportH * 0.62
      const progress = clamp01((scrollY - startY) / Math.max(1, endY - startY))
      const active = scrollY >= startY - viewportH * 0.12 && scrollY <= endY + viewportH * 0.2
      setState((prev) => {
        if (Math.abs(prev.progress - progress) < 0.002 && prev.active === active) return prev
        return { progress, active }
      })
    }

    const requestMeasure = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    requestMeasure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', requestMeasure)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', requestMeasure)
    }
  }, [])

  return state
}

function normalizeObject(object: THREE.Group) {
  const box = new THREE.Box3().setFromObject(object)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  const maxAxis = Math.max(size.x, size.y, size.z) || 1
  const scale = 1.72 / maxAxis
  object.scale.setScalar(scale)
  object.position.copy(center.multiplyScalar(-scale))
}

function makeGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
  gradient.addColorStop(0, 'rgba(255, 246, 188, 0.95)')
  gradient.addColorStop(0.26, 'rgba(255, 217, 112, 0.45)')
  gradient.addColorStop(0.62, 'rgba(255, 180, 48, 0.18)')
  gradient.addColorStop(1, 'rgba(255, 180, 48, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function GoldKeyModel({
  progress,
  pointerRef,
}: {
  progress: number
  pointerRef: MutableRefObject<PointerState>
}) {
  const loaded = useLoader(OBJLoader, KEY_MODEL_URL)
  const key = useMemo(() => {
    const base = loaded.clone()

    normalizeObject(base)

    base.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      child.castShadow = true
      child.receiveShadow = true
      child.material = new THREE.MeshStandardMaterial({
        color: '#ffdc78',
        metalness: 1,
        roughness: 0.08,
        emissive: '#ffc94a',
        emissiveIntensity: 0.95,
      })
    })

    const group = new THREE.Group()
    group.add(base)
    return group
  }, [loaded])

  const group = useRef<THREE.Group>(null)
  const orientGroup = useRef<THREE.Group>(null)
  const spinGroup = useRef<THREE.Group>(null)
  const topHalo = useRef<THREE.Sprite>(null)
  const midHalo = useRef<THREE.Sprite>(null)
  const bottomHalo = useRef<THREE.Sprite>(null)
  const light = useRef<THREE.PointLight>(null)
  const glowTexture = useMemo(makeGlowTexture, [])
  const smoothProgress = useRef(progress)
  const hoverAmount = useRef(0)
  const hoverTwist = useRef(0)
  const projected = useMemo(() => new THREE.Vector3(), [])
  const hoverAnchor = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame(({ camera, size }, delta) => {
    const g = group.current
    const o = orientGroup.current
    const s = spinGroup.current
    if (!g || !o || !s) return

    smoothProgress.current = THREE.MathUtils.damp(smoothProgress.current, progress, 8.5, delta)
    const t = smoothProgress.current
    const point = getKeyPoint(t)

    g.position.set(point.x, point.y, point.z)
    g.rotation.set(0, 0, 0)
    g.scale.setScalar(THREE.MathUtils.lerp(0.34, 0.4, point.settle) * (1 + hoverAmount.current * 0.08))
    const pathLean = getPathLean(t) * point.spiralFade
    const travelZ = -0.06 - pathLean + Math.sin(t * point.loop) * 0.08 * point.spiralFade
    o.rotation.x = -0.03
    o.rotation.y = 0.1
    o.rotation.z = travelZ
    s.rotation.x = 0
    s.rotation.y = hoverTwist.current
    s.rotation.z = 0
    g.updateMatrixWorld()

    projected.copy(hoverAnchor).applyMatrix4(s.matrixWorld).project(camera)

    const screenX = (projected.x * 0.5 + 0.5) * size.width
    const screenY = (-projected.y * 0.5 + 0.5) * size.height
    const pointer = pointerRef.current
    const dx = pointer.x - screenX
    const dy = pointer.y - screenY
    const hovered = pointer.active && Math.hypot(dx, dy) < 74
    hoverAmount.current = THREE.MathUtils.damp(hoverAmount.current, hovered ? 1 : 0, 12, delta)

    if (hovered) {
      hoverTwist.current += delta * 5.8
    } else {
      hoverTwist.current = THREE.MathUtils.damp(
        hoverTwist.current,
        closestAngleTarget(hoverTwist.current, 0),
        7,
        delta,
      )
    }

    if (light.current) {
      light.current.position.copy(g.position)
      light.current.position.z += 1.4
      light.current.intensity = THREE.MathUtils.lerp(6.2, 9.2, point.settle) + hoverAmount.current * 3.4
    }

    const haloPulse = 1 + hoverAmount.current * 0.14
    const haloOpacity = 0.42 + hoverAmount.current * 0.16
    ;[
      { sprite: topHalo.current, scale: 0.72, opacity: haloOpacity + 0.06 },
      { sprite: midHalo.current, scale: 0.62, opacity: haloOpacity - 0.06 },
      { sprite: bottomHalo.current, scale: 0.58, opacity: haloOpacity },
    ].forEach(({ sprite, scale, opacity }) => {
      if (!sprite) return
      sprite.scale.setScalar(scale * haloPulse)
      const material = sprite.material as THREE.SpriteMaterial
      material.opacity = opacity
    })
  })

  return (
    <>
      <pointLight ref={light} color="#ffd86a" distance={5.2} intensity={5.6} />
      <group ref={group}>
        <group ref={orientGroup}>
          <sprite ref={topHalo} position={[0, 0.42, -0.08]} scale={[0.72, 0.72, 1]}>
            <spriteMaterial
              map={glowTexture}
              color="#ffe08a"
              transparent
              opacity={0.48}
              depthWrite={false}
              depthTest={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <sprite ref={midHalo} position={[0, -0.02, -0.08]} scale={[0.62, 0.62, 1]}>
            <spriteMaterial
              map={glowTexture}
              color="#ffd86a"
              transparent
              opacity={0.36}
              depthWrite={false}
              depthTest={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <sprite ref={bottomHalo} position={[0, -0.52, -0.08]} scale={[0.58, 0.58, 1]}>
            <spriteMaterial
              map={glowTexture}
              color="#ffd36a"
              transparent
              opacity={0.42}
              depthWrite={false}
              depthTest={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <group ref={spinGroup}>
            <primitive object={key} />
          </group>
        </group>
      </group>
    </>
  )
}

function Scene({
  progress,
  pointerRef,
}: {
  progress: number
  pointerRef: MutableRefObject<PointerState>
}) {
  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight position={[2, 5, 5]} intensity={4.8} color="#fff0cc" />
      <directionalLight position={[-4, -2, 3]} intensity={1.4} color="#8fb5ff" />
      <Suspense fallback={null}>
        <GoldKeyModel progress={progress} pointerRef={pointerRef} />
      </Suspense>
    </>
  )
}

export default function GoldKeyGuide({ enabled = true }: { enabled?: boolean }) {
  const { progress, active } = useKeyScrollProgress()
  const pointerRef = useRef<PointerState>({ x: -9999, y: -9999, active: false })
  const opacity = enabled && active ? smoothstep(0, 0.08, progress) * (1 - smoothstep(0.95, 1, progress)) : 0

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true }
    }
    const onPointerLeave = () => {
      pointerRef.current = { x: -9999, y: -9999, active: false }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[0] pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
    >
      <Canvas
        dpr={[1, 1.6]}
        camera={{ fov: 36, position: [0, 0, 5.4] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene progress={progress} pointerRef={pointerRef} />
      </Canvas>
    </div>
  )
}
