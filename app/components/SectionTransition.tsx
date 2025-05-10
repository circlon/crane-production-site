"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import '../styles/transitions.css';

interface SectionTransitionProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  clipPath?: boolean;
  id?: string;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  direction = 'up',
  threshold = 0.2,
  delay = 0,
  className = '',
  style = {},
  clipPath = true,
  id,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: threshold });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Set initial and animated clip paths based on direction
  const getClipPath = () => {
    switch (direction) {
      case 'up':
        return {
          initial: 'inset(100% 0 0 0)',
          animate: 'inset(0% 0 0 0)',
        };
      case 'down':
        return {
          initial: 'inset(0 0 100% 0)',
          animate: 'inset(0 0 0% 0)',
        };
      case 'left':
        return {
          initial: 'inset(0 100% 0 0)',
          animate: 'inset(0 0% 0 0)',
        };
      case 'right':
        return {
          initial: 'inset(0 0 0 100%)',
          animate: 'inset(0 0 0 0%)',
        };
      default:
        return {
          initial: 'inset(100% 0 0 0)',
          animate: 'inset(0% 0 0 0)',
        };
    }
  };
  
  // Set initial and animated transform values based on direction
  const getTransform = () => {
    switch (direction) {
      case 'up':
        return {
          initial: 'translateY(50px)',
          animate: 'translateY(0px)',
        };
      case 'down':
        return {
          initial: 'translateY(-50px)',
          animate: 'translateY(0px)',
        };
      case 'left':
        return {
          initial: 'translateX(50px)',
          animate: 'translateX(0px)',
        };
      case 'right':
        return {
          initial: 'translateX(-50px)',
          animate: 'translateX(0px)',
        };
      default:
        return {
          initial: 'translateY(50px)',
          animate: 'translateY(0px)',
        };
    }
  };
  
  const clipPathValues = getClipPath();
  const transformValues = getTransform();
  
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    } else if (!isInView && hasAnimated) {
      // Reset animation when element is out of view
      setTimeout(() => {
        setHasAnimated(false);
      }, 500);
    }
  }, [isInView, hasAnimated]);
  
  return (
    <div id={id} className={`overflow-hidden ${className}`} style={style} ref={sectionRef}>
      <motion.div
        initial={{
          opacity: 0,
          ...(clipPath ? { clipPath: clipPathValues.initial } : {}),
          transform: transformValues.initial,
        }}
        animate={{
          opacity: isInView ? 1 : 0,
          ...(clipPath ? { clipPath: isInView ? clipPathValues.animate : clipPathValues.initial } : {}),
          transform: isInView ? transformValues.animate : transformValues.initial,
        }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SectionTransition; 