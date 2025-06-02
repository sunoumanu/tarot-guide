import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/AppHeader';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'es'}, {locale: 'fr'}];
}
 

const geistSans = GeistSans;

export const metadata: Metadata = {
  title: 'Mystic Guide',
  description: 'Your personal Tarot reading companion.',
  icons: {
    shortcut: '/favicon.ico',
    icon: '/icon.png',
    apple: '/icon.png'
  }
};
export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <AppHeader />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
          <footer className="text-center py-4 text-muted-foreground text-sm border-t border-border/30">
            © {new Date().getFullYear()} Mystic Guide. All rights reserved.
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
