"use client"

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollTextProps {
  children: ReactNode;
  className?: string;
  id?: string;
  fadeInStart?: number; // Когда начинает появляться (0-1)
  fadeOutStart?: number; // Когда начинает исчезать (0-1)
  animationType?: 'fade' | 'slide-up' | 'slide-down';
  duration?: number; // Продолжительность фазы анимации
}

const ScrollText = ({
  children,
  className = '',
  id,
  fadeInStart = 0.2,
  fadeOutStart = 0.8,
  animationType = 'fade',
  duration = 0.3
}: ScrollTextProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prevProgressRef = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    let frameId: number | null = null;
    const section = sectionRef.current;
    
    const updateScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Используем похожую логику на ScrollExpandMedia
      // Секция начинает анимацию когда появляется снизу
      // И заканчивает когда исчезает сверху
      const start = windowHeight; // Секция только начинает появляться
      const end = -section.offsetHeight * 0.2; // Секция почти ушла вверх
      
      // Прогресс от 0 до 1 на основе позиции верхней границы
      const rawProgress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      
      // Сглаживание прогресса для плавности
      const smoothFactor = 0.3;
      const newProgress = prevProgressRef.current + (rawProgress - prevProgressRef.current) * smoothFactor;
      prevProgressRef.current = newProgress;
      
      // Обновляем состояние только при значительном изменении
      if (Math.abs(newProgress - scrollProgress) > 0.001) {
        setScrollProgress(newProgress);
      }
      
      frameId = requestAnimationFrame(updateScrollProgress);
    };
    
    const handleScroll = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(updateScrollProgress);
    };
    
    // Начальная установка прогресса
    updateScrollProgress();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [scrollProgress]);

  // Вычисляем opacity на основе прогресса
  const getTextOpacity = () => {
    if (scrollProgress < fadeInStart) {
      return 0;
    } else if (scrollProgress < fadeInStart + duration) {
      // Фаза появления
      const fadeInProgress = (scrollProgress - fadeInStart) / duration;
      return Math.min(1, fadeInProgress);
    } else if (scrollProgress < fadeOutStart) {
      // Фаза полной видимости
      return 1;
    } else if (scrollProgress < fadeOutStart + duration) {
      // Фаза исчезновения
      const fadeOutProgress = (scrollProgress - fadeOutStart) / duration;
      return Math.max(0, 1 - fadeOutProgress);
    } else {
      return 0;
    }
  };

  // Вычисляем transform на основе типа анимации
  const getTextTransform = () => {
    const opacity = getTextOpacity();
    
    switch (animationType) {
      case 'slide-up':
        const slideUp = (1 - opacity) * 40; // 40px максимальное смещение
        return `translateY(${slideUp}px)`;
      case 'slide-down':
        const slideDown = (1 - opacity) * -40; // 40px максимальное смещение вверх
        return `translateY(${slideDown}px)`;
      default:
        return 'translateY(0)';
    }
  };

  const opacity = getTextOpacity();
  const transform = getTextTransform();

  return (
    <div 
      ref={sectionRef}
      className={className}
      id={id}
      style={{
        opacity,
        transform,
        transition: 'none', // Убираем CSS transitions для плавного скролла
        willChange: 'opacity, transform',
        // Убираем любые стили, которые могут переопределить шрифты
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        lineHeight: 'inherit',
        letterSpacing: 'inherit'
      }}
    >
      {children}
    </div>
  );
};

export default ScrollText; 