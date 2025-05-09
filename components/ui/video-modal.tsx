'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
}

export function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
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
    // Проверяем, есть ли уже параметры в URL
    if (videoSrc.includes('?')) {
      // Если уже есть параметр hd, обновляем его
      if (videoSrc.includes('hd=')) {
        return videoSrc.replace(/hd=\d+/, 'hd=4');
      }
      // Иначе добавляем параметр hd=4
      return `${videoSrc}&hd=4`;
    }
    // Если параметров нет, добавляем hd=4
    return `${videoSrc}?hd=4`;
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
          >
            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Закрыть видео"
            >
              <X size={24} />
            </button>
            
            {/* VK Видео плеер */}
            <iframe
              src={getVideoUrl()}
              width="100%"
              height="100%"
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
              frameBorder="0"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 