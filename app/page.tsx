import HeroSection from './section/hero-section/page'
import ProjectContent from './section/project-section/projectcontent'

export default function Home() {
  return (
    <main className="bg-[var(--background)] transition-colors duration-350">
      <HeroSection />
      <ProjectContent />
    </main>
  )
}
