"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CyberText } from '../../components/ui/cyber-text';
import { DynamicFrameLayout } from '../../components/ui/dynamic-frame-layout';

interface AnimatedDirectionsSectionProps {
  frameData: any[];
  onVideoClick: (videoId: number) => void;
}

const AnimatedDirectionsSection: React.FC<AnimatedDirectionsSectionProps> = ({
  frameData,
  onVideoClick
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { 
    amount: 0.2,
    once: false 
  });
  
  const [backgroundAnimated, setBackgroundAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !backgroundAnimated) {
      setBackgroundAnimated(true);
    }
  }, [isInView, backgroundAnimated]);

  // Container animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.3
      }
    }
  };

  // Background gradient animation variants
  const backgroundVariants = {
    hidden: {
      opacity: 0,
      scale: 1.1,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  // Grid container animation variants
  const gridVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      id="video-grid-section" 
      className="flex flex-col items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm min-h-screen py-16 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Animated Background Layers */}
      <motion.div 
        className="absolute inset-0 z-0"
        variants={backgroundVariants}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
        
        {/* Additional animated layers */}
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-transparent to-transparent"
          animate={backgroundAnimated ? {
            scale: [1, 1.2, 1],
            opacity: [0, 0.3, 0.1]
          } : {}}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Scanlines effect */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`
          }}
          animate={backgroundAnimated ? {
            backgroundPositionY: ["0px", "8px"]
          } : {}}
          transition={{
            duration: 0.5,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </motion.div>

      {/* Animated Title */}
      <motion.div
        className="relative z-10"
        variants={{
          hidden: { opacity: 0, y: -30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.8,
              ease: "easeOut"
            }
          }
        }}
      >
        <CyberText
          cinematicMode={true}
          intersectionReveal={true} // Включаем intersection observer для автоматической анимации
          cinematicDelay={300}
          className="text-3xl md:text-5xl font-bold text-white mb-12 text-center uppercase font-display tracking-wider"
          scanLineColor="rgba(255, 255, 255, 0.9)"
          pixelated={false}
        >
          <h2>Наши направления</h2>
        </CyberText>
      </motion.div>

      {/* Animated Grid Container */}
      <motion.div 
        className="w-full max-w-[94%] lg:max-w-[90%] mx-auto h-[85vh] px-4 relative z-10 video-grid-container"
        variants={gridVariants}
      >
        <AnimatedFrameLayout
          frames={frameData}
          showFrames={false}
          hoverSize={6}
          gapSize={16}
          onVideoClick={onVideoClick}
          isVisible={isInView}
        />
      </motion.div>

      {/* Floating particles effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-5"
        initial={{ opacity: 0 }}
        animate={backgroundAnimated ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2, delay: 1 }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};

// Enhanced DynamicFrameLayout wrapper with stagger animations
const AnimatedFrameLayout: React.FC<{
  frames: any[];
  showFrames: boolean;
  hoverSize: number;
  gapSize: number;
  onVideoClick: (videoId: number) => void;
  isVisible: boolean;
}> = ({ frames, showFrames, hoverSize, gapSize, onVideoClick, isVisible }) => {
  
  return (
    <motion.div
      className="w-full h-full"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
          }
        }
      }}
    >
      <DynamicFrameLayout 
        frames={frames}
        showFrames={showFrames}
        hoverSize={hoverSize}
        gapSize={gapSize}
        onVideoClick={onVideoClick}
      />
    </motion.div>
  );
};

export default AnimatedDirectionsSection; 