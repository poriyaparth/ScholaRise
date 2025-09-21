
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';

export default function LoginPage() {
  const { login, user } = useAuth();
  const [loadingRole, setLoadingRole] = useState<'student' | 'admin' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = (role: 'student' | 'admin') => {
    setLoadingRole(role);
    setTimeout(() => {
      login(role);
    }, 1000);
  };

  if(user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link href="/">&larr; Back to Home</Link>
        </Button>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Logo className="mx-auto h-16 w-16" />
          <CardTitle className="mt-2 text-2xl font-bold">Ascend</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" defaultValue="demo@example.com" />
          </div>
          <div className="grid gap-2">
             <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                defaultValue="password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
             <div className="flex items-center">
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={() => handleLogin('student')} disabled={!!loadingRole}>
            {loadingRole === 'student' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Login as Student
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => handleLogin('admin')} disabled={!!loadingRole}>
            {loadingRole === 'admin' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Login as Admin
          </Button>
           <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
