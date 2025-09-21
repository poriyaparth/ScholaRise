
'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useActivities } from '@/context/ActivityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Share2, Download, Edit, Save, XCircle, CheckCircle, Upload, Loader2, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Activity, User } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LinkedInPostModal } from '@/components/student/LinkedInPostModal';

export default function MyPortfolioPage() {
  const { user, updateUserProfile } = useAuth();
  const { getStudentActivities } = useActivities();
  const { toast } = useToast();
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || 'alex.j@university.edu');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '+1 234 567 890');
  const [editedProfile, setEditedProfile] = useState(user?.profile || '');
  const [editedSkills, setEditedSkills] = useState(user?.skills?.join(', ') || 'React, Node.js, Python, Project Management, Public Speaking');
  const [editedUniversity, setEditedUniversity] = useState(user?.university || 'State University');
  const [editedYear, setEditedYear] = useState(user?.year || '3rd Year');
  const [editedCgpa, setEditedCgpa] = useState(user?.cgpa || '3.8');
  const [editedAvatarUrl, setEditedAvatarUrl] = useState<string | null>(null);

  // LinkedIn Modal State
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [selectedActivityForLinkedIn, setSelectedActivityForLinkedIn] = useState<Activity | null>(null);


  if (!user) return null;
  
  const approvedActivities = getStudentActivities(user.id).filter(a => a.status === 'Approved');

  const handleShare = () => {
    const publicUrl = `${window.location.origin}/portfolio/${user.id}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: 'Link Copied!',
      description: 'Your public portfolio link has been copied to the clipboard.',
    });
  };

  const handleDownload = async () => {
    const contentToCapture = portfolioRef.current;
    if (!contentToCapture) return;
  
    setIsDownloading(true);
    toast({
      title: 'Generating PDF...',
      description: 'Your portfolio is being prepared for download.',
    });
  
    // Hide all action buttons before capturing
    const actionButtons = contentToCapture.querySelectorAll('.portfolio-action-button');
    actionButtons.forEach(button => ((button as HTMLElement).style.display = 'none'));
  
    try {
        const canvas = await html2canvas(contentToCapture, {
            scale: 2,
            useCORS: true,
            logging: false,
        });
  
        // Show buttons again after capture
        actionButtons.forEach(button => ((button as HTMLElement).style.display = 'inline-flex'));
  
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });
  
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
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
  
        pdf.save(`${user.name}-portfolio.pdf`);
  
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
            variant: "destructive",
            title: "PDF Generation Failed",
            description: "There was an error while generating the PDF. Please try again.",
        });
    } finally {
        actionButtons.forEach(button => ((button as HTMLElement).style.display = 'inline-flex'));
        setIsDownloading(false);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedName(user.name);
      setEditedEmail(user.email || 'alex.j@university.edu');
      setEditedPhone(user.phone || '+1 234 567 890');
      setEditedProfile(user.profile || 'A dedicated and motivated student with a passion for technology and leadership. Experienced in organizing large-scale events and proficient in modern web development frameworks. Eager to apply skills in a challenging professional environment.');
      setEditedSkills(user.skills?.join(', ') || 'React, Node.js, Python, Project Management, Public Speaking');
      setEditedUniversity(user.university || 'State University');
      setEditedYear(user.year || '3rd Year');
      setEditedCgpa(user.cgpa || '3.8');
      setEditedAvatarUrl(null);
    }
    setIsEditing(!isEditing);
  };
  
  const handleSaveChanges = () => {
    const updatedUser: User = {
        ...user,
        name: editedName,
        email: editedEmail,
        phone: editedPhone,
        profile: editedProfile,
        skills: editedSkills.split(',').map(s => s.trim()),
        university: editedUniversity,
        year: editedYear,
        cgpa: editedCgpa,
        avatarUrl: editedAvatarUrl || user.avatarUrl,
    };
    updateUserProfile(updatedUser);
    setIsEditing(false);
    toast({
        title: 'Profile Updated',
        description: 'Your portfolio has been successfully updated.',
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenLinkedInModal = (activity: Activity) => {
    setSelectedActivityForLinkedIn(activity);
    setShowLinkedInModal(true);
  }
  
  const ActivityItem = ({ activity }: { activity: Activity }) => (
    <div className="py-4">
      <div className="flex items-start justify-between">
        <div>
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
        </div>
        <Button className="portfolio-action-button" variant="outline" size="sm" onClick={() => handleOpenLinkedInModal(activity)}>
            <Linkedin className="mr-2 h-4 w-4" />
            Share
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{activity.description}</p>
    </div>
  );

  const currentAvatar = editedAvatarUrl || user.avatarUrl || `https://picsum.photos/seed/${user.id}/150/150`;

  return (
    <>
      <div className="flex flex-1 flex-col gap-4">
        <div id="portfolio-actions" className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">My Portfolio</h1>
            <div className="flex items-center gap-2 portfolio-action-button">
                <Button variant="outline" size="sm" onClick={handleShare}><Share2 className="mr-2 h-4 w-4"/>Copy Link</Button>
                <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                    Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleEditToggle}>
                  {isEditing ? <XCircle className="mr-2 h-4 w-4"/> : <Edit className="mr-2 h-4 w-4" />}
                  {isEditing ? 'Cancel' : 'Edit'}
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
                              <AvatarImage src={currentAvatar} alt={user.name} data-ai-hint="person" />
                              <AvatarFallback>{(editedName || user.name).charAt(0)}</AvatarFallback>
                          </Avatar>
                          {isEditing && (
                            <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full portfolio-action-button" asChild>
                              <label htmlFor="avatar-upload">
                                <Upload className="h-4 w-4" />
                                <Input id="avatar-upload" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*" />
                                <span className="sr-only">Upload new picture</span>
                              </label>
                            </Button>
                          )}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          {isEditing ? (
                              <div className="space-y-2">
                                <Input className="text-2xl font-bold" value={editedName} onChange={e => setEditedName(e.target.value)} placeholder="Your Name" />
                                <Input value={editedEmail} onChange={e => setEditedEmail(e.target.value)} placeholder="your.email@example.com" />
                                <Input value={editedPhone} onChange={e => setEditedPhone(e.target.value)} placeholder="Your Phone Number" />
                              </div>
                            ) : (
                              <div>
                                  <h2 className="text-2xl font-bold">{user.name}</h2>
                                  <p className="text-muted-foreground">{user.email || 'alex.j@university.edu'}</p>
                                  <p className="text-muted-foreground">{user.phone || '+1 234 567 890'}</p>
                              </div>
                          )}
                        </div>
                    </div>

                    <Separator />

                    <div className="py-6">
                        <h3 className="font-semibold mb-2">About</h3>
                        {isEditing ? (
                            <Textarea value={editedProfile} onChange={e => setEditedProfile(e.target.value)} rows={4} />
                        ) : (
                            <p className="text-sm text-muted-foreground break-words">{user.profile || 'A dedicated and motivated student with a passion for technology and leadership. Experienced in organizing large-scale events and proficient in modern web development frameworks. Eager to apply skills in a challenging professional environment.'}</p>
                        )}
                    </div>

                    <Separator />
                    
                    <div className="py-6">
                        <h3 className="font-semibold mb-2">Education</h3>
                        {isEditing ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div><Label>University/College</Label><Input value={editedUniversity} onChange={e => setEditedUniversity(e.target.value)} /></div>
                              <div><Label>Year of Study</Label><Input value={editedYear} onChange={e => setEditedYear(e.target.value)} /></div>
                              <div><Label>Semester CGPA</Label><Input value={editedCgpa} onChange={e => setEditedCgpa(e.target.value)} /></div>
                          </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div><span className="text-muted-foreground">University/College:</span><p>{user.university || 'State University'}</p></div>
                                <div><span className="text-muted-foreground">Year of Study:</span><p>{user.year || '3rd Year'}</p></div>
                                <div><span className="text-muted-foreground">Semester CGPA:</span><p>{user.cgpa || '3.8'}</p></div>
                            </div>
                        )}
                    </div>

                    <Separator />
                    
                    <div className="py-6">
                        <h3 className="font-semibold mb-2">Skills</h3>
                        {isEditing ? (
                            <div>
                                <Label>Skills (comma separated)</Label>
                                <Input value={editedSkills} onChange={e => setEditedSkills(e.target.value)} />
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                              {(user.skills || ['React', 'Node.js', 'Python', 'Project Management', 'Public Speaking']).map(skill => (
                                    <Badge key={skill} variant="secondary" style={{whiteSpace: 'nowrap'}}>
                                      <span style={{ verticalAlign: 'middle' }}>{skill}</span>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {isEditing && (
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleSaveChanges} className="portfolio-action-button">
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    )}
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
                            <p className="text-sm">Add activities and get them approved to see them here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <LinkedInPostModal 
        isOpen={showLinkedInModal}
        setIsOpen={setShowLinkedInModal}
        activity={selectedActivityForLinkedIn}
      />
    </>
  );
}
