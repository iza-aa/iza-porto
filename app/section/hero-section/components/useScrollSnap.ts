'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from '@studio-freight/react-lenis'

const TOTAL_FRAMES = 192
const LAST_FRAME = TOTAL_FRAMES - 1

// Virtual frame milestones the shader already understands:
//  hero rest .......... frame 0
//  about rest ......... frame 130   (burn-1 done at 112, brief settle)
//  project released ... frame LAST  (burn-2 done)
const ABOUT_FRAME = 130
const PROJECT_FRAME = LAST_FRAME

// One transition's playback time (ms) and easing. Longer = slower, statelier
// burn that reads clearly instead of snapping past.
const HERO_TO_ABOUT_MS = 4200
const ABOUT_TO_PROJECT_MS = 2300
const PROJECT_TO_SKILLS_MS = 2300
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

// A downward gesture past this wheel/touch delta triggers the next transition.
const TRIGGER_DELTA = 24
// Reversing skills→project needs a clearly deliberate upward gesture, so a
// small reflexive scroll-up at the top of skills doesn't bounce back.
const REVERSE_DELTA = 90

export type SnapPhase = 'hero' | 'about' | 'project' | 'skills' | 'experience'

export interface SnapState {
  frameIndex: number
  aboutProgress: number
  skillsBurnProgress: number
  // 0..1 darken-then-burn of the skills layer away to reveal experience.
  experienceBurnProgress: number
  phase: SnapPhase
}

/**
 * Scroll-snap stage engine.
 *
 * Instead of binding the burn to scroll position, each downward gesture FIRES a
 * fixed-duration transition that plays on its own (rAF + easing). Native page
 * scroll is locked (Lenis stopped + wheel/touch prevented) while a transition
 * plays, then released at the next "rest" phase:
 *
 *   hero  --(gesture)-->  [auto burn 1.5s]  -->  about (rest)
 *   about --(gesture)-->  [auto burn 1.4s]  -->  project (released → native scroll)
 *
 * Once in `project`, the engine steps aside entirely so the long project
 * content scrolls normally through Lenis.
 */
export function useScrollSnap(): SnapState {
  const lenis = useLenis()
  const [state, setState] = useState<SnapState>({
    frameIndex: 0,
    aboutProgress: 1,
    skillsBurnProgress: 0,
    experienceBurnProgress: 0,
    phase: 'hero',
  })

  // Mutable refs mirror state for use inside event handlers without re-binding
  const phaseRef = useRef<SnapPhase>('hero')
  const frameRef = useRef(0)
  const skillsBurnRef = useRef(0)
  const experienceBurnRef = useRef(0)
  const projectReturnScrollRef = useRef(0)
  const skillsReturnScrollRef = useRef(0)
  const animatingRef = useRef(false)
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  useEffect(() => {
    const animateTo = (target: number, duration: number, onDone: () => void) => {
      animatingRef.current = true
      lenisRef.current?.stop()
      const from = frameRef.current
      const start = performance.now()

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = easeInOut(t)
        const value = from + (target - from) * eased
        frameRef.current = value
        setState((s) => ({ ...s, frameIndex: Math.round(value * 10) / 10 }))
        if (t < 1) {
          requestAnimationFrame(tick)
        } else {
          frameRef.current = target
          animatingRef.current = false
          lenisRef.current?.start()
          onDone()
        }
      }
      requestAnimationFrame(tick)
    }

    const startHeroToAbout = () => {
      if (animatingRef.current || phaseRef.current !== 'hero') return
      animateTo(ABOUT_FRAME, HERO_TO_ABOUT_MS, () => {
        phaseRef.current = 'about'
        setState((s) => ({ ...s, phase: 'about', frameIndex: ABOUT_FRAME }))
        // Pin the window at the very top while hero/about live in the fixed
        // stage, so releasing to project later scrolls from a known origin.
        lenisRef.current?.scrollTo(0, { immediate: true })
      })
    }

    const startAboutToProject = () => {
      if (animatingRef.current || phaseRef.current !== 'about') return
      animateTo(PROJECT_FRAME, ABOUT_TO_PROJECT_MS, () => {
        phaseRef.current = 'project'
        setState((s) => ({ ...s, phase: 'project', frameIndex: PROJECT_FRAME }))
      })
    }

    const reverseAboutToHero = () => {
      animateTo(0, HERO_TO_ABOUT_MS, () => {
        phaseRef.current = 'hero'
        setState((s) => ({ ...s, phase: 'hero', frameIndex: 0 }))
      })
    }

    // project → about: re-burn the About scene back over the project content.
    // Only when the project page is scrolled to its very top.
    const reverseProjectToAbout = () => {
      if (animatingRef.current) return
      phaseRef.current = 'about'
      setState((s) => ({ ...s, phase: 'about' }))
      lenisRef.current?.scrollTo(0, { immediate: true })
      animateTo(ABOUT_FRAME, ABOUT_TO_PROJECT_MS, () => {
        setState((s) => ({ ...s, frameIndex: ABOUT_FRAME }))
      })
    }

    const animateSkillsBurn = (target: number, onDone: () => void) => {
      animatingRef.current = true
      lenisRef.current?.stop()
      const from = skillsBurnRef.current
      const start = performance.now()

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / PROJECT_TO_SKILLS_MS)
        const value = from + (target - from) * easeInOut(t)
        skillsBurnRef.current = value
        setState((s) => ({ ...s, skillsBurnProgress: Math.round(value * 1000) / 1000 }))

        if (t < 1) {
          requestAnimationFrame(tick)
        } else {
          skillsBurnRef.current = target
          animatingRef.current = false
          lenisRef.current?.start()
          onDone()
        }
      }

      requestAnimationFrame(tick)
    }

    const startProjectToSkills = () => {
      if (animatingRef.current || phaseRef.current !== 'project') return
      projectReturnScrollRef.current = window.scrollY
      animateSkillsBurn(1, () => {
        phaseRef.current = 'skills'
        setState((s) => ({ ...s, phase: 'skills', skillsBurnProgress: 1 }))
        lenisRef.current?.scrollTo(0, { immediate: true })
        const skillsStage = document.querySelector('[data-skills-stage]') as HTMLElement | null
        if (skillsStage) skillsStage.scrollTop = 0
        lenisRef.current?.stop()
      })
    }

    const reverseSkillsToProject = () => {
      if (animatingRef.current || phaseRef.current !== 'skills') return
      // Restore the project's saved scroll position FIRST, while the project
      // layer is still fully burned away (skillsBurnProgress = 1, transparent),
      // so the jump is invisible — mirrors how the forward transition hides its
      // scrollTo reset until after the burn. Lenis must be running for the
      // scrollTo to land, then the burn animation re-locks it.
      lenisRef.current?.start()
      lenisRef.current?.scrollTo(projectReturnScrollRef.current, { immediate: true })
      phaseRef.current = 'project'
      setState((s) => ({ ...s, phase: 'project' }))
      animateSkillsBurn(0, () => {
        setState((s) => ({ ...s, skillsBurnProgress: 0 }))
      })
    }

    const animateExperienceBurn = (target: number, onDone: () => void) => {
      animatingRef.current = true
      lenisRef.current?.stop()
      const from = experienceBurnRef.current
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / PROJECT_TO_SKILLS_MS)
        const value = from + (target - from) * easeInOut(t)
        experienceBurnRef.current = value
        setState((s) => ({ ...s, experienceBurnProgress: Math.round(value * 1000) / 1000 }))
        if (t < 1) {
          requestAnimationFrame(tick)
        } else {
          experienceBurnRef.current = target
          animatingRef.current = false
          lenisRef.current?.start()
          onDone()
        }
      }
      requestAnimationFrame(tick)
    }

    const startSkillsToExperience = () => {
      if (animatingRef.current || phaseRef.current !== 'skills') return
      const skillsStage = document.querySelector('[data-skills-stage]') as HTMLElement | null
      skillsReturnScrollRef.current = skillsStage ? skillsStage.scrollTop : 0
      animateExperienceBurn(1, () => {
        phaseRef.current = 'experience'
        setState((s) => ({ ...s, phase: 'experience', experienceBurnProgress: 1 }))
        const expStage = document.querySelector('[data-experience-stage]') as HTMLElement | null
        if (expStage) expStage.scrollTop = 0
      })
    }

    const reverseExperienceToSkills = () => {
      if (animatingRef.current || phaseRef.current !== 'experience') return
      phaseRef.current = 'skills'
      setState((s) => ({ ...s, phase: 'skills' }))
      // Restore skills' scroll position while it is still hidden behind the
      // full burn (experienceBurnProgress = 1).
      const skillsStage = document.querySelector('[data-skills-stage]') as HTMLElement | null
      if (skillsStage) skillsStage.scrollTop = skillsReturnScrollRef.current
      animateExperienceBurn(0, () => {
        setState((s) => ({ ...s, experienceBurnProgress: 0 }))
      })
    }

    const atProjectBottom = () => {
      const stage = document.querySelector('[data-project-stage]') as HTMLElement | null
      if (!stage) return false
      const rect = stage.getBoundingClientRect()
      return rect.bottom <= window.innerHeight + 60
    }

    const atSkillsTop = () => {
      const stage = document.querySelector('[data-skills-stage]') as HTMLElement | null
      return !stage || stage.scrollTop <= 2
    }

    const atSkillsBottom = () => {
      const stage = document.querySelector('[data-skills-stage]') as HTMLElement | null
      if (!stage) return true
      return stage.scrollTop + stage.clientHeight >= stage.scrollHeight - 60
    }

    const atExperienceTop = () => {
      const stage = document.querySelector('[data-experience-stage]') as HTMLElement | null
      return !stage || stage.scrollTop <= 2
    }

    // Wheel handling: while in hero/about, the page must not scroll — every
    // downward gesture is a transition trigger instead.
    const onWheel = (e: WheelEvent) => {
      const phase = phaseRef.current

      if (phase === 'project') {
        // Native scroll owns the page — except an upward gesture at the very
        // top re-enters About.
        if (animatingRef.current) return
        if (e.deltaY < -TRIGGER_DELTA && window.scrollY <= 2) {
          e.preventDefault()
          reverseProjectToAbout()
        } else if (e.deltaY > TRIGGER_DELTA && atProjectBottom()) {
          e.preventDefault()
          startProjectToSkills()
        }
        return
      }

      if (phase === 'skills') {
        if (animatingRef.current) {
          e.preventDefault()
          return
        }
        if (e.deltaY < -REVERSE_DELTA && atSkillsTop()) {
          e.preventDefault()
          reverseSkillsToProject()
        } else if (e.deltaY > TRIGGER_DELTA && atSkillsBottom()) {
          e.preventDefault()
          startSkillsToExperience()
        }
        return
      }

      if (phase === 'experience') {
        if (animatingRef.current) {
          e.preventDefault()
          return
        }
        if (e.deltaY < -REVERSE_DELTA && atExperienceTop()) {
          e.preventDefault()
          reverseExperienceToSkills()
        }
        return
      }

      if (animatingRef.current) {
        e.preventDefault()
        return
      }
      if (e.deltaY > TRIGGER_DELTA) {
        e.preventDefault()
        if (phase === 'hero') startHeroToAbout()
        else if (phase === 'about') startAboutToProject()
      } else if (e.deltaY < -TRIGGER_DELTA) {
        // Upward gesture in about → reverse back to hero
        e.preventDefault()
        if (phase === 'about') reverseAboutToHero()
      }
    }

    // Touch: translate vertical swipe into the same triggers
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const phase = phaseRef.current
      const y = e.touches[0]?.clientY ?? 0
      const dy = touchStartY - y

      if (phase === 'project') {
        if (animatingRef.current) return
        if (dy < -TRIGGER_DELTA && window.scrollY <= 2) {
          e.preventDefault()
          reverseProjectToAbout()
        } else if (dy > TRIGGER_DELTA && atProjectBottom()) {
          e.preventDefault()
          startProjectToSkills()
        }
        return
      }

      if (phase === 'skills') {
        if (animatingRef.current) {
          e.preventDefault()
          return
        }
        if (dy < -REVERSE_DELTA && atSkillsTop()) {
          e.preventDefault()
          reverseSkillsToProject()
        } else if (dy > TRIGGER_DELTA && atSkillsBottom()) {
          e.preventDefault()
          startSkillsToExperience()
        }
        return
      }

      if (phase === 'experience') {
        if (animatingRef.current) {
          e.preventDefault()
          return
        }
        if (dy < -REVERSE_DELTA && atExperienceTop()) {
          e.preventDefault()
          reverseExperienceToSkills()
        }
        return
      }

      if (animatingRef.current) {
        e.preventDefault()
        return
      }
      if (dy > TRIGGER_DELTA) {
        e.preventDefault()
        if (phase === 'hero') startHeroToAbout()
        else if (phase === 'about') startAboutToProject()
      } else if (dy < -TRIGGER_DELTA && phase === 'about') {
        e.preventDefault()
        reverseAboutToHero()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      lenisRef.current?.start()
    }
  }, [])

  return state
}
