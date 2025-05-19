import { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Bold, Italic, Underline, Link2, Smile, Send, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
  placeholder?: string;
  maxLength?: number;
  userAvatar?: string;
  userName?: string;
  replyMode?: boolean;
  showFormatting?: boolean;
}

const EMOJIS = [
  "😊", "😂", "👍", "❤️", "🎉", "👏", "🔥", "⭐", "😍", "🤔", 
  "👀", "💯", "👌", "🙌", "💪", "🤝", "🌟", "💡", "📝", "💻", 
  "🚀", "✅", "👉", "⏱️", "🧠", "📚", "📊", "📈", "📱", "💬",
  "🔄", "🖋️", "📋", "🎯", "💭", "🎨", "🏆", "💰", "📣", "🎬"
];

export function CommentForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className,
  placeholder = "Add a comment...",
  maxLength = 500,
  userAvatar = "/placeholder.svg?height=40&width=40",
  userName = "You",
  replyMode = false,
  showFormatting = true,
}: CommentFormProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const characterCount = value.length;
  const characterPercentage = Math.min((characterCount / maxLength) * 100, 100);
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  const handleEmojiClick = (emoji: string) => {
    onChange(value + emoji);
    textareaRef.current?.focus();
  };

  const formatText = (formatType: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = "";
    let newCursorPos = end;
    
    switch (formatType) {
      case "bold":
        formattedText = `**${selectedText}**`;
        newCursorPos = end + 4;
        break;
      case "italic":
        formattedText = `_${selectedText}_`;
        newCursorPos = end + 2;
        break;
      case "underline":
        formattedText = `__${selectedText}__`;
        newCursorPos = end + 4;
        break;
      case "link":
        formattedText = `[${selectedText}](url)`;
        newCursorPos = end + 6;
        break;
      default:
        return;
    }
    
    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after the format markers
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = selectedText ? end + formattedText.length - selectedText.length : newCursorPos;
      textarea.selectionEnd = selectedText ? end + formattedText.length - selectedText.length : newCursorPos;
    }, 0);
  };

  useEffect(() => {
    if (replyMode && textareaRef.current) {
      textareaRef.current.focus();
      // Set state outside of the useEffect using a ref to avoid the lint warning
      const focusTimeout = setTimeout(() => setIsFocused(true), 0);
      return () => clearTimeout(focusTimeout);
    }
  }, [replyMode]);
  
  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      onChange("");
      setIsFocused(false);
    }
  };

  return (
    <div className={cn(replyMode ? "animate-fade-in-up" : "")}>
      <Card 
        className={cn(
          "w-full shadow-sm border border-muted/30 bg-background/80 backdrop-blur-sm transition-all", 
          isFocused ? "shadow-md ring-1 ring-primary/20" : "",
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex gap-3">
            {!replyMode && (
              <div className="hidden sm:block">
                <Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-primary/10">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>
                    {userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                className={cn(
                  "min-h-[80px] resize-none focus-visible:ring-1 rounded-lg border-muted/40 bg-muted/10", 
                  "transition-all focus:bg-background/90 w-full p-3",
                  isOverLimit ? "border-destructive ring-destructive/30" : ""
                )}
                placeholder={placeholder}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
                disabled={isSubmitting}
                onFocus={() => setIsFocused(true)}
                onBlur={() => value.length === 0 && setIsFocused(false)}
              />
              
              {(isFocused || value.length > 0) && (
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    {showFormatting && (
                      <TooltipProvider>
                        <ToggleGroup type="single" variant="outline" className="justify-start border-0 space-x-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ToggleGroupItem value="bold" size="sm" className="h-7 w-7 p-0" onClick={() => formatText("bold")}>
                                <Bold className="h-3.5 w-3.5" />
                              </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">Bold</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ToggleGroupItem value="italic" size="sm" className="h-7 w-7 p-0" onClick={() => formatText("italic")}>
                                <Italic className="h-3.5 w-3.5" />
                              </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">Italic</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ToggleGroupItem value="underline" size="sm" className="h-7 w-7 p-0" onClick={() => formatText("underline")}>
                                <Underline className="h-3.5 w-3.5" />
                              </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">Underline</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ToggleGroupItem value="link" size="sm" className="h-7 w-7 p-0" onClick={() => formatText("link")}>
                                <Link2 className="h-3.5 w-3.5" />
                              </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">Link</TooltipContent>
                          </Tooltip>
                          
                          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                      <Smile className="h-3.5 w-3.5" />
                                    </Button>
                                  </PopoverTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">Emoji</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <PopoverContent className="w-64 p-2" align="start">
                              <div className="grid grid-cols-8 gap-1">
                                {EMOJIS.map((emoji) => (
                                  <Button
                                    key={emoji}
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-muted"  
                                    onClick={() => handleEmojiClick(emoji)}
                                  >
                                    {emoji}
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </ToggleGroup>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "text-xs", 
                      isOverLimit ? "text-destructive font-medium" : "text-muted-foreground",
                      isNearLimit && !isOverLimit ? "text-amber-500 dark:text-amber-400" : ""
                    )}>
                      {characterCount}/{maxLength}
                    </span>
                    <div className="w-16 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all", 
                          isOverLimit ? "bg-destructive" : "bg-primary",
                          isNearLimit && !isOverLimit ? "bg-amber-500 dark:bg-amber-400" : ""
                        )}
                        style={{ width: `${characterPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        {(isFocused || value.length > 0) && (
          <CardFooter className="p-3 pt-0 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelClick}
              className="h-8 text-xs gap-1 px-2.5"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className={cn(
                "h-8 text-xs gap-1.5 px-3 shadow-sm",
                isSubmitting ? "animate-pulse" : "hover:shadow-md transition-all hover:translate-y-[-1px]"
              )}
              disabled={!value.trim() || isSubmitting || isOverLimit}
              onClick={(e) => onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? 'Posting...' : (replyMode ? 'Reply' : 'Comment')}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
