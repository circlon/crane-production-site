"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface LiquidSectionProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  id?: string;
}

const LiquidSection: React.FC<LiquidSectionProps> = ({
  children,
  backgroundColor = 'black',
  textColor = 'white',
  className = '',
  id,
}) => {
  return (
    <section 
      id={id}
      className={`relative min-h-screen ${className}`}
      style={{ 
        backgroundColor,
        color: textColor,
      }}
    >
      <div className="h-full w-full relative z-10">
        {children}
      </div>
    </section>
  );
};

export default LiquidSection; 