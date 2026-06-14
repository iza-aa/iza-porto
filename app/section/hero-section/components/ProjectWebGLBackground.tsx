'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const BG_URL = '/asset/project-section/projectbg/leopardbg.jpeg'
const IMG_ASPECT = 1408 / 768

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
  varying vec2 vUv;

  void main() {
    float zoom = 1.06 + 0.012 * sin(uTime * 0.055);
    vec2 drift = vec2(sin(uTime * 0.028), cos(uTime * 0.021)) * 0.006;

    vec2 ratio = vec2(
      min(uPlaneAspect / uImgAspect, 1.0),
      min(uImgAspect / uPlaneAspect, 1.0)
    );
    vec2 uv = (vUv - 0.5) * ratio / zoom + 0.5 + drift;

    vec3 blurred = texture2D(uMap, uv, 5.0).rgb;
    float lum = dot(blurred, vec3(0.299, 0.587, 0.114));
    float depth = 1.0 - lum;
    vec2 parallax = uPointer * (depth - 0.34) * 0.014;

    vec3 color = texture2D(uMap, uv + parallax).rgb;
    color = mix(color, vec3(0.09, 0.055, 0.035), 0.34);

    float vig = smoothstep(1.30, 0.48, length(vUv - 0.5) * 1.7);
    color *= mix(0.68, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`

function BackgroundPlane() {
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

export default function ProjectWebGLBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#120b05]">
      <Canvas
        className="pointer-events-none absolute inset-0"
        style={{ pointerEvents: 'none' }}
        dpr={[1, 1.75]}
        camera={{ fov: 45, position: [0, 0, 2] }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <BackgroundPlane />
        </Suspense>
      </Canvas>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: 'url("/asset/noise.png")', opacity: 0.07 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(10,6,3,0.56) 100%)',
        }}
      />
    </div>
  )
}
