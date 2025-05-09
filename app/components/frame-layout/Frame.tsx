'use client';

import { FrameProps } from './media/types';

export function Frame({ children, showFrame, borderThickness, borderSize }: FrameProps) {
  return (
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
        {children}
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
  );
} 