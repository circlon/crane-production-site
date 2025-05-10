"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface WaveSplitterProps {
  topColor?: string;
  bottomColor?: string;
  height?: number;
  intensity?: number; // Интенсивность волнообразного эффекта
  waveLayers?: number; // Количество слоев волн
}

const WaveSplitter: React.FC<WaveSplitterProps> = ({
  topColor = 'black',
  bottomColor = '#111',
  height = 180,
  intensity = 1,
  waveLayers = 3,
}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Получение прогресса скролла
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Значение для анимации волны на основе скролла
  const waveProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  // Обновление ширины окна
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Генерация волнистого пути для верхней секции
  const generateWavePath = (index: number, total: number) => {
    if (windowWidth === 0) return '';
    
    // Базовая амплитуда волны
    const baseAmplitude = (height / 2) * intensity;
    // Фазовый сдвиг для каждой волны
    const phaseShift = index / total;
    // Уменьшение амплитуды для каждого последующего слоя
    const amplitudeFactor = 1 - (index / (total * 1.5));
    // Расчет амплитуды с учетом факторов
    const amplitude = baseAmplitude * amplitudeFactor;
    
    const w = windowWidth;
    const h = height;
    const c1x = w * 0.2; // первая контрольная точка x
    const c1y = h / 2 + (amplitude * Math.sin(Math.PI * phaseShift)); // первая контрольная точка y
    const c2x = w * 0.8; // вторая контрольная точка x
    const c2y = h / 2 - (amplitude * Math.sin(Math.PI * phaseShift)); // вторая контрольная точка y
    
    // Создаем путь волны
    return `M0,0 L0,${h/2} C${c1x},${c1y} ${c2x},${c2y} ${w},${h/2} L${w},0 Z`;
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: `${height}px` }}
    >
      {windowWidth > 0 && (
        <svg
          className="absolute w-full h-full"
          preserveAspectRatio="none"
          viewBox={`0 0 ${windowWidth} ${height}`}
        >
          {/* Нижняя часть (фон) */}
          <rect width={windowWidth} height={height} fill={bottomColor} />
          
          {/* Несколько слоев волн для эффекта глубины */}
          {Array.from({ length: waveLayers }).map((_, i) => (
            <motion.path
              key={i}
              d={generateWavePath(i, waveLayers)}
              fill={topColor}
              opacity={1 - (i * 0.15)} // Уменьшающаяся прозрачность
              initial={{ y: -10 }}
              animate={{ 
                y: [-(i*2), 0, -(i*2)],
                transition: { 
                  duration: 4 + i,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }
              }}
              style={{
                filter: i > 0 ? `blur(${i * 1.5}px)` : 'none',
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
};

export default WaveSplitter; 