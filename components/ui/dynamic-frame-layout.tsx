"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { VideoModal } from "./video-modal"
import { CyberText } from "./cyber-text"
import { ANIMATION_TIMINGS } from "@/lib/constants/animation-timings"

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
  isMobile: boolean
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
  isMobile,
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
    if (isHovered && !isMobile) {
      setIsAnimating(true);
      // Воспроизводим только локальные видео (не VK)
      videoRef.current?.play().catch(() => {
        setVideoError(true)
      })
    } else {
      setIsAnimating(false);
      videoRef.current?.pause();
    }
  }, [isHovered, isMobile]);

  // Обработчик клика на фрейм
  const handleFrameClick = useCallback(() => {
    // Очищаем предыдущий таймер сброса, если он существует
    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current)
    }
    
    setIsClicked(true); // Запускаем анимацию закрытия
    
    if (vkVideoSrc) {
      // Открываем модальное окно для VK видео
      setIsModalOpen(true);
    }
    
    // Сбрасываем клик, чтобы при следующем наведении можно было снова запустить анимацию
    // Используем константу HIDE_DURATION для синхронизации с анимацией скрытия
    clickResetTimerRef.current = setTimeout(() => {
      setIsClicked(false);
      clickResetTimerRef.current = null;
    }, ANIMATION_TIMINGS.HIDE_DURATION + 50); // Добавляем небольшой запас времени
  }, [vkVideoSrc]);

  // Генерируем URL для постера, если он не указан
  const posterUrl = poster || video.replace(/\.(mp4|webm|ogg)$/, '.jpg');
  
  // Добавляем обработчик ошибки для изображений
  const [imageError, setImageError] = useState(false);
  
  // Используем fallback изображение, если постер не найден
  const fallbackImage = '/images/frames/video-poster-default.jpg';
  const displayImage = imageError ? fallbackImage : posterUrl;

  return (
    <>
      <div
        className={`relative ${className}`}
        style={{
          width,
          height,
          transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
        }}
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
              className="w-full h-full overflow-hidden relative bg-black"
              style={{
                transform: `scale(${mediaSize})`,
                transformOrigin: "center",
                transition: "transform 0.3s ease-in-out",
              }}
            >
              {videoError ? (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <p>Video not available</p>
                </div>
              ) : (
                <>
                  {/* На мобильных устройствах используем изображение вместо видео */}
                  {isMobile ? (
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${displayImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#000'
                      }}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <video
                      className="w-full h-full object-cover"
                      src={video}
                      poster={displayImage}
                      loop
                      muted
                      playsInline
                      ref={videoRef}
                      onError={() => setVideoError(true)}
                    />
                  )}
                  
                  {/* Темный оверлей с киберпанк текстом */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-black/90 to-black/70 pointer-events-none z-10 flex items-center justify-center"
                    style={{
                      opacity: 0.5,
                      transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    <CyberText
                      isHovered={isHovered}
                      isClicked={isClicked}
                      className="text-white font-mono text-2xl tracking-wider"
                      initialState={isDiscovered ? 'hidden' : 'visible'}
                      autoRevealDelay={7000}
                    >
                      <div className="px-4 py-2 relative text-center">
                        <span>{title ? title : `Frame ${frameId}`}</span>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-white opacity-50" />
                      </div>
                    </CyberText>
                  </div>
                </>
              )}
            </div>
          </div>

          {showFrame && (
            <div className="absolute inset-0" style={{ zIndex: 2 }}>
              <div
                className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
                style={{ backgroundImage: `url(${corner})` }}
              />
              <div
                className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
                style={{ backgroundImage: `url(${corner})`, transform: "scaleX(-1)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
                style={{ backgroundImage: `url(${corner})`, transform: "scaleY(-1)" }}
              />
              <div
                className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
                style={{ backgroundImage: `url(${corner})`, transform: "scale(-1, -1)" }}
              />

              <div
                className="absolute top-0 left-16 right-16 h-16"
                style={{
                  backgroundImage: `url(${edgeHorizontal})`,
                  backgroundSize: "auto 64px",
                  backgroundRepeat: "repeat-x",
                }}
              />
              <div
                className="absolute bottom-0 left-16 right-16 h-16"
                style={{
                  backgroundImage: `url(${edgeHorizontal})`,
                  backgroundSize: "auto 64px",
                  backgroundRepeat: "repeat-x",
                  transform: "rotate(180deg)",
                }}
              />
              <div
                className="absolute left-0 top-16 bottom-16 w-16"
                style={{
                  backgroundImage: `url(${edgeVertical})`,
                  backgroundSize: "64px auto",
                  backgroundRepeat: "repeat-y",
                }}
              />
              <div
                className="absolute right-0 top-16 bottom-16 w-16"
                style={{
                  backgroundImage: `url(${edgeVertical})`,
                  backgroundSize: "64px auto",
                  backgroundRepeat: "repeat-y",
                  transform: "rotate(180deg)",
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
}

export function DynamicFrameLayout({ 
  frames: initialFrames, 
  className,
  showFrames = false,
  hoverSize = 6,
  gapSize = 4
}: DynamicFrameLayoutProps) {
  const [frames, setFrames] = useState(initialFrames)
  const [hoveredFrame, setHoveredFrame] = useState<number | null>(null)
  const [activeFrame, setActiveFrame] = useState<number | null>(null)
  const [discoveredState, setDiscoveredState] = useState<DiscoveredState>({})
  // Определяем, является ли устройство мобильным
  const [isMobile, setIsMobile] = useState(false)
  
  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Размеры строк - адаптивные для мобильных устройств
  const getRowSizes = () => {
    if (isMobile) {
      // Более компактное отображение на мобильных
      return ["1fr", "1fr", "1fr"];
    }
    return ["1fr", "1fr", "1fr"];
  };

  // Размеры колонок - адаптивные для мобильных устройств
  const getColSizes = () => {
    if (isMobile) {
      // Одна колонка на очень маленьких экранах
      if (window.innerWidth < 480) {
        return ["1fr"];
      }
      // Две колонки на средних мобильных
      return ["1fr", "1fr"];
    }
    return ["1fr", "1fr", "1fr"];
  };

  const getTransformOrigin = (x: number, y: number) => {
    return `${x * 50}% ${y * 50}%`;
  };

  const handleMouseEnter = (row: number, col: number, frameId: number) => {
    setHoveredFrame(frameId);
    setDiscoveredState(prev => ({...prev, [frameId]: true}));
    
    setFrames(frames.map(frame => ({
      ...frame,
      isHovered: frame.id === frameId
    })));
  };

  const handleMouseLeave = () => {
    setHoveredFrame(null);
    
    setFrames(frames.map(frame => ({
      ...frame,
      isHovered: false
    })));
  };

  // Создаем "сетку" с учетом позиций фреймов из данных
  const gridData = frames.map(frame => ({
    row: Math.floor(frame.defaultPos.y / 4),
    col: Math.floor(frame.defaultPos.x / 4),
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
        className="w-full h-full grid"
        style={{ 
          display: "grid",
          gridTemplateRows: getRowSizes().join(" "),
          gridTemplateColumns: getColSizes().join(" "),
          gap: `${gapSize}px`,
          position: "relative",
          // Добавляем адаптивные стили для мобильных
          width: "100%",
          height: isMobile ? "auto" : "100%", // На мобильных - автовысота
          minHeight: isMobile ? "100vh" : "auto" // Минимальная высота на мобильных
        }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Создаем сетку на основе данных */}
        {gridData.map(({ row, col, frame }) => {
          // Определяем, куда входит фрейм в зависимости от количества колонок
          const colSize = getColSizes().length;
          const adjustedCol = colSize === 1 ? 0 : (colSize === 2 ? col % 2 : col);
          
          return (
            <div 
              key={frame.id}
              style={{ 
                gridRow: isMobile 
                  ? (colSize === 1 ? frame.id : Math.floor((frame.id - 1) / colSize) + 1) 
                  : row + 1,
                gridColumn: isMobile 
                  ? (colSize === 1 ? 1 : (frame.id % colSize === 0 ? colSize : frame.id % colSize))
                  : col + 1,
                transformOrigin: getTransformOrigin(col, row),
                // Адаптивный размер ячейки
                width: "100%",
                height: isMobile ? "33vh" : "100%",
                minHeight: isMobile ? "250px" : "auto"
              }}
              onMouseEnter={() => !isMobile && handleMouseEnter(row, col, frame.id)}
              onClick={() => isMobile && handleMouseEnter(row, col, frame.id)}
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
                activeFrameId={activeFrame}
                startTime={frame.startTime}
                title={frame.title}
                isDiscovered={!!discoveredState[frame.id]}
                vkVideoSrc={frame.vkVideoSrc}
                isMobile={isMobile}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}