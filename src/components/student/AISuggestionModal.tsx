'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { suggestActivity, SuggestActivityOutput } from "@/ai/flows/ai-suggest-activity";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AISuggestionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AISuggestionModal({ isOpen, setIsOpen }: AISuggestionModalProps) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<SuggestActivityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggest = async () => {
    if (!user?.profile) return;
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await suggestActivity({
        studentProfile: user.profile,
        numberOfSuggestions: 3,
      });
      setSuggestions(result);
    } catch (e) {
      console.error(e);
      setError("Failed to get suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Activity Suggester</DialogTitle>
          <DialogDescription>
            Let our AI suggest activities based on your profile to enhance your portfolio.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {!suggestions && !isLoading && (
            <div className="text-center p-4 border-dashed border-2 rounded-lg">
              <p className="text-sm text-muted-foreground">Click the button below to generate suggestions.</p>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {suggestions && (
            <div className="space-y-4">
              {suggestions.suggestions.map((suggestion, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{suggestion.title}</CardTitle>
                    <CardDescription>{suggestion.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between gap-2">
            <Button type="button" onClick={handleSuggest} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                )}
                {suggestions ? 'Regenerate' : 'Generate Suggestions'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Minimal Card components for use within the modal
function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="rounded-lg border bg-card text-card-foreground shadow-sm" {...props}>{children}</div>
}
function CardHeader({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="flex flex-col space-y-1.5 p-4" {...props}>{children}</div>
}
function CardTitle({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className="text-lg font-semibold leading-none tracking-tight" {...props}>{children}</h3>
}
function CardDescription({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className="text-sm text-muted-foreground" {...props}>{children}</p>
}
function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className="p-4 pt-0" {...props}>{children}</div>
  }
