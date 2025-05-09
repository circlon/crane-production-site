'use client';

import React, { useEffect, useRef } from 'react';

interface WavesBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const WavesBackground: React.FC<WavesBackgroundProps> = ({ className = '', children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    let step = 0;
    
    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;
    };
    
    const drawWave = (color: string, amplitude: number, frequency: number, offset: number) => {
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      for (let i = 0; i <= width; i++) {
        const y = Math.sin(i * frequency + offset + step) * amplitude + height / 2;
        ctx.lineTo(i, y);
      }
      
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Main blue wave
      drawWave('rgba(30, 144, 255, 0.7)', 50, 0.01, Math.PI); 
      
      // Secondary lighter wave
      drawWave('rgba(65, 105, 225, 0.5)', 40, 0.015, 0);
      
      // Top lightest wave
      drawWave('rgba(100, 149, 237, 0.3)', 30, 0.02, Math.PI / 2);
      
      step += 0.05;
      requestAnimationFrame(render);
    };
    
    init();
    render();
    
    window.addEventListener('resize', init);
    
    return () => {
      window.removeEventListener('resize', init);
    };
  }, []);
  
  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default WavesBackground; 