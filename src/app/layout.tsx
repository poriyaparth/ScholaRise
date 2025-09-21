import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { ActivityProvider } from '@/context/ActivityContext';

export const metadata: Metadata = {
  title: 'Ascend',
  description: 'Your Entire College Journey, Verified and in One Place.',
  icons: {
    icon: '/Ascend.svg',
    shortcut: '/Ascend.svg',
    apple: '/Ascend.svg',
  },
  openGraph: {
    title: 'Ascend',
    description: 'Your Entire College Journey, Verified and in One Place.',
    images: ['/Ascend.svg'],
  },
  twitter: {
    card: 'summary',
    title: 'Ascend',
    description: 'Your Entire College Journey, Verified and in One Place.',
    images: ['/Ascend.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body h-full bg-background text-foreground antialiased">
        <AuthProvider>
          <ActivityProvider>
            {children}
            <Toaster />
          </ActivityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
