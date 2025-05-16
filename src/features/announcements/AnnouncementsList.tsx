import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Bookmark, BookmarkCheck, CheckCircle2 } from 'lucide-react';
import * as React from 'react';
import { ANNOUNCEMENTS } from './data/announcements';
import { cn } from '../../lib/utils';

export function AnnouncementsList() {
  // Track read and bookmarked announcements in local state
  const [readAnnouncements, setReadAnnouncements] = React.useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('readAnnouncements');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [bookmarkedAnnouncements, setBookmarkedAnnouncements] = React.useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('bookmarkedAnnouncements');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Save to localStorage when state changes
  React.useEffect(() => {
    localStorage.setItem('readAnnouncements', JSON.stringify(readAnnouncements));
  }, [readAnnouncements]);
  
  React.useEffect(() => {
    localStorage.setItem('bookmarkedAnnouncements', JSON.stringify(bookmarkedAnnouncements));
  }, [bookmarkedAnnouncements]);
  
  React.useEffect(() => {
    document.body.classList.add('fade-in');
    return () => document.body.classList.remove('fade-in');
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 announcements-container">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">Announcements</h1>
      <div className="flex flex-col gap-4 animate-fade-in-scale">
        {ANNOUNCEMENTS.map((a) => {
          const isRead = readAnnouncements[a.id];
          const isBookmarked = bookmarkedAnnouncements[a.id];
          
          return (
            <div key={a.id} className="relative group">
              <Link
                to="/announcements/$announcementId"
                params={{ 
                  announcementId: a.id,
                }}
                className="block"
              >
                <Card 
                  className={cn(
                    "w-full sm:min-w-[42rem] cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 animate-slide-in announcement-card-hover",
                    isRead ? "border-l-4 border-primary/30" : "",
                    isBookmarked ? "border-r-4 border-yellow-500/30" : ""
                  )}
                  style={{ viewTransitionName: `announcement-card-${a.id}` }}
                >
              <CardContent className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                <Avatar 
                  className="w-12 h-12 ring-2 ring-primary/10 transition-all duration-300 avatar-hover"
                  style={{ viewTransitionName: `announcement-avatar-${a.id}` }}
                >
                  <AvatarImage
                    src={a.avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(a.author)}`}
                    alt={a.author}
                    onError={e => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(a.author)}`;
                    }}
                  />
                  <AvatarFallback>
                    {a.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="flex-1 space-y-2"
                  style={{ viewTransitionName: `announcement-content-${a.id}` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-semibold text-lg">{a.author}</div>
                        <div className="text-xs text-muted-foreground">{a.date}</div>
                      </div>
                      
                      {/* Status indicators */}
                      <div className="flex gap-1 ml-2">
                        {isRead && (
                          <div 
                            className="text-primary animate-fade-in" 
                            style={{ viewTransitionName: `read-indicator-${a.id}` }}
                          >
                            <CheckCircle2 className="w-4 h-4 fill-primary/20" />
                          </div>
                        )}
                        {isBookmarked && (
                          <div 
                            className="text-yellow-500 animate-fade-in" 
                            style={{ viewTransitionName: `bookmark-indicator-${a.id}` }}
                          >
                            <BookmarkCheck className="w-4 h-4 fill-yellow-500/20" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {a.comments && a.comments.length > 0 && (
                        <Badge variant="outline" className="animate-pulse">
                          {a.comments.length} {a.comments.length === 1 ? 'comment' : 'comments'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 line-clamp-3 text-sm sm:text-base">{a.content}</div>
                </div>
              </CardContent>
                </Card>
              </Link>
              
              {/* Quick action buttons that appear on hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Use view transitions API for smooth state change
                    if (document.startViewTransition) {
                      document.startViewTransition(() => {
                        setReadAnnouncements(prev => ({
                          ...prev,
                          [a.id]: !isRead
                        }));
                      });
                    } else {
                      setReadAnnouncements(prev => ({
                        ...prev,
                        [a.id]: !isRead
                      }));
                    }
                  }}
                  className={cn(
                    "p-1 rounded-full transition-all hover:scale-110",
                    isRead ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                  aria-label={isRead ? "Mark as unread" : "Mark as read"}
                  style={{ viewTransitionName: `read-button-${a.id}` }}
                >
                  <CheckCircle2 className={cn(
                    "w-4 h-4 transition-all",
                    isRead ? "fill-primary/20" : ""
                  )} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Use view transitions API for smooth state change
                    if (document.startViewTransition) {
                      document.startViewTransition(() => {
                        setBookmarkedAnnouncements(prev => ({
                          ...prev,
                          [a.id]: !isBookmarked
                        }));
                      });
                    } else {
                      setBookmarkedAnnouncements(prev => ({
                        ...prev,
                        [a.id]: !isBookmarked
                      }));
                    }
                  }}
                  className={cn(
                    "p-1 rounded-full transition-all hover:scale-110",
                    isBookmarked ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
                  )}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                  style={{ viewTransitionName: `bookmark-button-${a.id}` }}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 fill-yellow-500/20" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// CSS transitions are now handled by the global view-transitions.css file
