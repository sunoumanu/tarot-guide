import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader';
import { Toaster } from "@/components/ui/toaster";

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Error loading messages:', error);
    return {}; // Fallback to empty messages rather than notFound()
  }
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
      </div>
    </NextIntlClientProvider>
  );
}