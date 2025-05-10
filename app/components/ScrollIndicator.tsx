"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  color?: string;
  size?: number;
  className?: string;
  targetSection?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ 
  color = "white",
  size = 40,
  className = "",
  targetSection = ""
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Определяем мобильную версию
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

  const handleClick = () => {
    // Если указан ID секции, скроллим к ней
    if (targetSection) {
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Иначе просто скроллим вниз на высоту экрана
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  // Увеличенный размер области нажатия для мобильных устройств
  const touchAreaSize = isMobile ? 64 : size;

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className="cursor-pointer relative"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        }}
      >
        {/* Невидимая область нажатия */}
        <div 
          className="absolute"
          style={{
            width: `${touchAreaSize}px`,
            height: `${touchAreaSize}px`,
            top: `${-(touchAreaSize - size) / 2}px`,
            left: `${-(touchAreaSize - size) / 2}px`,
            zIndex: 10,
          }}
          onClick={handleClick}
        />
        
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path 
            d="M7 10L12 15L17 10" 
            stroke={color} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default ScrollIndicator; 