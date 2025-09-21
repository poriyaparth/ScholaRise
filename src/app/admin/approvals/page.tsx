'use client';

import { useState } from 'react';
import { useActivities } from "@/context/ActivityContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Check, Loader2, X, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Activity } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { verifyCertificate } from '@/ai/flows/verify-certificate';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


export default function ApprovalQueuePage() {
  const { activities, updateActivityStatus } = useActivities();
  const { toast } = useToast();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // 'approve' or 'reject'
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);

  const pendingActivities = activities.filter(a => a.status === 'Pending');

  const handleUpdate = (status: 'Approved' | 'Rejected') => {
    if (!selectedActivity) return;
    setIsUpdating(status.toLowerCase());
    setTimeout(() => {
      updateActivityStatus(selectedActivity.id, status);
      setIsUpdating(null);
      setSelectedActivity(null);
      toast({
        title: `Activity ${status}`,
        description: `"${selectedActivity.title}" has been ${status.toLowerCase()}.`,
      });
    }, 1000);
  }
  
  const handleAutoVerify = async () => {
    if (pendingActivities.length === 0) {
       toast({ title: 'No pending activities to verify.' });
       return;
    }

    setIsAutoVerifying(true);
    toast({
      title: 'Auto-Verification Started...',
      description: `Analyzing ${pendingActivities.length} pending activities.`,
    });

    let approvedCount = 0;
    let flaggedCount = 0;

    for (const activity of pendingActivities) {
        try {
            // Create a mock certificate data URI. In a real app, this would come from the activity's proof upload.
            // This mock content is designed to pass verification for demonstration.
            const mockCertificateText = `Certificate of Completion awarded to ${activity.studentName} for successfully finishing the course: ${activity.title}`;
            const mockCertificateDataUri = `data:text/plain;base64,${Buffer.from(mockCertificateText).toString('base64')}`;

            const result = await verifyCertificate({
                activityTitle: activity.title,
                studentName: activity.studentName,
                certificateDataUri: mockCertificateDataUri,
            });

            if (result.recommendation === 'Approve' && result.confidenceScore > 0.9) {
                updateActivityStatus(activity.id, 'Approved');
                approvedCount++;
            } else {
                flaggedCount++;
            }
        } catch (error) {
            console.error(`Failed to verify activity ${activity.id}:`, error);
            flaggedCount++;
        }
    }

    setIsAutoVerifying(false);
    toast({
      title: 'Auto-Verification Complete',
      description: `${approvedCount} activities automatically approved. ${flaggedCount} activities still require manual review.`,
    });
  }

  const handleOpenDialog = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseDialog = () => {
    setSelectedActivity(null);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Activity Approval Management</h1>
        <Button onClick={handleAutoVerify} disabled={isAutoVerifying || pendingActivities.length === 0}>
            {isAutoVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Auto-Verify Pending ({pendingActivities.length})
        </Button>
      </div>
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && handleCloseDialog()}>
        <Card>
          <CardHeader>
            <CardTitle>Approval Queue</CardTitle>
            <CardDescription>Review and approve or reject student-submitted activities.</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingActivities.length === 0 && !isAutoVerifying && (
                <div className="py-10">
                    <Alert>
                        <Check className="h-4 w-4" />
                        <AlertTitle>All Caught Up!</AlertTitle>
                        <AlertDescription>There are no pending activities to review.</AlertDescription>
                    </Alert>
                </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Activity Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingActivities.map(activity => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.studentName}</TableCell>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DialogTrigger asChild>
                         <Button variant="outline" size="sm" onClick={() => handleOpenDialog(activity)}>Review</Button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingActivities.length > 0 && isAutoVerifying && (
                     <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>AI is verifying activities...</span>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedActivity?.title}</DialogTitle>
            <DialogDescription>
              Submitted by {selectedActivity?.studentName} under {selectedActivity?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{selectedActivity?.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Date</h4>
              <p className="text-sm text-muted-foreground">{selectedActivity ? new Date(selectedActivity.date).toLocaleDateString() : ''}</p>
            </div>
            <Button variant="link" className="p-0 h-auto">View Proof (mock link)</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={!!isUpdating}>Cancel</Button>
            <Button 
              variant="destructive"
              onClick={() => handleUpdate('Rejected')}
              disabled={!!isUpdating}
            >
              {isUpdating === 'rejected' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
              Reject
            </Button>
            <Button 
              onClick={() => handleUpdate('Approved')}
              disabled={!!isUpdating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isUpdating === 'approved' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
