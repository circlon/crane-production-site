'use client';

import { useRef } from 'react';
import { MediaProps } from './types';

export function IframeMedia({ src, isHovered }: MediaProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Если есть src и элемент в фокусе, показываем iframe
  // Иначе показываем плейсхолдер
  return (
    <div className="w-full h-full">
      {isHovered && src ? (
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full h-full"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
          frameBorder="0"
          allowFullScreen
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center bg-blue-900"
        >
          <div className="text-white text-center p-4">
            <p className="text-xl font-semibold">VK Video</p>
            <p className="text-sm opacity-70">Hover to play</p>
          </div>
        </div>
      )}
    </div>
  );
} 