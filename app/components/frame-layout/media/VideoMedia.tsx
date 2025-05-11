'use client';

import { useRef, useEffect } from 'react';
import { MediaProps } from './types';

export function VideoMedia({ src, isHovered }: MediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (isHovered) {
      videoRef.current?.play().catch(err => 
        console.log('Video autoplay prevented:', err)
      );
    } else {
      videoRef.current?.pause();
    }
  }, [isHovered]);

  // Цвет для видео-плейсхолдера
  const placeholderColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 30%)`;

  return (
    <div className="w-full h-full" data-video-content>
      {src ? (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: placeholderColor }}
        >
          <div className="text-white text-center p-4">
            <p className="text-xl font-semibold">Video {Math.floor(Math.random() * 100) + 1}</p>
            <p className="text-sm opacity-70">Hover to play</p>
          </div>
        </div>
      )}
    </div>
  );
} 