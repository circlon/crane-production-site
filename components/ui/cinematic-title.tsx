"use client";

import React from 'react';
import { CyberText } from './cyber-text';

interface CinematicTitleProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  scanLineColor?: string;
  glowColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  pixelated?: boolean;
}

const sizeClasses = {
  'sm': 'text-lg md:text-xl',
  'md': 'text-xl md:text-2xl',
  'lg': 'text-2xl md:text-3xl',
  'xl': 'text-3xl md:text-4xl',
  '2xl': 'text-4xl md:text-5xl',
  '3xl': 'text-5xl md:text-6xl lg:text-7xl',
};

/**
 * Быстрый компонент для создания заголовков с кинематографическим эффектом
 * Предустановленные настройки для единообразия по всему сайту
 */
export function CinematicTitle({
  children,
  className = '',
  delay = 0,
  threshold = 0.3,
  scanLineColor = 'rgba(255, 255, 255, 0.9)',
  glowColor = 'white',
  size = 'xl',
  pixelated = false,
}: CinematicTitleProps) {
  return (
    <CyberText
      cinematicMode={true}
      intersectionReveal={true}
      intersectionThreshold={threshold}
      cinematicDelay={delay}
      className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}
      scanLineColor={scanLineColor}
      glowColor={glowColor}
      pixelated={pixelated}
    >
      {children}
    </CyberText>
  );
}

export default CinematicTitle; 