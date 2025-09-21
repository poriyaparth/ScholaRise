
'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { StatusBadge } from "../shared/StatusBadge";
import { Activity } from "@/lib/mock-data";

interface ActivityDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activity: Activity | null;
}

export function ActivityDetailsModal({ isOpen, setIsOpen, activity }: ActivityDetailsModalProps) {
  if (!activity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{activity.title}</DialogTitle>
          <DialogDescription>
            Category: {activity.category}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-1">Status</h4>
            <StatusBadge status={activity.status} />
          </div>
           <div>
            <h4 className="font-semibold text-sm mb-1">Date</h4>
            <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>
          <Button variant="link" className="p-0 h-auto">View Proof (mock link)</Button>
        </div>
        <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
