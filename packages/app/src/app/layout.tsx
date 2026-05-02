import type { Metadata, Viewport } from 'next';
import { Inter, Lilita_One } from 'next/font/google';
import './globals.css';
import { ThemeScript } from '@/components/ThemeScript';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lilitaOne = Lilita_One({ subsets: ['latin'], weight: '400', variable: '--font-lilita' });

export const metadata: Metadata = {
  title: 'Playlink',
  description: 'Jeux de cartes party — Action ou Vérité, Icebreaker & plus',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Playlink' },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} ${lilitaOne.variable} font-sans min-h-[100dvh] flex flex-col`}>
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
