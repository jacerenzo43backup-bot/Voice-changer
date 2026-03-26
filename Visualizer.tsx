import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VisualizerProps {
  getAnalyser: () => AnalyserNode | null;
  isActive: boolean;
  className?: string;
  color?: string;
}

export function Visualizer({ 
  getAnalyser, 
  isActive, 
  className,
  color = '#00f3ff' // Default neon cyan
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;

    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);
      
      // Draw background with slight trail effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const analyser = getAnalyser();
      
      if (!isActive || !analyser) {
        // Draw flat line if inactive
        ctx.lineWidth = 2;
        ctx.strokeStyle = `${color}40`; // dimmed
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      
      // Add glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      
      ctx.beginPath();
      
      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (height / 2);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
      
      // Reset shadow for next frame's clearRect
      ctx.shadowBlur = 0;
    };

    draw();

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, getAnalyser, color]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx?.scale(dpr, dpr);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl bg-black/40 border border-white/5", className)}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Scanline overlay effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
             backgroundSize: '100% 4px'
           }}
      />
    </div>
  );
}
