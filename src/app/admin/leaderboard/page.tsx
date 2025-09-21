
'use client';

import { useActivities } from '@/context/ActivityContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Eye, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { mockUsers } from '@/lib/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  approvedCount: number;
  rank: number;
}

export default function AdminLeaderboardPage() {
  const { activities } = useActivities();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  const leaderboardData: LeaderboardEntry[] = useMemo(() => {
    const studentScores: { [key: string]: { name: string; score: number } } = {};

    // Filter students based on search and filter criteria
    const filteredStudents = mockUsers.all.filter(u => {
        if (u.role !== 'student') return false;
        
        const nameMatch = u.name.toLowerCase().includes(searchQuery.toLowerCase());
        const branchMatch = selectedBranch === 'All' || u.branch === selectedBranch;
        const yearMatch = selectedYear === 'All' || u.year === selectedYear;

        return nameMatch && branchMatch && yearMatch;
    });

    // Initialize scores for filtered students
    filteredStudents.forEach(student => {
      studentScores[student.id] = { name: student.name, score: 0 };
    });
    
    // Calculate scores from approved activities for the filtered students
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
  }, [activities, searchQuery, selectedBranch, selectedYear]);

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
  
  const uniqueBranches = ['All', ...Array.from(new Set(mockUsers.all.filter(u => u.role === 'student' && u.branch).map(u => u.branch!)))];
  const uniqueYears = ['All', ...Array.from(new Set(mockUsers.all.filter(u => u.role === 'student' && u.year).map(u => u.year!)))];


  // Debug: Log the leaderboard data
  console.log('Admin Leaderboard Data:', leaderboardData);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Student Leaderboard</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Overall Rankings</CardTitle>
          <CardDescription> </CardDescription>
           <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8 sm:w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Branch" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueBranches.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Year" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueYears.map(year => (
                     <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Approved Activities</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="font-semibold text-lg">{entry.approvedCount}</TableCell>
                   <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                       <Link href={`/admin/portfolio/${entry.studentId}`}>
                        <Eye className="mr-2 h-4 w-4" />
                         View Portfolio
                       </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {leaderboardData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">No students found matching your criteria.</TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
