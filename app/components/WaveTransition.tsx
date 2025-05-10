"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WaveTransitionProps {
  color?: string;
  backgroundColor?: string;
  height?: number;
  position?: 'top' | 'bottom';
  reversed?: boolean;
}

const WaveTransition: React.FC<WaveTransitionProps> = ({
  color = '#000',
  backgroundColor = 'transparent',
  height = 120,
  position = 'bottom',
  reversed = false,
}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Update window width on mount and resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    // Set initial width
    handleResize();
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate path for the wave
  const generateWavePath = () => {
    if (windowWidth === 0) return '';
    
    const amplitude = height * 0.6; // Height of the wave
    const period = windowWidth / 2; // How many waves fit in the width
    
    let path = '';
    
    if (position === 'bottom') {
      // Start at bottom-left
      path = `M0,${height} `;
      
      // Create the wave pattern
      path += `C${windowWidth * 0.25},${height - amplitude} ${windowWidth * 0.75},${height + amplitude} ${windowWidth},${height} `;
      
      // Complete the shape
      path += `V${height} H0 Z`;
    } else {
      // Start at top-left
      path = `M0,0 `;
      
      // Create the wave pattern
      path += `C${windowWidth * 0.25},${amplitude} ${windowWidth * 0.75},${-amplitude} ${windowWidth},0 `;
      
      // Complete the shape
      path += `V0 H0 Z`;
    }
    
    return path;
  };
  
  const wavePath = generateWavePath();
  
  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{ 
        height: `${height}px`,
        backgroundColor
      }}
    >
      {windowWidth > 0 && (
        <svg
          className="absolute w-full h-full"
          preserveAspectRatio="none"
          viewBox={`0 0 ${windowWidth} ${height}`}
          style={{
            transform: reversed ? 'scaleX(-1)' : 'none'
          }}
        >
          <motion.path
            d={wavePath}
            fill={color}
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              transition: { duration: 1.5, ease: "easeInOut" }
            }}
          />
          <motion.path
            d={wavePath}
            fill={color}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              y: [0, -5, 0],
              transition: { 
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror"
              }
            }}
          />
        </svg>
      )}
    </div>
  );
};

export default WaveTransition; 