
'use client';

import { useActivities } from '@/context/ActivityContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Pie, PieChart, Cell, Legend, Line, LineChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';
import { mockUsers } from '@/lib/mock-data';
import { format, startOfMonth } from 'date-fns';
import * as XLSX from 'xlsx';
import { useAuth } from '@/context/AuthContext';

const CATEGORY_COLORS: { [key: string]: string } = {
  'Internship': 'hsl(var(--chart-1))',
  'Certification': 'hsl(var(--chart-2))',
  'Volunteering': 'hsl(var(--chart-3))',
  'Workshop': 'hsl(var(--chart-4))',
  'Leadership': 'hsl(var(--chart-5))',
  'Competition': '#A0AEC0',
  'Community Service': '#FBBF24',
  'Conference': '#4FD1C5',
};

export default function AnalyticsPage() {
  const { activities } = useActivities();
  const { user: adminUser } = useAuth();
  const { toast } = useToast();

  const approvedActivities = useMemo(() => activities.filter(a => a.status === 'Approved'), [activities]);

  const activityBreakdown = useMemo(() => {
    const counts = approvedActivities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.keys(counts).map(category => ({
      name: category,
      value: counts[category],
      fill: CATEGORY_COLORS[category] || '#CBD5E0',
    }));
  }, [approvedActivities]);

  const activityBreakdownConfig = useMemo(() => {
    const config: ChartConfig = {};
    activityBreakdown.forEach(item => {
      config[item.name] = { label: item.name, color: item.fill };
    });
    return config;
  }, [activityBreakdown]);

  const activityTrend = useMemo(() => {
    const submissionsByMonth: { [key: string]: number } = {};
    activities.forEach(activity => {
      const month = format(startOfMonth(new Date(activity.date)), 'MMM yyyy');
      submissionsByMonth[month] = (submissionsByMonth[month] || 0) + 1;
    });
    
    const sortedMonths = Object.keys(submissionsByMonth).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedMonths.map(month => ({
      month,
      submissions: submissionsByMonth[month],
    }));
  }, [activities]);

  const departmentPerformance = useMemo(() => {
    const performance: { [key: string]: number } = {};
    approvedActivities.forEach(activity => {
      const student = mockUsers.all.find(u => u.id === activity.studentId);
      if (student && student.branch) {
        performance[student.branch] = (performance[student.branch] || 0) + 1;
      }
    });
    
    return Object.entries(performance).map(([department, count]) => ({
      department,
      count
    })).sort((a,b) => a.count - b.count);
  }, [approvedActivities]);

  const handleExport = (reportType: 'NAAC' | 'NIRF') => {
    toast({
      title: `Generating ${reportType} Report...`,
      description: 'Your data is being compiled for download (mock function).',
    });
  };

  const handleDownloadXLSX = () => {
     toast({
      title: 'Generating Excel Sheet...',
      description: 'Your data is being prepared for download.',
    });

    const dataToExport = approvedActivities.map(activity => {
      const student = mockUsers.all.find(u => u.id === activity.studentId);
      return {
        'Student ID': activity.studentId,
        'Student Name': activity.studentName,
        'Department': student?.branch || 'N/A',
        'Activity Type': activity.category,
        'Activity Name': activity.title,
        'Verification Status': activity.status,
        'Verification Date': new Date(activity.date).toLocaleDateString('en-CA'),
        'Faculty Approver': adminUser?.name || 'Admin'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Verified Activities');
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // Student ID
      { wch: 20 }, // Student Name
      { wch: 25 }, // Department
      { wch: 20 }, // Activity Type
      { wch: 40 }, // Activity Name
      { wch: 15 }, // Verification Status
      { wch: 15 }, // Verification Date
      { wch: 20 }, // Faculty Approver
    ];
    
    XLSX.writeFile(workbook, 'verified-activities.xlsx');
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Institutional Analytics</h1>
        <Card className="w-full md:w-auto">
          <CardHeader className="p-4">
             <CardTitle className="text-base">Report Generation</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
             <div className="flex flex-col sm:flex-row gap-2">
               <Select>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Select Report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="naac">NAAC Report</SelectItem>
                  <SelectItem value="nirf">NIRF Report</SelectItem>
                </SelectContent>
              </Select>
               <Select>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full sm:w-auto" onClick={() => handleExport('NAAC')}>
                <Download className="mr-2 h-4 w-4" />
                Generate
              </Button>
               <Button className="w-full sm:w-auto" onClick={handleDownloadXLSX}>
                <Download className="mr-2 h-4 w-4" />
                Download Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
            <CardDescription>Distribution of all verified activities by category.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activityBreakdownConfig} className="mx-auto aspect-square max-h-[350px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie data={activityBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                   {activityBreakdown.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Activity Submission Trends</CardTitle>
             <CardDescription>Number of total activity submissions per month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={{stroke: 'hsl(var(--border))'}}/>
                <YAxis fontSize={12} tickLine={false} axisLine={{stroke: 'hsl(var(--border))'}}/>
                <Tooltip />
                <Line type="monotone" dataKey="submissions" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }}/>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Total verified activities ranked by academic department.</CardDescription>
        </CardHeader>
        <CardContent>
             <ResponsiveContainer width="100%" height={350}>
                <BarChart data={departmentPerformance} layout="vertical" margin={{ left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="department" type="category" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }}/>
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

    