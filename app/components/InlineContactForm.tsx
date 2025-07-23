"use client";

import React, { useState } from 'react';

interface ContactData {
  name: string;
  contact: string;
  message: string;
  contactType: 'phone' | 'email';
}

const InlineContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactData>({
    name: '',
    contact: '',
    message: '',
    contactType: 'phone'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [showGdprWarning, setShowGdprWarning] = useState(false);

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
        // Сбросить форму через 5 секунд
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            contact: '',
            message: '',
            contactType: 'phone'
          });
          setGdprAccepted(false);
        }, 5000);
      } else {
        setError(data.error || 'Ошибка отправки. Попробуйте еще раз.');
      }
    } catch (error) {
      setError('Ошибка соединения. Проверьте интернет и попробуйте снова.');
    } finally {
      setIsLoading(false);
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
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 font-heading">Заявка отправлена!</h3>
        <p className="text-gray-300 text-lg mb-2">
          Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
        </p>
        <p className="text-gray-500 text-sm">Форма обновится автоматически через несколько секунд...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* GDPR Warning */}
      {showGdprWarning && (
        <div className="p-6 bg-amber-900/30 border border-amber-700/50 rounded-xl mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-amber-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-amber-300 font-medium text-lg mb-3">Согласие на обработку данных</h4>
              <p className="text-amber-100 text-base leading-relaxed mb-4">
                Отправляя форму, вы соглашаетесь на передачу ваших данных через Telegram API 
                для обеспечения обратной связи. Данные будут использованы только для ответа на ваш запрос.
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    acceptGdpr();
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
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
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-lg font-medium text-gray-200 mb-3 font-heading">
              Ваше имя *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Как к вам обращаться?"
              className="w-full px-5 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Contact Type */}
          <div>
            <label className="block text-lg font-medium text-gray-200 mb-3 font-heading">
              Как с вами связаться? *
            </label>
            <div className="flex space-x-3 mb-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInputChange('contactType', 'phone');
                }}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
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
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
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
              className="w-full px-5 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-lg font-medium text-gray-200 mb-3 font-heading">
              Расскажите о вашем проекте *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Опишите ваш проект, бюджет, сроки и любые пожелания..."
              rows={5}
              className="w-full px-5 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
              <p className="text-red-300 text-base">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-sans font-semibold text-lg flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Отправляем...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Отправить заявку</span>
              </>
            )}
          </button>

          {!gdprAccepted && (
            <p className="text-sm text-gray-400 text-center font-sans">
              Нажимая "Отправить", вы соглашаетесь с передачей данных через Telegram API
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InlineContactForm; 