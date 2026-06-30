import { Orbitron, Share_Tech_Mono } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '700', '900'],
  display: 'swap',
});

const mono = Share_Tech_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400'],
  display: 'swap',
});

export const metadata = {
  title: 'ARUSH BADHE // PORTFOLIO',
  description: 'Software Engineer — Portfolio experience powered by Tron Legacy.',
  keywords: ['developer', 'portfolio', 'full-stack', 'react', 'nextjs'],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
