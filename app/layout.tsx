import './globals.css';
import type { Metadata } from 'next';
import { Noise } from '@/components/ui/noise';
import { Inter, Bitter, IBM_Plex_Sans, Montserrat } from 'next/font/google';

// Основной современный шрифт с отличной поддержкой кириллицы
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

// Альтернативный шрифт для заголовков
const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});

// Контрастный шрифт для акцентов
const bitter = Bitter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-bitter',
});

// Премиальный шрифт для основных заголовков
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Crane Film Site',
  description: 'Frame Moments, Build Brands',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${ibmPlexSans.variable} ${bitter.variable} ${montserrat.variable}`}>
      <body className="relative font-sans">
        {/* Фоновый слой */}
        <div className="background-layer fixed inset-0 z-0 overflow-hidden">
          {/* Шумовой эффект применяется только к фоновому слою */}
          <div className="noise-container">
            <Noise 
              patternAlpha={10} 
              patternSize={300} 
              patternRefreshInterval={4}
              className="opacity-30"
            />
            <Noise 
              patternAlpha={8} 
              patternSize={400} 
              patternRefreshInterval={6}
              className="opacity-20"
            />
          </div>
          
          {/* Дополнительный фоновый контент (если нужен) */}
          <div className="bg-black w-full h-full"></div>
        </div>
        
        {/* Контентный слой - всё содержимое сайта */}
        <div className="content-layer relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
} 