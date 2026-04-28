'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function DitheringImage({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    
    let intervalId: NodeJS.Timeout;
    let imgData: ImageData | null = null;
    
    // Configuration
    const BLOCK_SIZE = 4;
    const COLOR_BLACK = [0, 0, 0, 255];       // Black background
    const COLOR_MID = [129, 139, 255, 255];   // #818BFF
    const COLOR_BRIGHT = [201, 217, 255, 255];// #C9D9FF
    
    img.onload = () => {
      // Set canvas internal resolution
      const width = 600;
      const height = width * (img.height / img.width);
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw to offscreen canvas to read pure image pixels
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;
      
      offCtx.drawImage(img, 0, 0, width, height);
      imgData = offCtx.getImageData(0, 0, width, height);
      
      // If already hovered when loaded, start interval
      if (isHovered) {
        renderDither();
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(renderDither, 150);
      }
    };
    
    const renderDither = () => {
      if (!imgData || !isHovered) return;
      
      const width = canvas.width;
      const height = canvas.height;
      const outData = ctx.createImageData(width, height);
      
      for (let y = 0; y < height; y += BLOCK_SIZE) {
        for (let x = 0; x < width; x += BLOCK_SIZE) {
          // Calculate average block luminance
          let rSum = 0, gSum = 0, bSum = 0;
          let count = 0;
          
          for (let by = 0; by < BLOCK_SIZE; by++) {
            for (let bx = 0; bx < BLOCK_SIZE; bx++) {
              if (x + bx < width && y + by < height) {
                const i = ((y + by) * width + (x + bx)) * 4;
                rSum += imgData.data[i];
                gSum += imgData.data[i + 1];
                bSum += imgData.data[i + 2];
                count++;
              }
            }
          }
          
          const rAvg = rSum / count;
          const gAvg = gSum / count;
          const bAvg = bSum / count;
          const luminance = 0.299 * rAvg + 0.587 * gAvg + 0.114 * bAvg;
          
          // Animated noise for moving pixel effect
          const noise = (Math.random() - 0.5) * 50; 
          const value = luminance + noise;
          
          // Map to 3 colors
          let color;
          if (value < 80) {
            color = COLOR_BLACK;
          } else if (value < 170) {
            color = COLOR_MID;
          } else {
            color = COLOR_BRIGHT;
          }
          
          // Draw block
          for (let by = 0; by < BLOCK_SIZE; by++) {
            for (let bx = 0; bx < BLOCK_SIZE; bx++) {
              if (x + bx < width && y + by < height) {
                const i = ((y + by) * width + (x + bx)) * 4;
                outData.data[i] = color[0];
                outData.data[i+1] = color[1];
                outData.data[i+2] = color[2];
                outData.data[i+3] = color[3];
              }
            }
          }
        }
      }
      
      ctx.putImageData(outData, 0, 0);
    };
    
    if (isHovered && imgData) {
      renderDither();
      intervalId = setInterval(renderDither, 150);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [src, isHovered]);

  return (
    <div 
      className="relative w-full cursor-crosshair group ml-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full overflow-hidden shadow-2xl rounded-sm">
      {/* Normal Image */}
      <motion.img 
        src={src} 
        alt="Dithering Target"
        className="block w-full h-auto object-cover border-4 border-transparent group-hover:border-[#818BFF] transition-all duration-300"
        initial={{ opacity: 1, filter: 'grayscale(0%)' }}
        animate={{ 
          opacity: isHovered ? 0 : 1,
          filter: isHovered ? 'grayscale(100%) blur(4px)' : 'grayscale(0%) blur(0px)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Canvas Overlay */}
      <motion.canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover border-4 border-[#818BFF] bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Tech Overlay Text */}
      <motion.div 
        className="absolute bottom-4 left-4 font-mono text-[10px] text-[#C9D9FF] bg-black/80 px-2 py-1 border border-[#818BFF]/30 backdrop-blur-sm pointer-events-none"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
      >
        [RENDER_DITHERING_ACTIVE]
      </motion.div>
      </div>

      {/* Floating Hover Card */}
      <motion.div 
        className="absolute -bottom-6 left-8 md:left-12 z-40 bg-white rounded-xl shadow-xl px-4 py-2.5 flex items-center gap-3 border border-gray-100 pointer-events-none"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: isHovered ? 10 : 0, opacity: isHovered ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
        </svg>
        <span className="text-gray-500 text-sm font-medium tracking-tight">
          Action <span className="mx-1">/</span> <span className="text-gray-900 font-bold">Hover me!</span>
        </span>
      </motion.div>
    </div>
  );
}
