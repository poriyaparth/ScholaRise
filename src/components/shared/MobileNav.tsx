
'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, LayoutDashboard, CheckSquare, FileText, LogOut, BarChart, Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

const studentNavItems = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/activities', label: 'My Activities', icon: CheckSquare },
  { href: '/student/portfolio', label: 'My Portfolio', icon: FileText },
  { href: '/student/timeline', label: 'Activity Timeline', icon: Clock },
  { href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
];

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/approvals', label: 'Approval Queue', icon: CheckSquare },
  { href: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
];

export function MobileNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = user?.role === 'student' ? studentNavItems : adminNavItems;
  const homeLink = user?.role === 'student' ? '/student/dashboard' : '/admin/dashboard';

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 md:hidden">
      <Link href={homeLink} className="flex items-center gap-2 font-semibold">
        <Logo className="h-8 w-8" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="w-full flex-1">
        {/* Can add search here later */}
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Logo className="h-8 w-8" />
              <span>{user?.role === 'student' ? 'Ascend' : 'Admin Panel'}</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                   pathname.startsWith(item.href) ? 'bg-muted text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
             <div className="flex items-center gap-3 p-2 mb-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.role}</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start" onClick={() => {
              setIsOpen(false);
              logout();
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
