import {  useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Bookmark, BookmarkCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import * as React from 'react';
import { ANNOUNCEMENTS } from './data/announcements';
import { cn } from '../../lib/utils';
import { Button } from '~/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function AnnouncementsList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Track read and bookmarked announcements in local state
  const [readAnnouncements, setReadAnnouncements] = React.useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('readAnnouncements');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [bookmarkedAnnouncements, setBookmarkedAnnouncements] = React.useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('bookmarkedAnnouncements');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Track per-announcement interaction counts
  const [readCounts, setReadCounts] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('readCounts');
    // Initialize with default counts if not saved
    if (saved) {
      return JSON.parse(saved);
    } else {
      // Create default counts object with 0 for each announcement
      const defaultCounts: Record<string, number> = {};
      ANNOUNCEMENTS.forEach(a => {
        defaultCounts[a.id] = 0;
      });
      return defaultCounts;
    }
  });
  
  const [bookmarkCounts, setBookmarkCounts] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('bookmarkCounts');
    // Initialize with default counts if not saved
    if (saved) {
      return JSON.parse(saved);
    } else {
      // Create default counts object with 0 for each announcement
      const defaultCounts: Record<string, number> = {};
      ANNOUNCEMENTS.forEach(a => {
        defaultCounts[a.id] = 0;
      });
      return defaultCounts;
    }
  });
  
  // Use TanStack Query to store and retrieve scroll position
  const { data: scrollPosition } = useQuery({
    queryKey: ['announcements', 'scrollPosition'],
    queryFn: () => 0,
    initialData: 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5, // Keep for 5 minutes
  });
  
  // Save to localStorage when state changes
  React.useEffect(() => {
    localStorage.setItem('readAnnouncements', JSON.stringify(readAnnouncements));
  }, [readAnnouncements]);
  
  React.useEffect(() => {
    localStorage.setItem('bookmarkedAnnouncements', JSON.stringify(bookmarkedAnnouncements));
  }, [bookmarkedAnnouncements]);
  
  React.useEffect(() => {
    localStorage.setItem('readCounts', JSON.stringify(readCounts));
  }, [readCounts]);
  
  React.useEffect(() => {
    localStorage.setItem('bookmarkCounts', JSON.stringify(bookmarkCounts));
  }, [bookmarkCounts]);
  
  // Restore scroll position when returning from detail view
  React.useEffect(() => {
    document.body.classList.add('fade-in');
    
    // Restore scroll position if available
    if (scrollPosition > 0 && containerRef.current) {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'auto'
      });
    }
    
    return () => document.body.classList.remove('fade-in');
  }, [scrollPosition]);
  
  // Handle navigation to announcement detail
  const handleAnnouncementClick = (announcementId: string) => {
    // Store current scroll position before navigating
    const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
    queryClient.setQueryData(['announcements', 'scrollPosition'], currentScrollPosition);
    
    // Navigate to the announcement detail
    navigate({ to: '/announcements/$announcementId', params: { announcementId } });
  };

  // Calculate counters for read and bookmarked announcements
  const readCount = Object.values(readAnnouncements).filter(Boolean).length;
  const bookmarkedCount = Object.values(bookmarkedAnnouncements).filter(Boolean).length;
  const totalAnnouncements = ANNOUNCEMENTS.length;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 announcements-container">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">Announcements</h1>
      
      {/* Status counters */}
      <div className="flex items-center justify-between mb-4 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="status-counter text-primary">
            <CheckCircle2 className="w-4 h-4 fill-primary/20" />
            <span className="text-sm font-medium">{readCount} of {totalAnnouncements} read</span>
          </div>
          <div className="status-counter text-yellow-500">
            <BookmarkCheck className="w-4 h-4 fill-yellow-500/20" />
            <span className="text-sm font-medium">{bookmarkedCount} bookmarked</span>
          </div>
        </div>
      </div>
      
      <div ref={containerRef} className="flex flex-col gap-4 animate-fade-in-scale">
        {ANNOUNCEMENTS.map((a) => {
          const isRead = readAnnouncements[a.id];
          const isBookmarked = bookmarkedAnnouncements[a.id];
          
          return (
            <div key={a.id} className="relative group">
              <div 
                onClick={() => handleAnnouncementClick(a.id)}
                className="block cursor-pointer"
              >
                <Card 
                  className={cn(
                    "pb-0 pt-0 w-full sm:min-w-2xl  cursor-pointer hover:shadow-xs hover:scale-[1.005] transition-all duration-200 animate-slide-in announcement-card-hover",
                    isRead ? "border-1 border-primary/30" : "",
                    isBookmarked ? "border-1 border-yellow-500/30" : ""
                  )}
                  style={{ viewTransitionName: `announcement-card-${a.id}` }}
                >
              <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Avatar 
                    className="rounded-xl w-12 h-12 ring-2 ring-primary/10 transition-all duration-300 avatar-hover"
                    style={{ viewTransitionName: `announcement-avatar-${a.id}` }}
                  >
                    <AvatarImage
                      src={a.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(a.author)}`}
                      alt={a.author}
                      onError={e => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(a.author)}`;
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
                      <div>
                        <div className="font-semibold text-lg">{a.author}</div>
                        <div className="text-xs text-muted-foreground">{a.date}</div>
                      </div>
                    </div>
                    <div className="mt-2 line-clamp-3 text-sm sm:text-base">{a.content}</div>
                  </div>
                </div>
                
                {/* Social media style action bar */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-muted/30">
                  <div className="flex items-center gap-6">
                    {/* Read status with counter */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex items-center gap-1.5 p-1 rounded-md transition-all hover:scale-105",
                        isRead ? "text-primary" : "text-muted-foreground hover:text-primary"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Use view transitions API for smooth state change
                        if (document.startViewTransition) {
                          document.startViewTransition(() => {
                            // Update read status
                            setReadAnnouncements(prev => ({
                              ...prev,
                              [a.id]: !isRead
                            }));
                            
                            // Update read count for this announcement
                            setReadCounts(prev => {
                              const currentCount = prev[a.id] || 0;
                              return {
                                ...prev,
                                [a.id]: !isRead ? currentCount + 1 : Math.max(0, currentCount - 1)
                              };
                            });
                          });
                        } else {
                          // Update read status
                          setReadAnnouncements(prev => ({
                            ...prev,
                            [a.id]: !isRead
                          }));
                          
                          // Update read count for this announcement
                          setReadCounts(prev => {
                            const currentCount = prev[a.id] || 0;
                            return {
                              ...prev,
                              [a.id]: !isRead ? currentCount + 1 : Math.max(0, currentCount - 1)
                            };
                          });
                        }
                      }}
                      aria-label={isRead ? "Mark as unread" : "Mark as read"}
                      style={{ viewTransitionName: `read-button-${a.id}` }}
                    >
                      <CheckCircle2 className={cn(
                        "w-4 h-4 transition-all",
                        isRead ? "fill-primary/20" : ""
                      )} />
                      <span className="text-xs font-medium">{readCounts[a.id] || 0}</span>
                    </Button>
                    
                    {/* Bookmark status with counter */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex items-center gap-1.5 p-1 rounded-md transition-all hover:scale-105",
                        isBookmarked ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Use view transitions API for smooth state change
                        if (document.startViewTransition) {
                          document.startViewTransition(() => {
                            // Update bookmark status
                            setBookmarkedAnnouncements(prev => ({
                              ...prev,
                              [a.id]: !isBookmarked
                            }));
                            
                            // Update bookmark count for this announcement
                            setBookmarkCounts(prev => {
                              const currentCount = prev[a.id] || 0;
                              return {
                                ...prev,
                                [a.id]: !isBookmarked ? currentCount + 1 : Math.max(0, currentCount - 1)
                              };
                            });
                          });
                        } else {
                          // Update bookmark status
                          setBookmarkedAnnouncements(prev => ({
                            ...prev,
                            [a.id]: !isBookmarked
                          }));
                          
                          // Update bookmark count for this announcement
                          setBookmarkCounts(prev => {
                            const currentCount = prev[a.id] || 0;
                            return {
                              ...prev,
                              [a.id]: !isBookmarked ? currentCount + 1 : Math.max(0, currentCount - 1)
                            };
                          });
                        }
                      }}
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                      style={{ viewTransitionName: `bookmark-button-${a.id}` }}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 fill-yellow-500/20" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      <span className="text-xs font-medium">{bookmarkCounts[a.id] || 0}</span>
                    </Button>
                    
                    {/* Comments counter with icon */}
                    {a.comments && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1.5 p-1 rounded-md transition-all hover:scale-105 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        aria-label={`${a.comments.length} ${a.comments.length === 1 ? 'comment' : 'comments'}`}
                      >
                        <MessageSquare className={cn(
                          "w-4 h-4 transition-all",
                          a.comments.length > 0 ? "animate-pulse" : ""
                        )} />
                        <span className="text-xs font-medium">{a.comments.length}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
                </Card>
              </div>
              
              {/* Action buttons are now in the social media style action bar below */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// CSS transitions are now handled by the global view-transitions.css file
