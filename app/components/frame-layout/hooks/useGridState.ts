'use client';

import { useState, useCallback } from 'react';
import { Frame } from '../media/types';

interface HoverState {
  id: number;
  row: number;
  col: number;
}

interface GridTemplateProps {
  rows: string;
  cols: string;
}

export function useGridState(frames: Frame[], hoverSize = 6) {
  const [hovered, setHovered] = useState<HoverState | null>(null);
  
  // Рассчитывает размеры сетки на основе состояния наведения
  const getGridTemplateProps = useCallback((): GridTemplateProps => {
    if (!hovered) return { rows: "1fr 1fr 1fr", cols: "1fr 1fr 1fr" };
    
    const { row, col } = hovered;
    const nonHoveredSize = (12 - hoverSize) / 2;
    
    return {
      rows: [0, 1, 2].map(r => 
        r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`).join(" "),
      cols: [0, 1, 2].map(c => 
        c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`).join(" ")
    };
  }, [hovered, hoverSize]);

  // Определяет, является ли фрейм с указанным ID наведенным
  const isHovered = useCallback((id: number) => {
    return hovered?.id === id;
  }, [hovered]);
  
  return {
    hovered,
    setHovered,
    getGridTemplateProps,
    isHovered
  };
} 