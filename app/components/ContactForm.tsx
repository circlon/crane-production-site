"use client";

import React, { useState, useRef } from 'react';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactData {
  name: string;
  contact: string; // телефон или email
  message: string;
  contactType: 'phone' | 'email';
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ContactData>({
    name: '',
    contact: '',
    message: '',
    contactType: 'phone'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGdprWarning, setShowGdprWarning] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Убираем автофокус чтобы избежать прокрутки
      // setTimeout(() => nameRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Пожалуйста, укажите ваше имя';
    }
    if (!formData.contact.trim()) {
      return 'Пожалуйста, укажите контакт для связи';
    }
    if (!formData.message.trim()) {
      return 'Пожалуйста, напишите ваше сообщение';
    }

    // Простая валидация email
    if (formData.contactType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contact)) {
        return 'Пожалуйста, укажите корректный email';
      }
    }

    // Простая валидация телефона
    if (formData.contactType === 'phone') {
      const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
      if (!phoneRegex.test(formData.contact)) {
        return 'Пожалуйста, укажите корректный номер телефона';
      }
    }

    return null;
  };

  const sendMessage = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `ЗАЯВКА НА ОБРАТНУЮ СВЯЗЬ

Имя: ${formData.name}
${formData.contactType === 'phone' ? 'Телефон' : 'Email'}: ${formData.contact}

Сообщение:
${formData.message}`,
          userInfo: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            sessionId: Math.random().toString(36).substring(2)
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        // Автоматически закрыть форму через 3 секунды
        setTimeout(() => {
          onClose();
          // Сброс формы при следующем открытии
          setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              contact: '',
              message: '',
              contactType: 'phone'
            });
          }, 500);
        }, 3000);
      } else {
        setError(data.error || 'Ошибка отправки. Попробуйте еще раз.');
      }
    } catch (error) {
      setError('Ошибка соединения. Проверьте интернет и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!gdprAccepted) {
      setShowGdprWarning(true);
      return;
    }
    await sendMessage();
  };

  const acceptGdpr = () => {
    setGdprAccepted(true);
    setShowGdprWarning(false);
    // Автоматически отправляем сообщение после принятия согласия
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full border border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white font-heading">Связаться с нами</h3>
                <p className="text-xs text-gray-400">Оставьте заявку на обратную связь</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* GDPR Warning */}
        {showGdprWarning && (
          <div className="p-4 bg-amber-900/30 border-b border-amber-700/50">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-amber-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-amber-300 font-medium text-sm mb-2">Согласие на обработку данных</h4>
                <p className="text-amber-100 text-xs leading-relaxed mb-3">
                  Отправляя форму, вы соглашаетесь на передачу ваших данных через Telegram API 
                  для обеспечения обратной связи. Данные будут использованы только для ответа на ваш запрос.
                </p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      acceptGdpr();
                    }}
                    className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Принимаю
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowGdprWarning(false);
                    }}
                    className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            // Success state
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-white font-medium mb-2">Заявка отправлена!</h4>
              <p className="text-gray-400 text-sm mb-4">
                Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
              </p>
              <p className="text-gray-500 text-xs">Окно закроется автоматически...</p>
            </div>
          ) : (
            // Form state
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ваше имя *
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Как к вам обращаться?"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Contact Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Как с вами связаться? *
                </label>
                <div className="flex space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInputChange('contactType', 'phone');
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      formData.contactType === 'phone'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                    }`}
                  >
                    Телефон
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInputChange('contactType', 'email');
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      formData.contactType === 'email'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                    }`}
                  >
                    Email
                  </button>
                </div>
                <input
                  type={formData.contactType === 'email' ? 'email' : 'tel'}
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  placeholder={
                    formData.contactType === 'phone' 
                      ? "+7 (999) 123-45-67" 
                      : "email@example.com"
                  }
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Расскажите о вашем проекте *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Опишите ваш проект, бюджет, сроки и любые пожелания..."
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-sans font-medium flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Отправляем...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Отправить заявку</span>
                  </>
                )}
              </button>

              {!gdprAccepted && (
                <p className="text-xs text-gray-500 text-center font-sans">
                  Нажимая "Отправить", вы соглашаетесь с передачей данных через Telegram API
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm; 