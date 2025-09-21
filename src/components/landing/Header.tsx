
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '../shared/Logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-8 w-8" />
          <span className="font-bold sm:inline-block">ScholaRise</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-6">
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="#features"
              className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
            >
              For Institutions
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
