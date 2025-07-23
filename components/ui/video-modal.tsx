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
  
  // Формируем URL для VK видео с автозапуском
  const getVideoUrl = () => {
    return videoSrc.replace('&autoplay=0', '&autoplay=1');
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          {/* Чистый VK плеер без рамок */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-5xl aspect-video"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Минимальная кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 z-20 text-white/60 hover:text-white transition-colors"
              aria-label="Закрыть видео"
            >
              <X size={32} />
            </button>
            
            {/* Только VK iframe */}
            <iframe
              src={getVideoUrl()}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
              allowFullScreen
              loading="eager"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VideoModal;