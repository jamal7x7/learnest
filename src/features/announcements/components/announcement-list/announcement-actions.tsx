import { Button } from '~/components/ui/button';
import { CheckCircle2, Bookmark, BookmarkCheck, MessageSquare } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useState } from 'react';

interface AnnouncementActionsProps {
  id: string;
  isRead: boolean;
  isBookmarked: boolean;
  readCount: number;
  bookmarkCount: number;
  commentCount: number;
  onToggleRead: (id: string, isRead: boolean) => void;
  onToggleBookmark: (id: string, isBookmarked: boolean) => void;
}

export function AnnouncementActions({
  id,
  isRead,
  isBookmarked,
  readCount,
  bookmarkCount,
  commentCount,
  onToggleRead,
  onToggleBookmark,
}: AnnouncementActionsProps) {
  const [isReadAnimating, setIsReadAnimating] = useState(false);
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false);

  const handleToggleRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsReadAnimating(true);
    setTimeout(() => setIsReadAnimating(false), 300);
    
    onToggleRead(id, isRead);
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsBookmarkAnimating(true);
    setTimeout(() => setIsBookmarkAnimating(false), 300);
    
    onToggleBookmark(id, isBookmarked);
  };

  return (
    <div className="flex items-center gap-6">
      {/* Read status with counter */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-1.5 p-1 rounded-md transition-all hover:scale-105",
          isRead ? "text-primary" : "text-muted-foreground hover:text-primary",
          isReadAnimating ? "animate-ping" : ""
        )}
        onClick={handleToggleRead}
        aria-label={isRead ? "Mark as unread" : "Mark as read"}
        style={{ viewTransitionName: `read-button-${id}` }}
      >
        <CheckCircle2 className={cn(
          "w-4 h-4 transition-all",
          isRead ? "fill-primary/20" : ""
        )} />
        <span className="text-xs font-medium">{readCount}</span>
      </Button>
      
      {/* Bookmark status with counter */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-1.5 p-1 rounded-md transition-all hover:scale-105",
          isBookmarked ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500",
          isBookmarkAnimating ? "animate-ping" : ""
        )}
        onClick={handleToggleBookmark}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
        style={{ viewTransitionName: `bookmark-button-${id}` }}
      >
        {isBookmarked ? (
          <BookmarkCheck className="w-4 h-4 fill-yellow-500/20" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
        <span className="text-xs font-medium">{bookmarkCount}</span>
      </Button>
      
      {/* Comments counter with icon */}
      {commentCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 p-1 rounded-md transition-all hover:scale-105 text-muted-foreground hover:text-primary"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={`${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`}
        >
          <MessageSquare className={cn(
            "w-4 h-4 transition-all",
            commentCount > 0 ? "animate-pulse" : ""
          )} />
          <span className="text-xs font-medium">{commentCount}</span>
        </Button>
      )}
    </div>
  );
}
