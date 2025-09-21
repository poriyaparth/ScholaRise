
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { CheckSquare, FileText, LayoutDashboard, Puzzle, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-20 text-center md:py-28 lg:py-32">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
            Your Entire College Journey, <br />
            Verified and in One Place.
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Document every achievement—from workshops to leadership roles—and build a dynamic, verified portfolio that gets you noticed.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/login">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container mx-auto space-y-12 px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Ascend?</h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                A comprehensive platform designed for student success and institutional excellence.
              </p>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <Card className="h-full text-center">
                <CardHeader className="flex flex-col items-center gap-4">
                  <LayoutDashboard className="h-10 w-10 text-primary" />
                  <CardTitle>Dynamic Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A central hub to see your progress, track approvals, and manage your activities at a glance.</p>
                </CardContent>
              </Card>
              <Card className="h-full text-center">
                <CardHeader className="flex flex-col items-center gap-4">
                  <CheckSquare className="h-10 w-10 text-primary" />
                  <CardTitle>Seamless Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Log every activity, upload proof, and get it verified by your institution for a credible record.</p>
                </CardContent>
              </Card>
              <Card className="h-full text-center">
                <CardHeader className="flex flex-col items-center gap-4">
                   <FileText className="h-10 w-10 text-primary" />
                   <CardTitle>Digital Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Generate a professional, shareable portfolio of your verified achievements to impress recruiters.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="container mx-auto py-12 md:py-24 lg:py-32 px-4">
          <div className="mx-auto flex max-w-5xl flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Empowering Students & Institutions</h2>
            <p className="max-w-3xl leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              From individual growth to institutional reporting, Ascend is the all-in-one solution.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-5xl">
            <Tabs defaultValue="students" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="students">For Students</TabsTrigger>
                <TabsTrigger value="institutions">For Institutions</TabsTrigger>
              </TabsList>
              <TabsContent value="students" className="mt-12">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                      <TrendingUp className="mb-4 h-10 w-10 text-primary" />
                      <h4 className="font-semibold mb-2">Ace Placements</h4>
                      <p className="text-muted-foreground">Showcase a verified record of your skills to land your dream job.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <ShieldCheck className="mb-4 h-10 w-10 text-primary" />
                      <h4 className="font-semibold mb-2">Simplify Applications</h4>
                      <p className="text-muted-foreground">Easily share your portfolio for higher studies or scholarships.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                       <Users className="mb-4 h-10 w-10 text-primary" />
                       <h4 className="font-semibold mb-2">Track Your Growth</h4>
                      <p className="text-muted-foreground">See your journey and development over your entire college life.</p>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="institutions" className="mt-12">
                 <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
                      <div className="flex flex-col items-center text-center">
                        <TrendingUp className="mb-4 h-10 w-10 text-primary" />
                        <h4 className="font-semibold mb-2">Streamline Accreditation</h4>
                        <p className="text-muted-foreground">Easily generate reports for NBA, NAAC, and other regulatory bodies.</p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <ShieldCheck className="mb-4 h-10 w-10 text-primary" />
                        <h4 className="font-semibold mb-2">Reduce Paperwork</h4>
                        <p className="text-muted-foreground">Digitize the activity verification process, saving time and resources.</p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <Users className="mb-4 h-10 w-10 text-primary" />
                        <h4 className="font-semibold mb-2">Gain Insights</h4>
                        <p className="text-muted-foreground">Understand student engagement with powerful analytics.</p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <Puzzle className="mb-4 h-10 w-10 text-primary" />
                        <h4 className="font-semibold mb-2">Integration Support</h4>
                        <p className="text-muted-foreground">Can link with existing LMS, ERP, or digital university platforms.</p>
                      </div>
                  </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

         {/* Call to Action Section */}
        <section className="w-full bg-primary/5 dark:bg-primary/10 py-12 md:py-24 lg:py-32">
          <div className="container mx-auto flex flex-col items-center gap-4 text-center px-4">
             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Elevate Your Portfolio?</h2>
             <p className="max-w-[700px] text-lg text-muted-foreground">
              Join hundreds of students and institutions who are building their future with Ascend.
            </p>
             <Button asChild size="lg" className="mt-4">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
