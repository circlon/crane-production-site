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
  // Новые пропсы для единой системы анимаций
  cinematicMode?: boolean; // Использовать единый кинематографический эффект
  intersectionReveal?: boolean; // Активировать анимацию при входе в viewport
  intersectionThreshold?: number; // Порог срабатывания Intersection Observer (0-1)
  cinematicDelay?: number; // Задержка перед анимацией в миллисекундах
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
  pixelDensity = 1.5,
  // Новые параметры для единой системы
  cinematicMode = false,
  intersectionReveal = false,
  intersectionThreshold = 0.2,
  cinematicDelay = 0
}: CyberTextProps) {
  // Трекинг монтирования компонента для предотвращения обновления состояния после размонтирования
  const mountedRef = useRef(true);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<{clean: () => void} | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const intersectionTriggeredRef = useRef(false);

  const { state, isRevealing, isHiding, forceReveal } = useCyberReveal(isHovered, isClicked, {
    initialState: intersectionReveal ? 'hidden' : (cinematicMode ? 'revealing' : initialState),
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

  // Intersection Observer для автоматической анимации при скролле
  useEffect(() => {
    if (!intersectionReveal || !textRef.current) return;

    const element = textRef.current;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !intersectionTriggeredRef.current) {
            intersectionTriggeredRef.current = true;
            
            // Добавляем задержку перед анимацией, если указана
            if (cinematicDelay > 0) {
              setTimeout(() => {
                if (mountedRef.current) {
                  forceReveal();
                }
              }, cinematicDelay);
            } else {
              forceReveal();
            }
          }
        });
      },
      {
        threshold: intersectionThreshold,
        rootMargin: '0px 0px -10% 0px' // Немного раньше срабатывания для плавности
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [intersectionReveal, intersectionThreshold, cinematicDelay, forceReveal]);
  
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
        isRevealing ? (cinematicMode ? 'cinematic-text-wipe-reveal' : 'cyber-text-reveal') : ''
      } ${
        isHiding ? (cinematicMode ? 'cinematic-text-wipe-hide' : 'cyber-text-hide') : ''
      } ${
        pixelated ? 'cyber-text-pixelated' : ''
      } ${
        cinematicMode ? 'cinematic-text-wipe' : ''
      } ${className}`}
      data-cyber-state={state}
      data-cinematic-mode={cinematicMode}
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