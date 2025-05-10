"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  color?: string;
  size?: number;
  className?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ 
  color = "white",
  size = 40,
  className = ""
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className="cursor-pointer"
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