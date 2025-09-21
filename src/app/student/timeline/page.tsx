
'use client';

import { useAuth } from '@/context/AuthContext';
import { useActivities } from '@/context/ActivityContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function TimelinePage() {
    const { user } = useAuth();
    const { getStudentActivities } = useActivities();

    if (!user) return null;
    
    const allActivities = getStudentActivities(user.id);

    return (
        <div className="flex flex-1 flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Activity Timeline</h1>
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary"/>
                        Your Journey
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    {allActivities.length > 0 ? (
                        <div className="border-l-2 border-border pl-6 space-y-8 relative">
                            {allActivities.map((activity) => (
                                <div key={activity.id} className="relative">
                                    <div className={`absolute -left-[34px] top-1 h-4 w-4 rounded-full border-2 border-background ${activity.status === 'Approved' ? 'bg-emerald-500' : activity.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                    <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    <p className="font-medium text-sm">{activity.title} <span className="text-muted-foreground font-normal">in {activity.category}</span></p>
                                    <p className="text-xs text-muted-foreground">Status: {activity.status}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-12">
                            <p className="text-muted-foreground">Your activity timeline is empty.</p>
                            <p className="text-sm text-muted-foreground">Start logging activities to see your journey here.</p>
                        </div>
                    )}
                 </CardContent>
            </Card>
        </div>
    )
}
