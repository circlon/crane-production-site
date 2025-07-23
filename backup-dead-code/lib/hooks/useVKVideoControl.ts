import { useRef, useEffect } from 'react';
import type { VKVideoPlayer, VKPlayerState } from '@/lib/types/vk';

// Хук для управления VK видео плеером
export function useVKVideoControl(
  iframeRef: React.RefObject<HTMLIFrameElement> | null, 
  isActive: boolean
) {
  const playerRef = useRef<VKVideoPlayer | null>(null);
  const initialized = useRef(false);

  // Инициализация плеера
  useEffect(() => {
    // Если iframeRef null, то не инициализируем плеер
    if (!iframeRef) return;
    
    // Инициализируем плеер один раз, когда iframe монтируется
    if (iframeRef.current && !initialized.current && window.VK) {
      try {
        playerRef.current = window.VK.VideoPlayer(iframeRef.current);
        initialized.current = true;
        
        // Подписываемся на события инициализации
        if (playerRef.current) {
          playerRef.current.on('inited', (state) => {
            console.log('VK Video Player initialized', state);
          });
        }
      } catch (error) {
        console.error('Failed to initialize VK Video Player:', error);
      }
    }
  }, [iframeRef]);

  // Управляем воспроизведением при изменении активного состояния
  useEffect(() => {
    if (!playerRef.current || !initialized.current) return;

    try {
      if (isActive) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    } catch (error) {
      console.error('Error controlling VK Video Player:', error);
    }
  }, [isActive]);

  // Очищаем ресурсы при размонтировании
  useEffect(() => {
    return () => {
      if (playerRef.current && initialized.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
          initialized.current = false;
        } catch (error) {
          console.error('Error destroying VK Video Player:', error);
        }
      }
    };
  }, []);

  return playerRef;
} 