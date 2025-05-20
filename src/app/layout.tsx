import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/AppHeader';

const geistSans = GeistSans;

export const metadata: Metadata = {
  title: 'Mystic Guide',
  description: 'Your personal Tarot reading companion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
        <footer className="text-center py-4 text-muted-foreground text-sm border-t border-border/30">
          © {new Date().getFullYear()} Mystic Guide. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
