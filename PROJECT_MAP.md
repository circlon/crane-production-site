# Карта проекта Crane Production Site

## 1. Технологический стек
- **Frontend**: Next.js 14, React 18
- **Стилизация**: Tailwind CSS с кастомными CSS-файлами для анимаций
- **Анимации**: Framer Motion для анимаций интерфейса и переходов
- **Медиа интеграция**: Встроенное воспроизведение видео, интеграция с VK Video API
- **Типизация**: TypeScript

## 2. Архитектура проекта

### 2.1 Структура директорий
- **app/**: Основные страницы и компоненты приложения (Next.js App Router)
  - **components/**: Визуальные компоненты сайта
    - **frame-layout/**: Компоненты для отображения фреймов
    - **Waves.tsx**: Генерация волновых эффектов на основе Perlin Noise
    - **Noise.tsx**: Текстурный шум для создания эффекта зернистости
    - **ScrollExpandMedia.tsx**: Компонент для параллакс-эффекта при скролле
    - **FluidTitle.tsx**: Анимированные заголовки с эффектом "жидкости"
    - **ScrollIndicator.tsx**: Индикатор прокрутки
    - **WaveSplitter.tsx**: Разделитель секций с волновым эффектом
    - **SectionTransition.tsx**: Плавные переходы между секциями
    - **DynamicFrameLayout.tsx**: Сетка видеофреймов с анимацией
    - Другие визуальные компоненты
  - **data/**: Данные для компонентов
    - **frame-data.ts**: Структурированные данные для видеофреймов
  - **styles/**: CSS стили
    - **fluid-animations.css**: Анимации для эффекта "жидкости" и киберпанк-эффектов
    - **wave-transitions.css**: Стили для волновых переходов
    - **transitions.css**: Общие анимации переходов
  - **globals.css**: Глобальные стили приложения
  - **page.tsx**: Основная страница
  - **layout.tsx**: Корневой лейаут приложения
- **components/ui/**: Переиспользуемые UI компоненты
  - **cyber-text.tsx**: Текст с киберпанк-эффектом "шторки"
  - **dynamic-frame-layout.tsx**: Динамическая сетка видеофреймов
  - **video-modal.tsx**: Модальное окно для видео, включая интеграцию с VK
  - **infinite-text-marquee.tsx**: Бегущая строка с бесконечным эффектом
- **lib/**: Утилиты и хуки
  - **hooks/**
    - **useCyberReveal.ts**: Хук для управления эффектом киберпанк-шторки
    - **useVKVideoControl.ts**: Хук для взаимодействия с VK Video API
  - **types/**
    - **vk.d.ts**: Типы для VK Video API
- **public/**: Статические файлы
  - **images/**: Изображения
    - **frames/**: Элементы рамок для видеофреймов
    - **fitness/**: Изображения для секции фитнеса
  - **videos/**: Видеофайлы

### 2.2 Ключевые функциональные компоненты
1. **Главная страница (app/page.tsx)**
   - Основной контейнер всех секций сайта
   - Организует последовательность элементов и создает единый визуальный нарратив

2. **Waves Component (app/components/Waves.tsx)**
   - Генерирует волновой фон на основе алгоритма Perlin Noise
   - Реагирует на движение курсора и скролл
   - Создает динамическую сетку точек, соединенных линиями, которые имитируют волны

3. **Noise Effect (app/components/Noise.tsx)**
   - Создает эффект зернистости как у старой пленки 
   - Генерирует текстуру шума в canvas с настраиваемыми параметрами
   - Регулярно обновляет паттерн для создания эффекта движения

4. **ScrollExpandMedia (app/components/ScrollExpandMedia.tsx)**
   - Создает эффект расширения медиа (видео/изображения) при прокрутке
   - Управляет переходами между секциями
   - Включает систему затемнения предыдущих секций

5. **DynamicFrameLayout (components/ui/dynamic-frame-layout.tsx)**
   - Основной компонент для сетки видеофреймов (третий блок)
   - Управляет анимациями при наведении и воспроизведением видео
   - Интегрируется с VK Video API

## 3. Детальный анализ сетки (DynamicFrameLayout)

### 3.1 Структура и слои компонента
1. **Основной контейнер**: CSS Grid сетка 3×3 с динамическим размером ячеек
2. **Frame Component**: Индивидуальный компонент для каждой ячейки сетки
3. **Видео-слой**: Встроенное воспроизведение видео с контролем по наведению
4. **Оверлей**: Затемнение с текстом, раскрывающимся при взаимодействии
5. **Рамки**: Визуальное оформление фреймов из угловых элементов и рёбер
6. **Модальное окно**: Интеграция с VK Video для полноэкранного просмотра

### 3.2 Типы данных и интерфейсы
```typescript
// Основная структура данных для фрейма
interface Frame {
  id: number
  video: string
  defaultPos: { x: number; y: number; w: number; h: number }
  corner: string
  edgeHorizontal: string
  edgeVertical: string
  mediaSize: number
  borderThickness: number
  borderSize: number
  isHovered: boolean
  startTime?: number
  title?: string
  vkVideoSrc?: string
}

// Пропсы для компонента FrameComponent
interface FrameComponentProps {
  video: string
  width: number | string
  height: number | string
  className?: string
  corner: string
  edgeHorizontal: string
  edgeVertical: string
  mediaSize: number
  borderThickness: number
  borderSize: number
  showFrame: boolean
  isHovered: boolean
  frameId: number
  activeFrameId: number | null
  startTime?: number
  title?: string
  isDiscovered: boolean
  vkVideoSrc?: string
}

// Пропсы для основного компонента DynamicFrameLayout
interface DynamicFrameLayoutProps {
  frames: Frame[]
  className?: string
  showFrames?: boolean
  hoverSize?: number
  gapSize?: number
}
```

### 3.3 Алгоритм работы
1. **Инициализация сетки**:
   - Создание сетки Grid с равными ячейками (4fr 4fr 4fr)
   - Рендеринг фреймов на основе данных из массива frames

2. **Поведение при наведении**:
   - При наведении на ячейку вызывается handleMouseEnter, который устанавливает hovered и activeFrameId
   - getRowSizes() и getColSizes() пересчитывают размеры строк и столбцов сетки:
     - Активная ячейка расширяется до размера hoverSize (по умолчанию 6fr)
     - Остальные ячейки сжимаются для компенсации (12-hoverSize)/2
   - Создается эффект "увеличения" выбранной ячейки за счет CSS Grid

3. **Воспроизведение видео**:
   - При наведении на фрейм запускается воспроизведение видео (useEffect в FrameComponent)
   - Видео инициализируется с начальной позиции startTime
   - При снятии наведения видео останавливается

4. **Анимация CyberText**:
   - Текст в фрейме использует эффект "шторки" через компонент CyberText
   - useCyberReveal управляет состоянием отображения (revealing, visible, hiding, hidden)
   - Добавлены спецэффекты: сканирующая линия, шум, свечение

5. **Интеграция с VK Video**:
   - При клике на фрейм с vkVideoSrc открывается модальное окно
   - VideoModal компонент использует iframe для встраивания видео с VK
   - useVKVideoControl обеспечивает программное управление VK плеером

### 3.4 Анимации и визуальные эффекты
1. **CSS Grid Animation**:
   - Плавное изменение размеров grid-шаблона через transition
   - Трансформация точки расширения через getTransformOrigin()

2. **Эффект затемнения**:
   - Градиент от черного до прозрачного на видео
   - Изменение непрозрачности при наведении через opacity transition

3. **Эффект CyberText**:
   - Анимация clip-path для эффекта "шторки"
   - Сканирующая линия, движущаяся во время анимации
   - Эффект глитча через трансформацию и непрозрачность

4. **Рамка фрейма**:
   - Динамическое построение рамки из угловых элементов и ребер
   - Трансформация углов для создания нужной ориентации
   - Контроль размера и отступов через showFrame, borderThickness, borderSize

### 3.5 Оптимизация производительности
1. **Ленивая загрузка видео**:
   - Видео начинают воспроизводиться только при наведении
   - Установлены атрибуты muted, playsInline для оптимизации мобильного воспроизведения

2. **State management**:
   - Предотвращение лишних ререндеров через useState для исходных данных фреймов
   - Использование useRef для доступа к DOM и хранения предыдущих значений

3. **CSS оптимизации**:
   - Использование will-change для элементов с анимацией
   - Применение transform вместо изменения геометрии (left, top)
   - Оптимизация под мобильные устройства через медиа-запросы

4. **Работа с видео**:
   - Отложенная инициализация currentTime для предотвращения FOUC
   - Обработка ошибок воспроизведения через catch и состояние videoError
   - Ограничение одновременного воспроизведения (только один активный фрейм)

## 4. Система стилей и анимаций

### 4.1 Глобальные CSS переменные
```css
:root {
  --fluid-animation-duration: 0.8s;
  --fluid-animation-ease: cubic-bezier(0.65, 0, 0.35, 1);
  --fluid-scroll-transition-timing: cubic-bezier(0.2, 0.6, 0.3, 1);
  --cyber-reveal-duration: 1s;
  --cyber-hide-duration: 0.6s;
  --cyber-line-color: rgba(0, 255, 240, 0.7);
  --cyber-glitch-intensity: 5px;
  --cyber-text-glow: 0 0 8px rgba(0, 255, 240, 0.8);
  --cyber-text-color: rgba(255, 255, 255, 0.9);
  --cyber-noise-opacity: 0.05;
  --wave-primary: black;
  --wave-secondary: #0f0f0f;
  --wave-height: 120px;
  --wave-animation-duration: 3s;
  --wave-animation-ease: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### 4.2 Анимации и keyframes
1. **Волновые анимации**:
   ```css
   @keyframes waveFlow {
     0% { transform: translateX(0) translateY(0); }
     50% { transform: translateX(-25px) translateY(15px); }
     100% { transform: translateX(0) translateY(0); }
   }
   
   @keyframes waveHeight {
     0% { d: path("M0,100 C250,130 750,70 1920,100 V100 H0 Z"); }
     50% { d: path("M0,100 C250,65 750,135 1920,100 V100 H0 Z"); }
     100% { d: path("M0,100 C250,130 750,70 1920,100 V100 H0 Z"); }
   }
   ```

2. **Киберпанк эффекты**:
   ```css
   @keyframes cyberReveal {
     0% { clip-path: inset(0 100% 0 0); opacity: 0; }
     40% { clip-path: inset(0 60% 0 0); opacity: 0.7; }
     100% { clip-path: inset(0 0 0 0); opacity: 0.9; }
   }
   
   @keyframes cyberHide {
     0% { clip-path: inset(0 0 0 0); transform: translateX(0); opacity: 0.9; }
     40% { clip-path: inset(0 0 0 40%); transform: translateX(var(--cyber-glitch-intensity)); opacity: 0.5; }
     100% { clip-path: inset(0 0 0 100%); transform: translateX(0); opacity: 0; }
   }
   
   @keyframes scanLineReveal {
     0% { left: 0; opacity: 0; }
     50% { opacity: 1; box-shadow: 0 0 12px 3px var(--cyber-line-color); }
     100% { left: 100%; opacity: 0; }
   }
   ```

3. **Плавающие анимации**:
   ```css
   @keyframes fluidWave {
     0% { transform: translateX(0) translateY(0); }
     50% { transform: translateX(-15px) translateY(5px); }
     100% { transform: translateX(0) translateY(0); }
   }
   
   @keyframes fluidFloat {
     0% { transform: translateY(0); }
     50% { transform: translateY(-10px); }
     100% { transform: translateY(0); }
   }
   ```

### 4.3 Интеграция с Tailwind
- Использование clsx/classnames и Tailwind Merge для композиции классов
- Кастомные утилиты в css-файлах для расширения возможностей Tailwind
- Применение Tailwind для базовой стилизации, кастомные CSS для сложных анимаций

## 5. Интеграция с VK Video API

### 5.1 Типизация API
```typescript
// lib/types/vk.d.ts
declare global {
  interface Window {
    VK?: {
      VideoPlayer: (iframe: HTMLIFrameElement) => VKVideoPlayer;
    };
  }
}

export interface VKVideoPlayer {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  seekLive: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unmute: () => void;
  isMuted: () => boolean;
  getState: () => string;
  getQuality: () => string;
  on: (event: string, handler: (state: VKPlayerState) => void) => void;
  off: (event: string, handler: (state: VKPlayerState) => void) => void;
  destroy: () => void;
}

export interface VKPlayerState {
  state: string;
  volume: number;
  muted: boolean;
  time: number;
  duration: number;
}
```

### 5.2 Хук для управления видео
```typescript
// lib/hooks/useVKVideoControl.ts
export function useVKVideoControl(
  iframeRef: React.RefObject<HTMLIFrameElement> | null, 
  isActive: boolean
) {
  const playerRef = useRef<VKVideoPlayer | null>(null);
  const initialized = useRef(false);

  // Инициализация плеера
  useEffect(() => {
    // ...инициализация...
  }, [iframeRef]);

  // Управление воспроизведением
  useEffect(() => {
    // ...логика play/pause...
  }, [isActive]);

  // Очистка ресурсов
  useEffect(() => {
    return () => {
      // ...destroy...
    };
  }, []);

  return playerRef;
}
```

### 5.3 Модальное окно VideoModal
- Полноэкранное модальное окно для видео из VK
- Управление дополнительными параметрами видео (HD, autoplay)
- Обработка закрытия окна и возвращения фокуса

## 6. Оптимизации и улучшения системы анимации

### 6.1 Система анимации заголовков фреймов

Система анимации названий фреймов была оптимизирована и улучшена:

#### 6.1.1 Архитектура
- **Синхронизированные константы** - `lib/constants/animation-timings.ts` содержит единый источник истины для всех временных параметров анимации
- **Решение проблемы утечек памяти** - улучшенная система управления таймерами в `useCyberReveal`
- **Типизация CSS-переменных** - добавлены типы для CSS-in-JS стилей с кастомными CSS-переменными
- **Утилиты генерации CSS** - `lib/utils/generate-css-variables.ts` для синхронизации CSS и JS

#### 6.1.2 Компоненты системы анимации
- **CyberText** - Отображает анимированный текст с эффектом киберпанк-шторки
- **useCyberReveal** - Управляет состояниями анимации и таймерами
- **CSS-анимации** - Определены в `fluid-animations.css` и синхронизированы с JS
- **FrameComponent** - Использует CyberText для отображения названий фреймов

#### 6.1.3 Потоки данных
- Константы → JS-логика → React-компоненты → CSS-переменные → Анимации
- Состояние взаимодействия пользователя → Управление состоянием → Визуальный эффект

#### 6.1.4 Решенные проблемы

##### Инверсия анимации при наведении (09.05.2024)
- **Проблема**: Текст в фреймах не скрывался при наведении мыши на фрейм
- **Причина**: Неправильная логика в хуке `useCyberReveal` - анимация срабатывала только если текст уже находился в состоянии `hidden`
- **Решение**: 
  1. Обновлена логика в `useCyberReveal`: 
     ```js
     // При наведении мыши на элемент - скрываем текст
     if (isHovered && (state === 'visible' || state === 'revealing')) {
       setState('hiding');
     } 
     // При уходе мыши с элемента - показываем текст
     else if (!isHovered && (state === 'hidden' || state === 'hiding')) {
       setState('revealing');
     }
     ```
  2. Добавлены CSS-классы для анимаций:
     ```css
     .cyber-text-reveal { animation: cyberReveal var(--cyber-reveal-duration) forwards; }
     .cyber-text-hide { animation: cyberHide var(--cyber-hide-duration) forwards; }
     ```
- **Результат**: Текст в фреймах корректно скрывается при наведении и появляется при уходе курсора

##### Задержка появления элемента после ухода курсора (09.05.2024)
- **Проблема**: Текст в фреймах появлялся мгновенно после ухода курсора мыши
- **Причина**: В логике хука `useCyberReveal` не было паузы перед сменой состояния на `revealing`
- **Решение**: 
  1. Добавлена новая константа для задержки в `animation-timings.ts`:
     ```js
     // Задержка перед появлением элемента после ухода мыши (в миллисекундах)
     HOVER_OUT_DELAY: 700,
     ```
  2. Улучшена логика в `useCyberReveal` - добавлена задержка с таймером:
     ```js
     // При уходе мыши с элемента - показываем его с задержкой
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
     ```
  3. Добавлено отслеживание изменения состояния наведения для предотвращения лишних перерендеров
- **Результат**: Текст в фреймах появляется с задержкой 0,7 секунды после ухода курсора мыши, что создает более плавный и приятный визуальный эффект

##### Восьмибитная пиксельная анимация текста (09.05.2024)
- **Улучшение**: Анимация появления и исчезновения текста фреймов заменена на стилизованную под восьмибитный/пиксельный стиль
- **Реализация**: 
  1. Обновлены CSS-анимации с добавлением ступенчатых переходов:
     ```css
     /* Восьмибитная пиксельная анимация */
     @keyframes cyberReveal {
       /* Используем 10 шагов анимации вместо 3 */
       0% { clip-path: inset(0 100% 0 0); opacity: 0; text-shadow: none; }
       10% { /* ... */ }
       /* ... */
       100% { /* ... */ }
     }
     ```
  2. Добавлены текстовые эффекты для имитации пиксельности:
     ```css
     .cyber-text-pixelated {
       image-rendering: pixelated;
       font-family: monospace !important;
       letter-spacing: 1px;
       text-transform: uppercase;
       animation-timing-function: steps(10, end) !important;
     }
     ```
  3. Улучшена анимация сканирующей линии с пиксельным паттерном:
     ```css
     .cyber-text-pixelated .cyber-scan-line {
       background: repeating-linear-gradient(
         to right,
         var(--cyber-line-color),
         var(--cyber-line-color) 4px,
         transparent 4px,
         transparent 8px
       ) !important;
     }
     ```
- **Результат**: Эффект более физического, материального появления текста, стилизованного под восьмибитные компьютерные игры и старые интерфейсы

##### Постоянное затемнение названий фреймов (09.05.2024)
- **Улучшение**: Названия фреймов теперь всегда затемнены и размыты (как при наведении), а линия подчеркивания соответствует цвету текста
- **Реализация**: 
  1. Изменена прозрачность оверлея в `dynamic-frame-layout.tsx`:
     ```js
     // Заменено
     opacity: isAnimating ? 0.5 : 1,
     
     // На статическое значение
     opacity: 0.5,
     ```
  2. Изменен цвет линии подчеркивания с голубого на белый (цвет текста):
     ```js
     // Заменено
     <div className="absolute bottom-0 left-0 right-0 h-px bg-cyan-400 opacity-50" />
     
     // На
     <div className="absolute bottom-0 left-0 right-0 h-px bg-white opacity-50" />
     ```
- **Результат**: Все названия фреймов имеют постоянный затемненный фон, что создает более единообразный и аккуратный внешний вид интерфейса

## 7. Генерация эффектов

### 7.1 Perlin Noise для волн
- Алгоритм Perlin Noise в Waves.tsx создает органичные волнообразные движения
- Класс Noise реализует двумерный шум с интерполяцией
- Обновление в реальном времени для создания эффекта движения

### 7.2 Canvas-рендеринг для шума
- Использование Canvas API для генерации шума в Noise.tsx
- Создание патчей случайного шума с управляемой непрозрачностью
- Обновление с настраиваемым интервалом для эффекта динамичности

### 7.3 Scroll-based анимации
- ScrollExpandMedia создает эффект расширения на основе прокрутки
- Использование requestAnimationFrame для плавных анимаций
- Интерполяция значений для плавности переходов

## 8. Особенности и оптимизация

### 8.1 Адаптивность
- Респонсивный дизайн для всех размеров экранов
- Оптимизированная версия сетки для мобильных устройств
- Адаптивные размеры с использованием clamp() и CSS-переменных

### 8.2 Производительность
- Ленивая загрузка и воспроизведение видео
- Оптимизированные анимации с использованием transform и opacity
- Контроль перерисовок компонентов

### 8.3 Доступность и UX
- Respect для prefers-reduced-motion
- Альтернативные варианты для видео (posterSrc)
- Обработка ошибок загрузки медиа-ресурсов 