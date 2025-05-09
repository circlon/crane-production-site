'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Адаптация к мобильным устройствам
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Единая функция для отслеживания скролла и анимации
  useEffect(() => {
    if (!sectionRef.current) return;
    
    let frameId: number | null = null;
    const section = sectionRef.current;
    
    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Запускаем анимацию когда секция еще только появляется (с предыдущей секции)
      // Полностью расширяется, когда секция занимает весь экран
      // Основываемся на положении верхней границы секции: от 1.5*windowHeight до -0.5*windowHeight
      const start = 1.5 * windowHeight; // Секция еще внизу, первая секция видна
      const end = -0.5 * windowHeight;  // Секция почти ушла вверх
      const total = start - end;
      
      // Вычисляем прогресс от 0 до 1
      const current = rect.top;
      const newProgress = 1 - Math.max(0, Math.min(1, (current - end) / total));
      
      if (newProgress !== progress) {
        setProgress(newProgress);
      }
      
      frameId = requestAnimationFrame(updateScroll);
    };
    
    frameId = requestAnimationFrame(updateScroll);
    
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [progress]);

  // Рассчитываем размеры и трансформации на основе прогресса
  const mediaWidth = 300 + progress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + progress * (isMobile ? 200 : 400);
  const textTranslateX = progress * (isMobile ? 180 : 150);
  const contentOpacity = Math.max(0, (progress - 0.75) * 4); // Показываем контент после 75% прогресса
  
  // Разделяем заголовок для анимации
  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';
  
  return (
    <div 
      ref={sectionRef}
      className="relative min-h-[100vh]"
    >
      <div className="relative w-full min-h-[100vh] flex flex-col items-center">
        {/* Фоновое изображение (при наличии) */}
        {bgImageSrc && (
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - progress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt="Background"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        )}
        
        <div className="container mx-auto flex flex-col items-center relative z-10 min-h-[100vh]">
          {/* Медиа и заголовок */}
          <div className="flex flex-col items-center justify-center w-full h-[100vh] relative">
            {/* Контейнер медиа */}
            <div
              className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl"
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: '95vw',
                maxHeight: '85vh',
                boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                transition: 'width 0.05s ease-out, height 0.05s ease-out',
              }}
            >
              {/* Видео контент */}
              {mediaType === 'video' && (
                <div className="relative w-full h-full pointer-events-none">
                  {mediaSrc.includes('youtube.com') ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={
                        mediaSrc.includes('embed')
                          ? mediaSrc +
                            (mediaSrc.includes('?') ? '&' : '?') +
                            'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                          : mediaSrc.replace('watch?v=', 'embed/') +
                            '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                            mediaSrc.split('v=')[1]
                      }
                      className="w-full h-full rounded-xl"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLVideoElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  
                  {/* Видео оверлей */}
                  <motion.div
                    className="absolute inset-0 bg-black/30 rounded-xl"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0.5 - progress * 0.3 }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              )}

              {/* Изображение контент */}
              {mediaType === 'image' && (
                <div className="relative w-full h-full">
                  <Image
                    src={mediaSrc}
                    alt={title || 'Media content'}
                    width={1280}
                    height={720}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                  
                  {/* Оверлей изображения */}
                  <motion.div
                    className="absolute inset-0 bg-black/50 rounded-xl"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0.7 - progress * 0.3 }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              )}

              {/* Дата */}
              {date && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
                  <p
                    className="text-2xl text-blue-200"
                    style={{ 
                      transform: `translateX(-${textTranslateX}vw)`,
                      transition: 'transform 0.05s ease-out' 
                    }}
                  >
                    {date}
                  </p>
                </div>
              )}
            </div>

            {/* Заголовок */}
            <div
              className={`flex items-center justify-center text-center gap-4 w-full relative z-10 flex-col ${
                textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
              }`}
            >
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-200"
                style={{ 
                  transform: `translateX(-${textTranslateX}vw)`,
                  transition: 'transform 0.05s ease-out'
                }}
              >
                {firstWord}
              </motion.h2>
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-200"
                style={{ 
                  transform: `translateX(${textTranslateX}vw)`,
                  transition: 'transform 0.05s ease-out'
                }}
              >
                {restOfTitle}
              </motion.h2>
            </div>
          </div>

          {/* Контент секция */}
          <div
            className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
            style={{ 
              opacity: contentOpacity,
              transition: 'opacity 0.3s ease-out'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollExpandMedia;