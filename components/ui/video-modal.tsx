'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen?: boolean;
  onClose: () => void;
  videoSrc: string;
}

export function VideoModal({ isOpen = true, onClose, videoSrc }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Закрытие модального окна по клику на фон
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // Закрытие по клавише Escape
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);
  
  // Блокировка скролла когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Формируем URL для VK видео с параметром HD
  const getVideoUrl = () => {
    // Если это не видео ВК, возвращаем исходный URL
    if (!videoSrc.includes('vkvideo.ru') && !videoSrc.includes('vk.com')) {
      return videoSrc;
    }
    
    // Базовые параметры для URL видео ВК
    const requiredParams = new Map([
      ['hd', '2'], // Принудительно устанавливаем HD 1080p (2 - код для 1080p)
      ['autoplay', '1'], // Автоматически воспроизводить видео
      ['preload', '1'], // Предзагрузка видео
      ['prefer_h265', '1'], // Предпочитать кодек H.265 (если доступен)
      ['no_buffer_preload', '1'], // Отключаем предзагрузку буфера до воспроизведения
      ['quality', '1080p'], // Указываем качество 1080p
      ['force_hd', '1'], // Дополнительный параметр для форсирования HD
      ['vq', '1080'], // VQ параметр для указания разрешения
      ['max_res', '1080'] // Максимальное разрешение
    ]);
    
    // Разбираем исходный URL
    let [baseUrl, queryString] = videoSrc.split('?');
    const params = new URLSearchParams(queryString || '');
    
    // Добавляем или обновляем необходимые параметры
    requiredParams.forEach((value, key) => {
      params.set(key, value);
    });
    
    // Формируем окончательный URL
    return `${baseUrl}?${params.toString()}`;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          {/* Затемненный фон */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Контейнер модального окна */}
          <motion.div
            ref={modalRef}
            className="relative z-10 w-full max-w-5xl h-[80vh] rounded-lg overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            data-video-content
          >
            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Закрыть видео"
            >
              <X size={24} />
            </button>
            
            {/* Индикатор загрузки */}
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            {/* VK Видео плеер */}
            <iframe
              src={getVideoUrl()}
              width="100%"
              height="100%"
              className="w-full h-full relative z-10"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
              frameBorder="0"
              allowFullScreen
              loading="eager"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 