'use client';

import { DynamicFrameLayout } from './DynamicFrameLayout';
import { useRef, useEffect, useState } from 'react';

// Данные для демонстрации, в реальном приложении должны быть загружены из API
const demoFrames = Array.from({ length: 9 }, (_, i) => {
  // Для центрального слота (индекс 4) используем видео из ВКонтакте
  if (i === 4) {
    return {
      id: i + 1,
      video: "https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239045&hd=4&autoplay=1",
      isIframe: true,
      defaultPos: { 
        x: (i % 3) * 4, 
        y: Math.floor(i / 3) * 4, 
        w: 4, 
        h: 4 
      },
      corner: "/images/frames/corner.png",
      edgeHorizontal: "/images/frames/edge-horizontal.png",
      edgeVertical: "/images/frames/edge-vertical.png",
      mediaSize: 1,
      borderThickness: 10,
      borderSize: 95,
      isHovered: false
    };
  }
  
  // Для остальных слотов используем обычные видео
  return {
    id: i + 1,
    video: `/videos/video${i + 1}.mp4`,
    isIframe: false,
    defaultPos: { 
      x: (i % 3) * 4, 
      y: Math.floor(i / 3) * 4, 
      w: 4, 
      h: 4 
    },
    corner: "/images/frames/corner.png",
    edgeHorizontal: "/images/frames/edge-horizontal.png",
    edgeVertical: "/images/frames/edge-vertical.png",
    mediaSize: 1,
    borderThickness: 10,
    borderSize: 95,
    isHovered: false
  };
});

interface VideoFrameSectionProps {
  className?: string;
}

export default function VideoFrameSection({ className = '' }: VideoFrameSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showFrames, setShowFrames] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowFrames(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className={`min-h-screen py-20 bg-black text-white ${className}`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Our Work
        </h2>
        
        <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-16">
          Hover over each frame to see our latest projects. We craft cinematic experiences 
          that capture imagination and emotion.
        </p>
        
        <div className="w-full h-[90vh] max-h-[800px]">
          {isVisible && (
            <DynamicFrameLayout 
              frames={demoFrames} 
              showFrames={showFrames}
              hoverSize={7}
              gapSize={6}
            />
          )}
        </div>
      </div>
    </section>
  );
} 