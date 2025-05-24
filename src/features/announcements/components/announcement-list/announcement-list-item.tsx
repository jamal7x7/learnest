import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { cn } from '~/lib/utils';
import { Announcement } from '../../types';
import { AnnouncementActions } from './announcement-actions';
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { motion } from 'motion/react';

// Helper function to safely format date
export const formatDateSafely = (dateString: string, fallback = 'Just now') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : fallback;
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
};

interface AnnouncementListItemProps {
  announcement: Announcement;
  isRead: boolean;
  isBookmarked: boolean;
  readCount: number;
  bookmarkCount: number;
  onAnnouncementClick: (id: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  onToggleBookmark: (id: string, isBookmarked: boolean) => void;
}

export function AnnouncementListItem({
  announcement,
  isRead,
  isBookmarked,
  readCount,
  bookmarkCount,
  onAnnouncementClick,
  onToggleRead,
  onToggleBookmark,
}: AnnouncementListItemProps) {
  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.0 }}
      whileTap={{ scale: 0.99 }}
    >
      <div 
        onClick={() => onAnnouncementClick(announcement.id)}
        className="block cursor-pointer focus:outline-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onAnnouncementClick(announcement.id)}
      >
        <Card 
          className={cn(
            "pt-0 pb-0  relative overflow-hidden transition-all duration-300 ease-in-out",
            "bg-card/5  hover:bg-card/30",
            "border border-border/50 hover:border-primary/10",
            "shadow-sm hover:shadow-md",
            "transform transition-transform duration-200 ",
            isRead ? "opacity-90" : "ring-1 ring-primary/20",
            isBookmarked && "ring-1 ring-yellow-400/30"
          )}
          style={{ viewTransitionName: `announcement-card-${announcement.id}` }}
        >
          {/* Read indicator dot */}
          {!isRead && (
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
          
          {/* Bookmark indicator */}
          {isBookmarked && (
            <div className="absolute top-4 right-4 text-yellow-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-sm">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          )}
          
          <CardContent className="p-5 sm:p-6">
            <div className="flex gap-4">
              <motion.div 
                className="shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar 
                  className="w-12 h-12 rounded-xl ring-2 ring-background shadow-sm transition-all duration-300 hover:ring-primary/50"
                  style={{ viewTransitionName: `announcement-avatar-${announcement.id}` }}
                >
                  <AvatarImage
                    src={announcement.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(announcement.author)}`}
                    alt={announcement.author}
                    onError={e => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(announcement.author)}`;
                    }}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-foreground/80">
                    {announcement.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <div 
                className="flex-1 min-w-0"
                style={{ viewTransitionName: `announcement-content-${announcement.id}` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                  <div>
                    <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-1">
                      {announcement.author}
                    </h3>
                    <div className="text-xs text-muted-foreground/80 flex items-center gap-1.5">
                      <span>{formatDateSafely(announcement.date)}</span>
                      {isRead && <span className="text-muted-foreground/50 text-[10px]">• Read</span>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2.5 text-sm text-foreground/90 leading-relaxed line-clamp-3">
                  {announcement.content}
                </div>
              </div>
            </div>
            
            {/* Action bar */}
            <motion.div 
              className="flex items-center justify-between pt-3 mt-3 border-t border-border/30"
              initial={{ opacity: 0.7, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AnnouncementActions
                id={announcement.id}
                isRead={isRead}
                isBookmarked={isBookmarked}
                readCount={readCount}
                bookmarkCount={bookmarkCount}
                commentCount={announcement.comments?.length || 0}
                onToggleRead={onToggleRead}
                onToggleBookmark={onToggleBookmark}
              />
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
