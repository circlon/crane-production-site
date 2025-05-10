/**
 * Утилита для создания минималистичных эффектов текста
 * Предоставляет базовую функциональность без создания тяжелых фрагментов
 */

/**
 * Применяет минималистичный эффект к тексту
 * Гораздо более легкий, чем пиксельный распад
 * 
 * @param textElement - Элемент, содержащий текст
 * @returns Объект с функциями для управления эффектом
 */
export function applyMinimalTextEffect(textElement: HTMLElement) {
  if (!textElement) return { clean: () => {} };
  
  // Получаем текстовое содержимое
  const text = textElement.textContent || '';
  
  // Создаем расширенные стили для базового эффекта
  const applyStyles = () => {
    if (!textElement) return;
    
    // Добавляем базовые стили для анимации
    textElement.style.position = 'relative';
    textElement.style.display = 'inline-block';
  };
  
  // Функция для очистки эффектов
  const clean = () => {
    if (!textElement) return;
    
    // Восстанавливаем исходное состояние
    textElement.style.position = '';
    textElement.style.display = '';
  };
  
  // Инициализация стилей
  applyStyles();
  
  return {
    clean
  };
}

/**
 * Эта функция сохранена для совместимости, 
 * но не создает тяжелые фрагменты
 */
export function generatePixelFragments(
  textElement: HTMLElement, 
  pixelSize: number = 6,
  density: number = 1.5
): HTMLElement[] {
  // Вместо создания фрагментов просто возвращаем пустой массив
  console.log('Pixel fragments disabled for performance reasons');
  return [];
}

/**
 * Удаляет все пиксельные фрагменты
 * Сохранена для обратной совместимости
 */
export function clearPixelFragments(container: HTMLElement): void {
  if (!container) return;
  
  const fragments = container.querySelectorAll('.pixel-fragment');
  fragments.forEach(fragment => fragment.remove());
}

export default { 
  applyMinimalTextEffect,
  generatePixelFragments, 
  clearPixelFragments 
}; 