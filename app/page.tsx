"use client";

import React from 'react';
import { Waves } from './components/Waves';
import { DynamicFrameLayout } from '../components/ui/dynamic-frame-layout';
import ScrollExpandMedia from './components/ScrollExpandMedia';
import FluidTitle from './components/FluidTitle';
import ScrollIndicator from './components/ScrollIndicator';
import { NoiseEffect } from './components/Noise';
import './styles/fluid-animations.css';

const frameData = [
  {
    id: 1,
    video: '/videos/Raf New 1.mp4',
    defaultPos: { x: 0, y: 0, w: 4, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 0,
    title: 'Fitness Cinematic',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1'
  },
  {
    id: 2,
    video: '/videos/video2.mp4',
    defaultPos: { x: 4, y: 0, w: 4, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 5
  },
  {
    id: 3,
    video: '/videos/video3.mp4',
    defaultPos: { x: 8, y: 0, w: 4, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 8
  },
  {
    id: 4,
    video: '/videos/video4.mp4',
    defaultPos: { x: 0, y: 4, w: 4, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 12
  },
  {
    id: 5,
    video: '/videos/video5.mp4',
    defaultPos: { x: 4, y: 4, w: 4, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 15
  },
  {
    id: 6,
    video: '/videos/video6.mp4',
    defaultPos: { x: 8, y: 4, w: 4, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 3
  },
  {
    id: 7,
    video: '/videos/video7.mp4',
    defaultPos: { x: 0, y: 8, w: 4, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 7
  },
  {
    id: 8,
    video: '/videos/video8.mp4',
    defaultPos: { x: 4, y: 8, w: 4, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 10
  },
  {
    id: 9,
    video: '/videos/video9.mp4',
    defaultPos: { x: 8, y: 8, w: 4, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 4
  }
];

export default function Home() {

  return (
    <main className="relative bg-transparent overflow-x-hidden w-screen m-0 p-0">
      {/* Основное содержимое начинается здесь */}      
      {/* Hero section с волнами */}
      <section id="hero-section" className="relative h-screen w-screen overflow-hidden m-0 p-0">
        <Waves lineColor="rgba(255, 255, 255, 0.5)" className="absolute inset-0" />
        <div className="h-screen flex flex-col items-center justify-center text-white relative z-10">
          <div className="max-w-6xl mx-auto text-center px-4">
            <FluidTitle 
              text="CRANE PRODUCTION" 
              color="white"
              className="mb-6 scale-125 transform origin-center"
              delay={0.5}
            />
            <p className="text-xl md:text-2xl mt-4 text-gray-400 opacity-70">
              Frame Moments, Build Brands
            </p>
          </div>
          
          {/* Индикатор скролла */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            <ScrollIndicator color="white" size={48} targetSection="scroll-expand-section" />
          </div>
        </div>
      </section>

      {/* Scroll Expand Media Section */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/videos/Raf New 1.mp4"
        bgImageSrc=""
        title="Fitness Cinematic Experience"
        textBlend={true}
        id="scroll-expand-section"
      >
        <div className="text-white max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">The Vision Behind Fitness Cinematic</h3>
          <p className="mb-6">
            A unique blend of artistic visuals and dynamic movement, captured frame by frame
            to showcase the beauty of fitness in motion.
          </p>
          <p>
            This project highlights the intersection of athleticism and cinematography,
            creating an immersive experience that inspires and motivates.
          </p>
        </div>
      </ScrollExpandMedia>

      {/* Video Frame Grid section */}
      <section className="flex items-center justify-center bg-transparent h-screen">
        <div className="w-full h-full px-4 py-4">
          <DynamicFrameLayout 
            frames={frameData} 
            showFrames={false}
            hoverSize={6}
            gapSize={4}
          />
        </div>
      </section>
    </main>
  );
} 