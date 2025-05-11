import { useState, useEffect, useCallback, useRef } from 'react';
import { ANIMATION_TIMINGS } from '@/lib/constants/animation-timings';

type RevealState = 'visible' | 'hidden' | 'revealing' | 'hiding';

interface UseCyberRevealOptions {
  initialState?: RevealState;
  revealDuration?: number;
  hideDuration?: number;
  autoRevealDelay?: number; // Время через которое скрытый элемент снова появится
  hoverOutDelay?: number; // Задержка перед появлением после ухода мыши
}

/**
 * Хук для управления эффектом "шторки" (curtain-reveal) в киберпанк-стиле
 * 
 * @param isHovered - Находится ли элемент в состоянии наведения
 * @param isClicked - Был ли элемент кликнут (переключение состояния)
 * @param options - Настройки анимации
 * @returns Текущее состояние анимации и callback для ручного переключения
 */
export function useCyberReveal(
  isHovered: boolean, 
  isClicked: boolean, 
  options: UseCyberRevealOptions = {}
) {
  const {
    initialState = 'visible',
    revealDuration = ANIMATION_TIMINGS.REVEAL_DURATION,
    hideDuration = ANIMATION_TIMINGS.HIDE_DURATION,
    autoRevealDelay = ANIMATION_TIMINGS.AUTO_REVEAL_DELAY,
    hoverOutDelay = ANIMATION_TIMINGS.HOVER_OUT_DELAY
  } = options;
  
  const [state, setState] = useState<RevealState>(initialState);
  
  // Используем useRef для хранения всех активных таймеров
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  
  // Хранение предыдущего состояния наведения
  const prevHoveredRef = useRef<boolean>(isHovered);
  
  // Функция для безопасного создания таймера с отслеживанием
  const createTimer = useCallback((callback: () => void, delay: number): NodeJS.Timeout => {
    const timer = setTimeout(callback, delay);
    timersRef.current = [...timersRef.current, timer];
    return timer;
  }, []);
  
  // Функция для очистки всех таймеров
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);
  
  // Ручное переключение состояния
  const toggle = useCallback(() => {
    setState(prevState => {
      if (prevState === 'visible' || prevState === 'revealing') {
        return 'hiding';
      } else {
        return 'revealing';
      }
    });
  }, []);
  
  // Обработка переходов анимации
  useEffect(() => {
    // Очищаем предыдущие таймеры при изменении состояния
    clearAllTimers();
    
    if (state === 'revealing') {
      createTimer(() => {
        setState('visible');
      }, revealDuration);
    }
    
    if (state === 'hiding') {
      createTimer(() => {
        setState('hidden');
        
        // Автоматически показать через некоторое время
        if (autoRevealDelay > 0) {
          createTimer(() => {
            setState('revealing');
          }, autoRevealDelay);
        }
      }, hideDuration);
    }
    
    // Очищаем все таймеры при размонтировании компонента
    return clearAllTimers;
  }, [state, revealDuration, hideDuration, autoRevealDelay, createTimer, clearAllTimers]);
  
  // Обработка клика - закрытие шторки
  useEffect(() => {
    if (isClicked && (state === 'visible' || state === 'revealing')) {
      setState('hiding');
    }
  }, [isClicked, state]);
  
  // Обработка наведения мыши с задержкой
  useEffect(() => {
    // Изменение состояния наведения
    const hoveredChanged = prevHoveredRef.current !== isHovered;
    prevHoveredRef.current = isHovered;
    
    if (!hoveredChanged) return;
    
    // При наведении мыши на элемент (если он видимый или в процессе появления) - скрываем его
    if (isHovered && (state === 'visible' || state === 'revealing')) {
      // Скрытие происходит мгновенно
      setState('hiding');
    } 
    // При уходе мыши с элемента (если он скрыт или в процессе скрытия) - показываем его с задержкой
    else if (!isHovered && (state === 'hidden' || state === 'hiding')) {
      // Добавляем задержку перед появлением
      clearAllTimers(); // Очистим все существующие таймеры
      if (hoverOutDelay > 0) {
        createTimer(() => {
          setState('revealing');
        }, hoverOutDelay);
      } else {
      setState('revealing');
      }
    }
  }, [isHovered, state, hoverOutDelay, createTimer, clearAllTimers]);
  
  return {
    state,
    toggle,
    isRevealing: state === 'revealing',
    isHiding: state === 'hiding',
    isVisible: state === 'visible',
    isHidden: state === 'hidden'
  };
}

export default useCyberReveal; 