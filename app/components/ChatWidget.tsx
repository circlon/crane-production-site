"use client";

import React, { useState, useEffect, useRef } from 'react';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
  status: 'sending' | 'sent' | 'error';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chat-session-id');
      if (stored) return stored;
      const newId = Math.random().toString(36).substring(2);
      localStorage.setItem('chat-session-id', newId);
      return newId;
    }
    return Math.random().toString(36).substring(2);
  });
  const [threadId, setThreadId] = useState<string | null>(null);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [showGdprWarning, setShowGdprWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMessages = localStorage.getItem('chat-messages');
      const storedThreadId = localStorage.getItem('chat-thread-id');
      const storedGdprAccepted = localStorage.getItem('chat-gdpr-accepted');
      
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Error loading chat messages:', error);
        }
      }
      
      if (storedThreadId) {
        setThreadId(storedThreadId);
      }
      
      if (storedGdprAccepted === 'true') {
        setGdprAccepted(true);
      }
    }
  }, []);

  // Сохранение сообщений в localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Сохранение threadId
  useEffect(() => {
    if (typeof window !== 'undefined' && threadId) {
      localStorage.setItem('chat-thread-id', threadId);
    }
  }, [threadId]);

  // Сохранение GDPR согласия
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat-gdpr-accepted', gdprAccepted.toString());
    }
  }, [gdprAccepted]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const generateMessageId = () => Math.random().toString(36).substring(2);

  const addMessage = (text: string, isUser: boolean, status: ChatMessage['status'] = 'sent') => {
    const newMessage: ChatMessage = {
      id: generateMessageId(),
      text,
      timestamp: new Date(),
      isUser,
      status
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessageStatus = (messageId: string, status: ChatMessage['status']) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ));
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    if (!gdprAccepted) {
      setShowGdprWarning(true);
      return;
    }

    const messageText = message.trim();
    setMessage('');
    
    const userMessageId = addMessage(messageText, true, 'sending');
    setIsLoading(true);

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          userInfo: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            sessionId: sessionId
          },
          threadId: threadId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        updateMessageStatus(userMessageId, 'sent');
        
        if (data.messageId && !threadId) {
          setThreadId(data.messageId.toString());
        }

        addMessage('Сообщение отправлено! Мы ответим вам в ближайшее время.', false);
      } else {
        updateMessageStatus(userMessageId, 'error');
        addMessage('Ошибка отправки сообщения. Попробуйте еще раз.', false);
      }
    } catch (error) {
      updateMessageStatus(userMessageId, 'error');
      addMessage('Ошибка соединения. Проверьте интернет и попробуйте снова.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const acceptGdpr = () => {
    setGdprAccepted(true);
    setShowGdprWarning(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const clearChatHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chat-messages');
      localStorage.removeItem('chat-thread-id');
      setMessages([]);
      setThreadId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full h-[600px] border border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-800/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.92 6.01L4.77 11.35C4.23 11.55 4.24 11.84 4.67 11.96L8.18 13.06L16.5 7.94C16.76 7.78 16.99 7.87 16.81 8.04L10.07 14.08H10.06L10.07 14.09L9.92 17.7C10.16 17.7 10.27 17.59 10.41 17.45L12.12 15.79L15.67 18.42C16.11 18.67 16.43 18.54 16.54 18.02L18.94 6.79C19.09 6.16 18.69 5.86 18.92 6.01Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white font-heading">CRANE Production</h3>
              <p className="text-xs text-gray-400">Онлайн</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {messages.length > 0 && (
              <button
                onClick={clearChatHistory}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="Очистить историю"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
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
                <h4 className="text-amber-300 font-medium text-sm mb-2">Уведомление о передаче данных</h4>
                <p className="text-amber-100 text-xs leading-relaxed mb-3">
                  Ваше сообщение будет отправлено через Telegram Bot API на серверы Telegram, 
                  которые находятся за пределами Европейского Союза. Продолжая, вы соглашаетесь 
                  с передачей ваших данных.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={acceptGdpr}
                    className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Принимаю
                  </button>
                  <button
                    onClick={() => setShowGdprWarning(false)}
                    className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-white font-medium mb-2">Начните диалог</h4>
              <p className="text-gray-400 text-sm">
                Расскажите о вашем проекте, и мы обязательно ответим!
              </p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-gray-200'
                }`}
              >
                <p className="font-sans text-sm leading-relaxed">{msg.text}</p>
                <div className={`flex items-center justify-between mt-2 ${msg.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                  <span className="text-xs">
                    {msg.timestamp.toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {msg.isUser && (
                    <div className="ml-2">
                      {msg.status === 'sending' && (
                        <div className="w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {msg.status === 'sent' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {msg.status === 'error' && (
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
          <div className="flex space-x-3">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите ваше сообщение..."
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-24"
              rows={1}
              disabled={isLoading}
              autoFocus
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[52px]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          
          {!gdprAccepted && (
            <p className="text-xs text-gray-500 mt-2 font-sans">
              Нажимая "Отправить", вы соглашаетесь с передачей данных через Telegram API
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWidget; 