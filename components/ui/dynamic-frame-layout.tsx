"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { VideoModal } from "./video-modal"
import { CyberText } from "./cyber-text"
import { ANIMATION_TIMINGS, CSS_VARIABLES } from "@/lib/constants/animation-timings"

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
  poster?: string
}

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
  poster?: string
  onVideoClick?: (videoId: number) => void
}

function FrameComponent({
  video,
  width,
  height,
  className = "",
  corner,
  edgeHorizontal,
  edgeVertical,
  mediaSize,
  borderThickness,
  borderSize,
  showFrame,
  isHovered,
  frameId,
  activeFrameId,
  startTime = 0,
  title,
  isDiscovered,
  vkVideoSrc,
  poster,
  onVideoClick,
}: FrameComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  
  // Ref для хранения таймера сброса клика
  const clickResetTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Очистка таймера при размонтировании компонента
  useEffect(() => {
    return () => {
      if (clickResetTimerRef.current) {
        clearTimeout(clickResetTimerRef.current)
      }
    }
  }, [])
  
  // Устанавливаем начальный кадр при загрузке видео
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime]);
  
  // Управляем локальными видео через useEffect
  useEffect(() => {
    if (isHovered) {
      setIsAnimating(true);
      // Воспроизводим только локальные видео (не VK)
      videoRef.current?.play().catch(() => {
        setVideoError(true)
      })
    } else {
      setIsAnimating(false);
      videoRef.current?.pause();
    }
  }, [isHovered]);

  // Обработчик клика на фрейм
  const handleFrameClick = () => {
    // Очищаем предыдущий таймер сброса, если он существует
    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current)
    }
    
    setIsClicked(true); // Запускаем анимацию закрытия
    
    if (vkVideoSrc) {
      // Вызываем внешнюю функцию обработки клика, если она есть
      if (onVideoClick) {
        onVideoClick(frameId);
      } else {
        // Если внешний обработчик не предоставлен, используем встроенное модальное окно
        setIsModalOpen(true);
      }
    }
    
    // Сбрасываем клик, чтобы при следующем наведении можно было снова запустить анимацию
    // Используем константу HIDE_DURATION для синхронизации с анимацией скрытия
    clickResetTimerRef.current = setTimeout(() => {
      setIsClicked(false);
      clickResetTimerRef.current = null;
    }, ANIMATION_TIMINGS.HIDE_DURATION + 50); // Добавляем небольшой запас времени
  };

  // Дефолтный постер для всех видео
  const defaultPoster = '/images/frames/video-poster-default.jpg';

  return (
    <>
      <div
        className={`relative ${className}`}
        style={{
          width,
          height,
          transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
        }}
        data-video-frame="true"
      >
        <div 
          className="relative w-full h-full overflow-hidden"
          onClick={handleFrameClick}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              zIndex: 1,
              transition: "all 0.3s ease-in-out",
              padding: showFrame ? `${borderThickness}px` : "0",
              width: showFrame ? `${borderSize}%` : "100%",
              height: showFrame ? `${borderSize}%` : "100%",
              left: showFrame ? `${(100 - borderSize) / 2}%` : "0",
              top: showFrame ? `${(100 - borderSize) / 2}%` : "0",
            }}
          >
            <div
              className="w-full h-full overflow-hidden relative bg-transparent"
              style={{
                transform: `scale(${mediaSize})`,
                transformOrigin: "center",
                transition: "transform 0.3s ease-in-out",
              }}
            >
              {videoError ? (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-black">
                  <p>Video not available</p>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-black/80"></div>
                  <video
                    className="w-full h-full object-cover relative z-1"
                    src={video}
                    poster={poster || defaultPoster}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    ref={videoRef}
                    onError={() => setVideoError(true)}
                  />
                  
                  {/* Темный оверлей (отдельно от текста) */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 pointer-events-none z-10"
                    style={{
                      opacity: isHovered ? 0 : 0.3,
                      transition: `opacity ${CSS_VARIABLES.HIDE_DURATION_CSS} cubic-bezier(0.16, 1, 0.3, 1)`,
                      backdropFilter: "blur(2px)",
                      mixBlendMode: "multiply", // Allows the noise to show through
                    }}
                  />
                  
                  {/* Отдельный слой для текста с более высоким z-index */}
                  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                    <CyberText
                      isHovered={isHovered}
                      isClicked={isClicked}
                      className="text-white font-display tracking-wider opacity-80"
                      initialState={isDiscovered ? 'hidden' : 'visible'}
                      autoRevealDelay={7000}
                    >
                      <div className="px-6 py-3 relative text-center">
                        <span className="text-2xl md:text-3xl uppercase font-display font-bold tracking-wider">
                          {title ? title : `Frame ${frameId}`}
                        </span>
                        <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-white opacity-60" />
                      </div>
                    </CyberText>
                  </div>
                </>
              )}
            </div>
          </div>

          {showFrame && (
            <div className="absolute inset-0" style={{ zIndex: 2 }}>
              {/* Добавляем прозрачную область для видимости шума между элементами рамки */}
              <div className="absolute inset-16 bg-transparent"></div>
              
              <div
                className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${corner})`,
                  opacity: 1,
                  mixBlendMode: 'screen'
                }}
              />
              <div
                className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${corner})`, 
                  transform: "scaleX(-1)",
                  opacity: 1,
                  mixBlendMode: 'screen'
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${corner})`, 
                  transform: "scaleY(-1)",
                  opacity: 1,
                  mixBlendMode: 'screen'
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${corner})`, 
                  transform: "scale(-1, -1)",
                  opacity: 1,
                  mixBlendMode: 'screen'
                }}
              />

              <div
                className="absolute top-0 left-16 right-16 h-16"
                style={{
                  backgroundImage: `url(${edgeHorizontal})`,
                  backgroundSize: "auto 64px",
                  backgroundRepeat: "repeat-x",
                  opacity: 1,
                  mixBlendMode: 'screen'
                }}
              />
              <div
                className="absolute bottom-0 left-16 right-16 h-16"
                style={{
                  backgroundImage: `url(${edgeHorizontal})`,
                  backgroundSize: "auto 64px",
                  backgroundRepeat: "repeat-x",
                  transform: "rotate(180deg)",
                  opacity: 1,
                  mixBlendMode: 'screen'
                }}
              />
              <div
                className="absolute left-0 top-16 bottom-16 w-16"
                style={{
                  backgroundImage: `url(${edgeVertical})`,
                  backgroundSize: "64px auto",
                  backgroundRepeat: "repeat-y",
                  opacity: 1,
                  mixBlendMode: 'screen'
                }}
              />
              <div
                className="absolute right-0 top-16 bottom-16 w-16"
                style={{
                  backgroundImage: `url(${edgeVertical})`,
                  backgroundSize: "64px auto",
                  backgroundRepeat: "repeat-y",
                  transform: "rotate(180deg)",
                  opacity: 1,
                  mixBlendMode: 'screen'
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Модальное окно */}
      {isModalOpen && vkVideoSrc && (
        <VideoModal 
          videoSrc={vkVideoSrc}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  )
}

interface DiscoveredState {
  [key: number]: boolean;
}

interface DynamicFrameLayoutProps {
  frames: Frame[]
  className?: string
  showFrames?: boolean
  hoverSize?: number
  gapSize?: number
  onVideoClick?: (videoId: number) => void
}

export function DynamicFrameLayout({ 
  frames: initialFrames, 
  className,
  showFrames = false,
  hoverSize = 6,
  gapSize = 4,
  onVideoClick
}: DynamicFrameLayoutProps) {
  const [frames, setFrames] = useState(initialFrames)
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)
  const [activeFrameId, setActiveFrameId] = useState<number | null>(null)
  const [discoveredState, setDiscoveredState] = useState<DiscoveredState>({})

  const getRowSizes = () => {
    if (hovered === null) return "1fr 1fr 1fr"
    const { row } = hovered
    // Уменьшаем эффект расширения с 4fr до 2.2fr для более сдержанного эффекта
    return [0, 1, 2].map((r) => (r === row ? `2.2fr` : `1fr`)).join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) return "1fr 1fr"
    const { col } = hovered
    // Уменьшаем эффект расширения с 4fr до 2.2fr для более сдержанного эффекта
    return [0, 1].map((c) => (c === col ? `2.2fr` : `1fr`)).join(" ")
  }

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom"
    const horizontal = x === 0 ? "left" : "right"
    return `${vertical} ${horizontal}`
  }

  const handleMouseEnter = (row: number, col: number, frameId: number) => {
    setHovered({ row, col });
    setActiveFrameId(frameId);
    setDiscoveredState(prev => ({...prev, [frameId]: true}));
    
    setFrames(frames.map(frame => ({
      ...frame,
      isHovered: frame.id === frameId
    })));
  }
  
  const handleMouseLeave = () => {
    // Add a slight delay before resetting the grid to improve the transition effect
    setTimeout(() => {
      setHovered(null);
      setActiveFrameId(null);
      
      setFrames(frames.map(frame => ({
        ...frame,
        isHovered: false
      })));
    }, 250);
  }

  // Создаем "сетку" с учетом позиций фреймов из данных
  const gridData = frames.map(frame => ({
    row: Math.floor(frame.defaultPos.y / 4),
    col: Math.floor(frame.defaultPos.x / 6), // Changed from 4 to 6 to match new column width
    frame
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`w-full h-full ${className}`}
    >
      <div 
        className="w-full h-full"
        style={{
          display: "grid",
          gridTemplateRows: getRowSizes(),
          gridTemplateColumns: getColSizes(),
          gap: `${gapSize}px`,
          position: "relative",
          // Увеличиваем продолжительность анимации для более плавного эффекта
          transition: "grid-template-rows 0.8s cubic-bezier(0.16, 1, 0.3, 1), grid-template-columns 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Создаем сетку на основе данных */}
        {gridData.map(({ row, col, frame }) => {
          const transformOrigin = getTransformOrigin(frame.defaultPos.x, frame.defaultPos.y);
          const isCurrentFrameHovered = hovered?.row === row && hovered?.col === col;

          return (
            <div 
              key={frame.id}
              style={{
                gridRow: row + 1,
                gridColumn: col + 1,
                transformOrigin,
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isCurrentFrameHovered ? 'scale(1.01)' : 'scale(1)',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: isCurrentFrameHovered ? '0 8px 24px rgba(0, 0, 0, 0.4)' : 'none',
              }}
              onMouseEnter={() => handleMouseEnter(row, col, frame.id)}
            >
              <FrameComponent
                video={frame.video}
                poster={frame.poster}
                width="100%"
                height="100%"
                corner={frame.corner}
                edgeHorizontal={frame.edgeHorizontal}
                edgeVertical={frame.edgeVertical}
                mediaSize={frame.mediaSize}
                borderThickness={frame.borderThickness}
                borderSize={frame.borderSize}
                showFrame={showFrames}
                isHovered={frame.isHovered}
                frameId={frame.id}
                activeFrameId={activeFrameId}
                startTime={frame.startTime}
                title={frame.title}
                isDiscovered={!!discoveredState[frame.id]}
                vkVideoSrc={frame.vkVideoSrc}
                onVideoClick={onVideoClick}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}