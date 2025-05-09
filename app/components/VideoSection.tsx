'use client';

import { useEffect, useRef, useState } from 'react';
import { DynamicFrameLayout, Frame } from './frame-layout';

// Подготавливаем данные для демонстрации
const videoFrames = Array.from({ length: 9 }, (_, i) => {
  // Для центрального элемента (индекс 4) используем видео из ВК
  if (i === 4) {
    return {
      id: i + 1,
      media: {
        type: 'iframe' as const,
        src: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239045&hd=4&autoplay=1'
      },
      mediaSize: 1,
      borderThickness: 10,
      borderSize: 95,
      position: {
        row: Math.floor(i / 3),
        col: i % 3
      }
    };
  }
  
  // Для остальных слотов используем обычные видео
  return {
    id: i + 1,
    media: {
      type: 'video' as const,
      src: `/videos/video${i + 1}.mp4`
    },
    mediaSize: 1,
    borderThickness: 10,
    borderSize: 95,
    position: {
      row: Math.floor(i / 3),
      col: i % 3
    }
  };
});

interface VideoSectionProps {
  className?: string;
}

export default function VideoSection({ className = '' }: VideoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showFrames, setShowFrames] = useState(false);

  // Используем IntersectionObserver для определения, когда секция
  // становится видимой в окне просмотра
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Показываем рамки с небольшой задержкой для анимации
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowFrames(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className={`min-h-screen py-20 bg-black text-white ${className}`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Наше Портфолио
        </h2>
        
        <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-16">
          Наведите курсор на рамки, чтобы увидеть примеры наших работ. 
          Мы создаем кинематографичные истории, которые увлекают и волнуют.
        </p>
        
        <div className="w-full h-[90vh] max-h-[800px]">
          {isVisible && (
            <DynamicFrameLayout 
              frames={videoFrames} 
              showFrames={showFrames}
              hoverSize={7}
              gapSize={6}
            />
          )}
        </div>
      </div>
    </section>
  );
} 