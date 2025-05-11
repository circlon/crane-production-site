import './globals.css';
import type { Metadata } from 'next';
import { Noise } from '@/components/ui/noise';

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
    <html lang="en">
      <body className="relative">
        {/* Фоновый слой */}
        <div className="background-layer fixed inset-0 z-0 overflow-hidden">
          {/* Шумовой эффект применяется только к фоновому слою */}
          <div className="noise-container">
            <Noise 
              patternAlpha={40} 
              patternSize={250} 
              patternRefreshInterval={2}
              className="opacity-70"
            />
            <Noise 
              patternAlpha={30} 
              patternSize={350} 
              patternRefreshInterval={4}
              className="opacity-50"
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