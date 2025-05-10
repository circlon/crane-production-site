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
  id?: string;
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
  id,
}: ScrollExpandMediaProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const prevProgressRef = useRef(0); // Для отслеживания предыдущего значения прогресса

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
      const rawProgress = 1 - Math.max(0, Math.min(1, (current - end) / total));
      
      // Добавляем плавность к изменению прогресса (интерполяция)
      const smoothFactor = 0.08; // Коэффициент сглаживания (меньше = плавнее)
      const newProgress = prevProgressRef.current + (rawProgress - prevProgressRef.current) * smoothFactor;
      prevProgressRef.current = newProgress; // Сохраняем для следующего кадра
      
      if (Math.abs(newProgress - progress) > 0.001) {
        setProgress(newProgress);
        
        // Затемняем первую секцию при скролле вниз
        updateHeroSection(newProgress);
      }
      
      frameId = requestAnimationFrame(updateScroll);
    };
    
    // Выносим логику обновления в отдельную функцию, чтобы можно было вызвать её и при обновлении прогресса
    const updateHeroSection = (newProgress: number) => {
      const heroSection = document.querySelector('#hero-section');
      if (heroSection) {
        // Добавляем плавный переход в цвет фона второй секции (черный)
        // вместо применения filter: brightness()
        const overlayOpacity = Math.min(newProgress * 1.2, 0.95); // max 95% затемнения
        
        // Добавляем эффект отдаления с уменьшением по мере прокрутки
        const scale = 1 - Math.min(newProgress * 0.08, 0.06); // max 6% уменьшения
        
        // Применяем трансформацию
        (heroSection as HTMLElement).style.transform = `scale(${scale})`;
        
        // Вместо filter: brightness используем оверлей с фоном второй секции
        const overlay = document.querySelector('#hero-overlay');
        if (overlay) {
          (overlay as HTMLElement).style.opacity = String(overlayOpacity);
        } else {
          // Если оверлея нет, создаем его
          const newOverlay = document.createElement('div');
          newOverlay.id = 'hero-overlay';
          newOverlay.style.position = 'absolute';
          newOverlay.style.inset = '0';
          newOverlay.style.backgroundColor = '#000'; // Цвет фона второй секции
          newOverlay.style.opacity = String(overlayOpacity);
          newOverlay.style.transition = 'opacity 0.3s ease-out';
          newOverlay.style.pointerEvents = 'none';
          newOverlay.style.zIndex = '1';
          heroSection.appendChild(newOverlay);
        }
      }
    };
    
    frameId = requestAnimationFrame(updateScroll);
    
    // Обеспечиваем сохранение состояния при первоначальной загрузке
    // и при остановке скролла
    updateHeroSection(progress);
    
    // Добавляем обработчик для обновления при скролле без активного requestAnimationFrame
    const handleScroll = () => {
      if (!frameId) {
        updateHeroSection(progress);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      
      // Сбрасываем эффекты при размонтировании компонента
      const heroSection = document.querySelector('#hero-section');
      if (heroSection) {
        (heroSection as HTMLElement).style.transform = '';
        
        // Удаляем оверлей при размонтировании компонента
        const overlay = document.querySelector('#hero-overlay');
        if (overlay) {
          overlay.remove();
        }
      }
    };
  }, [progress]);

  // Рассчитываем размеры и трансформации на основе прогресса
  const mediaWidth = 300 + progress * (isMobile ? 650 : 1250);
  const mediaHeight = 300 + progress * (isMobile ? 300 : 500);
  
  // Новый расчет смещения текста с использованием нелинейной функции
  // Текст начинает разъезжаться только после 50% прогресса и ускоряется к концу
  const easeInOutCubic = (x: number) => {
    // Ступенчатая функция: держим текст на месте до 50%, затем начинаем движение
    // с кубическим ускорением к концу (кривая Безье с ускорением)
    if (x < 0.5) return 0;
    const adjusted = (x - 0.5) / 0.5; // нормализуем оставшийся диапазон от 0 до 1
    
    // Эффект очень медленного начала и резкого ускорения к концу
    return adjusted * adjusted * adjusted;
  };
  
  const textTranslateX = easeInOutCubic(progress) * (isMobile ? 120 : 100);
  
  const contentOpacity = Math.max(0, (progress - 0.75) * 4); // Показываем контент после 75% прогресса
  
  // Расчет прозрачности заголовка - исчезает к концу прокрутки
  // Начинаем уменьшать прозрачность с 80% прогресса, полное исчезновение к 100%
  const titleOpacity = progress > 0.8 ? Math.max(0, 1 - (progress - 0.8) * 5) : 1;
  
  // Разделяем заголовок для анимации
  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';
  
  return (
    <div 
      ref={sectionRef}
      className="relative min-h-[100vh] overflow-hidden"
      id={id}
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
                      transition: 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)',
                      opacity: titleOpacity
                    }}
                  >
                    {date}
                  </p>
                </div>
              )}
            </div>

            {/* Заголовок */}
            <div
              className={`flex items-center justify-center text-center gap-2 w-full relative z-10 flex-col overflow-hidden max-w-screen-lg mx-auto ${
                textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
              }`}
            >
              <motion.h2
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-200"
                style={{ 
                  transform: `translateX(-${Math.min(textTranslateX, 100)}vw)`,
                  transition: 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
                  opacity: titleOpacity
                }}
              >
                {firstWord}
              </motion.h2>
              <motion.h2
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-blue-200"
                style={{ 
                  transform: `translateX(${Math.min(textTranslateX, 100)}vw)`,
                  transition: 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
                  opacity: titleOpacity
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