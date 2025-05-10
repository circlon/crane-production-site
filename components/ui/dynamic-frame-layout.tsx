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
                  <video
                    className="w-full h-full object-cover"
                    src={video}
                    loop
                    muted
                    playsInline
                    ref={videoRef}
                    onError={() => setVideoError(true)}
                  />
                  
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
                  transform: "scaleX(-1)",
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Модальное окно для VK видео */}
      {vkVideoSrc && (
        <VideoModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          videoSrc={vkVideoSrc} 
        />
      )}
    </>
  )
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
  const [frames] = useState<Frame[]>(initialFrames)
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)
  const [activeFrameId, setActiveFrameId] = useState<number | null>(null)
  const [discoveredFrames, setDiscoveredFrames] = useState<number[]>([])

  const getRowSizes = () => {
    if (hovered === null) return "4fr 4fr 4fr"
    const { row } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) return "4fr 4fr 4fr"
    const { col } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom"
    const horizontal = x === 0 ? "left" : x === 4 ? "center" : "right"
    return `${vertical} ${horizontal}`
  }

  const handleMouseEnter = (row: number, col: number, frameId: number) => {
    setHovered({ row, col });
    setActiveFrameId(frameId);
    
    // Отмечаем фрейм как открытый, если это первое наведение
    if (!discoveredFrames.includes(frameId)) {
      setDiscoveredFrames((prev) => [...prev, frameId]);
    }
  }

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        display: "grid",
        gridTemplateRows: getRowSizes(),
        gridTemplateColumns: getColSizes(),
        gap: `${gapSize}px`,
        transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
      }}
    >
      {frames.map((frame) => {
        const row = Math.floor(frame.defaultPos.y / 4)
        const col = Math.floor(frame.defaultPos.x / 4)
        const transformOrigin = getTransformOrigin(frame.defaultPos.x, frame.defaultPos.y)
        const isCurrentFrameHovered = hovered?.row === row && hovered?.col === col;
        const isDiscovered = discoveredFrames.includes(frame.id);

        return (
          <motion.div
            key={frame.id}
            className="relative"
            style={{
              transformOrigin,
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={() => handleMouseEnter(row, col, frame.id)}
            onMouseLeave={() => {
              setHovered(null);
              setActiveFrameId(null);
            }}
          >
            <FrameComponent
              video={frame.video}
              width="100%"
              height="100%"
              className="absolute inset-0"
              corner={frame.corner}
              edgeHorizontal={frame.edgeHorizontal}
              edgeVertical={frame.edgeVertical}
              mediaSize={frame.mediaSize}
              borderThickness={frame.borderThickness}
              borderSize={frame.borderSize}
              showFrame={showFrames}
              isHovered={isCurrentFrameHovered}
              frameId={frame.id}
              activeFrameId={activeFrameId}
              startTime={frame.startTime}
              title={frame.title}
              isDiscovered={isDiscovered}
              vkVideoSrc={frame.vkVideoSrc}
            />
          </motion.div>
        )
      })}
    </div>
  )
}