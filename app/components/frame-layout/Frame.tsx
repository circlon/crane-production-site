'use client';

import { useRef } from 'react';
import { FrameProps } from './media/types';
import { NoiseEffect } from '@/app/components/Noise';

// Обновленный интерфейс с необязательным свойством isHovered
export function Frame({ children, showFrame, borderThickness, borderSize, title, isHovered }: FrameProps & { isHovered?: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      className="frame-container relative w-full h-full overflow-hidden"
      ref={frameRef}
      data-video-frame
    >
      {/* Noise effect убран для исключения шума на видео */}
      
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          zIndex: 1,
          transition: "all 0.3s ease-in-out",
          padding: showFrame ? `${borderThickness}px` : "0",
          width: showFrame ? `${borderSize}%` : "100%",
          height: showFrame ? `${borderSize}%` : "100%",
          left: showFrame ? `${(100 - borderSize) / 2}%` : "0",
          top: showFrame ? `${(100 - borderSize) / 2}%` : "0",
        }}
      >
        {children}
      </div>
      
      {showFrame && (
        <div 
          className="absolute inset-0" 
          style={{ zIndex: 2, pointerEvents: 'none' }}
        >
          {/* Corners */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-white/20 border-t-2 border-l-2 border-white/40" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 border-t-2 border-r-2 border-white/40" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 border-b-2 border-l-2 border-white/40" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/20 border-b-2 border-r-2 border-white/40" />

          {/* Edges */}
          <div className="absolute top-0 left-16 right-16 h-4 bg-white/20 border-t-2 border-white/40" />
          <div className="absolute bottom-0 left-16 right-16 h-4 bg-white/20 border-b-2 border-white/40" />
          <div className="absolute left-0 top-16 bottom-16 w-4 bg-white/20 border-l-2 border-white/40" />
          <div className="absolute right-0 top-16 bottom-16 w-4 bg-white/20 border-r-2 border-white/40" />
          
          {/* Заголовок с data-атрибутом для CSS-анимаций */}
          {title && (
            <div className="absolute top-0 left-0 right-0 flex justify-center px-6 py-3 z-10 pointer-events-none">
              <span 
                className="animation-target font-mono uppercase tracking-wider text-white text-sm"
                data-hover-state={isHovered ? 'hovered' : 'not-hovered'}
              >
                {title}
                <div className="cyber-scan-line"></div>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 