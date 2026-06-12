'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScrolling({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.05,           // Ubah angka ini untuk mengatur "berat" scroll (0.01 - 0.1)
      wheelMultiplier: 0.8, // Mengurangi sensitivitas mouse wheel
      smoothWheel: true,
    }}>
      {children}
    </ReactLenis>
  );
}