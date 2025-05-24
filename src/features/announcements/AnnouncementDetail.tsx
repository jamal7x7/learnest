import * as React from 'react';
import { Separator } from '~/components/ui/separator';
import { AnnouncementDetailProps } from './types';
import { AnnouncementHeader } from './components/AnnouncementHeader';
import { CommentForm } from './components/CommentForm';
import { CommentsList } from './components/CommentsList';
import { ReadStatusAnimation, BookmarkStatusAnimation } from './components/StatusAnimation';
import { AnnouncementDetailCard } from './components/Announcement-detail-card';

export function AnnouncementDetail({ announcement, onBack }: AnnouncementDetailProps) {
  const [comments, setComments] = React.useState(announcement.comments ?? []);
  const [commentInput, setCommentInput] = React.useState('');
  const [isRead, setIsRead] = React.useState(announcement.isRead ?? false);
  const [isBookmarked, setIsBookmarked] = React.useState(announcement.isBookmarked ?? false);
  const [showReadAnimation, setShowReadAnimation] = React.useState(false);
  const [showBookmarkAnimation, setShowBookmarkAnimation] = React.useState(false);
  
  // Handle like/dislike functionality
  function handleLikeComment(commentId: string) {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          const wasLiked = comment.hasLiked || false;
          return {
            ...comment,
            likes: wasLiked ? (comment.likes || 1) - 1 : (comment.likes || 0) + 1,
            hasLiked: !wasLiked
          };
        } else if (comment.replies) {
          // Check in replies
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              const wasLiked = reply.hasLiked || false;
              return {
                ...reply,
                likes: wasLiked ? (reply.likes || 1) - 1 : (reply.likes || 0) + 1,
                hasLiked: !wasLiked
              };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      })
    );
  }
  
  function handleDislikeComment(commentId: string) {
    // Similar implementation as like but for dislikes
    // For now just toggle the dislike state without counter
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            hasDisliked: !(comment.hasDisliked || false)
          };
        } else if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                hasDisliked: !(reply.hasDisliked || false)
              };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      })
    );
  }
  
  function handleReplyToComment(commentId: string, content: string) {
    if (!content.trim()) return;
    
    const newReply = {
      id: `reply-${Date.now()}`,
      author: 'You',
      content,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=You',
      likes: 0,
      hasLiked: false,
      isAuthor: true,
      role: 'Student',
      timeAgo: 'Just now',
      isReply: true
    };
    
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      })
    );
  }
  
  function handleEditComment(commentId: string, content: string) {
    if (!content.trim()) return;
    
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content };
        } else if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              return { ...reply, content };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      })
    );
  }
  
  function handleDeleteComment(commentId: string) {
    setComments(prevComments => 
      prevComments.filter(comment => {
        if (comment.id === commentId) {
          return false; // Remove this comment
        } else if (comment.replies) {
          // Filter out the reply if it matches the ID
          const updatedReplies = comment.replies.filter(reply => reply.id !== commentId);
          return { ...comment, replies: updatedReplies };
        }
        return true;
      })
    );
  }

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
    
    // Create new comment object with additional properties for enhanced features
    const newComment = {
      id: `c${comments.length + 1}`,
      author: 'You',
      content: commentInput,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=You',
      likes: 0,
      hasLiked: false,
      isAuthor: true,
      role: 'Student',
      timeAgo: 'Just now',
      replies: []
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
      {/* Status Animations */}
      <ReadStatusAnimation show={showReadAnimation} />
      <BookmarkStatusAnimation show={showBookmarkAnimation} isBookmarked={isBookmarked} />
      
      {/* Header with back button and actions */}
      <AnnouncementHeader
        onBack={onBack}
        onMarkAsRead={handleMarkAsRead}
        onBookmark={handleBookmark}
        isRead={isRead}
        isBookmarked={isBookmarked}
        announcementId={announcement.id}
      />
      
      {/* Main announcement card */}
      <AnnouncementDetailCard 
        announcement={{
          ...announcement,
          isRead,
          isBookmarked,
        }} 
      />
      
      {/* Comments section */}
      <div className="mt-8 animate-fade-in">
        <h2 className="font-semibold text-xl mb-4">Comments</h2>
        
        {/* Comment form */}
        <CommentForm
        value={commentInput}
        onChange={setCommentInput}
        onSubmit={handleCommentSubmit}
        isSubmitting={false}
        showFormatting={true}
        maxLength={500}
        userAvatar={"https://api.dicebear.com/7.x/fun-emoji/svg?seed=You"}
        userName="You"
      />
        
        <Separator className="my-4" />
      
      {/* Comments list */}
      <CommentsList 
        comments={comments} 
        onLike={handleLikeComment}
        onDislike={handleDislikeComment}
        onReply={handleReplyToComment}
        onEdit={handleEditComment}
        onDelete={handleDeleteComment}
        onReaction={(id, reaction) => console.log(`Reaction ${reaction} on comment ${id}`)}
        currentUser={{ name: "You", role: "Student" }}
        sortOptions={true}
        defaultSort="recent"
        pageSize={5}
      />
      </div>
    </div>
  );
}

// CSS transitions are now handled by the global view-transitions.css file
