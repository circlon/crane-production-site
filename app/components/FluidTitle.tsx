"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CyberText } from '../../components/ui/cyber-text';

interface FluidTitleProps {
  text: string;
  size?: 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  color?: string;
  className?: string;
  delay?: number;
  duration?: number;
  // Новые пропсы для кинематографической системы
  cinematicMode?: boolean;
  intersectionReveal?: boolean;
  intersectionThreshold?: number;
  // Shader-эффекты
  shaderEffect?: 'gradient' | 'wipe' | 'holographic' | 'wave' | 'combined' | 'none';
  gradientColors?: string[];
  animationSpeed?: 'slow' | 'normal' | 'fast';
  intensityLevel?: 'subtle' | 'normal' | 'intense';
}

const FluidTitle: React.FC<FluidTitleProps> = ({
  text,
  size = '5xl',
  color = 'white',
  className = '',
  delay = 0,
  duration = 0.5,
  cinematicMode = false,
  intersectionReveal = false,
  intersectionThreshold = 0.2,
  shaderEffect = 'none',
  gradientColors,
  animationSpeed = 'normal',
  intensityLevel = 'normal',
}) => {
  const sizeClasses = {
    'xl': 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl',
    '5xl': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  // Если включен кинематографический режим или shader-эффекты, используем CyberText
  if (cinematicMode || shaderEffect !== 'none') {
    return (
      <CyberText
        cinematicMode={cinematicMode}
        intersectionReveal={intersectionReveal}
        intersectionThreshold={intersectionThreshold}
        cinematicDelay={delay * 1000} // Конвертируем в миллисекунды
        className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}
        scanLineColor="rgba(255, 255, 255, 0.9)"
        glowColor={color}
        pixelated={false} // Для заголовков отключаем пиксели
        // Новые shader-параметры
        shaderEffect={shaderEffect}
        gradientColors={gradientColors}
        animationSpeed={animationSpeed}
        intensityLevel={intensityLevel}
      >
        <h1 style={{ color }}>
          {text}
        </h1>
      </CyberText>
    );
  }

  // Обычный режим с Framer Motion
  return (
    <motion.h1
      className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}
      style={{ color }}
      initial="hidden"
      animate="visible"
      variants={titleVariants}
    >
      {text}
    </motion.h1>
  );
};

export default FluidTitle; 