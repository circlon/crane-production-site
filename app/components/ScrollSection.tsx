"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollSectionProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  id?: string;
  fullHeight?: boolean;
  fadeWhenLeaving?: boolean;
  scaleEffect?: boolean;
  parallaxFactor?: number; // 0 - нет эффекта, 1 - максимальный эффект
}

const ScrollSection: React.FC<ScrollSectionProps> = ({
  children,
  backgroundColor = 'black',
  textColor = 'white',
  className = '',
  id,
  fullHeight = true,
  fadeWhenLeaving = true,
  scaleEffect = true,
  parallaxFactor = 0.15, // Умеренный эффект параллакса по умолчанию
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  
  // Получаем параметры скролла
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  
  // Сглаженный прогресс для более плавной анимации
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Трансформация элементов в зависимости от скролла
  const scale = useTransform(
    smoothProgress, 
    [0, 1], 
    [1, scaleEffect ? 0.95 : 1]
  );
  
  const opacity = useTransform(
    smoothProgress, 
    [0, 0.6, 1], 
    [1, fadeWhenLeaving ? 0.85 : 1, fadeWhenLeaving ? 0.7 : 1]
  );
  
  // Параллакс эффект для дочерних элементов - уменьшаем для лучшей видимости контента
  const y = useTransform(
    smoothProgress, 
    [0, 1], 
    ['0%', `${parallaxFactor * 70}%`]
  );
  
  // Обновляем затемнение секции при прокрутке
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange(value => {
      setOverlayOpacity(Math.min(value * 0.8, 0.5)); // Максимальное затемнение 50%
    });
    
    return () => unsubscribe();
  }, [smoothProgress]);
  
  return (
    <motion.section 
      ref={sectionRef}
      id={id}
      className={`
        relative 
        fluid-section 
        ${fullHeight ? 'min-h-screen' : ''} 
        ${className}
      `}
      style={{ 
        backgroundColor,
        color: textColor,
        scale,
        opacity,
      }}
    >
      {/* Затемняющий оверлей */}
      <div 
        className="fluid-section-overlay"
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Контент с параллакс-эффектом */}
      <motion.div 
        className="h-full w-full relative z-10 fluid-section-parallax"
        style={{ y }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};

export default ScrollSection; 