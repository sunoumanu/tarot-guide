'use client';

import Link from 'next/link';
import { BookOpen, Wand2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AppHeader() {
  const pathname = usePathname();

  const navLinkClasses = (href: string) =>
    cn(
      "flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors",
      pathname === href ? "text-accent" : "text-foreground/80"
    );

  return (
    <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Wand2 className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Mystic Guide
          </h1>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className={navLinkClasses('/')}>
            New Reading
          </Link>
          <Link href="/saved-readings" className={navLinkClasses('/saved-readings')}>
            <BookOpen className="h-4 w-4" />
            Saved Readings
          </Link>
        </nav>
      </div>
    </header>
  );
}
