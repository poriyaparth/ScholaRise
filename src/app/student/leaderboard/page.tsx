
'use client';

import { useActivities } from '@/context/ActivityContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { useMemo } from 'react';
import { mockUsers } from '@/lib/mock-data';

interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  approvedCount: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { activities } = useActivities();

  const leaderboardData: LeaderboardEntry[] = useMemo(() => {
    const studentScores: { [key: string]: { name: string; score: number } } = {};

    const allStudents = mockUsers.all.filter(u => u.role === 'student');
    allStudents.forEach(student => {
      studentScores[student.id] = { name: student.name, score: 0 };
    });

    activities.forEach(activity => {
      if (activity.status === 'Approved' && studentScores[activity.studentId]) {
        studentScores[activity.studentId].score += 1;
      }
    });

    const sortedStudents = Object.entries(studentScores)
      .map(([studentId, data]) => ({
        studentId,
        studentName: data.name,
        approvedCount: data.score,
      }))
      .sort((a, b) => b.approvedCount - a.approvedCount);

    // Simple sequential ranking
    return sortedStudents.map((student, index) => ({
      ...student,
      rank: index + 1
    }));
  }, [activities]);

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-yellow-700" />;
      default:
        return null;
    }
  };

  // Debug: Log the leaderboard data
  console.log('Leaderboard Data:', leaderboardData);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Leaderboard</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Approved Activities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow key={entry.studentId}>
                  <TableCell className="font-bold text-lg">
                    <div className="flex items-center gap-2">
                       {getMedal(entry.rank) || <span className="w-5"></span>}
                       <span className="text-foreground">{entry.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.studentName}`} alt={entry.studentName} />
                        <AvatarFallback>{entry.studentName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{entry.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-lg">{entry.approvedCount}</TableCell>
                </TableRow>
              ))}
               {leaderboardData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">No activities approved yet. Be the first!</TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
