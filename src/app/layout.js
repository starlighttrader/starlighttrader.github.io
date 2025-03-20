import { Geist } from 'next/font/google';
import '@/styles/globals.css';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false, // Disable font size adjustment
});

export const metadata = {
  title: 'StarLight Trader',
  description: 'Financial Astrology Courses and Tools',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  );
} 