'use client';

import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { FrameItemProps } from './media/types';
import { Frame } from './Frame';
import { MediaProvider } from './media/MediaProvider';

export function FrameItem({ 
  frame, 
  showFrame, 
  isHovered: parentIsHovered,
  onHover 
}: FrameItemProps) {
  const { id, media, mediaSize, borderThickness, borderSize, position, title } = frame;
  
  // Храним локальное состояние для обработки кликов на мобильных устройствах
  const [isTouched, setIsTouched] = useState(false);
  
  // Унифицированная обработка событий для всех устройств
  const handleMouseEnter = useCallback(() => {
    onHover({ id, row: position.row, col: position.col });
  }, [id, position.row, position.col, onHover]);
  
  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);
  
  // Обработка клика для сенсорных устройств
  const handleClick = useCallback(() => {
    // Инвертируем состояние касания
    const newTouchedState = !isTouched;
    setIsTouched(newTouchedState);
    
    // Если элемент был нажат, он становится "наведенным", иначе сбрасываем состояние
    if (newTouchedState) {
      onHover({ id, row: position.row, col: position.col });
    } else {
      onHover(null);
    }
  }, [id, position.row, position.col, onHover, isTouched]);
  
  return (
    <motion.div
      className="relative"
      style={{
        transformOrigin: getTransformOrigin(position.row, position.col),
        transition: "transform 0.4s ease",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Frame
        showFrame={showFrame}
        borderThickness={borderThickness}
        borderSize={borderSize}
        title={title}
        isHovered={parentIsHovered}
      >
        <div
          className="w-full h-full overflow-hidden"
          style={{
            transform: `scale(${mediaSize})`,
            transformOrigin: "center",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <MediaProvider
            type={media.type}
            src={media.src}
            isHovered={parentIsHovered}
          />
        </div>
      </Frame>
    </motion.div>
  );
}

// Функция для определения, с какой стороны элемент будет увеличиваться
function getTransformOrigin(row: number, col: number): string {
  const vertical = row === 0 ? "top" : row === 1 ? "center" : "bottom";
  const horizontal = col === 0 ? "left" : col === 1 ? "center" : "right";
  return `${horizontal} ${vertical}`;
} 