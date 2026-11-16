import { Baloo_2, Nunito } from 'next/font/google';
import './globals.css';

const baslik = Baloo_2({ subsets: ['latin', 'latin-ext'], weight: ['600', '700', '800'], variable: '--yazi-baslik' });
const metin = Nunito({ subsets: ['latin', 'latin-ext'], variable: '--yazi-metin' });

export const metadata = {
  title: { default: 'Kedi ile Türkçe', template: '%s · Kedi ile Türkçe' },
  description: 'Weekly Turkish practice with Portakal the cat.',
  robots: { index: false, follow: false },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#FFF6E9' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${baslik.variable} ${metin.variable}`}>
      <body>{children}</body>
    </html>
  );
}
