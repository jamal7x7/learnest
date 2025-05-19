import { cn } from "~/lib/utils";
import { StatusAnimationProps } from "../types";
import { CheckCircle2, Bookmark, BookmarkCheck } from "lucide-react";

export function StatusAnimation({ show, children, className }: StatusAnimationProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className={cn("rounded-full p-8 animate-pulse-fade backdrop-blur-sm", className)}>
        {children}
      </div>
    </div>
  );
}

export function ReadStatusAnimation({ show }: { show: boolean }) {
  return (
    <StatusAnimation show={show} className="bg-primary/20">
      <CheckCircle2 className="w-16 h-16 text-primary animate-bounce-subtle" />
    </StatusAnimation>
  );
}

export function BookmarkStatusAnimation({ 
  show, 
  isBookmarked 
}: { 
  show: boolean; 
  isBookmarked: boolean 
}) {
  return (
    <StatusAnimation 
      show={show} 
      className={isBookmarked ? "bg-yellow-500/20" : "bg-muted/20"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-16 h-16 text-yellow-500 animate-bounce-subtle" />
      ) : (
        <Bookmark className="w-16 h-16 text-muted-foreground animate-bounce-subtle" />
      )}
    </StatusAnimation>
  );
}
