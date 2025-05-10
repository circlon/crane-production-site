'use client';

import { DynamicFrameLayout } from './DynamicFrameLayout';
import type { FrameType } from './index';

// Тестовые данные для проверки работы
const testFrames: FrameType[] = [
  {
    id: 1,
    media: { type: 'video', src: '/videos/sample1.mp4' },
    mediaSize: 1.2,
    borderThickness: 2,
    borderSize: 95,
    position: { row: 0, col: 0 },
    title: 'Киберпанк Фрейм 1'
  },
  {
    id: 2,
    media: { type: 'video', src: '/videos/sample2.mp4' },
    mediaSize: 1.2,
    borderThickness: 2,
    borderSize: 95,
    position: { row: 0, col: 1 },
    title: 'Киберпанк Фрейм 2'
  },
  {
    id: 3,
    media: { type: 'video', src: '/videos/sample3.mp4' },
    mediaSize: 1.2,
    borderThickness: 2,
    borderSize: 95,
    position: { row: 0, col: 2 },
    title: 'Киберпанк Фрейм 3'
  },
  {
    id: 4,
    media: { type: 'video', src: '/videos/sample4.mp4' },
    mediaSize: 1.2,
    borderThickness: 2,
    borderSize: 95,
    position: { row: 1, col: 0 },
    title: 'Киберпанк Фрейм 4'
  },
  {
    id: 5,
    media: { type: 'video', src: '/videos/sample5.mp4' },
    mediaSize: 1.2,
    borderThickness: 2,
    borderSize: 95,
    position: { row: 1, col: 1 },
    title: 'Киберпанк Фрейм 5'
  },
  {
    id: 6,
    media: { type: 'video', src: '/videos/sample6.mp4' },
    mediaSize: 1.2,
    borderThickness: 2,
    borderSize: 95,
    position: { row: 1, col: 2 },
    title: 'Киберпанк Фрейм 6'
  },
  {
    id: 7,
    media: { type: 'video', src: '/videos/sample7.mp4' },
    mediaSize: 1.2,
    borderThickness: 2,
    borderSize: 95,
    position: { row: 2, col: 0 },
    title: 'Киберпанк Фрейм 7'
  },
  {
    id: 8,
    media: { type: 'video', src: '/videos/sample8.mp4' },
    mediaSize: 1.2,
    borderThickness: 2,
    borderSize: 95,
    position: { row: 2, col: 1 },
    title: 'Киберпанк Фрейм 8'
  },
  {
    id: 9,
    media: { type: 'video', src: '/videos/sample9.mp4' },
    mediaSize: 1.2,
    borderThickness: 2,
    borderSize: 95,
    position: { row: 2, col: 2 },
    title: 'Киберпанк Фрейм 9'
  },
];

export default function TestFrameLayout() {
  return (
    <div className="w-full h-screen bg-black">
      <h1 className="text-white text-2xl p-4 font-mono">Тестирование CSS-анимации заголовков</h1>
      <p className="text-white/70 p-4 font-mono">Наведите на фрейм, чтобы заголовок исчез с анимацией</p>
      
      <div className="w-full h-[80vh] p-8">
        <DynamicFrameLayout 
          frames={testFrames} 
          showFrames={true}
          hoverSize={6}
          gapSize={8}
        />
      </div>
    </div>
  );
} 