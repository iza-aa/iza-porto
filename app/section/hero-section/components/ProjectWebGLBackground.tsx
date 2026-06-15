'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Per-section living backdrop (scroll-driven) ─────────────────────────────
// The shared WebGL stage behind Project → Skills → Experience holds a small
// gallery of bright frescoes and BURNS from one to the next as each section
// TITLE rises into view. The burn is tied to scroll position frame-by-frame
// (driven by `progressRef`, a continuous float), not a timed animation — so it
// runs forward as you scroll down and reverses as you scroll up. Only the
// backdrop transitions; the content cards never move.
//
// Mapping (one painting per title):
//   0  extended labs    -> skill-section-bg.jpg  (original)
//   1  selected systems -> fresco-1 (Tiepolo, Mercury)
//   2  skills           -> fresco-3 (Tiepolo, Apollo)
//   3  experience       -> fresco-4 (Tiepolo, Planets & Continents)
// Paintings 1-3 are Met Museum Open Access (public domain).
//
// Each painting also carries a zoom `technique` chosen for its composition —
// all run scroll-down = zoom OUT, scroll-up = zoom IN, subtle, alongside the
// burn. Techniques:
//   0 PARALLAX DEPTH  — flat zoom + luminance parallax (enter the landscape)
//   1 PERSPECTIVE TILT — zoom with a vanishing tilt (look up into the sky)
//   2 DOLLY / VERTIGO  — centre fixed, edges bow (radial compositions)
//   3 LENS BARREL      — barrel distortion pulls edges toward the open centre
const TECH = { PARALLAX: 0, TILT: 1, VERTIGO: 2, BARREL: 3 } as const
const PAINTINGS: { url: string; aspect: number; technique: number }[] = [
  { url: '/asset/skill-section/skill-section-bg.jpg', aspect: 2877 / 2250, technique: TECH.PARALLAX }, // extended labs (landscape)
  { url: '/asset/webgl-bg/fresco-1.jpg', aspect: 3042 / 3716, technique: TECH.TILT },                 // selected systems (rising figures)
  { url: '/asset/webgl-bg/fresco-3.jpg', aspect: 3038 / 3716, technique: TECH.VERTIGO },              // skills (radial Apollo)
  { url: '/asset/webgl-bg/fresco-4.jpg', aspect: 2996 / 3973, technique: TECH.BARREL },               // experience (framed open sky)
]
const FINALE_ORDER = [3, 0, 1, 2, 3]

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Samples TWO paintings (A = current section, B = next section) and dissolves
// between them with an fbm "burn" front driven by uMix (the scroll fraction).
// Same burn language as the hero→project reveal, kept of-one-family.
const FRAGMENT = /* glsl */ `
  uniform sampler2D uMapA;
  uniform sampler2D uMapB;
  uniform float uAspectA;
  uniform float uAspectB;
  uniform float uTechA;          // zoom technique id for A / B
  uniform float uTechB;
  uniform float uZoomA;          // 0 = zoomed-in (reading), 1 = zoomed-out (scrolled past)
  uniform float uZoomB;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uPlaneAspect;
  uniform float uMix;            // 0 = fully A, 1 = fully B (scroll-driven)
  uniform float uForceSobel;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
               mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p*=2.02; a*=0.5; }
    return v;
  }

  // tech: which perspective zoom to apply · z: 0 (zoomed-in) → 1 (zoomed-out).
  // All amplitudes are deliberately SUBTLE (museum-grade, no nausea).
  vec3 samplePainting(sampler2D map, float imgAspect, float tech, float z, vec2 baseUv){
    // gentle ambient breathing (kept from before) as the base scale
    float breathe = 1.06 + 0.012 * sin(uTime * 0.055);
    vec2 drift = vec2(sin(uTime * 0.028), cos(uTime * 0.021)) * 0.006;

    // scroll zoom: zoomed-in (z=0) is closer (larger), zoomed-out (z=1) pulls back.
    // Gentle range so the painting never drifts out of frame across a long
    // section, but with a touch more presence to match the livelier tempo.
    float scrollZoom = mix(1.12, 0.98, z);

    // centred, aspect-correct uv
    vec2 ratio = vec2(
      min(uPlaneAspect / imgAspect, 1.0),
      min(imgAspect / uPlaneAspect, 1.0)
    );
    vec2 c = (baseUv - 0.5);                       // -0.5..0.5 from centre
    float zoom = breathe * scrollZoom;
    vec2 uv = c * ratio / zoom;                    // pre-recentre (still centred)

    // ── per-technique perspective warp (applied in centred space) ──
    if (tech > 2.5) {
      // 3 LENS BARREL — edges bow toward centre as we zoom in. Strength fades
      // as we zoom out so the framed figures relax outward.
      float r2 = dot(uv, uv);
      float k = -0.32 * (1.0 - z);                 // negative = barrel (pull in)
      uv *= (1.0 + k * r2);
    } else if (tech > 1.5) {
      // 2 DOLLY / VERTIGO — centre fixed, radial stretch changes with zoom so
      // the surrounding ring seems to rush past the still centre.
      float r = length(uv);
      float v = 0.10 * (0.5 - z);                  // +in / -out, signed
      uv *= (1.0 + v * smoothstep(0.0, 0.7, r));
    } else if (tech > 0.5) {
      // 1 PERSPECTIVE TILT — a vanishing tilt toward the top, like looking up
      // into the ceiling. Upper part recedes faster.
      float tilt = 0.12 * (1.0 - z);               // strongest when zoomed in
      uv.x *= (1.0 + tilt * (0.5 - uv.y));         // converge toward top
      uv.y += tilt * 0.10 * (1.0 - z);             // lift the horizon a touch
    }
    // tech 0 PARALLAX DEPTH needs no warp here — the parallax below does it.

    uv += 0.5 + drift;                             // recentre

    vec3 blurred = texture2D(map, uv, 5.0).rgb;
    float lum = dot(blurred, vec3(0.299, 0.587, 0.114));
    float depth = 1.0 - lum;
    // depth parallax: cursor + a scroll-coupled push for technique 0 so the
    // landscape gains real in/out depth (far moves less than near).
    float depthPush = (tech < 0.5) ? (0.018 * (0.5 - z)) : 0.0;
    vec2 parallax = uPointer * (depth - 0.34) * 0.014
                  + vec2(0.0, 1.0) * (depth - 0.5) * depthPush;

    vec3 color = texture2D(map, uv + parallax).rgb;
    color = mix(color, vec3(0.09, 0.055, 0.035), 0.34);
    return color;
  }

  vec3 sobelPainting(sampler2D map, float imgAspect, float tech, float z, vec2 baseUv){
    vec2 texel = vec2(1.0 / 900.0, 1.0 / 900.0);

    float tl = dot(samplePainting(map, imgAspect, tech, z, baseUv + texel * vec2(-1.0,  1.0)), vec3(0.299, 0.587, 0.114));
    float  t = dot(samplePainting(map, imgAspect, tech, z, baseUv + texel * vec2( 0.0,  1.0)), vec3(0.299, 0.587, 0.114));
    float tr = dot(samplePainting(map, imgAspect, tech, z, baseUv + texel * vec2( 1.0,  1.0)), vec3(0.299, 0.587, 0.114));
    float  l = dot(samplePainting(map, imgAspect, tech, z, baseUv + texel * vec2(-1.0,  0.0)), vec3(0.299, 0.587, 0.114));
    float  r = dot(samplePainting(map, imgAspect, tech, z, baseUv + texel * vec2( 1.0,  0.0)), vec3(0.299, 0.587, 0.114));
    float bl = dot(samplePainting(map, imgAspect, tech, z, baseUv + texel * vec2(-1.0, -1.0)), vec3(0.299, 0.587, 0.114));
    float  b = dot(samplePainting(map, imgAspect, tech, z, baseUv + texel * vec2( 0.0, -1.0)), vec3(0.299, 0.587, 0.114));
    float br = dot(samplePainting(map, imgAspect, tech, z, baseUv + texel * vec2( 1.0, -1.0)), vec3(0.299, 0.587, 0.114));

    float gx = -tl - 2.0 * l - bl + tr + 2.0 * r + br;
    float gy = -bl - 2.0 * b - br + tl + 2.0 * t + tr;
    float edgeStrength = length(vec2(gx, gy));
    edgeStrength = smoothstep(0.055, 0.38, edgeStrength);
    edgeStrength = pow(edgeStrength, 0.72);

    float grit = fbm(baseUv * 130.0 + vec2(uTime * 0.08, -uTime * 0.05));
    float scratches = smoothstep(0.955, 1.0, noise(baseUv * vec2(260.0, 38.0) + uTime * 0.04));
    vec3 paperBlack = vec3(0.012, 0.013, 0.014);
    vec3 graphite = vec3(0.76, 0.80, 0.84) * (0.76 + grit * 0.34);
    vec3 sobel = mix(paperBlack, graphite, edgeStrength);
    sobel += vec3(0.12, 0.13, 0.14) * scratches * edgeStrength;
    sobel += (grit - 0.5) * 0.035;
    return max(sobel, paperBlack);
  }

  void main() {
    vec3 colA = samplePainting(uMapA, uAspectA, uTechA, uZoomA, vUv);
    vec3 colB = samplePainting(uMapB, uAspectB, uTechB, uZoomB, vUv);
    vec3 sobelA = sobelPainting(uMapA, uAspectA, uTechA, uZoomA, vUv);
    vec3 sobelB = sobelPainting(uMapB, uAspectB, uTechB, uZoomB, vUv);

    // Burn dissolve: an fbm field gated by uMix decides per-pixel whether B has
    // taken over yet. A thin bright ember rides the front. Because uMix is the
    // scroll fraction and A/B are always (current, next), this is a pure
    // function of scroll — no stateful hand-off, so it never flips back.
    float field = fbm(vUv * vec2(5.0, 3.4));
    float front = uMix * 1.28 - 0.14;
    float edge = smoothstep(front - 0.10, front + 0.06, field);
    float toB = 1.0 - edge;

    // The new painting first appears as a dark graphite Sobel pass, then
    // resolves into the full fresco as the burn completes.
    float sobelHold = 1.0 - smoothstep(0.48, 0.92, uMix);
    sobelHold *= smoothstep(0.04, 0.24, uMix);
    vec3 revealB = mix(colB, sobelB, sobelHold);
    vec3 color = mix(colA, revealB, toB);

    // white-hot ember on the burn front (only while transitioning)
    float ember = clamp(1.0 - abs(field - front) * 9.0, 0.0, 1.0);
    ember *= step(0.001, uMix) * step(uMix, 0.999);
    color += vec3(1.0, 1.0, 1.0) * ember * 0.5;

    float vig = smoothstep(1.30, 0.48, length(vUv - 0.5) * 1.7);
    color *= mix(0.68, 1.0, vig);

    vec3 forcedSobel = mix(sobelA, sobelB, uMix);
    float forceField = fbm(vUv * vec2(5.0, 3.4) + vec2(0.19, -0.13));
    float forceFront = uForceSobel * 1.28 - 0.14;
    float forceMask = 1.0 - smoothstep(forceFront - 0.10, forceFront + 0.06, forceField);
    float forceEmber = clamp(1.0 - abs(forceField - forceFront) * 9.0, 0.0, 1.0);
    forceEmber *= step(0.001, uForceSobel) * step(uForceSobel, 0.999);
    color = mix(color, forcedSobel, forceMask);
    color += vec3(1.0) * forceEmber * 0.36;

    gl_FragColor = vec4(color, 1.0);
  }
`

function BackgroundPlane({
  progressRef,
  zoomDwellRef,
  forceSobelRef,
  forceSobelMixRef,
}: {
  progressRef: React.MutableRefObject<number>
  zoomDwellRef: React.MutableRefObject<number[]>
  forceSobelRef?: React.MutableRefObject<number>
  forceSobelMixRef?: React.MutableRefObject<number>
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const textures = useLoader(THREE.TextureLoader, PAINTINGS.map((p) => p.url))
  const { viewport } = useThree()
  const pointerTarget = useRef(new THREE.Vector2(0, 0))
  const lastPair = useRef<[number, number]>([-1, -1])

  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.NoColorSpace
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
      t.anisotropy = 4
    })
  }, [textures])

  const uniforms = useMemo(
    () => ({
      uMapA: { value: textures[0] },
      uMapB: { value: textures[1] ?? textures[0] },
      uAspectA: { value: PAINTINGS[0].aspect },
      uAspectB: { value: PAINTINGS[1]?.aspect ?? PAINTINGS[0].aspect },
      uTechA: { value: PAINTINGS[0].technique },
      uTechB: { value: PAINTINGS[1]?.technique ?? PAINTINGS[0].technique },
      uZoomA: { value: 0 },
      uZoomB: { value: 0 },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPlaneAspect: { value: 16 / 9 },
      uMix: { value: 0 },
      uForceSobel: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textures]
  )

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

  const maxIndex = PAINTINGS.length - 1
  const finaleMaxIndex = FINALE_ORDER.length - 1

  useFrame((_, delta) => {
    const mat = matRef.current
    if (!mat) return
    mat.uniforms.uTime.value += delta
    mat.uniforms.uPointer.value.lerp(pointerTarget.current, 0.045)
    mat.uniforms.uPlaneAspect.value = viewport.width / viewport.height

    // Scroll-driven: progress (float) → which pair + how far burned.
    const finaleProgress = forceSobelRef?.current ?? 0
    const finaleMix = forceSobelMixRef?.current ?? 0
    const sequenceMax = finaleProgress > 0 ? finaleMaxIndex : maxIndex
    const p = finaleProgress > 0
      ? Math.max(0, Math.min(sequenceMax, finaleProgress - 0.001))
      : Math.max(0, Math.min(sequenceMax, progressRef.current))
    const i = Math.min(sequenceMax - 1, Math.floor(p))
    const f = p - i
    const indexA = finaleProgress > 0 ? FINALE_ORDER[i] : i
    const indexB = finaleProgress > 0 ? FINALE_ORDER[i + 1] : i + 1
    // Only reassign textures when the integer pair changes (cheap, stable).
    if (lastPair.current[0] !== indexA || lastPair.current[1] !== indexB) {
      mat.uniforms.uMapA.value = textures[indexA]
      mat.uniforms.uAspectA.value = PAINTINGS[indexA].aspect
      mat.uniforms.uTechA.value = PAINTINGS[indexA].technique
      mat.uniforms.uMapB.value = textures[indexB]
      mat.uniforms.uAspectB.value = PAINTINGS[indexB].aspect
      mat.uniforms.uTechB.value = PAINTINGS[indexB].technique
      lastPair.current = [indexA, indexB]
    }
    mat.uniforms.uMix.value = f

    // Per-painting zoom — each painting reads ITS OWN continuous dwell. A is
    // painting i, B is painting i+1, so they never get forced to a discrete
    // value mid-burn (which was making the outgoing painting suddenly shrink).
    const dwell = zoomDwellRef.current
    mat.uniforms.uZoomA.value = finaleProgress > 0 ? 1 : (dwell[indexA] ?? 0)
    mat.uniforms.uZoomB.value = finaleProgress > 0 ? 1 : (dwell[indexB] ?? 0)
    mat.uniforms.uForceSobel.value = finaleMix
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

export default function ProjectWebGLBackground({
  progressRef,
  zoomDwellRef,
  forceSobelRef,
  forceSobelMixRef,
}: {
  progressRef: React.MutableRefObject<number>
  zoomDwellRef: React.MutableRefObject<number[]>
  forceSobelRef?: React.MutableRefObject<number>
  forceSobelMixRef?: React.MutableRefObject<number>
}) {
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
          <BackgroundPlane
            progressRef={progressRef}
            zoomDwellRef={zoomDwellRef}
            forceSobelRef={forceSobelRef}
            forceSobelMixRef={forceSobelMixRef}
          />
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
