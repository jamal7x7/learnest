import { useState } from "react";
import { Comment } from "../types";
import { CommentItem } from "./CommentItem";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { ChevronDown, Clock, MessageSquare, ThumbsUp, Filter, SortAsc } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card } from "~/components/ui/card";

interface CommentsListProps {
  comments: Comment[];
  className?: string;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
  onReply?: (id: string, content: string) => void;
  onReaction?: (id: string, reaction: string) => void;
  sortOptions?: boolean;
  defaultSort?: 'recent' | 'oldest' | 'likes';
  currentUser?: { name: string; role?: string };
}

export function CommentsList({ 
  comments, 
  className,
  isLoading,
  onDelete,
  onEdit,
  onReply,
  onReaction,
  sortOptions = true,
  defaultSort = 'recent',
  currentUser
}: CommentsListProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'likes'>(defaultSort);
  const [expandedView, setExpandedView] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mine' | 'liked'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  
  // Sort comments based on selected sort option
  const filteredComments = comments.filter(comment => {
    if (activeFilter === 'mine') {
      return comment.author === currentUser?.name;
    } else if (activeFilter === 'liked') {
      return comment.hasLiked;
    }
    return true;
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
    } else if (sortBy === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0;
  });

  // Calculate paginated comments
  const paginatedComments = sortedComments.slice(
    0,
    currentPage * commentsPerPage
  );
  const hasMoreComments = sortedComments.length > currentPage * commentsPerPage;
  
  const loadMoreComments = () => {
    setCurrentPage((prev) => prev + 1);
  };
 

  // Show skeleton loader when loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        {["skeleton-1", "skeleton-2", "skeleton-3"].map((skeletonId) => (
          <div key={skeletonId} className="flex flex-col space-y-3 p-4 border rounded-md">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (comments.length === 0) {
    return (
      <div className="text-muted-foreground text-sm py-10 px-6 text-center bg-muted/20 rounded-lg border border-dashed border-muted animate-fade-in">
        <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="font-medium mb-1">No comments yet</p>
        <p>Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortOptions && (
        <Card className="p-3 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-0 h-6">
                <MessageSquare className="mr-1 h-3 w-3" />
                {comments.length}
              </Badge>
              
              <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="h-7">
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="all" className="text-xs h-6 px-2">All</TabsTrigger>
                  <TabsTrigger value="mine" className="text-xs h-6 px-2">Mine</TabsTrigger>
                  <TabsTrigger value="liked" className="text-xs h-6 px-2">Liked</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
                <SelectTrigger className="h-7 w-[140px] text-xs">
                  <SortAsc className="mr-1 h-3 w-3" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="likes">Most Likes</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1 text-xs"
                onClick={() => setExpandedView(!expandedView)}
              >
                <ChevronDown className={cn("h-3 w-3 transition-transform", expandedView ? "rotate-180" : "")} />
                {expandedView ? "Collapse" : "Expand"}
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {expandedView && (
        <div className="space-y-4">
          {paginatedComments.map((comment) => (
            <div 
              key={comment.id}
              className="animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <CommentItem 
                comment={comment} 
                isNew={comment.id === `c${comments.length}`}
                onDelete={onDelete}
                onEdit={onEdit}
                onReply={onReply}
                onReaction={onReaction}
                currentUser={currentUser}
                className={!expandedView ? "py-2" : ""}
              />
              
              {/* Render nested replies if any */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 mt-2 space-y-2 border-l-2 border-muted pl-4 pt-2">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onReaction={onReaction}
                      onLike={onLike}
                      onDislike={onDislike}
                      currentUser={currentUser}
                      className="scale-95 origin-left"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {hasMoreComments && (
            <div className="flex justify-center pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadMoreComments}
                className="w-full max-w-xs gap-2"
              >
                Show more comments
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
