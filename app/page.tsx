import HeroSection from './section/hero-section/HeroSection'

// HeroSection owns the full scroll journey: hero, about, projects, skills,
// experience, and contact.
export default function Home() {
  return (
    <main className="bg-[var(--background)] transition-colors duration-350">
      <HeroSection />
    </main>
  )
}
