# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Iza Porto's portfolio website built with Next.js 14, React 18, TypeScript, and Tailwind CSS. Features include scroll-driven animations, 3D elements with Three.js, and a custom loading system.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (eslint ignored during builds)
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion + custom scroll-driven animations
- **3D**: Three.js with @react-three/fiber and @react-three/drei
- **UI Components**: Radix UI primitives

### Theming System
- Dark mode via `class` strategy with `html.dark`
- CSS variables in `globals.css` control colors: `--background`, `--foreground`, `--border-color`, `--muted`, `--color-paper`
- Theme persisted to localStorage
- Inline script in `layout.tsx` prevents flash of wrong theme

### Page Structure
- `app/page.tsx`: Home page composes `HeroSection` and `ProjectContent`
- `app/section/hero-section/`: Scroll-driven hero with video frames, loading screen, and about section
- `app/section/project-section/`: Project showcase with responsive mockup cards

### Key Components
- **LoadingContext**: Global app loading state for coordinating initial load
- **LiquidGlass**: Reusable frosted glass effect component with animated color orbs
- **ProjectMockups**: Phone/macbook mockup components for project display
- **TornEdge**: Decorative torn paper edge effect (supports `showGlow` and `showGrain` props)
- **Navbar**: Fixed top navigation with social links and theme toggle

### Scroll Architecture
- `useFramePreloader`: Preloads video frames for scroll animation
- `useScrollFrame`: Maps scroll position to frame index
- `ScrollFrameCanvas`: Renders preloaded frames based on scroll
- Hero section uses 350vh scroll container with sticky viewport

### Path Aliases
- `@/*` maps to `./src/*` (though code currently lives in `app/` directory)

### Build Configuration
- ESLint errors are ignored during Vercel builds (`next.config.mjs`)
- React 18 overrides in package.json ensure consistent versions
