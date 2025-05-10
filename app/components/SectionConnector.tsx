"use client";

import React from 'react';

interface SectionConnectorProps {
  color?: string;
  height?: string;
  width?: string;
  orientation?: 'vertical' | 'horizontal';
}

const SectionConnector: React.FC<SectionConnectorProps> = ({
  color = 'rgba(255, 255, 255, 0.2)',
  height = '120px',
  width = '2px',
  orientation = 'vertical'
}) => {
  const style = orientation === 'vertical' 
    ? { height, width, backgroundColor: color } 
    : { height: width, width: height, backgroundColor: color };

  return (
    <div className="flex justify-center my-8">
      <div style={style} />
    </div>
  );
};

export default SectionConnector; 