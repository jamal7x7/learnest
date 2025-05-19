import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { ArrowLeft, CheckCircle2, Bookmark, BookmarkCheck } from "lucide-react";
import { AnnouncementHeaderProps } from "../types";

export function AnnouncementHeader({
  onBack,
  onMarkAsRead,
  onBookmark,
  isRead,
  isBookmarked,
  announcementId,
}: AnnouncementHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        size="icon"
        className="hover:scale-105 transition-transform"
        onClick={onBack}
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hover:scale-105 transition-all duration-300",
                  isRead ? "text-primary" : "text-muted-foreground"
                )}
                onClick={onMarkAsRead}
                aria-label={isRead ? "Marked as read" : "Mark as read"}
                style={{ viewTransitionName: `read-button-${announcementId}` }}
              >
                <CheckCircle2 className={cn(
                  "w-5 h-5 transition-all",
                  isRead ? "fill-primary/20" : ""
                )} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRead ? "Marked as read" : "Mark as read"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hover:scale-105 transition-all duration-300",
                  isBookmarked ? "text-yellow-500" : "text-muted-foreground"
                )}
                onClick={onBookmark}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                style={{ viewTransitionName: `bookmark-button-${announcementId}` }}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 fill-yellow-500/20" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBookmarked ? "Remove bookmark" : "Bookmark"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
