"use client";

import React, { useEffect, useState } from 'react';
import { Waves } from './components/Waves';
import { DynamicFrameLayout } from '../components/ui/dynamic-frame-layout';
import { CyberText } from '../components/ui/cyber-text';
import ScrollExpandMedia from './components/ScrollExpandMedia';
import FluidTitle from './components/FluidTitle';
import ScrollIndicator from './components/ScrollIndicator';
import ScrollText from '../components/ui/scroll-text';

import VideoModal from './components/VideoModal';
import TelegramModal from './components/TelegramModal';
import './styles/fluid-animations.css';

const frameData = [
  {
    id: 1,
    video: '/videos/Raf New 1.mp4',
    defaultPos: { x: 0, y: 0, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 0,
    title: 'Fitness Cinematic',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=0'
  },
  {
    id: 2,
    video: '/videos/video2.mp4',
    defaultPos: { x: 6, y: 0, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 5,
    title: 'Fashion',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=1'
  },
  {
    id: 3,
    video: '/videos/video3.mp4',
    defaultPos: { x: 0, y: 4, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 8,
    title: 'Личный бренд',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=2'
  },
  {
    id: 4,
    video: '/videos/video4.mp4',
    defaultPos: { x: 6, y: 4, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 12,
    title: 'Презентация компаний',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=3'
  },
  {
    id: 5,
    video: '/videos/video5.mp4',
    defaultPos: { x: 0, y: 8, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 15,
    title: 'Подкасты и интервью',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=4'
  },
  {
    id: 6,
    video: '/videos/video6.mp4',
    defaultPos: { x: 6, y: 8, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 3,
    title: 'Креативные Reels',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=5'
  }
];

export default function Home() {
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  
  // Find the active video from frameData
  const activeVideo = activeVideoId !== null 
    ? frameData.find(frame => frame.id === activeVideoId) 
    : null;

  // Handle video click events
  const handleVideoClick = (videoId: number) => {
    setActiveVideoId(videoId);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle Telegram modal
  const handleTelegramClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTelegramModal(true);
  };

  const handleCloseTelegramModal = () => {
    setShowTelegramModal(false);
  };

  useEffect(() => {
    // Smooth scroll function
    const handleNavClick = (e: React.MouseEvent | Event) => {
      if (!e.target) return;
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
          });
        }
      }
    };

    // Add click event listener to navigation
    const navElement = document.querySelector('nav');
    if (navElement) {
      navElement.addEventListener('click', handleNavClick);
    }

    // Запускаем кинематографические анимации заголовка и подзаголовка синхронно
    const startTitleAnimations = () => {
      const titleElement = document.getElementById('main-title');
      const subtitleElement = document.getElementById('main-subtitle');
      
      if (titleElement && subtitleElement) {
        // Минимальная задержка только для завершения DOM
        requestAnimationFrame(() => {
          // Заголовок появляется сразу
          titleElement.classList.add('cinematic-text-wipe-reveal');
          
          // Подзаголовок появляется с небольшой задержкой для эффекта последовательности
          setTimeout(() => {
            subtitleElement.classList.add('cinematic-text-wipe-reveal');
          }, 600); // Задержка для красивой последовательности
        });
      }
    };

        startTitleAnimations();



    // Cleanup listener on component unmount
    return () => {
      if (navElement) {
        navElement.removeEventListener('click', handleNavClick);
      }
    };
  }, []);

  return (
    <main className="relative bg-transparent overflow-x-hidden w-screen m-0 p-0">
      {/* Основное содержимое начинается здесь */}      
      {/* Hero section с волнами */}
      <section id="hero-section" className="relative h-screen w-screen overflow-hidden" style={{ padding: 0, margin: 0 }}>
        {/* Навигационное меню */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-white text-xl font-original-heading">CRANE</div>
            
            <div className="flex items-center space-x-10">
              {/* Навигационные ссылки */}
              <a href="#video-grid-section" className="text-white opacity-80 hover:opacity-100 transition-opacity font-sans">
                Направления
              </a>
              <a href="#contacts-section" className="text-white opacity-80 hover:opacity-100 transition-opacity font-sans">
                Контакты
              </a>
              
              {/* Социальные сети */}
              <div className="flex space-x-4">
                <a href="https://vkvideo.ru/@club229245500/playlists" target="_blank" rel="noopener noreferrer" className="group">
                  <div className="w-10 h-10 rounded-full bg-zinc-900/70 backdrop-blur-sm flex items-center justify-center group-hover:bg-zinc-800 transition-all duration-300 border border-zinc-800/50">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.145 15.84C7.77 15.84 5.29 12.86 5.17 7.95H7.29C7.37 11.62 8.97 13.23 10.24 13.53V7.95H12.23V11.2C13.49 11.06 14.8 9.56 15.25 7.95H17.24C16.9 9.98 15.47 11.48 14.45 12.08C15.47 12.57 17.09 13.89 17.74 15.84H15.53C15.01 14.49 13.81 13.26 12.23 13.09V15.84H12.145Z" fill="currentColor"/>
                    </svg>
                  </div>
                </a>
                
                <button onClick={handleTelegramClick} className="group">
                  <div className="w-10 h-10 rounded-full bg-zinc-900/70 backdrop-blur-sm flex items-center justify-center group-hover:bg-zinc-800 transition-all duration-300 border border-zinc-800/50">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.92 6.01L4.77 11.35C4.23 11.55 4.24 11.84 4.67 11.96L8.18 13.06L16.5 7.94C16.76 7.78 16.99 7.87 16.81 8.04L10.07 14.08H10.06L10.07 14.09L9.92 17.7C10.16 17.7 10.27 17.59 10.41 17.45L12.12 15.79L15.67 18.42C16.11 18.67 16.43 18.54 16.54 18.02L18.94 6.79C19.09 6.16 18.69 5.86 18.92 6.01Z" fill="currentColor"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Анимированный фон с волнами - быстрая инициализация */}
        <Waves 
          lineColor="rgba(255, 255, 255, 0.4)" 
          className="absolute inset-0" 
          reactToScroll={true}
          parallaxFactor={0.1}
          waveSpeedX={0.02}
          waveSpeedY={0.01}
        />
        <div className="h-screen flex flex-col items-center justify-center text-white relative z-10">
          <div className="max-w-6xl mx-auto text-center px-4">
            {/* Оригинальная структура FluidTitle с кинематографической анимацией */}
            <h1 
              id="main-title" 
              className="cinematic-text-wipe font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 transform origin-center font-original-heading text-white whitespace-nowrap"
            >
              CRANE PRODUCTION
              <div className="cyber-scan-line"></div>
            </h1>
            
            {/* Оригинальный FluidTitle (закомментирован для отладки) */}
            {/* <FluidTitle 
              text="CRANE PRODUCTION" 
              color="white"
              className="mb-6 scale-125 transform origin-center font-display"
              delay={0.5}
              cinematicMode={true}
              intersectionReveal={false}
            /> */}
            <p 
              id="main-subtitle"
              className="cinematic-text-wipe text-xl md:text-2xl mt-4 text-gray-300 font-sans"
            >
              Снимаем не видео — снимаем смыслы
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
        title="О НАС"
        textBlend={true}
        id="scroll-expand-section"
        disableContentAnimation={true}
      >
        <ScrollText 
          fadeInStart={0.1}
          fadeOutStart={0.85}
          animationType="slide-up"
          duration={0.25}
          className="text-white max-w-2xl mx-auto font-sans"
        >
          <p className="mb-6 text-lg">
            Мы креативный продакшен, который понимает, как важно любому бизнесу и эксперту продвижение в медийной сфере. 
            Мы умеем создавать крутые видео, которые зацепят вашего зрителя и потенциального клиента.
          </p>
          <p className="text-lg">
            Мы изучаем ваш бизнес и экспертность, чтобы создать лучшие условия видеопроизводства. 
            Наш подход - рушить привычные шаблоны съемки и монтажа и научиться выделяться среди огромной массы видео.
          </p>
        </ScrollText>
      </ScrollExpandMedia>

      {/* Video Frame Grid section */}
      <section id="video-grid-section" className="flex flex-col items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm min-h-screen py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 z-0"></div>
        <CyberText
          cinematicMode={true}
          intersectionReveal={true}
          intersectionThreshold={0.4}
          cinematicDelay={300}
          className="text-3xl md:text-5xl font-bold text-white mb-12 text-center relative z-10 uppercase font-display tracking-wider"
          scanLineColor="rgba(255, 255, 255, 0.9)"
          pixelated={false}
        >
          <h2>Наши направления</h2>
        </CyberText>
        <div className="w-full max-w-[94%] lg:max-w-[90%] mx-auto h-[85vh] px-4 relative z-10 video-grid-container">
          <DynamicFrameLayout 
            frames={frameData} 
            showFrames={false}
            hoverSize={6}
            gapSize={16}
            onVideoClick={handleVideoClick}
          />
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal 
          isOpen={showModal}
          onClose={handleCloseModal}
          videoSrc={activeVideo.vkVideoSrc || `https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1`}
        />
      )}

      {/* Telegram Modal */}
      <TelegramModal 
        isOpen={showTelegramModal}
        onClose={handleCloseTelegramModal}
        telegramUsername="crane_film"
      />

      {/* Подход */}
      <section id="approach-section" className="py-32 bg-gradient-to-b from-black/80 to-black/70 relative">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollText 
            fadeInStart={0.15}
            fadeOutStart={0.8}
            animationType="slide-up"
            duration={0.3}
            className="text-gray-200"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center font-heading uppercase tracking-wide">
              Наш подход
            </h2>
            
            <div className="space-y-6 font-sans">
              <p className="text-lg md:text-xl leading-relaxed">
                Мы способны создавать профессиональные видео силами небольшой команды, которое «продает» при этом оставляя комфортную стоимость для Вас, но при необходимости, всегда можем привлечь крутых специалистов в области монтажа, звукорежиссуры, графики.
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed">
                Видео - это и про творчество, поэтому мы создаем классную и дружественную атмосферу на съемках, потому что хотим кайфовать от процесса и результата.
              </p>
            </div>
          </ScrollText>
        </div>
      </section>

      {/* Контакты */}
      <section id="contacts-section" className="py-40 bg-gradient-to-b from-black/70 to-black/90 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-display uppercase tracking-wider">
            Свяжитесь с нами
          </h2>
          
          <p className="text-xl text-gray-200 mb-12 font-sans">
            Расскажите о задаче — предложим решение
          </p>
          
          <div className="flex justify-center space-x-10">
            <a href="https://vkvideo.ru/@club229245500/playlists" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 transition-all duration-300 border border-zinc-800">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.145 15.84C7.77 15.84 5.29 12.86 5.17 7.95H7.29C7.37 11.62 8.97 13.23 10.24 13.53V7.95H12.23V11.2C13.49 11.06 14.8 9.56 15.25 7.95H17.24C16.9 9.98 15.47 11.48 14.45 12.08C15.47 12.57 17.09 13.89 17.74 15.84H15.53C15.01 14.49 13.81 13.26 12.23 13.09V15.84H12.145Z" fill="currentColor"/>
                </svg>
              </div>
            </a>
            
            <button onClick={handleTelegramClick} className="group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 transition-all duration-300 border border-zinc-800">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.92 6.01L4.77 11.35C4.23 11.55 4.24 11.84 4.67 11.96L8.18 13.06L16.5 7.94C16.76 7.78 16.99 7.87 16.81 8.04L10.07 14.08H10.06L10.07 14.09L9.92 17.7C10.16 17.7 10.27 17.59 10.41 17.45L12.12 15.79L15.67 18.42C16.11 18.67 16.43 18.54 16.54 18.02L18.94 6.79C19.09 6.16 18.69 5.86 18.92 6.01Z" fill="currentColor"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
} 