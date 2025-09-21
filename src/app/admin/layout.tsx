
'use client';
import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/shared/AdminSidebar';
import { MobileNav } from '@/components/shared/MobileNav';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // AuthContext handles redirect
  }

  return (
    <div className="flex h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden md:ml-[220px] lg:ml-[280px]">
        <MobileNav />
        <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
