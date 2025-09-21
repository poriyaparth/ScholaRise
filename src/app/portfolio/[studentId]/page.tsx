
'use client';

import React from 'react';
import { useActivities } from '@/context/ActivityContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, mockUsers, User } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';

function PublicPortfolioPage({ params }: { params: { studentId: string } }) {
  const { getStudentActivities } = useActivities();
  const { studentId } = params;

  const student = mockUsers.all.find(u => u.id === studentId) as User | undefined;

  if (!student) {
    notFound();
  }
  
  const approvedActivities = getStudentActivities(student.id).filter(a => a.status === 'Approved');
  
  const ActivityItem = ({ activity }: { activity: Activity }) => (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-semibold">{activity.title}</h4>
        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700">
           <CheckCircle className="mr-1 h-3 w-3" />
           Verified
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{activity.category} • {new Date(activity.date).toLocaleDateString('en-CA')}</p>
      <p className="text-sm text-muted-foreground">{activity.description}</p>
    </div>
  );
  
  const avatarUrl = student.avatarUrl || `https://picsum.photos/seed/${student.id}/150/150`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <Card>
              <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarUrl} alt={student.name} data-ai-hint="person" />
                            <AvatarFallback>{(student.name).charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                          <div>
                              <h2 className="text-2xl font-bold">{student.name}</h2>
                              <p className="text-muted-foreground">{student.email || 'alex.j@university.edu'}</p>
                              <p className="text-muted-foreground">{student.phone || '+1 234 567 890'}</p>
                          </div>
                      </div>
                  </div>

                  <Separator />

                  <div className="py-6">
                      <h3 className="font-semibold mb-2">About</h3>
                      <p className="text-sm text-muted-foreground">{student.profile || 'A dedicated and motivated student with a passion for technology and leadership. Experienced in organizing large-scale events and proficient in modern web development frameworks. Eager to apply skills in a challenging professional environment.'}</p>
                  </div>

                  <Separator />
                  
                  <div className="py-6">
                      <h3 className="font-semibold mb-2">Education</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div><span className="text-muted-foreground">University/College:</span><p>{student.university || 'State University'}</p></div>
                          <div><span className="text-muted-foreground">Year of Study:</span><p>{student.year || '3rd Year'}</p></div>
                          <div><span className="text-muted-foreground">Semester CGPA:</span><p>{student.cgpa || '3.8'}</p></div>
                      </div>
                  </div>

                  <Separator />
                  
                  <div className="py-6">
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                         {(student.skills || ['React', 'Node.js', 'Python', 'Project Management', 'Public Speaking']).map(skill => (
                              <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                      </div>
                  </div>
              </CardContent>
          </Card>

          <Card className="mt-4">
              <CardHeader>
                  <CardTitle>Academic Approved & Verified Activity</CardTitle>
              </CardHeader>
              <CardContent>
                  {approvedActivities.length > 0 ? (
                      <div className="divide-y">
                          {approvedActivities.map(activity => <ActivityItem key={activity.id} activity={activity} />)}
                      </div>
                  ) : (
                      <div className="text-center py-12 text-muted-foreground">
                          <p>No verified activities yet.</p>
                      </div>
                  )}
              </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PublicPortfolioPage;
