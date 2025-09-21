'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { generateLinkedInPost } from "@/ai/flows/generate-linkedin-post";
import { Loader2, Wand2, Copy, Linkedin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Activity } from "@/lib/mock-data";

interface LinkedInPostModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activity: Activity | null;
}

export function LinkedInPostModal({ isOpen, setIsOpen, activity }: LinkedInPostModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [postText, setPostText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activity && user) {
        handleGeneratePost();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activity, user]);


  const handleGeneratePost = async () => {
    if (!activity || !user) return;
    setIsLoading(true);
    setError(null);
    setPostText('');
    try {
      const result = await generateLinkedInPost({
        activityTitle: activity.title,
        activityCategory: activity.category,
        activityDescription: activity.description,
        studentName: user.name,
      });
      setPostText(result.postText);
    } catch (e) {
      console.error(e);
      setError("Failed to generate post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(postText);
    toast({
        title: "Copied to Clipboard",
        description: "The LinkedIn post has been copied.",
    });
  }
  
  const handlePostOnLinkedIn = () => {
    const text = encodeURIComponent(postText);
    // This will open a new tab with the LinkedIn post composer pre-filled with the text.
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, '_blank');
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share on LinkedIn</DialogTitle>
          <DialogDescription>
            Here's a draft post for your activity: "{activity?.title}". You can edit it before posting.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoading && postText && (
            <Textarea 
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                rows={10}
                className="text-sm"
            />
          )}
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <Button type="button" onClick={handleGeneratePost} disabled={isLoading} variant="outline">
                <Wand2 className="mr-2 h-4 w-4" />
                Regenerate
            </Button>
            <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={handleCopyToClipboard} disabled={!postText}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Post
                </Button>
                <Button type="button" onClick={handlePostOnLinkedIn} disabled={!postText}>
                  <Linkedin className="mr-2 h-4 w-4" />
                  Post on LinkedIn
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
