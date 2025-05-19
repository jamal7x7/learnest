import { useState } from "react";
import { Comment } from "../types";
import { CommentItem } from "./CommentItem";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { ChevronDown, Clock, MessageSquare, ThumbsUp, Filter } from "lucide-react";

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

  // Sort comments based on selected sort option
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
    } else if (sortBy === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0;
  });

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
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="px-2 py-0 h-6">
              <MessageSquare className="mr-1 h-3 w-3" />
              {comments.length}
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 gap-1 text-xs"
              onClick={() => setExpandedView(!expandedView)}
            >
              {expandedView ? "Compact" : "Expanded"}
              <ChevronDown className={`h-3 w-3 transition-transform ${expandedView ? '' : 'rotate-180'}`} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <Select defaultValue={sortBy} onValueChange={(value: string) => setSortBy(value as 'recent' | 'oldest' | 'likes')}>
              <SelectTrigger className="h-8 w-[110px] text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="recent" className="text-xs">
                  <div className="flex items-center">
                    <Clock className="mr-1.5 h-3 w-3" />
                    <span>Newest</span>
                  </div>
                </SelectItem>
                <SelectItem value="oldest" className="text-xs">
                  <div className="flex items-center">
                    <Clock className="mr-1.5 h-3 w-3" />
                    <span>Oldest</span>
                  </div>
                </SelectItem>
                <SelectItem value="likes" className="text-xs">
                  <div className="flex items-center">
                    <ThumbsUp className="mr-1.5 h-3 w-3" />
                    <span>Most liked</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className={cn("flex flex-col gap-4 pr-2 custom-scrollbar", className)}>
        <div className="space-y-4">
          {sortedComments.map((comment) => (
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
                      currentUser={currentUser}
                      className="scale-95 origin-left"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
