import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
