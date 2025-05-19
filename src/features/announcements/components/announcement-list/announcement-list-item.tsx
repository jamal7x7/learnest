import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { cn } from '~/lib/utils';
import { Announcement } from '../../types';
import { AnnouncementActions } from './announcement-actions';

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
    <div className="relative group">
      <div 
        onClick={() => onAnnouncementClick(announcement.id)}
        className="block cursor-pointer"
      >
        <Card 
          className={cn(
            "pb-0 pt-0 border-[1px]  bg-background/80 hover:bg-accent/20  w-full sm:w-2xl cursor-pointer hover:shadow-xs hover:scale-[1.00] transition-all duration-200 animate-slide-in announcement-card-hover",
            isRead ? "border-1 border-primary/30" : "",
            isBookmarked ? "border-1 border-yellow-500/30" : ""
          )}
          style={{ viewTransitionName: `announcement-card-${announcement.id}` }}
        >
          <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Avatar 
                className="rounded-xl w-12 h-12 ring-2 ring-primary/10 transition-all duration-300 avatar-hover"
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
                />
                <AvatarFallback>
                  {announcement.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div 
                className="flex-1 space-y-2"
                style={{ viewTransitionName: `announcement-content-${announcement.id}` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-lg">{announcement.author}</div>
                    <div className="text-xs text-muted-foreground">{announcement.date}</div>
                  </div>
                </div>
                <div className="mt-2 line-clamp-3 text-sm sm:text-base">{announcement.content}</div>
              </div>
            </div>
            
            {/* Action bar */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-muted/30">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
