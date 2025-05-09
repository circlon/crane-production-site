'use client';

import { memo } from 'react';
import { DynamicFrameLayoutProps } from './media/types';
import { useGridState } from './hooks/useGridState';
import { FrameItem } from './FrameItem';

// Мемоизируем компонент для оптимизации производительности
export const DynamicFrameLayout = memo(function DynamicFrameLayout({ 
  frames, 
  showFrames = false,
  hoverSize = 6,
  gapSize = 4,
  className = ''
}: DynamicFrameLayoutProps) {
  // Используем кастомный хук для управления состоянием сетки
  const { setHovered, getGridTemplateProps, isHovered } = useGridState(frames, hoverSize);
  const { rows, cols } = getGridTemplateProps();
  
  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        display: "grid",
        gridTemplateRows: rows,
        gridTemplateColumns: cols,
        gap: `${gapSize}px`,
        transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
      }}
    >
      {frames.map((frame) => (
        <FrameItem
          key={frame.id}
          frame={frame}
          showFrame={showFrames}
          isHovered={isHovered(frame.id)}
          onHover={setHovered}
        />
      ))}
    </div>
  );
}); 