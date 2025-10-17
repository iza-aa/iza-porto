'use client';

import { useEffect, useRef } from 'react';

interface BinaryBackgroundProps {
  className?: string;
}

export default function BinaryBackground({ className = '' }: BinaryBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();

    // Configuration
    const FONT_SIZE = 14;                    // Fixed font size
    const CELL_SIZE = FONT_SIZE * 2;         // Space allocated for each binary digit
    const GAP = FONT_SIZE * 0.5;             // Gap between cells
    const ROWS = Math.ceil(canvas.height / (CELL_SIZE + GAP)) + 4;
    const COLS = Math.ceil(canvas.width / (CELL_SIZE + GAP)) + 4;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px monospace`;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = timeRef.current;

      // Draw grid of binary numbers
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          // Base position
          const baseX = (col - COLS/2) * (CELL_SIZE + GAP);
          const baseY = (row - ROWS/2) * (CELL_SIZE + GAP);

          // Add wave distortion
          const angle = Math.atan2(baseY, baseX);
          const distance = Math.sqrt(baseX * baseX + baseY * baseY);
          const wave = Math.sin(distance * 0.05 - time + angle * 2) * 20;

          const x = centerX + baseX + wave;
          const y = centerY + baseY + wave;

          // Calculate opacity based on position
          const opacity = Math.max(0.1, Math.min(0.8, 
            1 - (distance / (Math.min(canvas.width, canvas.height) * 0.5))
          ));

          ctx.fillStyle = `rgba(180, 180, 180, ${opacity})`;
          const binary = Math.random() > 0.5 ? '1' : '0';
          ctx.fillText(binary, x, y);
        }
      }

      timeRef.current += 0.02;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      <canvas ref={canvasRef} className="pointer-events-none bg-black" />
    </div>
  );
}