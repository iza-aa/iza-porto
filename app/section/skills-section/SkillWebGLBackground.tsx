'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const BG_URL = '/asset/skill-section/skill-section-bg.jpg'
const IMG_ASPECT = 2877 / 2250

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPlaneAspect;
  uniform float uImgAspect;
  uniform float uDark;        // 0 = light mode, 1 = dark mode
  varying vec2 vUv;

  void main() {
    float zoom = 1.38 + 0.018 * sin(uTime * 0.045);
    vec2 drift = vec2(sin(uTime * 0.027), cos(uTime * 0.020)) * 0.010;
    vec2 ratio = vec2(
      min(uPlaneAspect / uImgAspect, 1.0),
      min(uImgAspect / uPlaneAspect, 1.0)
    );
    vec2 cropSize = ratio / zoom;
    vec2 maxOffset = max(vec2(0.0), (vec2(1.0) - cropSize) * 0.5);
    vec2 cropCenter = vec2(0.5 + maxOffset.x * 0.72, 0.44);
    vec2 uv = (vUv - 0.5) * cropSize + cropCenter + drift + uPointer * 0.012;
    uv = clamp(uv, vec2(0.001), vec2(0.999));

    vec3 color = texture2D(uMap, uv).rgb;

    // Theme dimming: light mode keeps the painting bright; dark mode sinks it
    // toward a deep warm brown like the other sections at night.
    color = mix(color, vec3(0.09, 0.055, 0.035), uDark * 0.42);

    // Painterly edge vignette, deeper in dark mode.
    float vig = smoothstep(1.30, 0.48, length(vUv - 0.5) * 1.7);
    color *= mix(1.0, mix(0.82, 0.62, uDark), 1.0 - vig);

    gl_FragColor = vec4(color, 1.0);
  }
`

function BackgroundPlane({ darkRef }: { darkRef: React.MutableRefObject<number> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const texture = useLoader(THREE.TextureLoader, BG_URL)
  const { viewport } = useThree()
  const pointerTarget = useRef(new THREE.Vector2(0, 0))

  useMemo(() => {
    texture.colorSpace = THREE.NoColorSpace
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
    texture.anisotropy = 4
  }, [texture])

  const uniforms = useMemo(() => ({
    uMap: { value: texture },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uPlaneAspect: { value: 16 / 9 },
    uImgAspect: { value: IMG_ASPECT },
    uDark: { value: 0 },
  }), [texture])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerTarget.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      )
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    const mat = matRef.current
    if (!mat) return
    mat.uniforms.uTime.value += delta
    mat.uniforms.uPointer.value.lerp(pointerTarget.current, 0.045)
    mat.uniforms.uPlaneAspect.value = viewport.width / viewport.height
    // Ease toward the live theme value so toggling fades smoothly
    mat.uniforms.uDark.value += (darkRef.current - mat.uniforms.uDark.value) * 0.08
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function SkillWebGLBackground() {
  const [isDark, setIsDark] = useState(true)
  const darkRef = useRef(1)
  useEffect(() => {
    const update = () => {
      const dark = document.documentElement.classList.contains('dark')
      setIsDark(dark)
      darkRef.current = dark ? 1 : 0
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#d8d4c4] dark:bg-[#120b05]">
      <Canvas
        className="pointer-events-none absolute inset-0"
        style={{ pointerEvents: 'none' }}
        dpr={[1, 1.75]}
        camera={{ fov: 45, position: [0, 0, 2] }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <BackgroundPlane darkRef={darkRef} />
        </Suspense>
      </Canvas>

      <style>{`
        @keyframes skill-shaft { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.62; } }
        @keyframes skill-haze  { 0%, 100% { transform: translateX(-3%); } 50% { transform: translateX(3%); } }
      `}</style>

      {/* Soft light shaft — warm gold (light) / cool moonlight (dark) */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background: isDark
            ? 'linear-gradient(118deg, rgba(180,205,255,0.2) 0%, rgba(150,180,235,0.07) 28%, transparent 55%)'
            : 'linear-gradient(118deg, rgba(255,232,170,0.32) 0%, rgba(255,222,150,0.1) 28%, transparent 55%)',
          animation: 'skill-shaft 11s ease-in-out infinite',
        }}
      />
      {/* Drifting haze/cloud at the top edge — warm cream / cool silver */}
      <div
        className="absolute top-[-8%] left-[-8%] right-[-8%] h-[24%]"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(186,198,224,0.18), transparent 82%)'
            : 'linear-gradient(to bottom, rgba(238,226,200,0.3), transparent 82%)',
          filter: 'blur(14px)',
          animation: 'skill-haze 26s ease-in-out infinite',
        }}
      />
      {/* Canvas grain */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: 'url("/asset/noise.png")', opacity: 0.07 }}
      />
    </div>
  )
}
