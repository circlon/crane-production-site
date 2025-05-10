"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FluidTitleProps {
  text: string;
  size?: 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  color?: string;
  className?: string;
  delay?: number;
  duration?: number;
}

const FluidTitle: React.FC<FluidTitleProps> = ({
  text,
  size = '5xl',
  color = 'white',
  className = '',
  delay = 0,
  duration = 0.5,
}) => {
  const sizeClasses = {
    'xl': 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl',
    '5xl': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.h1
      className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}
      style={{ color }}
      initial="hidden"
      animate="visible"
      variants={titleVariants}
    >
      {text}
    </motion.h1>
  );
};

export default FluidTitle; 