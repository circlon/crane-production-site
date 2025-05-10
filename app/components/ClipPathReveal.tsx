"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'circle' | 'diagonal';

interface ClipPathRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const ClipPathReveal: React.FC<ClipPathRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
  once = true,
  threshold = 0.2,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  // Define clip path values based on direction
  const getClipPathValues = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: 'inset(100% 0 0 0)',
          visible: 'inset(0% 0 0% 0)',
        };
      case 'down':
        return {
          hidden: 'inset(0 0 100% 0)',
          visible: 'inset(0% 0 0% 0)',
        };
      case 'left':
        return {
          hidden: 'inset(0 100% 0 0)',
          visible: 'inset(0% 0 0% 0)',
        };
      case 'right':
        return {
          hidden: 'inset(0 0 0 100%)',
          visible: 'inset(0% 0 0% 0)',
        };
      case 'circle':
        return {
          hidden: 'circle(0% at center)',
          visible: 'circle(150% at center)',
        };
      case 'diagonal':
        return {
          hidden: 'polygon(0% 0%, 0% 0%, 0% 0%)',
          visible: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        };
      default:
        return {
          hidden: 'inset(100% 0 0 0)',
          visible: 'inset(0% 0 0% 0)',
        };
    }
  };

  const clipPathValues = getClipPathValues();

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: clipPathValues.hidden }}
        animate={{
          clipPath: isInView ? clipPathValues.visible : clipPathValues.hidden,
        }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1], // Custom ease curve (cubic-bezier)
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ClipPathReveal; 