import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

const geistSans = GeistSans;

export const metadata: Metadata = {
  title: 'Mystic Guide',
  description: 'Your personal Tarot reading companion.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${geistSans.className} font-sans`}>
        {children}
      </body>
    </html>
  );
}
