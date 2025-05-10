"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FluidSectionProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  id?: string;
  fullHeight?: boolean;
  initial?: any;
  animate?: any;
  transition?: any;
}

const FluidSection: React.FC<FluidSectionProps> = ({
  children,
  backgroundColor = 'black',
  textColor = 'white',
  className = '',
  id,
  fullHeight = true,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 0.8, ease: "easeOut" }
}) => {
  return (
    <motion.section 
      id={id}
      className={`relative ${fullHeight ? 'min-h-screen' : ''} ${className}`}
      style={{ 
        backgroundColor,
        color: textColor,
      }}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      <div className="h-full w-full relative z-10">
        {children}
      </div>
    </motion.section>
  );
};

export default FluidSection; 