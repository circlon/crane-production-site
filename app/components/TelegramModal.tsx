"use client";

import React, { useState, useEffect } from 'react';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramUsername: string;
}

const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose, telegramUsername }) => {
  const [message, setMessage] = useState('');

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSend = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message.trim());
      const telegramUrl = `https://t.me/${telegramUsername}?text=${encodedMessage}`;
      window.open(telegramUrl, '_blank');
      onClose();
      setMessage('');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full border border-zinc-800 overflow-hidden">
        {/* Заголовок */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.92 6.01L4.77 11.35C4.23 11.55 4.24 11.84 4.67 11.96L8.18 13.06L16.5 7.94C16.76 7.78 16.99 7.87 16.81 8.04L10.07 14.08H10.06L10.07 14.09L9.92 17.7C10.16 17.7 10.27 17.59 10.41 17.45L12.12 15.79L15.67 18.42C16.11 18.67 16.43 18.54 16.54 18.02L18.94 6.79C19.09 6.16 18.69 5.86 18.92 6.01Z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white font-heading">Написать сообщение</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-6">
          <p className="text-gray-300 mb-4 font-sans">
            Напишите ваше сообщение для команды CRANE Production:
          </p>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Расскажите о вашем проекте, бюджете и сроках..."
            className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            autoFocus
          />
          
          <div className="text-right text-sm text-gray-500 mt-2 font-mono">
            {message.length}/1000
          </div>
        </div>

        {/* Кнопки */}
        <div className="px-6 py-4 bg-zinc-800/50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-sans"
          >
            Отмена
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-sans font-medium flex items-center space-x-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.92 6.01L4.77 11.35C4.23 11.55 4.24 11.84 4.67 11.96L8.18 13.06L16.5 7.94C16.76 7.78 16.99 7.87 16.81 8.04L10.07 14.08H10.06L10.07 14.09L9.92 17.7C10.16 17.7 10.27 17.59 10.41 17.45L12.12 15.79L15.67 18.42C16.11 18.67 16.43 18.54 16.54 18.02L18.94 6.79C19.09 6.16 18.69 5.86 18.92 6.01Z" fill="currentColor"/>
            </svg>
            <span>Отправить</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramModal; 