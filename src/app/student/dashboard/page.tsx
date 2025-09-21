
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useActivities } from '@/context/ActivityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Lightbulb, Check, Clock, MessageCircle } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AddActivityModal } from '@/components/student/AddActivityModal';
import { AISuggestionModal } from '@/components/student/AISuggestionModal';
import { Chatbot } from '@/components/student/Chatbot';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getStudentActivities } = useActivities();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAISuggestionModal, setShowAISuggestionModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  if (!user) return null;

  const studentActivities = getStudentActivities(user.id);
  const approvedCount = studentActivities.filter(a => a.status === 'Approved').length;
  const pendingCount = studentActivities.filter(a => a.status === 'Pending').length;
  const recentActivities = studentActivities.slice(0, 5);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-lg font-semibold md:text-2xl">Welcome, {user.name}!</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowAISuggestionModal(true)}>
              <Lightbulb className="mr-2 h-4 w-4" />
              AI Suggestions
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Activity
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Activities Logged" value={studentActivities.length} icon={PlusCircle} />
          <StatCard title="Approved Activities" value={approvedCount} icon={Check} />
          <StatCard title="Pending Approvals" value={pendingCount} icon={Clock} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your 5 most recently added activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell>{activity.category}</TableCell>
                      <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={activity.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentActivities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">No activities logged yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <AddActivityModal isOpen={showAddModal} setIsOpen={setShowAddModal} />
      <AISuggestionModal isOpen={showAISuggestionModal} setIsOpen={setShowAISuggestionModal} />
      <Chatbot isOpen={showChatbot} setIsOpen={setShowChatbot} />
      
      {!showChatbot && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
                onClick={() => setShowChatbot(true)}
              >
                <MessageCircle className="h-7 w-7" />
                <span className="sr-only">Open Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chatbot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
