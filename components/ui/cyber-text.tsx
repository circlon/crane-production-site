import React, { ReactNode, useRef, useEffect, CSSProperties } from 'react';
import { useCyberReveal } from '@/lib/hooks/useCyberReveal';
import { ANIMATION_TIMINGS } from '@/lib/constants/animation-timings';
import { getCyberTextCSSVariables } from '@/lib/utils/generate-css-variables';
import { clearPixelFragments, applyMinimalTextEffect } from '@/lib/utils/pixel-fragment';

interface CyberTextProps {
  children: ReactNode;
  isHovered?: boolean;
  isClicked?: boolean;
  className?: string;
  initialState?: 'visible' | 'hidden' | 'revealing' | 'hiding';
  autoRevealDelay?: number;
  scanLineColor?: string;  // Цвет сканирующей линии
  glowColor?: string;      // Цвет свечения текста
  pixelated?: boolean;     // Включить эффект пикселизации
  pixelFragment?: boolean; // Параметр оставлен для обратной совместимости, но не используется
  pixelSize?: number;      // Параметр оставлен для обратной совместимости, но не используется
  pixelDensity?: number;   // Параметр оставлен для обратной совместимости, но не используется
}

// Расширенный интерфейс для CSS-свойств с кастомными переменными
interface CyberTextCSSProperties extends CSSProperties {
  [key: string]: any; // Позволяет использовать CSS-переменные с префиксом --
}

/**
 * Компонент для отображения текста с киберпанк эффектом "шторки"
 */
export function CyberText({
  children,
  isHovered = false,
  isClicked = false,
  className = '',
  initialState = 'visible',
  autoRevealDelay = ANIMATION_TIMINGS.AUTO_REVEAL_DELAY,
  scanLineColor,
  glowColor,
  pixelated = true, // По умолчанию включаем пиксельный эффект
  // Эти параметры игнорируются, но сохранены для обратной совместимости
  pixelFragment = false,
  pixelSize = 6,
  pixelDensity = 1.5
}: CyberTextProps) {
  // Трекинг монтирования компонента для предотвращения обновления состояния после размонтирования
  const mountedRef = useRef(true);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<{clean: () => void} | null>(null);

  const { state, isRevealing, isHiding } = useCyberReveal(isHovered, isClicked, {
    initialState,
    autoRevealDelay
  });
  
  // Инициализация минималистичного эффекта
  useEffect(() => {
    if (textRef.current) {
      effectRef.current = applyMinimalTextEffect(textRef.current);
    }
    
    return () => {
      if (effectRef.current) {
        effectRef.current.clean();
      }
    };
  }, []);
  
  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Если текст скрыт, не рендерим его вообще
  if (state === 'hidden') {
    return null;
  }
  
  // Получаем базовые CSS-переменные из утилиты
  const baseStyles = getCyberTextCSSVariables() as CyberTextCSSProperties;
  
  // Модифицируем только нужные переменные, если переданы пользовательские значения
  if (scanLineColor) {
    baseStyles['--cyber-line-color'] = scanLineColor;
  }
  
  if (glowColor) {
    baseStyles['--cyber-text-glow'] = `0 0 8px ${glowColor}`;
  }
  
  // Добавляем пиксельный эффект
  if (pixelated) {
    baseStyles['fontFamily'] = 'monospace';
    baseStyles['letterSpacing'] = '1px';
  }
  
  return (
    <div 
      ref={textRef}
      className={`relative overflow-hidden ${
        isRevealing ? 'cyber-text-reveal' : ''
      } ${
        isHiding ? 'cyber-text-hide' : ''
      } ${
        pixelated ? 'cyber-text-pixelated' : ''
      } ${className}`}
      data-cyber-state={state}
      style={baseStyles}
    >
      <div ref={contentRef} className="relative">
      {children}
      </div>
      
      {/* Сканирующая линия (видна только при анимации) */}
      {(isRevealing || isHiding) && (
        <div className="cyber-scan-line" />
      )}
    </div>
  );
}

export default CyberText; 