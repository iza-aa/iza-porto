'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScrolling({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{
      lerp: 0.1,            // "Berat" scroll (0.01 berat–0.2 ringan). 0.1 = halus tapi responsif
      wheelMultiplier: 1,   // Sensitivitas mouse wheel
      smoothWheel: true,
    }}>
      {children}
    </ReactLenis>
  );
}