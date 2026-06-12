'use client'

import { memo, Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Living Canvas — Poussin's "Landscape with Saint John on Patmos" (1640),
 * public domain (Wikimedia Commons / Art Institute of Chicago), brought to
 * life the way a museum documentary opens a film:
 *
 * - Pseudo-depth breathing (WebGL): the painting's own blurred luminance acts
 *   as a depth map — bright sky shifts less, dark foreground shifts more as
 *   the cursor moves. The motion is born from the painting's tonal structure,
 *   so it feels natural, never gimmicky.
 * - Ken Burns drift: an imperceptibly slow zoom/pan cycle.
 * - Scroll pushes INTO the painting before the About curtain rises.
 * - DOM atmosphere: one soft light shaft, thin ground haze, museum gold frame,
 *   canvas grain, and a center scrim that guards NavOverlay legibility and
 *   fades away once the nav flies to the corner.
 *
 * The plain <img> underneath is both the WebGL fallback and the LCP element.
 */

const PAINTING_URL = '/asset/hero-section/patmos.jpg'
const REVEAL_PAINTING_URL = '/asset/project-section/projectbg/hall.jpeg'
const PROJECT_PAINTING_URL = '/asset/project-section/projectbg/leopardbg.jpeg'
const IMG_ASPECT = 1920 / 1421
const PROJECT_IMG_ASPECT = 1408 / 768
const TEXT_TEXTURE_W = 2400

interface LivingCanvasHeroProps {
  frameIndex: number
  totalFrames: number
  burnProgress?: number
  projectBurnProgress?: number
  aboutContentProgress?: number
}

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uRevealMap;
  uniform sampler2D uProjectMap;
  uniform sampler2D uTextMap;
  uniform sampler2D uAboutMap;
  uniform float uTime;
  uniform vec2  uPointer;     // eased cursor, -1..1
  uniform float uScroll;      // 0..1 push-in
  uniform float uBurn;        // 0..1 painting combustion reveal
  uniform float uProjectBurn; // 0..1 about-to-project combustion reveal
  uniform float uAboutLayer;  // 0..1 controlled canvas version of About content
  uniform float uPlaneAspect;
  uniform float uImgAspect;
  uniform float uProjectImgAspect;
  varying vec2  vUv;

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
    // Slow Ken Burns breathe + scroll push-in. Base zoom 1.07 keeps the
    // parallax offsets from ever exposing the texture edge.
    float zoom = 1.07 + 0.015 * sin(uTime * 0.05) + uScroll * 0.10;
    vec2 pan = vec2(sin(uTime * 0.031), cos(uTime * 0.023)) * 0.006;

    // CSS object-cover equivalent
    vec2 ratio = vec2(
      min(uPlaneAspect / uImgAspect, 1.0),
      min(uImgAspect / uPlaneAspect, 1.0)
    );
    vec2 uv = (vUv - 0.5) * ratio / zoom + 0.5 + pan;

    // Pseudo-depth: blurred luminance (high mip bias) = distance.
    // Bright sky -> far -> barely moves; dark foreground -> near -> moves most.
    vec3 blurred = texture2D(uMap, uv, 5.0).rgb;
    float lum = dot(blurred, vec3(0.299, 0.587, 0.114));
    float depth = 1.0 - lum;
    vec2 parallax = uPointer * (depth - 0.35) * 0.012;

    vec2 sampleUv = uv + parallax;
    vec3 heroColor = texture2D(uMap, sampleUv).rgb;
    vec3 revealColor = texture2D(uRevealMap, sampleUv).rgb;
    vec2 projectRatio = vec2(
      min(uPlaneAspect / uProjectImgAspect, 1.0),
      min(uProjectImgAspect / uPlaneAspect, 1.0)
    );
    vec2 projectUv = (vUv - 0.5) * projectRatio + 0.5;
    vec3 projectColor = texture2D(uProjectMap, projectUv).rgb;
    vec4 aboutContent = texture2D(uAboutMap, vUv);

    // The burn rises from the SOFTWARE ENGINEER title area and eats upward
    // through a noisy painterly edge, like old varnish catching fire.
    float burnField = (1.0 - vUv.y) * 0.72 + fbm(vUv * vec2(5.0, 3.4) + vec2(uTime * 0.035, -uTime * 0.018)) * 0.34;
    float threshold = 1.12 - uBurn * 1.32;
    float ash = smoothstep(threshold - 0.10, threshold + 0.08, burnField);
    float edge = smoothstep(threshold - 0.018, threshold + 0.028, burnField) - smoothstep(threshold + 0.03, threshold + 0.105, burnField);
    ash *= smoothstep(0.02, 0.12, uBurn);
    edge *= smoothstep(0.02, 0.12, uBurn);

    vec3 ember = vec3(1.0, 0.43, 0.08) * edge;
    vec3 gold = vec3(0.95, 0.69, 0.25) * edge * 0.45;
    vec3 color = mix(heroColor, revealColor, ash);

    vec4 textSample = texture2D(uTextMap, vUv);
    float textAsh = ash;
    float textAlpha = textSample.a * (1.0 - textAsh);
    vec3 textColor = mix(vec3(0.94, 0.91, 0.86), vec3(1.0, 0.96, 0.88), textSample.r);
    color = mix(color, textColor, textAlpha);
    color += textSample.rgb * textAlpha * 0.18;

    float textEdge = textSample.a * edge;
    color += vec3(1.0, 0.38, 0.08) * textEdge * 1.15;
    color += vec3(1.0, 0.78, 0.25) * textEdge * 0.55;

    color += ember + gold;

    float aboutReveal = aboutContent.a * uAboutLayer * ash;
    color = mix(color, aboutContent.rgb, aboutReveal);

    float projectThreshold = 1.12 - uProjectBurn * 1.32;
    float projectAsh = smoothstep(projectThreshold - 0.10, projectThreshold + 0.08, burnField);
    float projectEdge = smoothstep(projectThreshold - 0.018, projectThreshold + 0.028, burnField) - smoothstep(projectThreshold + 0.03, projectThreshold + 0.105, burnField);
    projectAsh *= smoothstep(0.02, 0.12, uProjectBurn);
    projectEdge *= smoothstep(0.02, 0.12, uProjectBurn);
    projectColor = mix(projectColor, projectColor * vec3(0.42, 0.48, 0.52), 0.22);
    color = mix(color, projectColor, projectAsh);
    float aboutEdge = aboutContent.a * uAboutLayer * projectEdge;
    color += vec3(1.0, 0.43, 0.08) * (projectEdge + aboutEdge * 1.25);
    color += vec3(0.95, 0.69, 0.25) * (projectEdge * 0.45 + aboutEdge * 0.8);

    // Warm smoke veil after the flame passes.
    float smoke = edge * fbm(vUv * 18.0 + uTime * 0.08);
    color = mix(color, vec3(0.13, 0.10, 0.08), smoke * 0.22);

    // Painterly edge falloff
    float vig = smoothstep(1.45, 0.55, length(vUv - 0.5) * 1.8);
    color *= mix(0.82, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

function drawGlassStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  alpha: number
) {
  const drawStarPath = (scale: number, ox = 0, oy = 0) => {
    ctx.beginPath()
    for (let i = 0; i < 32; i++) {
      const angle = -Math.PI / 2 + (i / 32) * Math.PI * 2
      const wave = Math.cos(angle * 4)
      const radius = r * scale * (0.54 + Math.max(0, wave) * 0.5)
      const x = cx + ox + Math.cos(angle) * radius
      const y = cy + oy + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
  }

  ctx.save()
  ctx.globalAlpha = alpha
  const gradient = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
  gradient.addColorStop(0, 'rgba(235,231,220,0.72)')
  gradient.addColorStop(0.46, 'rgba(120,116,106,0.74)')
  gradient.addColorStop(1, 'rgba(58,56,50,0.82)')
  drawStarPath(1)
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.lineWidth = Math.max(1, r * 0.035)
  ctx.strokeStyle = 'rgba(255,255,255,0.42)'
  ctx.stroke()

  ctx.globalCompositeOperation = 'screen'
  const sheen = ctx.createRadialGradient(cx - r * 0.24, cy - r * 0.25, 0, cx - r * 0.22, cy - r * 0.25, r * 0.68)
  sheen.addColorStop(0, 'rgba(255,255,255,0.55)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  drawStarPath(0.96)
  ctx.fillStyle = sheen
  ctx.fill()

  drawStarPath(0.38, r * 0.72, -r * 0.68)
  ctx.fillStyle = 'rgba(185,181,169,0.72)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.32)'
  ctx.stroke()
  ctx.restore()
}

function drawSoftwareEngineerTexture(canvas: HTMLCanvasElement, aspect: number) {
  const dpr = 1
  const width = TEXT_TEXTURE_W
  const height = Math.round(width / Math.max(0.48, aspect))
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width * dpr
    canvas.height = height * dpr
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.scale(dpr, dpr)

  const fontVar =
    typeof window !== 'undefined'
      ? getComputedStyle(document.body).getPropertyValue('--font-anton').trim()
      : ''
  const fontFamily = fontVar || 'Anton, Impact, sans-serif'
  const left = 'SOFTWARE'
  const right = 'ENGINEER'
  const gap = width * 0.022
  let fontSize = height * 0.205

  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.font = `400 ${fontSize}px ${fontFamily}, Impact, sans-serif`

  const target = width * 0.86
  for (let i = 0; i < 28; i++) {
    ctx.font = `400 ${fontSize}px ${fontFamily}, Impact, sans-serif`
    const starSize = fontSize * 0.62
    const total = ctx.measureText(left).width + ctx.measureText(right).width + starSize + gap * 2
    if (total <= target) break
    fontSize *= 0.965
  }

  ctx.font = `400 ${fontSize}px ${fontFamily}, Impact, sans-serif`
  const leftW = ctx.measureText(left).width
  const rightW = ctx.measureText(right).width
  const starSize = fontSize * 0.62
  const totalW = leftW + rightW + starSize + gap * 2
  const startX = (width - totalW) / 2
  const baseline = height - height * 0.055

  ctx.shadowColor = 'rgba(244, 226, 193, 0.32)'
  ctx.shadowBlur = fontSize * 0.08
  ctx.fillStyle = 'rgba(245, 240, 229, 0.98)'
  ctx.fillText(left, startX, baseline)
  drawGlassStar(ctx, startX + leftW + gap + starSize * 0.5, baseline - fontSize * 0.38, starSize * 0.64, 0.92)
  ctx.fillStyle = 'rgba(245, 240, 229, 0.98)'
  ctx.fillText(right, startX + leftW + gap * 2 + starSize, baseline)

  ctx.restore()
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  if (!iw || !ih) return
  const scale = Math.max(w / iw, h / ih)
  const sw = w / scale
  const sh = h / scale
  ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, x, y, w, h)
}

function drawContainImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  if (!iw || !ih) return
  const scale = Math.min(w / iw, h / ih)
  const dw = iw * scale
  const dh = ih * scale
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
) {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = testLine
    }
  })
  if (line) lines.push(line)

  lines.slice(0, maxLines).forEach((textLine, index) => {
    ctx.fillText(textLine, x, y + index * lineHeight)
  })

  return Math.min(lines.length, maxLines) * lineHeight
}

function drawAboutTexture(
  canvas: HTMLCanvasElement,
  aspect: number,
  portrait?: HTMLImageElement | null,
  signature?: HTMLImageElement | null
) {
  const width = TEXT_TEXTURE_W
  const height = Math.round(width / Math.max(0.48, aspect))
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)

  const fontAnton =
    typeof window !== 'undefined'
      ? getComputedStyle(document.body).getPropertyValue('--font-anton').trim()
      : ''
  const fontInknut =
    typeof window !== 'undefined'
      ? getComputedStyle(document.body).getPropertyValue('--font-inknut-antiqua').trim()
      : ''
  const display = fontAnton || 'Anton, Impact, sans-serif'
  const label = fontInknut || 'serif'
  const serif = 'Georgia, Times New Roman, serif'

  const leftPad = width * (aspect < 0.9 ? 0.08 : 0.195)
  const rightPad = width * (aspect < 0.9 ? 0.08 : 0.07)
  const top = height * 0.22
  const navReserve = aspect < 0.9 ? 0 : width * 0.12
  const usableX = Math.max(leftPad, navReserve + width * 0.035)
  const columnGap = width * 0.055
  const leftW = aspect < 0.9 ? width - leftPad - rightPad : width * 0.42
  const photoX = aspect < 0.9 ? leftPad : usableX + leftW + columnGap
  const photoW = aspect < 0.9 ? width - leftPad - rightPad : width - photoX - rightPad
  const photoH = aspect < 0.9 ? height * 0.46 : height * 0.62
  const photoY = aspect < 0.9 ? height * 0.42 : height * 0.19

  ctx.save()
  ctx.globalAlpha = 0.9
  ctx.fillStyle = 'rgba(8,6,4,0.48)'
  ctx.fillRect(0, 0, width, height)
  ctx.restore()

  ctx.save()
  ctx.translate(usableX, top)
  ctx.fillStyle = 'rgba(201,162,39,0.72)'
  ctx.font = `600 ${Math.max(14, width * 0.006)}px ${label}`
  ctx.fillText('NO. II / PROFILE', 0, 0)

  ctx.fillStyle = 'rgba(243,238,229,0.98)'
  ctx.font = `400 ${Math.max(64, width * (aspect < 0.9 ? 0.064 : 0.058))}px ${display}, Impact, sans-serif`
  ctx.textBaseline = 'top'
  const heading = aspect < 0.9
    ? ['BUILDER OF', 'PRACTICAL', 'INTERFACES']
    : ['BUILDER OF', 'PRACTICAL', 'INTERFACES']
  const lineHeight = Math.max(70, width * (aspect < 0.9 ? 0.062 : 0.056))
  heading.forEach((line, index) => {
    ctx.fillText(line, 0, width * 0.022 + lineHeight * index)
  })
  const headingBottom = width * 0.022 + lineHeight * heading.length
  const signatureY = headingBottom + height * 0.035
  if (signature?.complete) {
    drawContainImage(ctx, signature, 0, signatureY, leftW * 0.62, height * 0.09)
  } else {
    ctx.fillStyle = 'rgba(243,238,229,0.86)'
    ctx.font = `italic ${Math.max(34, width * 0.024)}px ${serif}`
    ctx.fillText('Rezky Haikal', 0, signatureY)
  }

  ctx.fillStyle = 'rgba(242,234,220,0.82)'
  ctx.font = `${Math.max(19, width * 0.0105)}px ${serif}`
  ctx.textBaseline = 'top'
  wrapCanvasText(
    ctx,
    'I design and build practical digital systems with a focus on clarity, structure, and reliable execution. My work sits between interface craft and real operational needs.',
    0,
    signatureY + height * 0.11,
    leftW * 0.88,
    width * 0.015,
    5
  )
  ctx.strokeStyle = 'rgba(201,162,39,0.34)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-width * 0.014, width * 0.04)
  ctx.lineTo(-width * 0.014, height * 0.56)
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.fillStyle = 'rgba(18,13,9,0.58)'
  ctx.strokeStyle = 'rgba(201,162,39,0.38)'
  ctx.lineWidth = 1.3
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = width * 0.035
  ctx.fillRect(photoX, photoY, photoW, photoH)
  ctx.shadowBlur = 0
  ctx.strokeRect(photoX, photoY, photoW, photoH)

  const corner = width * 0.012
  const cornerPad = width * 0.008
  ctx.strokeStyle = 'rgba(201,162,39,0.72)'
  ;[
    [photoX + cornerPad, photoY + cornerPad, 1, 1],
    [photoX + photoW - cornerPad, photoY + cornerPad, -1, 1],
    [photoX + cornerPad, photoY + photoH - cornerPad, 1, -1],
    [photoX + photoW - cornerPad, photoY + photoH - cornerPad, -1, -1],
  ].forEach(([cx, cy, sx, sy]) => {
    ctx.beginPath()
    ctx.moveTo(cx, cy + sy * corner)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx + sx * corner, cy)
    ctx.stroke()
  })

  const inner = width * 0.018
  const imageX = photoX + inner
  const imageY = photoY + inner
  const imageW = photoW - inner * 2
  const imageH = photoH - inner * 2
  ctx.fillStyle = 'rgba(23,16,11,0.86)'
  ctx.fillRect(imageX, imageY, imageW, imageH)
  ctx.strokeStyle = 'rgba(201,162,39,0.7)'
  ctx.strokeRect(imageX + 8, imageY + 8, imageW - 16, imageH - 16)
  if (portrait?.complete) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(imageX + 18, imageY + 18, imageW - 36, imageH - 36)
    ctx.clip()
    drawCoverImage(ctx, portrait, imageX + 18, imageY + 18, imageW - 36, imageH - 36)
    ctx.restore()
    ctx.fillStyle = 'rgba(70,42,12,0.18)'
    ctx.fillRect(imageX + 18, imageY + 18, imageW - 36, imageH - 36)
  }

  ctx.restore()
}

function PaintingPlane({
  progressRef,
  burnRef,
  projectBurnRef,
  aboutLayerRef,
}: {
  progressRef: React.MutableRefObject<number>
  burnRef: React.MutableRefObject<number>
  projectBurnRef: React.MutableRefObject<number>
  aboutLayerRef: React.MutableRefObject<number>
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const texture = useLoader(THREE.TextureLoader, PAINTING_URL)
  const revealTexture = useLoader(THREE.TextureLoader, REVEAL_PAINTING_URL)
  const projectTexture = useLoader(THREE.TextureLoader, PROJECT_PAINTING_URL)
  const { viewport } = useThree()
  const pointerTarget = useRef(new THREE.Vector2(0, 0))
  const textCanvas = useMemo(() => document.createElement('canvas'), [])
  const aboutCanvas = useMemo(() => document.createElement('canvas'), [])
  const portraitRef = useRef<HTMLImageElement | null>(null)
  const signatureRef = useRef<HTMLImageElement | null>(null)
  const textTexture = useMemo(() => {
    const tex = new THREE.CanvasTexture(textCanvas)
    tex.colorSpace = THREE.NoColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [textCanvas])
  const aboutTexture = useMemo(() => {
    const tex = new THREE.CanvasTexture(aboutCanvas)
    tex.colorSpace = THREE.NoColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [aboutCanvas])

  useMemo(() => {
    // Identity color pipeline: sample the JPEG bytes as-is, output as-is —
    // the painting on screen matches the source file exactly.
    texture.colorSpace = THREE.NoColorSpace
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
    texture.anisotropy = 4
    revealTexture.colorSpace = THREE.NoColorSpace
    revealTexture.wrapS = revealTexture.wrapT = THREE.ClampToEdgeWrapping
    revealTexture.anisotropy = 4
    projectTexture.colorSpace = THREE.NoColorSpace
    projectTexture.wrapS = projectTexture.wrapT = THREE.ClampToEdgeWrapping
    projectTexture.anisotropy = 4
  }, [texture, revealTexture, projectTexture])

  const uniforms = useMemo(() => ({
    uMap: { value: texture },
    uRevealMap: { value: revealTexture },
    uProjectMap: { value: projectTexture },
    uTextMap: { value: textTexture },
    uAboutMap: { value: aboutTexture },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
    uBurn: { value: 0 },
    uProjectBurn: { value: 0 },
    uAboutLayer: { value: 0 },
    uPlaneAspect: { value: 16 / 9 },
    uImgAspect: { value: IMG_ASPECT },
    uProjectImgAspect: { value: PROJECT_IMG_ASPECT },
  }), [texture, revealTexture, projectTexture, textTexture, aboutTexture])

  useEffect(() => {
    const redraw = () => {
      const aspect = window.innerWidth / Math.max(1, window.innerHeight)
      drawSoftwareEngineerTexture(textCanvas, aspect)
      textTexture.needsUpdate = true
    }

    redraw()
    document.fonts?.ready.then(redraw)
    window.addEventListener('resize', redraw)
    return () => window.removeEventListener('resize', redraw)
  }, [textCanvas, textTexture])

  useEffect(() => {
    const redraw = () => {
      const aspect = window.innerWidth / Math.max(1, window.innerHeight)
      drawAboutTexture(aboutCanvas, aspect, portraitRef.current, signatureRef.current)
      aboutTexture.needsUpdate = true
    }

    const portrait = new window.Image()
    const signature = new window.Image()
    portraitRef.current = portrait
    signatureRef.current = signature
    portrait.src = '/asset/about-section/Fotosaya.jpg'
    signature.src = '/asset/about-section/namasaya.png'
    portrait.onload = redraw
    signature.onload = redraw

    redraw()
    document.fonts?.ready.then(redraw)
    window.addEventListener('resize', redraw)
    return () => window.removeEventListener('resize', redraw)
  }, [aboutCanvas, aboutTexture])

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
    const m = matRef.current
    if (!m) return
    m.uniforms.uTime.value += delta
    m.uniforms.uPointer.value.lerp(pointerTarget.current, 0.045)
    m.uniforms.uScroll.value = progressRef.current
    m.uniforms.uBurn.value = burnRef.current
    m.uniforms.uProjectBurn.value = projectBurnRef.current
    m.uniforms.uAboutLayer.value = aboutLayerRef.current
    m.uniforms.uPlaneAspect.value = viewport.width / viewport.height
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={matRef} uniforms={uniforms} vertexShader={VERTEX} fragmentShader={FRAGMENT} />
    </mesh>
  )
}

function LivingCanvasHero({
  frameIndex,
  totalFrames,
  burnProgress = 0,
  projectBurnProgress = 0,
  aboutContentProgress = 0,
}: LivingCanvasHeroProps) {
  const progressRef = useRef(0)
  const burnRef = useRef(0)
  const projectBurnRef = useRef(0)
  const aboutLayerRef = useRef(0)

  const active = frameIndex < totalFrames - 1
  progressRef.current = Math.min(1, frameIndex / (totalFrames * 0.6))
  burnRef.current = burnProgress
  projectBurnRef.current = projectBurnProgress
  aboutLayerRef.current = aboutContentProgress

  // Nav idles center until its flight trigger (frame 70) — keep the scrim up
  // exactly that long, then let the painting stand fully revealed.
  const navCentered = frameIndex <= 70

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1f180f]">
      <style>{`
        @keyframes canvas-shaft { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.7; } }
        @keyframes canvas-haze  { 0%, 100% { transform: translateX(-3%); } 50% { transform: translateX(3%); } }
      `}</style>

      {/* Base painting — LCP + fallback when WebGL is unavailable.
          Scaled to match the shader's resting zoom so the takeover is seamless. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- intentional LCP/fallback layer under the WebGL canvas */}
      <img
        src={PAINTING_URL}
        alt="Landscape with Saint John on Patmos — Nicolas Poussin, 1640"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scale(1.07)' }}
        draggable={false}
      />
      <img
        src={REVEAL_PAINTING_URL}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        draggable={false}
      />

      {/* WebGL living layer */}
      <Canvas
        className="absolute inset-0"
        dpr={[1, 2]}
        frameloop={active ? 'always' : 'never'}
        camera={{ fov: 45, position: [0, 0, 2] }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <PaintingPlane
            progressRef={progressRef}
            burnRef={burnRef}
            projectBurnRef={projectBurnRef}
            aboutLayerRef={aboutLayerRef}
          />
        </Suspense>
      </Canvas>

      {/* Soft light shaft following the painting's sun (upper left sky) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-soft-light"
        style={{
          background:
            'linear-gradient(118deg, rgba(255,232,170,0.55) 0%, rgba(255,222,150,0.18) 28%, transparent 55%)',
          animation: 'canvas-shaft 11s ease-in-out infinite',
        }}
      />

      {/* Thin ground haze drifting at the painting's foot */}
      <div
        aria-hidden
        className="absolute bottom-[-4%] left-[-8%] right-[-8%] h-[24%] pointer-events-none opacity-35"
        style={{
          background: 'linear-gradient(to top, rgba(238,226,200,0.65), transparent 75%)',
          filter: 'blur(8px)',
          animation: 'canvas-haze 26s ease-in-out infinite',
        }}
      />

      {/* Dusk dimming in dark mode — museum after hours */}
      <div aria-hidden className="absolute inset-0 pointer-events-none hidden dark:block bg-[#140c05]/45 mix-blend-multiply" />

      {/* Legibility scrim behind the centered nav — fades once the nav flies */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse 46% 38% at 50% 44%, rgba(16,10,4,0.34), transparent 75%)',
          opacity: navCentered ? 1 : 0,
        }}
      />

      {/* Museum gold frame at the viewport edge — same language as the cards below */}



      {/* Tiny museum label — quiet attribution, bottom right */}
      <p className="absolute bottom-6 right-7 md:bottom-8 md:right-10 font-inknut-antiqua text-[9px] md:text-[10px] tracking-[0.22em] uppercase text-[#f0e6cf]/55 pointer-events-none select-none">
        After Nicolas Poussin · MDCXL
      </p>

      {/* Canvas grain + vignette — same material language as every section */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: 'url("/asset/noise.png")', backgroundRepeat: 'repeat' }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 58%, rgba(15,9,3,0.42) 100%)' }}
      />
    </div>
  )
}

export default memo(LivingCanvasHero)
