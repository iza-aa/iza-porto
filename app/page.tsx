import HeroSection from './section/hero-section/HeroSection'

// Hero is NOT virtualized: it hosts NavOverlay + LoadingScreen, and its heavy
// internals already unmount themselves once scrolled past.
// Project, Skills & Experience (and the finale) now ALL live inside HeroSection
// as staged layers. The old z-40 ProjectContent shell here was a leftover that
// rendered an empty spacer + a 110vh LeopardBg overlapping UPWARD at z-40 — it
// sat over the finale button and swallowed its clicks. Removed.
export default function Home() {
  return (
    <main className="bg-[var(--background)] transition-colors duration-350">
      <HeroSection />
    </main>
  )
}
