"use client";

import React, { useEffect, useState } from 'react';
import { Waves } from './components/Waves';
import ScrollExpandMedia from './components/ScrollExpandMedia';
import FluidTitle from './components/FluidTitle';
import ScrollIndicator from './components/ScrollIndicator';
import ScrollText from '../components/ui/scroll-text';


import ContactForm from './components/ContactForm';
import InlineContactForm from './components/InlineContactForm';
import AnimatedDirectionsSection from './components/AnimatedDirectionsSection';
import { VideoCollectionBlock } from '../components/ui/video-collection-block';
import './styles/fluid-animations.css';

const frameData = [
  {
    id: 1,
    video: '/videos/previews/preview-1.mp4',
    defaultPos: { x: 0, y: 0, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 0, // Теперь не используется, так как каждое видео начинается с начала
    title: 'Fitness Cinematic',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=0'
  },
  {
    id: 2,
    video: '/videos/previews/preview-2.mp4',
    defaultPos: { x: 6, y: 0, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 0,
    title: 'Fashion',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=1'
  },
  {
    id: 3,
    video: '/videos/previews/preview-3.mp4',
    defaultPos: { x: 0, y: 4, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 0,
    title: 'Личный бренд',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=2'
  },
  {
    id: 4,
    video: '/videos/previews/preview-4.mp4',
    defaultPos: { x: 6, y: 4, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 0,
    title: 'Презентация компаний',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=3'
  },
  {
    id: 5,
    video: '/videos/previews/preview-5.mp4',
    defaultPos: { x: 0, y: 8, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 0,
    title: 'Подкасты и интервью',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=4'
  },
  {
    id: 6,
    video: '/videos/previews/Превью Reels.mp4',
    defaultPos: { x: 6, y: 8, w: 6, h: 4 },
    corner: '/images/frames/corner.png',
    edgeHorizontal: '/images/frames/edge-h.png',
    edgeVertical: '/images/frames/edge-v.png',
    mediaSize: 1,
    borderThickness: 16,
    borderSize: 100,
    isHovered: false,
    startTime: 0,
    title: 'Креативные Reels',
    vkVideoSrc: 'https://vkvideo.ru/video_ext.php?oid=-229245500&id=456239047&hd=2&autoplay=1&preload=1&prefer_h265=1&no_buffer_preload=1&quality=1080p&force_hd=1&playlist_id=4&index=5'
  }
];

export default function Home() {
  const [showContactForm, setShowContactForm] = useState(false);

  // Handle video click events
  const handleVideoClick = (videoId: number) => {
    // Навигация к секции VK видео
    const vkVideosSection = document.getElementById('vk-videos-section');
    if (vkVideosSection) {
      vkVideosSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle Contact Form
  const handleTelegramClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContactForm(true);
  };

  const handleCloseTelegramModal = () => {
    setShowContactForm(false);
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
        // Функция очистки анимационных стилей после завершения
        const cleanupAnimation = (element: HTMLElement) => {
          element.addEventListener('animationend', () => {
            // Удаляем анимационные классы
            element.classList.remove('cinematic-text-wipe-reveal', 'cinematic-text-wipe');
            // Очищаем анимационные стили вручную
            element.style.clipPath = '';
            element.style.overflow = '';
            element.style.animation = '';
            element.style.textShadow = '';
          }, { once: true });
        };

        // Минимальная задержка только для завершения DOM
        requestAnimationFrame(() => {
          // Заголовок появляется сразу
          titleElement.classList.add('cinematic-text-wipe-reveal');
          cleanupAnimation(titleElement);
          
          // Подзаголовок появляется с небольшой задержкой для эффекта последовательности
          setTimeout(() => {
            subtitleElement.classList.add('cinematic-text-wipe-reveal');
            cleanupAnimation(subtitleElement);
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
                <button type="button" onClick={handleTelegramClick} className="group">
                  <div className="w-10 h-10 rounded-full bg-zinc-900/70 backdrop-blur-sm flex items-center justify-center group-hover:bg-zinc-800 transition-all duration-300 border border-zinc-800/50">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8L10.89 13.26C11.2 13.46 11.4 13.46 11.71 13.26L19.6 8M5 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V17C3 18.1 3.9 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
              className="cinematic-text-wipe font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 transform origin-center font-display text-white whitespace-nowrap"
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
        mediaSrc="/videos/ПРЕВЬЮ SHOWREEL.mp4"
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
          className="text-white max-w-2xl mx-auto font-heading"
        >
          <p className="mb-6 text-xl md:text-2xl">
            Мы креативный продакшен, который понимает, как важно любому бизнесу и эксперту продвижение в медийной сфере. 
            Мы умеем создавать крутые видео, которые зацепят вашего зрителя и потенциального клиента.
          </p>
          <p className="text-xl md:text-2xl">
            Мы изучаем ваш бизнес и экспертность, чтобы создать лучшие условия видеопроизводства. 
            Наш подход - рушить привычные шаблоны съемки и монтажа и научиться выделяться среди огромной массы видео.
          </p>
        </ScrollText>
      </ScrollExpandMedia>

      {/* Animated Video Frame Grid section */}
      <AnimatedDirectionsSection 
        frameData={frameData}
        onVideoClick={handleVideoClick}
      />



      {/* Contact Form */}
      <ContactForm 
        isOpen={showContactForm}
        onClose={handleCloseTelegramModal}
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
            
            <div className="space-y-6 font-heading">
              <p className="text-xl md:text-2xl leading-relaxed">
                Мы способны создавать профессиональные видео силами небольшой команды, которое «продает» при этом оставляя комфортную стоимость для Вас, но при необходимости, всегда можем привлечь крутых специалистов в области монтажа, звукорежиссуры, графики.
              </p>
              
              <p className="text-xl md:text-2xl leading-relaxed">
                Видео - это и про творчество, поэтому мы создаем классную и дружественную атмосферу на съемках, потому что хотим кайфовать от процесса и результата.
              </p>
            </div>
          </ScrollText>
        </div>
      </section>

      {/* VK Video Collection */}
      <section id="vk-videos-section">
        <VideoCollectionBlock className="bg-gradient-to-b from-black/90 to-black/95" />
      </section>

      {/* Контакты */}
      <section id="contacts-section" className="py-40 bg-gradient-to-b from-black/70 to-black/90 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <FluidTitle
              text="Свяжитесь с нами"
              size="4xl"
              className="mb-8 font-display uppercase tracking-wider"
              shaderEffect="gradient"
              animationSpeed="normal"
              intensityLevel="normal"
              intersectionReveal={true}
              intersectionThreshold={0.3}
              gradientColors={['#ff0080', '#ff8c00', '#40e0d0', '#0080ff']}
            />
            
            <p className="text-xl text-gray-200 font-sans">
              Расскажите о задаче — предложим решение
            </p>
          </div>
          
          <InlineContactForm />
        </div>
      </section>
    </main>
  );
} 