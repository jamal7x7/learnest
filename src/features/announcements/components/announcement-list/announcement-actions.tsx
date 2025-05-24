import { Button } from '~/components/ui/button';
import { CheckCircle2, BookmarkCheck, MessageSquare, Bookmark as BookmarkIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [isMounted, setIsMounted] = useState(false);

  // Skip initial animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleRead = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsReadAnimating(true);
    setTimeout(() => setIsReadAnimating(false), 300);
    
    onToggleRead(id, isRead);
  };

  const handleToggleBookmark = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsBookmarkAnimating(true);
    setTimeout(() => setIsBookmarkAnimating(false), 300);
    
    onToggleBookmark(id, isBookmarked);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: (e: React.KeyboardEvent) => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action(e);
    }
  };

  return (
    <div className="flex items-center gap-4 sm:gap-5">
      {/* Read status with counter */}
      <motion.div 
        className="relative"
        initial={isMounted ? { opacity: 0, x: -5 } : { opacity: 1, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative flex items-center gap-1.5 px-2 py-1.5 h-8 rounded-md transition-all",
            "hover:bg-primary/5 active:bg-primary/10",
            isRead ? "text-primary" : "text-muted-foreground hover:text-primary",
            isRead && "font-medium"
          )}
          onClick={handleToggleRead}
          onKeyDown={(e) => handleKeyDown(e, () => handleToggleRead(e))}
          aria-label={isRead ? "Mark as unread" : "Mark as read"}
          style={{ viewTransitionName: `read-button-${id}` }}
        >
          <AnimatePresence mode="wait">
            <motion.span 
              key={isRead ? 'read' : 'unread'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center"
            >
              {isRead ? (
                <CheckCircle2 className="w-4 h-4 fill-primary/10 text-primary" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </motion.span>
          </AnimatePresence>
          <motion.span 
            className={cn(
              "text-xs font-medium tabular-nums transition-colors",
              isRead ? "text-primary" : "text-muted-foreground"
            )}
          >
            {readCount}
          </motion.span>
          {isReadAnimating && (
            <motion.span 
              className="absolute inset-0 rounded-md bg-primary/10"
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </Button>
      </motion.div>
      
      {/* Bookmark status with counter */}
      <motion.div 
        className="relative"
        initial={isMounted ? { opacity: 0, x: -5 } : { opacity: 1, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative flex items-center gap-1.5 px-2 py-1.5 h-8 rounded-md transition-all",
            "hover:bg-yellow-500/5 active:bg-yellow-500/10",
            isBookmarked ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500",
            isBookmarked && "font-medium"
          )}
          onClick={handleToggleBookmark}
          onKeyDown={(e) => handleKeyDown(e, () => handleToggleBookmark(e))}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          style={{ viewTransitionName: `bookmark-button-${id}` }}
        >
          <AnimatePresence mode="wait">
            <motion.span 
              key={isBookmarked ? 'bookmarked' : 'unbookmarked'}
              initial={{ scale: 0.8, opacity: 0, y: -2 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 2 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-yellow-500/10 text-yellow-500" />
              ) : (
                <BookmarkIcon className="w-4 h-4" />
              )}
            </motion.span>
          </AnimatePresence>
          <motion.span 
            className={cn(
              "text-xs font-medium tabular-nums transition-colors",
              isBookmarked ? "text-yellow-500" : "text-muted-foreground"
            )}
          >
            {bookmarkCount}
          </motion.span>
          {isBookmarkAnimating && (
            <motion.span 
              className="absolute inset-0 rounded-md bg-yellow-500/10"
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </Button>
      </motion.div>
      
      {/* Comments counter with icon */}
      {commentCount > 0 && (
        <motion.div
          className="relative"
          initial={isMounted ? { opacity: 0, x: -5 } : { opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "group relative flex items-center gap-1.5 px-2 py-1.5 h-8 rounded-md transition-colors",
              "hover:bg-primary/5 hover:text-primary text-muted-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            aria-label={`${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`}
          >
            <MessageSquare className={cn(
              "w-4 h-4 transition-transform group-hover:scale-110",
              commentCount > 0 ? "text-primary/90" : ""
            )} />
            <motion.span 
              className={cn(
                "text-xs font-medium tabular-nums transition-colors",
                commentCount > 0 ? "text-primary" : "text-muted-foreground"
              )}
            >
              {commentCount}
            </motion.span>
            {commentCount > 0 && (
              <motion.span 
                className="absolute inset-0 rounded-md bg-primary/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
