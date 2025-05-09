import React from 'react';
import { Waves } from './components/Waves';
import { DynamicFrameLayout } from '../components/ui/dynamic-frame-layout';
import ScrollExpandMedia from './components/ScrollExpandMedia';
import { InfiniteTextMarquee } from '@/components/ui/infinite-text-marquee';

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
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1'
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
    <main className="relative bg-black">
      {/* Hero section with waves background */}
      <section className="relative h-screen overflow-hidden">
        <Waves lineColor="rgba(255, 255, 255, 0.5)" />
        <div className="h-screen flex flex-col items-center justify-center text-white relative z-10">
          <div className="max-w-6xl mx-auto text-center px-4">
            <div className="-mt-8">
              <InfiniteTextMarquee
                text="CRANE PRODUCTION"
                link="#"
                speed={60}
                showTooltip={false}
                fontSize="9rem"
                textColor="white"
                hoverColor="rgba(255, 255, 255, 0.8)"
              />
            </div>
            <p className="text-xl md:text-2xl mt-12 mb-8">
              Capturing moments that matter
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium text-lg hover:bg-opacity-90 transition-all">
              Explore Our Work
            </button>
          </div>
        </div>
      </section>

      {/* Scroll Expand Media Section */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/videos/Raf New 1.mp4"
        bgImageSrc=""
        title="Fitness Cinematic Experience"
        date="2024"
        textBlend={true}
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
      <section className="flex items-center justify-center bg-black h-screen">
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