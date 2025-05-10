import { CSS_VARIABLES } from '@/lib/constants/animation-timings';
import { CSSProperties } from 'react';

// Расширенный интерфейс для CSS-свойств с кастомными переменными
interface CyberTextCSSProperties extends CSSProperties {
  [key: string]: any; // Позволяет использовать CSS-переменные с префиксом --
}

/**
 * Генерирует CSS переменные для встраивания в стили компонентов
 * Это позволяет синхронизировать значения из JavaScript с CSS
 * 
 * @returns Строка с CSS переменными для использования в :root или inline стилях
 */
export function generateCSSVariables(): string {
  return `
    --cyber-reveal-duration: ${CSS_VARIABLES.REVEAL_DURATION_CSS};
    --cyber-hide-duration: ${CSS_VARIABLES.HIDE_DURATION_CSS};
    --cyber-line-color: ${CSS_VARIABLES.LINE_COLOR};
    --cyber-glitch-intensity: ${CSS_VARIABLES.GLITCH_INTENSITY_CSS};
    --cyber-text-glow: ${CSS_VARIABLES.TEXT_GLOW};
    --cyber-text-color: ${CSS_VARIABLES.TEXT_COLOR};
    --cyber-noise-opacity: ${CSS_VARIABLES.NOISE_OPACITY};
  `;
}

/**
 * Встраивает CSS переменные в объект стилей React
 * Для использования в компонентах с inline стилями
 * 
 * @returns Объект стилей с CSS переменными
 */
export function getCyberTextCSSVariables(): CyberTextCSSProperties {
  return {
    // Используем типизацию CyberTextCSSProperties для поддержки CSS переменных
    '--cyber-reveal-duration': CSS_VARIABLES.REVEAL_DURATION_CSS,
    '--cyber-hide-duration': CSS_VARIABLES.HIDE_DURATION_CSS,
    '--cyber-line-color': CSS_VARIABLES.LINE_COLOR,
    '--cyber-glitch-intensity': CSS_VARIABLES.GLITCH_INTENSITY_CSS,
    '--cyber-text-glow': CSS_VARIABLES.TEXT_GLOW,
    '--cyber-text-color': CSS_VARIABLES.TEXT_COLOR,
    '--cyber-noise-opacity': CSS_VARIABLES.NOISE_OPACITY
  };
} 