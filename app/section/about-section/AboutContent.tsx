'use client'

import Image from 'next/image'

export default function AboutContent() {
  return (
    <section
      id="about"
      // Tetap menggunakan pl-[280px] untuk memberikan ruang navigasi di kiri
      className="relative w-full min-h-screen bg-gradient-to-b from-[#f0ece4] to-[#e8e0d4] dark:from-[#1a120f] dark:to-[#0f0a08] flex flex-col justify-center px-6 py-24 md:pr-16 md:pl-[280px] lg:pr-24 lg:pl-[320px] md:py-32 overflow-hidden"
    >
      {/* Optional: Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("/asset/noise.png")' }}
      />

      {/* Kontainer Utama */}
      <div className="max-w-7xl mx-auto w-full relative flex flex-col gap-12 md:gap-16">
        
        {/* ─── BARIS ATAS: Gambar Kaligrafi namasaya.png ─── */}
        {/* Layout normal, tidak ada margin negatif atau z-index aneh */}
        <div className="relative w-full h-[clamp(4rem,10vw,8rem)] md:h-[clamp(6rem,12vw,10rem)]">
          <Image
            src="/asset/about-section/namasaya.png"
            alt="Rezki Haikal Kaligrafi"
            fill
            className="object-contain object-left-bottom drop-shadow-lg " 
            priority
          />
          <Image
            src="/asset/about-section/namasaya.svg"
            alt="Rezki Haikal Kaligrafi"
            fill
            className="object-contain object-left-bottom drop-shadow-lg dark:hidden" 
            priority
          />
        </div>

        {/* ─── BARIS BAWAH: GRID (Kiri Foto, Kanan Teks) ─── */}
        {/* items-start agar foto dan teks sejajar di bagian atas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          
          {/* ─── KIRI: Foto (Kode dari kamu) ─── */}
          <div className="relative w-full max-w-[400px] aspect-[16/9] rounded-xl overflow-hidden group mt-4 md:mt-0">

          </div>

          {/* ─── KANAN: Text Content ─── */}
          <div className="flex flex-col gap-6 md:gap-8 pt-2 md:pt-4">
            {/* Label */}
            <span className="text-[10px] md:text-xs font-light tracking-[0.3em] uppercase text-neutral-800 dark:text-[#EDE7E3] opacity-40">
              About
            </span>
            
            {/* Bio Description */}
            <p className="font-serif text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-loose text-neutral-700 dark:text-neutral-300">
              I design and build digital systems that prioritize clarity and function. 
              Working across both design and development, I focus on creating intuitive and scalable solutions.
            </p>
          </div>
          
        </div>
      </div>
    </section>
  )
}