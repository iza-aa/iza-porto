import HeroSection from './section/hero-section/page'
import ProjectContent from './section/project-section/projectcontent'
import SkillsSection from './section/skills-section/SkillsSection'

export default function Home() {
  return (
    <main className="bg-[var(--background)] transition-colors duration-350">
      <HeroSection />
      <ProjectContent />
      <SkillsSection isVisible={true} />
    </main>
  )
}