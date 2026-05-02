import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Playlink Admin',
  description: 'Panneau d\'administration Playlink',
  icons: {
    icon: '/playlink-logo.svg',
    apple: '/playlink-logo.svg',
  },
  robots: 'noindex',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
