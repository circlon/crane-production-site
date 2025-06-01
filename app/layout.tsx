import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk, Manrope, Montserrat } from 'next/font/google';

// НОВАЯ ПРЕМИАЛЬНАЯ СИСТЕМА ШРИФТОВ 2025
// Primary Display: Аналог MURS GOTHIC - Space Grotesk (геометрический гротеск с edge)
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

// Secondary: Manrope - modern geometric sans (аналог NASTUP BASIC)
const manrope = Manrope({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  display: 'swap',
  variable: '--font-manrope',
});

// UI Elements: JetBrains Mono - clean monospace (аналог KREIS для UI)
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

// Body Text: Inter - premium body text
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

// Original GitHub heading font: Montserrat
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Crane Film Site',
      description: 'Снимаем не видео — снимаем смыслы',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${spaceGrotesk.variable} ${manrope.variable} ${jetBrainsMono.variable} ${inter.variable} ${montserrat.variable}`}>
      <body className="relative font-sans">
        {/* Фоновый слой - NOISE УБРАН */}
        <div className="background-layer fixed inset-0 z-0 overflow-hidden">
          {/* Чистый чёрный фон без шума */}
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