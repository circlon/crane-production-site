'use client';

import { MediaProviderProps } from './types';
import { VideoMedia } from './VideoMedia';
import { IframeMedia } from './IframeMedia';

export function MediaProvider({ type, src, isHovered }: MediaProviderProps) {
  // Выбираем компонент на основе типа медиа
  switch (type) {
    case 'video':
      return <VideoMedia src={src} isHovered={isHovered} />;
    case 'iframe':
      return <IframeMedia src={src} isHovered={isHovered} />;
    default:
      // Плейсхолдер, если тип не определен
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="text-white text-center p-4">
            <p className="text-xl font-semibold">Unknown Media</p>
            <p className="text-sm opacity-70">Media type not supported</p>
          </div>
        </div>
      );
  }
} 