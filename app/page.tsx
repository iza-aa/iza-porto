import HeroSection from './section/hero-section/HeroSection'
import ProjectContent from './section/project-section/projectcontent'
import VirtualSection from './components/VirtualSection'

// Hero is NOT virtualized: it hosts NavOverlay + LoadingScreen, and its heavy
// internals already unmount themselves once scrolled past.
// Project, Skills & Experience now live as staged burn layers inside the hero.
export default function Home() {
  return (
    <main className="bg-[var(--background)] transition-colors duration-350">
      <HeroSection />
      {/* Sections after the hero must sit ABOVE the hero's fixed WebGL layers
          (project backdrop z-0, hero stage z-20, haze z-30) — otherwise those
          fixed overlays bleed over them as you scroll past. relative z-40 wins. */}
      <div className="relative z-40">
        <VirtualSection id="project">
          <ProjectContent cinematicShell skipIntro skipFirstBatch />
        </VirtualSection>
      </div>
    </main>
  )
}
