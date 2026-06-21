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

const SITE_URL = 'https://usholding.kz';
const SITE_NAME = 'US Holding';
const DESCRIPTION =
  'US Holding — группа из 17 компаний, работающих в сферах строительства, инжиниринга, логистики, девелопмента и других направлениях в Казахстане.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Группа компаний`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'ru_RU',
    title: `${SITE_NAME} — Группа компаний`,
    description: DESCRIPTION,
    images: [
      {
        url: '/images/astana.jpg',
        width: 1200,
        height: 630,
        alt: 'US Holding — Астана, Казахстан',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Группа компаний`,
    description: DESCRIPTION,
    images: ['/images/astana.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
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
