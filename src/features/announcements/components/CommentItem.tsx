import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { Comment } from "../types";
import { MoreHorizontal, Reply, ThumbsUp, Flag, Edit, Trash2, Send, Clock } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  isNew?: boolean;
  className?: string;
  onReply?: (id: string, content: string) => void;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onReaction?: (id: string, reaction: string) => void;
  currentUser?: { name: string; role?: string };
}

const REACTIONS = [
  { emoji: "👍", name: "thumbs_up" },
  { emoji: "❤️", name: "heart" },
  { emoji: "😂", name: "laugh" },
  { emoji: "😮", name: "wow" },
  { emoji: "😢", name: "sad" },
  { emoji: "🔥", name: "fire" },
];

export function CommentItem({ 
  comment, 
  isNew, 
  className,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  currentUser
}: CommentItemProps) {
  const { id, author, content, date, avatar, reactions = [], isAuthor = false, role, timeAgo } = comment;
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [showReactions, setShowReactions] = useState(false);
  
  // Format the date for display
  const formattedDate = timeAgo || date;

  const handleReactionClick = (reactionName: string) => {
    if (onReaction) {
      onReaction(id, reactionName);
      setShowReactions(false);
    }
  };

  const handleReplySubmit = () => {
    if (onReply && replyContent.trim()) {
      onReply(id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const handleEditSubmit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(id, editContent);
      setIsEditing(false);
    }
  };

  const isCurrentUserAuthor = isAuthor || (currentUser?.name === author);
  
  return (
    <div className={cn(isNew ? "animate-fade-in" : "")}>
      <Card 
        id={`comment-${id}`}
        className={cn(
          'p-4 flex flex-col gap-3 hover:shadow-md transition-all border-[0.5px] dark:border-[0px] dark:bg-accent/20',
          isNew ? 'border-primary' : 'hover:border-[0.5px] hover:border-primary/30 dark:hover:border-[0.5px] dark:hover:border-primary/20',
          isReplying || isEditing ? 'shadow-md ring-1 ring-primary/20' : '',
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar className="w-9 h-9 flex-shrink-0 ring-1 ring-primary/10 border-2 border-background">
              <AvatarImage
                src={(avatar || `https://avatar.iran.liara.run/public/boy?username=${author}`) ?? `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(author)}`}
                alt={author}
              />
              <AvatarFallback>
                {author
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-medium text-sm">{author}</div>
                {role && (
                  <Badge variant="outline" className="text-xs py-0 h-5">
                    {role}
                  </Badge>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{typeof date === 'string' ? new Date(date).toLocaleString() : date}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {!isEditing ? (
                <div className="text-sm mt-2 bg-muted/10 p-3 rounded-md break-words">{content}</div>
              ) : (
                <div className="mt-2 space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px] text-sm"
                    placeholder="Edit your comment..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleEditSubmit}
                      disabled={!editContent.trim() || editContent === content}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {isCurrentUserAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive" 
                  onClick={() => onDelete?.(id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="flex items-center gap-1 ml-12">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowReactions(!showReactions)}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-xs">React</span>
            </Button>
            
            {showReactions && (
              <div className="absolute -top-12 left-0 flex items-center gap-1 bg-background p-1 rounded-full shadow-lg border border-muted z-10 animate-fade-in-scale">
                {REACTIONS.map((reaction) => (
                  <Button
                    key={reaction.name}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-muted"
                    onClick={() => handleReactionClick(reaction.name)}
                  >
                    {reaction.emoji}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsReplying(!isReplying)}
          >
            <Reply className="h-4 w-4 mr-1" />
            <span className="text-xs">Reply</span>
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Report comment</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {reactions && reactions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 ml-12">
            {Object.entries(reactions.reduce((acc: Record<string, number>, r: string) => {
              acc[r] = (acc[r] || 0) + 1;
              return acc;
            }, {})).map(([reaction, count]) => (
              <Badge 
                key={reaction} 
                variant="secondary"
                className="text-xs py-0 px-2 h-6 gap-1"
              >
                {REACTIONS.find(r => r.name === reaction)?.emoji || reaction}
                <span>{count}</span>
              </Badge>
            ))}
          </div>
        )}
        
        {isReplying && (
          <div className="ml-12 mt-2 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[80px] text-sm"
              placeholder="Write a reply..."
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
              >
                <Send className="h-3 w-3 mr-2" />
                Reply
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
