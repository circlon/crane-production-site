"use client";

import React from 'react';

interface SimpleTitleTextProps {
  text: string;
  size?: 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  color?: string;
  className?: string;
}

const SimpleTitleText: React.FC<SimpleTitleTextProps> = ({
  text,
  size = '5xl',
  color = 'white',
  className = '',
}) => {
  const sizeClasses = {
    'xl': 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl',
    '5xl': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
  };

  return (
    <h1 
      className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}
      style={{ color }}
    >
      {text}
    </h1>
  );
};

export default SimpleTitleText; 