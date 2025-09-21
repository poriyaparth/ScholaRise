
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useActivities } from '@/context/ActivityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AddActivityModal } from '@/components/student/AddActivityModal';
import { ActivityDetailsModal } from '@/components/student/ActivityDetailsModal';
import { Activity } from '@/lib/mock-data';

type StatusFilter = 'All' | Activity['status'];

export default function MyActivitiesPage() {
  const { user } = useAuth();
  const { getStudentActivities } = useActivities();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('All');

  if (!user) return null;

  const studentActivities = getStudentActivities(user.id);
  
  const filteredActivities = studentActivities.filter(activity => 
    filter === 'All' || activity.status === filter
  );
  
  const filters: StatusFilter[] = ['All', 'Pending', 'Approved', 'Rejected'];

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetailsModal(true);
  };
  
  const handleEdit = (activity: Activity) => {
    setActivityToEdit(activity);
    setShowAddModal(true);
  };
  
  const handleAddNew = () => {
    setActivityToEdit(null);
    setShowAddModal(true);
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">My Activities Log</h1>
          <Button size="sm" onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Activity
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Activities</CardTitle>
            <CardDescription>A complete log of your extracurricular involvement.</CardDescription>
            <div className="flex items-center space-x-2 pt-4">
              {filters.map(f => (
                <Button 
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map(activity => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={activity.status} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(activity)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      {activity.status === 'Rejected' && (
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(activity)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit Activity</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No activities match the filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <AddActivityModal 
        isOpen={showAddModal} 
        setIsOpen={setShowAddModal}
        activityToEdit={activityToEdit}
        setActivityToEdit={setActivityToEdit}
      />
      <ActivityDetailsModal
        isOpen={showDetailsModal}
        setIsOpen={setShowDetailsModal}
        activity={selectedActivity}
      />
    </>
  );
}
