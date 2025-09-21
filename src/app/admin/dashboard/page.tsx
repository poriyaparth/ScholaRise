
'use client';

import { useActivities } from "@/context/ActivityContext";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/shared/StatCard";
import { Users, Clock, ListChecks } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/mock-data";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { activities } = useActivities();

  const pendingActivities = activities.filter(a => a.status === 'Pending');
  const totalStudents = mockUsers.all.filter(u => u.role === 'student').length;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Administrator Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Pending Approvals" value={pendingActivities.length} icon={Clock} description="Activities awaiting review" />
        <StatCard title="Total Students" value={totalStudents} icon={Users} description="Active students on the platform" />
        <StatCard title="Total Activities Logged" value={activities.length} icon={ListChecks} description="Across all students" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Approval Queue Preview</CardTitle>
          <CardDescription>A list of the 5 most recent activities with status: 'Pending'.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingActivities.slice(0, 5).map(activity => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.studentName}</TableCell>
                  <TableCell className="font-medium">{activity.title}</TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>
                    <StatusBadge status={activity.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                       <Link href="/admin/approvals">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {pendingActivities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">No pending approvals.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
