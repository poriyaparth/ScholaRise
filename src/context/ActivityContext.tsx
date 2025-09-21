
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Activity, mockActivities as initialActivities, User } from '@/lib/mock-data';

type ActivityUpdatePayload = Omit<Activity, 'id' | 'studentId' | 'studentName' | 'status'>;

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: ActivityUpdatePayload, user: User) => void;
  updateActivityStatus: (activityId: string, status: 'Approved' | 'Rejected') => void;
  updateActivity: (activityId: string, payload: ActivityUpdatePayload) => void;
  getStudentActivities: (studentId: string) => Activity[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const addActivity = (activity: ActivityUpdatePayload, user: User) => {
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}`,
      studentId: user.id,
      studentName: user.name,
      status: 'Pending',
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const updateActivityStatus = (activityId: string, status: 'Approved' | 'Rejected') => {
    setActivities(prev => 
      prev.map(act => act.id === activityId ? { ...act, status } : act)
    );
  };

  const updateActivity = (activityId: string, payload: ActivityUpdatePayload) => {
    setActivities(prev =>
      prev.map(act => act.id === activityId ? { ...act, ...payload, status: 'Pending' } : act)
    );
  }
  
  const getStudentActivities = (studentId: string) => {
    return activities.filter(act => act.studentId === studentId);
  }

  const value = { activities, addActivity, updateActivityStatus, updateActivity, getStudentActivities };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}
