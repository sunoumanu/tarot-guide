import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

const geistSans = GeistSans;

// Make the metadata generation async and use generateMetadata instead
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mystic Guide',
    description: 'Your personal Tarot reading companion.',
  };
}

export default async function RootLayout({children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
   return (
    <html>
      <body className={`${geistSans.className} font-sans`}>
        {children}
      </body>
    </html>
  );
}