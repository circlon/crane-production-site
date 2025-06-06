/**
 * Константы для анимаций
 * Эти значения используются как в JavaScript коде, так и в CSS
 * для обеспечения синхронизации временных параметров
 */

// Основные параметры анимации
export const ANIMATION_TIMINGS = {
  // Продолжительность анимации появления текста (в миллисекундах)
  REVEAL_DURATION: 1000,
  
  // Продолжительность анимации скрытия текста (в миллисекундах)
  HIDE_DURATION: 600,
  
  // Задержка перед автоматическим появлением (в миллисекундах)
  AUTO_REVEAL_DELAY: 7000,
  
  // Задержка для сброса состояния клика (в миллисекундах)
  CLICK_RESET_DELAY: 700,
  
  // Задержка перед появлением элемента после ухода мыши (в миллисекундах)
  HOVER_OUT_DELAY: 0,
  
  // Интенсивность эффекта "глитча" (в пикселях)
  GLITCH_INTENSITY: 5,
}

// CSS переменные (используются для генерации CSS-in-JS или для синхронизации с .css файлами)
export const CSS_VARIABLES = {
  // Продолжительность появления в CSS формате
  REVEAL_DURATION_CSS: `${ANIMATION_TIMINGS.REVEAL_DURATION / 1000}s`,
  
  // Продолжительность скрытия в CSS формате
  HIDE_DURATION_CSS: `${ANIMATION_TIMINGS.HIDE_DURATION / 1000}s`,
  
  // Цвет сканирующей линии
  LINE_COLOR: 'rgba(255, 255, 255, 0.8)',
  
  // Интенсивность эффекта "глитча" в CSS формате
  GLITCH_INTENSITY_CSS: `${ANIMATION_TIMINGS.GLITCH_INTENSITY}px`,
  
  // Эффект свечения текста
  TEXT_GLOW: '0 0 8px rgba(255, 255, 255, 0.9)',
  
  // Цвет текста
  TEXT_COLOR: 'rgba(255, 255, 255, 0.9)',
  
  // Непрозрачность шума
  NOISE_OPACITY: '0.05',
} 