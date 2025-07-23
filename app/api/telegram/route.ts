import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8161140866:AAGXOz8JIHg38k41tjxWum_hxYOvNtIWChw';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '29491299';

interface TelegramMessage {
  message: string;
  userInfo?: {
    userAgent: string;
    timestamp: string;
    sessionId: string;
  };
  threadId?: string; // Для цепочки сообщений
}

export async function POST(request: NextRequest) {
  try {
    const { message, userInfo, threadId }: TelegramMessage = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Сообщение не может быть пустым' },
        { status: 400 }
      );
    }

    // Формируем сообщение с метаданными
    const formattedMessage = `
${message.trim()}

Техническая информация:
• Время: ${userInfo?.timestamp || new Date().toISOString()}
• ID сессии: ${userInfo?.sessionId || 'неизвестно'}
• Браузер: ${userInfo?.userAgent || 'неизвестно'}
${threadId ? `• Thread ID: ${threadId}` : ''}

---
Свяжитесь с клиентом для ответа
    `.trim();

    // Параметры для отправки в Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload: any = {
      chat_id: TELEGRAM_CHAT_ID,
      text: formattedMessage,
      parse_mode: 'Markdown'
    };

    // Если есть threadId, отвечаем на предыдущее сообщение
    if (threadId) {
      payload.reply_to_message_id = parseInt(threadId);
    }

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Telegram API Error:', errorData);
      return NextResponse.json(
        { error: 'Ошибка отправки сообщения в Telegram' },
        { status: 500 }
      );
    }

    const telegramData = await telegramResponse.json();
    
    // Возвращаем message_id для будущих ответов
    return NextResponse.json({
      success: true,
      messageId: telegramData.result.message_id,
      message: 'Сообщение отправлено успешно'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Обработка OPTIONS для CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 