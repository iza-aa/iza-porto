"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TransitionWrapper() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contactContainerRef = useRef<HTMLDivElement>(null);
  const bentoCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contactContainerRef.current || !bentoCardRef.current) return;

    // Create a GSAP timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "bottom bottom",
        end: "+=150%",
        pin: true,
        scrub: 1,
      },
    });

    // Animasi 1: Animasikan container ContactSection ke y: 0
    tl.to(
      contactContainerRef.current,
      {
        y: 0,
        ease: "none",
      },
      0 // Mulai pada detik ke-0 timeline (bersamaan)
    );

    // Animasi 2: Animasikan bento card dari scale: 0.5 menuju scale: 1
    tl.to(
      bentoCardRef.current,
      {
        scale: 1,
        ease: "none",
      },
      0 // Mulai pada detik ke-0 timeline (bersamaan)
    );

    // Cleanup saat komponen unmount
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-black overflow-hidden">
      {/* Simulasi ExperienceSection */}

      {/* Container ContactSection */}
      <div
        ref={contactContainerRef}
        className="absolute inset-0 z-50 flex items-center justify-center translate-y-[-100vh]"
      >
        {/* Simulasi Bento Card */}
        <div
          ref={bentoCardRef}
          className="w-[95vw] h-[95vh] bg-[#E5E5E5] rounded-[2rem] scale-50 flex items-center justify-center"
        >
          <h2 className="text-black text-3xl font-bold">
            Contact Section (Bento Grid)
          </h2>
        </div>
      </div>
    </div>
  );
}
