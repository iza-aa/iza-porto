'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * BurnVeil — a fixed full-screen WebGL layer that BURNS ITSELF AWAY to reveal
 * whatever DOM sits behind it, using the EXACT same flame maths as the
 * about→project transition in LivingCanvasHero (fbm field + threshold sweep +
 * gold flame edge + warm smoke, with alpha = 1 - ash so the canvas turns
 * transparent where it has burned).
 *
 * Unlike LivingCanvasHero (which burns a painting), this veil shows a solid
 * theme-matched colour — the eye reads the FLAME, not what is burning, so the
 * transition is visually identical to about→project. Driven by `progress`
 * (0 = solid/covering, 1 = fully burned/gone).
 */

// The veil is near-black in both themes: the transition reads as the section
// "darkening to black", then the flame eating through the black to reveal the
// next section. A hair warmer in light mode so it isn't pure void.
const VEIL_LIGHT = new THREE.Color('#0a0806')
const VEIL_DARK = new THREE.Color('#070503')

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Flame maths copied verbatim from LivingCanvasHero's uProjectBurn path.
const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uBurn;     // 0 = solid, 1 = fully burned away
  uniform vec3  uBase;     // solid veil colour (theme matched)
  varying vec2  vUv;

  const vec3 FLAME_CORE = vec3(1.0, 1.0, 1.0);
  const vec3 FLAME_HALO = vec3(0.78, 0.85, 1.0);

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 color = uBase;

    float field =
      (1.0 - vUv.y) * 0.72 +
      fbm(vUv * vec2(5.0, 3.4) + vec2(uTime * 0.035, -uTime * 0.018)) * 0.34;
    float threshold = 1.12 - uBurn * 1.32;
    float ash = smoothstep(threshold - 0.10, threshold + 0.08, field);
    float edge =
      smoothstep(threshold - 0.018, threshold + 0.028, field) -
      smoothstep(threshold + 0.03, threshold + 0.105, field);
    ash *= smoothstep(0.02, 0.12, uBurn);
    edge *= smoothstep(0.02, 0.12, uBurn);

    color += FLAME_CORE * edge;
    color += FLAME_HALO * edge * 0.5;
    float smoke = edge * fbm(vUv * 18.0 + uTime * 0.08);
    color = mix(color, vec3(0.13, 0.10, 0.08), smoke * 0.22);

    float alpha = 1.0 - ash;
    alpha = max(alpha, edge * 0.72);

    gl_FragColor = vec4(color, alpha);
  }
`

function VeilPlane({ progressRef, darkRef }: {
  progressRef: React.MutableRefObject<number>
  darkRef: React.MutableRefObject<number>
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBurn: { value: 0 },
    uBase: { value: VEIL_DARK.clone() },
  }), [])

  useFrame((_, delta) => {
    const m = matRef.current
    if (!m) return
    m.uniforms.uTime.value += delta
    // First 18% of progress is the "darken to black" lead-in (handled by the
    // div opacity outside); the flame only starts burning after that, remapped
    // to 0→1 across the remaining 82%.
    const p = progressRef.current
    const burn = p <= 0.18 ? 0 : (p - 0.18) / 0.82
    m.uniforms.uBurn.value = burn
    m.uniforms.uBase.value.lerpColors(VEIL_LIGHT, VEIL_DARK, darkRef.current)
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export default function BurnVeil({
  progress,
  className = '',
}: {
  progress: number
  className?: string
}) {
  const progressRef = useRef(progress)
  progressRef.current = progress
  const darkRef = useRef(1)

  useEffect(() => {
    const update = () => {
      darkRef.current = document.documentElement.classList.contains('dark') ? 1 : 0
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Render only while active to keep GPU free (4 WebGL canvases otherwise run
  // at once → frame drops). Stays mounted (no context rebuild); gated via
  // frameloop + opacity.
  const burning = progress > 0.001 && progress < 0.999
  // Opacity ramps in fast over the first 18% (the "darken to black" lead-in),
  // then holds at 1 while the flame eats through. Mirror on the way out.
  const veilOpacity = burning ? Math.min(1, progress / 0.18) : 0

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{ opacity: veilOpacity }}
    >
      <Canvas
        className="pointer-events-none absolute inset-0"
        style={{ pointerEvents: 'none' }}
        dpr={[1, 1.5]}
        frameloop={burning ? 'always' : 'never'}
        camera={{ fov: 45, position: [0, 0, 2] }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <VeilPlane progressRef={progressRef} darkRef={darkRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
