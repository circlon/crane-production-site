'use client';

import { motion } from 'framer-motion';
import { FrameItemProps } from './media/types';
import { Frame } from './Frame';
import { MediaProvider } from './media/MediaProvider';

export function FrameItem({ 
  frame, 
  showFrame, 
  isHovered,
  onHover 
}: FrameItemProps) {
  const { id, media, mediaSize, borderThickness, borderSize, position } = frame;
  
  return (
    <motion.div
      className="relative"
      style={{
        // Это свойство определяет, с какой стороны элемент будет увеличиваться при наведении
        transformOrigin: getTransformOrigin(position.row, position.col),
        transition: "transform 0.4s ease",
      }}
      onMouseEnter={() => onHover({ id, row: position.row, col: position.col })}
      onMouseLeave={() => onHover(null)}
    >
      <div className="absolute inset-0">
        <Frame
          showFrame={showFrame}
          borderThickness={borderThickness}
          borderSize={borderSize}
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
              isHovered={isHovered}
            />
          </div>
        </Frame>
      </div>
    </motion.div>
  );
}

// Функция для определения, с какой стороны элемент будет увеличиваться
function getTransformOrigin(row: number, col: number): string {
  const vertical = row === 0 ? "top" : row === 1 ? "center" : "bottom";
  const horizontal = col === 0 ? "left" : col === 1 ? "center" : "right";
  return `${horizontal} ${vertical}`;
} 