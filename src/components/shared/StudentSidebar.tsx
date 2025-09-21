
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, CheckSquare, FileText, LogOut, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

const navItems = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/activities', label: 'My Activities', icon: CheckSquare },
  { href: '/student/portfolio', label: 'My Portfolio', icon: FileText },
  { href: '/student/timeline', label: 'Activity Timeline', icon: Clock },
  { href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function StudentSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="hidden md:block fixed left-0 top-0 h-screen w-[220px] lg:w-[280px] border-r bg-card z-10">
      <div className="flex h-full flex-col overflow-y-auto gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/student/dashboard" className="flex items-center gap-1 font-semibold">
            <Logo className="h-8 w-8" />
            <span className="">Ascend</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  { 'bg-muted text-primary': pathname.startsWith(item.href) }
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
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
          <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useAuth } from '@/context/AuthContext';
// import { GraduationCap, LayoutDashboard, CheckSquare, FileText, LogOut, Trophy, Clock } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const navItems = [
//   { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//   { href: '/student/activities', label: 'My Activities', icon: CheckSquare },
//   { href: '/student/portfolio', label: 'My Portfolio', icon: FileText },
//   { href: '/student/timeline', label: 'Activity Timeline', icon: Clock },
//   { href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
// ];

// export function StudentSidebar() {
//   const { user, logout } = useAuth();
//   const pathname = usePathname();

//   return (
//     <div className="hidden border-r bg-card md:block">
//       <div className="flex h-full max-h-screen flex-col gap-2">
//         <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
//           <Link href="/student/dashboard" className="flex items-center gap-2 font-semibold">
//             <GraduationCap className="h-6 w-6 text-primary" />
//             <span className="">Student Hub</span>
//           </Link>
//         </div>
//         <div className="flex-1 overflow-auto py-2">
//           <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={cn(
//                   'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
//                   { 'bg-muted text-primary': pathname.startsWith(item.href) }
//                 )}
//               >
//                 <item.icon className="h-4 w-4" />
//                 {item.label}
//               </Link>
//             ))}
//           </nav>
//         </div>
//         <div className="mt-auto border-t p-4">
//           <div className="flex items-center gap-3 p-2 mb-2">
//             <Avatar className="h-9 w-9">
//               <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
//               <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">
//               <span className="font-medium text-sm">{user?.name}</span>
//               <span className="text-xs text-muted-foreground">{user?.role}</span>
//             </div>
//           </div>
//           <Button variant="ghost" className="w-full justify-start" onClick={logout}>
//             <LogOut className="mr-2 h-4 w-4" />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
