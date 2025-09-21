
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CalendarIcon, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Logo } from '@/components/shared/Logo';

export default function SignupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'admin' | null>(null);
  const [dob, setDob] = useState<Date | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    if (!role) return;
    setIsLoading(true);
    // In a real app, you'd call a signup function from your auth context
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Account Created!',
        description: `Your ${role} account has been successfully created. Please log in.`,
      });
      router.push('/login');
    }, 1500);
  };
  
  const handleRoleSelection = (selectedRole: 'student' | 'admin') => {
    if (role === selectedRole) {
      setRole(null); // Allow deselecting
    } else {
      setRole(selectedRole);
    }
  }

  if (user) {
    // This should be handled by AuthContext, but as a fallback:
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link href="/">&larr; Back to Home</Link>
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Logo className="mx-auto h-12 w-12" />
          <CardTitle className="mt-4 text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join ScholaRise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <Button variant={role === 'student' ? 'default' : 'outline'} onClick={() => handleRoleSelection('student')}>
              I am a Student
            </Button>
            <Button variant={role === 'admin' ? 'default' : 'outline'} onClick={() => handleRoleSelection('admin')}>
              I am an Admin
            </Button>
          </div>
          
          {role && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} />
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
              </div>

              {role === 'student' && (
                <>
                  <div className="grid gap-2">
                    <Label>Date of Birth</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn('w-full justify-start text-left font-normal', !dob && 'text-muted-foreground')}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dob ? format(dob, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            fromYear={1990}
                            toYear={new Date().getFullYear()}
                            selected={dob}
                            onSelect={setDob}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Select>
                        <SelectTrigger id="branch">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="it">Information Technology</SelectItem>
                          <SelectItem value="entc">ENTC</SelectItem>
                          <SelectItem value="inst">Instrumentation</SelectItem>
                          <SelectItem value="me">Mechanical</SelectItem>
                          <SelectItem value="ee">Electrical</SelectItem>
                          <SelectItem value="cv">Civil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="grid gap-2">
                      <Label htmlFor="year">Year of Study</Label>
                       <Select>
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           {role && (
              <Button className="w-full" onClick={handleSignup} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign Up
              </Button>
           )}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
