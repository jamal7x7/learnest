import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { ArrowLeft, Send, Bookmark, BookmarkCheck, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import * as React from 'react';
import { cn } from '../../lib/utils';

export interface Announcement {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  date: string;
  isRead?: boolean;
  isBookmarked?: boolean;
  comments: {
    id: string;
    author: string;
    content: string;
    date: string;
    avatar?: string;
  }[];
}

interface AnnouncementDetailProps {
  announcement: Announcement;
  onBack: () => void;
}

export function AnnouncementDetail({ announcement, onBack }: AnnouncementDetailProps) {
  const [comments, setComments] = React.useState(announcement.comments ?? []);
  const [commentInput, setCommentInput] = React.useState('');
  const [isRead, setIsRead] = React.useState(announcement.isRead ?? false);
  const [isBookmarked, setIsBookmarked] = React.useState(announcement.isBookmarked ?? false);
  const [showReadAnimation, setShowReadAnimation] = React.useState(false);
  const [showBookmarkAnimation, setShowBookmarkAnimation] = React.useState(false);

  React.useEffect(() => {
    document.body.classList.add('fade-in');
    
    // Mark as read automatically when viewed
    if (!isRead) {
      // Small delay to make it feel natural
      const timer = setTimeout(() => {
        handleMarkAsRead();
      }, 2000);
      return () => {
        clearTimeout(timer);
        document.body.classList.remove('fade-in');
      };
    }
    
    return () => document.body.classList.remove('fade-in');
  }, []);

  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentInput.trim()) return;
    
    // Create new comment object
    const newComment = {
      id: `c${comments.length + 1}`,
      author: 'You',
      content: commentInput,
      date: new Date().toISOString().slice(0, 10),
      avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=You'
    };
    
    // Use view transitions API for smooth comment addition
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setComments([...comments, newComment]);
        setCommentInput('');
        
        // Scroll to the new comment after a short delay
        setTimeout(() => {
          const newCommentElement = document.getElementById(`comment-${newComment.id}`);
          newCommentElement?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    } else {
      // Fallback for browsers that don't support view transitions
      setComments([...comments, newComment]);
      setCommentInput('');
      
      // Scroll to the new comment after a short delay
      setTimeout(() => {
        const newCommentElement = document.getElementById(`comment-${newComment.id}`);
        newCommentElement?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  // Handle mark as read action
  function handleMarkAsRead() {
    if (document.startViewTransition && !isRead) {
      document.startViewTransition(() => {
        setIsRead(true);
        setShowReadAnimation(true);
        setTimeout(() => setShowReadAnimation(false), 2000);
      });
    } else {
      setIsRead(true);
      setShowReadAnimation(true);
      setTimeout(() => setShowReadAnimation(false), 2000);
    }
  }

  // Handle bookmark action
  function handleBookmark() {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setIsBookmarked(!isBookmarked);
        setShowBookmarkAnimation(true);
        setTimeout(() => setShowBookmarkAnimation(false), 1500);
      });
    } else {
      setIsBookmarked(!isBookmarked);
      setShowBookmarkAnimation(true);
      setTimeout(() => setShowBookmarkAnimation(false), 1500);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 announcements-container relative">
      {/* Read confirmation animation */}
      {showReadAnimation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="bg-primary/20 backdrop-blur-sm rounded-full p-8 animate-pulse-fade">
            <CheckCircle2 className="w-16 h-16 text-primary animate-bounce-subtle" />
          </div>
        </div>
      )}
      
      {/* Bookmark animation */}
      {showBookmarkAnimation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className={cn(
            "rounded-full p-8 animate-pulse-fade",
            isBookmarked ? "bg-yellow-500/20 backdrop-blur-sm" : "bg-muted/20 backdrop-blur-sm"
          )}>
            {isBookmarked ? (
              <BookmarkCheck className="w-16 h-16 text-yellow-500 animate-bounce-subtle" />
            ) : (
              <Bookmark className="w-16 h-16 text-muted-foreground animate-bounce-subtle" />
            )}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="hover:scale-105 transition-transform"
          onClick={() => {
            // Use onBack callback which will handle navigation
            onBack();
          }}
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
                  onClick={handleMarkAsRead}
                  aria-label={isRead ? "Marked as read" : "Mark as read"}
                  style={{ viewTransitionName: `read-button-${announcement.id}` }}
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
                  onClick={handleBookmark}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                  style={{ viewTransitionName: `bookmark-button-${announcement.id}` }}
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
      <Card 
        className={cn(
          "mb-6 w-full sm:min-w-[42rem] animate-slide-in shadow-md hover:shadow-lg transition-all duration-300 announcement-card-hover",
          isRead ? "border-1 border-primary/30" : "",
          isBookmarked ? "border-1 border-yellow-500/30" : ""
        )}
        style={{ viewTransitionName: `announcement-card-${announcement.id}` }}
      >
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <Avatar 
              className="w-12 h-12 ring-2 ring-primary/10 transition-all duration-300 avatar-hover"
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
            <div>
              <div className="font-semibold">{announcement.author}</div>
              <div className="text-xs text-muted-foreground">{announcement.date}</div>
            </div>
          </div>
          <div 
            className="text-lg mt-4 leading-relaxed"
            style={{ viewTransitionName: `announcement-content-${announcement.id}` }}
          >
            {announcement.content}
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 animate-fade-in">
        <div className="font-semibold text-xl mb-4">Comments</div>
        <Card className="mb-6 w-full max-w-2xl mx-auto shadow-lg border border-muted/30 bg-background/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <form className="flex flex-col sm:flex-row gap-3 items-end" onSubmit={handleCommentSubmit}>
              <div className="relative flex-1">
                <Textarea
                  className="min-h-[80px] resize-none pr-10 focus-visible:ring-2 rounded-lg border-muted/40 bg-muted/10 transition-all focus:bg-background/90 focus:shadow-lg"
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="sm:self-end transition-all hover:scale-105 flex items-center gap-2 px-6 py-2 rounded-lg shadow-md bg-primary text-primary-foreground font-semibold disabled:opacity-60 disabled:cursor-not-allowed animate-bounce-subtle"
                disabled={!commentInput.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Comment
              </Button>
            </form>
          </CardContent>
        </Card>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar animate-fade-in-scale">
          {comments.length === 0 && (
            <div className="text-muted-foreground text-sm py-8 text-center bg-muted/20 rounded-lg">No comments yet. Be the first to comment!</div>
          )}
          {comments.slice().reverse().map((c) => (
            <Card 
              id={`comment-${c.id}`}
              key={c.id}
              className={`p-4 flex flex-col gap-3 hover:shadow-md transition-all ${c.id === `c${comments.length}` ? 'animate-comment-slide-in border-l-4 border-primary' : 'hover:border-l-4 hover:border-primary/50'}`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0 ring-1 ring-primary/10">
                  <AvatarImage
                    src={(c.avatar || `https://avatar.iran.liara.run/public/boy?username=`+ c.author) ??`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(c.author)}`}
                    alt={c.author}
                  />
                  <AvatarFallback>
                    {c.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <div className="font-medium">{c.author}</div>
                  <div className="text-xs text-muted-foreground">{c.date}</div>
                </div>
              </div>
              <div className="text-sm ml-11 bg-muted/10 p-2 rounded-md">{c.content}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// CSS transitions are now handled by the global view-transitions.css file
