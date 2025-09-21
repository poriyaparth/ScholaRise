
'use client';

import { useActivities } from '@/context/ActivityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Activity, mockUsers } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function StudentPortfolioPage({ params }: { params: { studentId: string } }) {
  const { getStudentActivities } = useActivities();
  const { toast } = useToast();
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const student = mockUsers.all.find(u => u.id === params.studentId && u.role === 'student');

  if (!student) {
    notFound();
  }

  const approvedActivities = getStudentActivities(student.id).filter(a => a.status === 'Approved');

  const handleDownload = async () => {
    const contentToCapture = portfolioRef.current;
    if (!contentToCapture) return;

    setIsDownloading(true);
    toast({
      title: 'Generating PDF...',
      description: `${student.name}'s portfolio is being prepared for download.`,
    });
    
    const actionsElement = document.getElementById('portfolio-actions');
    if (actionsElement) (actionsElement as HTMLElement).style.display = 'none';

    try {
      const canvas = await html2canvas(contentToCapture, {
          scale: 2,
          useCORS: true,
          logging: false,
      });

      if (actionsElement) (actionsElement as HTMLElement).style.display = 'flex';

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      let finalImgWidth = pdfWidth;
      let finalImgHeight = pdfWidth / ratio;
      
      let heightLeft = finalImgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, finalImgWidth, finalImgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - finalImgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, finalImgWidth, finalImgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${student.name}-portfolio.pdf`);
    } catch(error) {
        console.error("Error generating PDF:", error);
        toast({
            variant: "destructive",
            title: "PDF Generation Failed",
            description: "There was an error while generating the PDF. Please try again.",
        })
    } finally {
        if (actionsElement) (actionsElement as HTMLElement).style.display = 'flex';
        setIsDownloading(false);
    }
  };

  const ActivityItem = ({ activity }: { activity: Activity }) => (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-semibold">{activity.title}</h4>
        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700" style={{whiteSpace: 'nowrap'}}>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', verticalAlign: 'middle' }}>
             <CheckCircle className="h-3 w-3" />
             <span>Verified</span>
           </div>
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{activity.category} • {new Date(activity.date).toLocaleDateString('en-CA')}</p>
      <p className="text-sm text-muted-foreground">{activity.description}</p>
    </div>
  );

  const avatarUrl = student.avatarUrl || `https://picsum.photos/seed/${student.id}/150/150`;

  return (
    <div className="flex flex-1 flex-col gap-4">
       <div id="portfolio-actions" className="flex flex-wrap items-center justify-between gap-4">
         <div>
          <Button variant="ghost" asChild>
            <Link href="/admin/leaderboard">&larr; Back to Leaderboard</Link>
          </Button>
          <h1 className="text-lg font-semibold md:text-2xl mt-2">{student.name}'s Professional Portfolio</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download PDF
          </Button>
        </div>
      </div>
      
       <div ref={portfolioRef}>
        <div id="portfolio-content">
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
                      <p className="text-sm text-muted-foreground break-words">{student.profile || 'A dedicated and motivated student with a passion for technology and leadership. Experienced in organizing large-scale events and proficient in modern web development frameworks. Eager to apply skills in a challenging professional environment.'}</p>
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
                              <Badge key={skill} variant="secondary" style={{whiteSpace: 'nowrap'}}>
                                <span style={{ verticalAlign: 'middle' }}>{skill}</span>
                              </Badge>
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
      </div>
    </div>
  );
}
