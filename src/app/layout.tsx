import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Raleway, Playfair_Display } from 'next/font/google';
import './globals.css';

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-family-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-family-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'US Holding — Группа компаний',
  description:
    'US Holding — группа из 17 компаний, работающих в сферах строительства, инжиниринга, логистики, девелопмента и других направлениях в Казахстане.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ru" className={`${raleway.variable} ${playfair.variable}`}>
        <body className={raleway.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
