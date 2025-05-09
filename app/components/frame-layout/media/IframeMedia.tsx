'use client';

import { useRef, useState } from 'react';
import { MediaProps } from './types';
import { VideoModal } from '@/components/ui/video-modal';

export function IframeMedia({ src, isHovered }: MediaProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Обработчик клика для открытия модального окна
  const handleClick = () => {
    if (src) {
      setIsModalOpen(true);
    }
  };

  // Если есть src и элемент в фокусе, показываем превью
  // При клике открываем модальное окно
  return (
    <>
      <div 
        className="w-full h-full cursor-pointer"
        onClick={handleClick}
      >
        {isHovered && src && !isModalOpen ? (
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
              <p className="text-sm opacity-70">{isHovered ? 'Нажмите для просмотра в HD' : 'Наведите для превью'}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Модальное окно для видео */}
      {src && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoSrc={src}
        />
      )}
    </>
  );
} 