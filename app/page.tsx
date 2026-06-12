import HeroSection from './section/hero-section/HeroSection'
import ProjectContent from './section/project-section/projectcontent'
import SkillsSection from './section/skills-section/SkillsSection'
import ExperienceSection from './section/experience-section/ExperienceSection'
import VirtualSection from './components/VirtualSection'

// Hero is NOT virtualized: it hosts NavOverlay + LoadingScreen, and its heavy
// internals already unmount themselves once scrolled past.
export default function Home() {
  return (
    <main className="bg-[var(--background)] transition-colors duration-350">
      <HeroSection />
      <VirtualSection id="project">
        <ProjectContent cinematicShell skipIntro />
      </VirtualSection>
      <VirtualSection id="skills">
        <SkillsSection isVisible={true} />
      </VirtualSection>
      <VirtualSection id="experience">
        <ExperienceSection />
      </VirtualSection>
    </main>
  )
}
