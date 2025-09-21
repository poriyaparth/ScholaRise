
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useActivities } from '@/context/ActivityContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Activity } from '@/lib/mock-data';

const activitySchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  category: z.enum(['Internship', 'Certification', 'Volunteering', 'Workshop', 'Leadership']),
  date: z.date({ required_error: 'A date is required.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  proof: z.any().optional(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

interface AddActivityModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activityToEdit?: Activity | null;
  setActivityToEdit?: (activity: Activity | null) => void;
}

export function AddActivityModal({ isOpen, setIsOpen, activityToEdit, setActivityToEdit }: AddActivityModalProps) {
  const { addActivity, updateActivity } = useActivities();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!activityToEdit;

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isEditMode && activityToEdit) {
      form.reset({
        title: activityToEdit.title,
        category: activityToEdit.category,
        date: new Date(activityToEdit.date),
        description: activityToEdit.description,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        date: undefined,
        category: undefined,
      });
    }
  }, [activityToEdit, isEditMode, form]);


  function onSubmit(data: ActivityFormValues) {
    if (!user) return;
    setIsSubmitting(true);
    setTimeout(() => {
      if(isEditMode && activityToEdit) {
        updateActivity(activityToEdit.id, { ...data, date: data.date.toISOString() });
        toast({
          title: 'Activity Updated!',
          description: `${data.title} has been resubmitted for approval.`,
        });
      } else {
        addActivity({ ...data, date: data.date.toISOString() }, user);
        toast({
          title: 'Activity Added!',
          description: `${data.title} has been submitted for approval.`,
        });
      }
      setIsSubmitting(false);
      handleClose();
    }, 1000);
  }

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
    if(setActivityToEdit) {
      setActivityToEdit(null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update the details of your activity and resubmit for verification." 
              : "Fill in the details of your activity to submit for verification."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Internship at TechCorp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Internship', 'Certification', 'Volunteering', 'Workshop', 'Leadership'].map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Activity</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly describe the activity and your role." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proof/Certificate</FormLabel>
                  <FormControl>
                     <Button variant="outline" className="w-full justify-start font-normal gap-2" asChild>
                      <label htmlFor="file-upload">
                        <Upload className="h-4 w-4" />
                        <span>Upload File (mock)</span>
                        <Input id="file-upload" type="file" className="sr-only" />
                      </label>
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Resubmit for Approval' : 'Submit for Approval'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
