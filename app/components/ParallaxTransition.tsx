"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxTransitionProps {
  children: React.ReactNode;
  bgColor?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

const ParallaxTransition: React.FC<ParallaxTransitionProps> = ({
  children,
  bgColor = 'black',
  speed = 0.5,
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? ['0%', `${-speed * 100}%`] : ['0%', `${speed * 100}%`]
  );

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ backgroundColor: bgColor }}>
      <motion.div
        style={{ y }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxTransition; 