'use client';

import { useRef, useState } from 'react';
import { MediaProps } from './types';
import { VideoModal } from '@/components/ui/video-modal';
import Image from 'next/image';

export function IframeMedia({ src, isHovered }: MediaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Обработчик клика для открытия модального окна
  const handleClick = () => {
    if (src) {
      setIsModalOpen(true);
    }
  };

  // Определяем, является ли iframe VK видео
  const isVkVideo = src?.includes('vkvideo.ru') || src?.includes('vk.com');
  
  // Создаем цвет для фона превью
  const bgColor = isVkVideo ? 'bg-blue-900' : 'bg-purple-900';

  return (
    <>
      <div 
        className={`w-full h-full cursor-pointer ${isHovered ? 'scale-105' : 'scale-100'} transition-transform duration-300`}
        onClick={handleClick}
      >
        <div className={`w-full h-full flex items-center justify-center ${bgColor} relative overflow-hidden`}>
          {/* Превью-контент */}
          <div className="text-white text-center p-4 z-10">
            <p className="text-xl font-semibold">
              {isVkVideo ? 'VK Video' : 'External Media'}
            </p>
            <p className="text-sm opacity-70 mt-1">
              {isHovered ? 'Нажмите для просмотра в HD' : 'Наведите для превью'}
            </p>
          </div>
          
          {/* Анимированный фон для превью */}
          <div className="absolute inset-0 z-0 opacity-30">
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent animate-pulse" />
            )}
            <div className="absolute -inset-1 bg-grid-white/10" style={{ backgroundSize: '20px 20px' }} />
          </div>
          
          {/* Индикатор типа контента */}
          <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md text-white px-2 py-1 text-xs rounded-md">
            {isVkVideo ? 'VK' : 'External'}
          </div>
        </div>
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