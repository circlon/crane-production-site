"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Frame {
  id: number
  video: string
  isIframe?: boolean
  defaultPos: { x: number; y: number; w: number; h: number }
  corner: string
  edgeHorizontal: string
  edgeVertical: string
  mediaSize: number
  borderThickness: number
  borderSize: number
  isHovered: boolean
}

interface FrameComponentProps {
  video: string
  isIframe?: boolean
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
}

function FrameComponent({
  video,
  isIframe = false,
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
}: FrameComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!isIframe) {
      if (isHovered) {
        videoRef.current?.play().catch(err => console.log('Video autoplay prevented:', err))
      } else {
        videoRef.current?.pause()
      }
    }
  }, [isHovered, isIframe])

  // Placeholder color for video
  const placeholderColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 30%)`;

  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        height,
        transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
      }}
    >
      <div className="relative w-full h-full overflow-hidden">
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
            className="w-full h-full overflow-hidden"
            style={{
              transform: `scale(${mediaSize})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {isIframe ? (
              // Iframe для видео из ВКонтакте
              <div className="w-full h-full">
                {isHovered && (
                  <iframe 
                    ref={iframeRef}
                    src={video}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                    frameBorder="0"
                    allowFullScreen
                  />
                )}
                {!isHovered && (
                  <div 
                    className="w-full h-full flex items-center justify-center bg-blue-900"
                  >
                    <div className="text-white text-center p-4">
                      <p className="text-xl font-semibold">Видео ВКонтакте</p>
                      <p className="text-sm opacity-70">Наведите для просмотра</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Placeholder для обычного видео
              <div 
                className="w-full h-full object-cover flex items-center justify-center"
                style={{ backgroundColor: placeholderColor }}
              >
                <div className="text-white text-center p-4">
                  <p className="text-xl font-semibold">Video {Math.floor(Math.random() * 100) + 1}</p>
                  <p className="text-sm opacity-70">Hover to play (placeholder)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {showFrame && (
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            {/* Corners */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-white/20 border-t-2 border-l-2 border-white/40" />
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 border-t-2 border-r-2 border-white/40" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 border-b-2 border-l-2 border-white/40" />
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/20 border-b-2 border-r-2 border-white/40" />

            {/* Edges */}
            <div className="absolute top-0 left-16 right-16 h-4 bg-white/20 border-t-2 border-white/40" />
            <div className="absolute bottom-0 left-16 right-16 h-4 bg-white/20 border-b-2 border-white/40" />
            <div className="absolute left-0 top-16 bottom-16 w-4 bg-white/20 border-l-2 border-white/40" />
            <div className="absolute right-0 top-16 bottom-16 w-4 bg-white/20 border-r-2 border-white/40" />
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

        return (
          <motion.div
            key={frame.id}
            className="relative"
            style={{
              transformOrigin,
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={() => setHovered({ row, col })}
            onMouseLeave={() => setHovered(null)}
          >
            <FrameComponent
              video={frame.video}
              isIframe={frame.isIframe}
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
              isHovered={hovered?.row === row && hovered?.col === col}
            />
          </motion.div>
        )
      })}
    </div>
  )
} 