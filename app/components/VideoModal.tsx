import React, { useEffect } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc }) => {
  useEffect(() => {
    // Disable scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blurred effect */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        style={{ animationDuration: '300ms' }}
      />
      
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-[90%] md:max-w-[80%] lg:max-w-5xl aspect-video">
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl border border-zinc-800">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute -top-12 right-0 text-white bg-zinc-800/70 hover:bg-zinc-700 rounded-full p-2 z-20 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* VK Video iframe with allowed playlist features */}
          <iframe 
            src={videoSrc}
            width="100%" 
            height="100%" 
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write; gyroscope; accelerometer" 
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
            style={{ backgroundColor: '#000000' }}
            title="VK Video Player"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal; 