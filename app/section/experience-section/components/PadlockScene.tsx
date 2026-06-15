'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * PadlockScene — a real 3D gold padlock for the finale's "unlocking" beat.
 *
 * Geometry is built from primitives (no external model): a rounded body + a
 * torus shackle + a keyhole. Brushed-gold PBR material lit by three coloured
 * lights so it reads as warm metal against the black gallery.
 *
 * Driven by `opening`:
 *   false → idle: slow turn + gentle bob, shackle closed.
 *   true  → the shackle lifts & swings open, the body settles, then the whole
 *           lock drifts up and fades (handled by the parent via `onOpened`).
 */

const GOLD = '#c9a227'
const GOLD_HI = '#f0d27a'

function Lock({ opening, onOpened }: { opening: boolean; onOpened: () => void }) {
  const group = useRef<THREE.Group>(null)
  const shackle = useRef<THREE.Group>(null)
  const t = useRef(0)
  const openAmt = useRef(0) // 0 closed → 1 fully open
  const firedRef = useRef(false)

  useFrame((_, delta) => {
    t.current += delta
    const g = group.current
    const s = shackle.current
    if (!g || !s) return

    if (!opening) {
      // Idle: slow continuous turn + breathing bob.
      g.rotation.y += delta * 0.5
      g.position.y = Math.sin(t.current * 1.2) * 0.06
      g.position.x = 0
      g.scale.setScalar(1)
    } else {
      // Ease the open amount toward 1.
      openAmt.current = Math.min(1, openAmt.current + delta * 0.9)
      const e = 1 - Math.pow(1 - openAmt.current, 3) // easeOutCubic

      // Snap to face the camera as it opens.
      g.rotation.y += (0 - (g.rotation.y % (Math.PI * 2))) * Math.min(1, delta * 4)
      // Shackle lifts up then pivots open.
      s.position.y = 0.42 + e * 0.32
      s.rotation.z = e * 0.9
      // Whole lock rises & shrinks slightly as it "dissolves" into the signature.
      g.position.y = e * 0.9
      g.scale.setScalar(1 - e * 0.25)

      if (openAmt.current >= 0.999 && !firedRef.current) {
        firedRef.current = true
        onOpened()
      }
    }
  })

  return (
    <group ref={group}>
      {/* Body — rounded box */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.25, 0.55]} />
        <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.28} emissive={GOLD} emissiveIntensity={0.06} />
      </mesh>
      {/* Bevel ring around body face */}
      <mesh position={[0, 0, 0.28]}>
        <torusGeometry args={[0.55, 0.05, 16, 48]} />
        <meshStandardMaterial color={GOLD_HI} metalness={1} roughness={0.2} />
      </mesh>
      {/* Keyhole */}
      <mesh position={[0, -0.05, 0.3]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 24]} />
        <meshStandardMaterial color="#1a1208" metalness={0.6} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.28, 0.3]}>
        <boxGeometry args={[0.12, 0.32, 0.1]} />
        <meshStandardMaterial color="#1a1208" metalness={0.6} roughness={0.6} />
      </mesh>

      {/* Shackle — the U-bar that lifts open */}
      <group ref={shackle} position={[0, 0.42, 0]}>
        <mesh>
          <torusGeometry args={[0.45, 0.11, 20, 40, Math.PI]} />
          <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.25} />
        </mesh>
        {/* two legs of the shackle */}
        <mesh position={[-0.45, -0.25, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.5, 20]} />
          <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.25} />
        </mesh>
        <mesh position={[0.45, -0.25, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.5, 20]} />
          <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.25} />
        </mesh>
      </group>
    </group>
  )
}

export default function PadlockScene({ opening, onOpened }: { opening: boolean; onOpened: () => void }) {
  return (
    <Canvas
      className="pointer-events-none"
      dpr={[1, 1.75]}
      camera={{ fov: 40, position: [0, 0, 5] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        {/* Warm museum lighting on the gold */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} color="#fff0cc" />
        <pointLight position={[-4, -2, 3]} intensity={1.4} color="#c9a227" />
        <pointLight position={[0, 2, -4]} intensity={1.0} color="#7da0ff" />
        <Lock opening={opening} onOpened={onOpened} />
      </Suspense>
    </Canvas>
  )
}
