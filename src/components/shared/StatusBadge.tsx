import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Activity } from '@/lib/mock-data';

interface StatusBadgeProps {
  status: Activity['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border", {
        'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700': status === 'Approved',
        'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700': status === 'Pending',
        'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700': status === 'Rejected',
      })}
    >
      {status}
    </Badge>
  );
}
