import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crane Film Site',
  description: 'Capturing moments that matter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 