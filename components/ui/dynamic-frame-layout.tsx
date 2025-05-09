"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

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
  const [showVkVideo, setShowVkVideo] = useState(false)
  const [vkIframeVisible, setVkIframeVisible] = useState(false)
  
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
      if (!showVkVideo) {
        videoRef.current?.play().catch(() => {
          setVideoError(true)
        })
      }
      // Если есть VK видео и оно уже было запущено, показываем его
      if (vkVideoSrc && showVkVideo) {
        setVkIframeVisible(true);
      }
    } else {
      setIsAnimating(false);
      videoRef.current?.pause();
      
      // Скрываем iframe VK видео, но не сбрасываем состояние showVkVideo
      // Это позволит сохранить позицию воспроизведения
      if (vkVideoSrc && showVkVideo) {
        setVkIframeVisible(false);
      }
    }
  }, [isHovered, showVkVideo, vkVideoSrc]);

  const handleFrameClick = () => {
    if (vkVideoSrc) {
      setShowVkVideo(true);
      setVkIframeVisible(true);
    }
  }

  return (
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
                {showVkVideo && vkVideoSrc ? (
                  <div 
                    className="absolute inset-0 z-20"
                    style={{ opacity: vkIframeVisible ? 1 : 0, pointerEvents: vkIframeVisible ? 'auto' : 'none', transition: 'opacity 0.3s ease-in-out' }}
                  >
                    <iframe
                      src={vkVideoSrc}
                      width="100%"
                      height="100%"
                      className="w-full h-full"
                      allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                ) : null}
                <video
                  className="w-full h-full object-cover"
                  src={video}
                  loop
                  muted
                  playsInline
                  ref={videoRef}
                  onError={() => setVideoError(true)}
                  style={{ opacity: showVkVideo && vkIframeVisible ? 0 : 1 }}
                />
                {/* Темный оверлей с анимацией - показываем только когда не воспроизводится VK-видео */}
                {!isDiscovered && (!showVkVideo || !vkIframeVisible) && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-black/90 to-black/70 pointer-events-none z-10 flex items-center justify-center"
                    style={{
                      opacity: isAnimating ? 0 : 1,
                      transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    <div 
                      className="text-white font-light text-2xl tracking-wider relative overflow-hidden"
                      style={{
                        opacity: isAnimating ? 0 : 1,
                        transform: `scale(${isAnimating ? 1.5 : 1})`,
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                        fontFamily: "monospace",
                        textShadow: "0 0 10px rgba(255,255,255,0.5)"
                      }}
                    >
                      <span className="relative inline-block">
                        {title ? title : `Frame ${frameId}`}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white" 
                          style={{
                            transform: isAnimating ? "translateX(100%)" : "translateX(0)",
                            transition: "transform 0.5s ease-in-out"
                          }}
                        />
                      </span>
                    </div>
                  </div>
                )}
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