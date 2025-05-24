import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { Textarea } from '~/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Progress } from '~/components/ui/progress';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import { 
  Bold, Italic, Underline, Link2, Image, Smile, AtSign, 
  Send, X, ThumbsUp, ThumbsDown, Eye, Edit3, Loader2,
  Keyboard, Zap
} from 'lucide-react';
import { Plate } from '@udecode/plate/react';
import { useCreateEditor } from '~/components/editor/use-create-editor';
import { Editor, EditorContainer } from '~/components/editor/ui/editor';
import '~/lib/styles/view-transitions.css';
import '~/lib/styles/comment-form.css';

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
  onLike?: () => void;
  hasLiked?: boolean;
  likeCount?: number;
  onDislike?: () => void;
  hasDisliked?: boolean;
  dislikeCount?: number;
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
  onLike,
  hasLiked = false,
  likeCount = 0,
  onDislike,
  hasDisliked = false,
  dislikeCount = 0,
}: CommentFormProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [hasInteracted, setHasInteracted] = useState(false);
  const editor = useCreateEditor();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Keyboard shortcuts
  const shortcuts = {
    bold: 'Cmd+B',
    italic: 'Cmd+I',
    underline: 'Cmd+U',
    submit: 'Cmd+Enter'
  };
  
  const characterCount = value.length;
  const characterPercentage = Math.min((characterCount / maxLength) * 100, 100);
  const isNearLimit = characterCount > maxLength * 0.7;
  const isOverLimit = characterCount > maxLength;
  
  // Enhanced handlers
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setHasInteracted(true);
  }, []);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Submit with Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (value.trim() && !isSubmitting && !isOverLimit) {
        onSubmit?.(e as any);
      }
    }
    
    // Format shortcuts when in rich text mode
    if (showFormatting) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        // Bold formatting logic would go here
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        // Italic formatting logic would go here
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
        e.preventDefault();
        // Underline formatting logic would go here
      }
    }
  }, [value, isSubmitting, isOverLimit, showFormatting, onSubmit]);
  
  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
    setHasInteracted(true);
  }, []);

  const handleEmojiClick = (emoji: string) => {
    onChange(value + emoji);
    textareaRef.current?.focus();
    setShowEmojiPicker(false);
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

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitWithAnimation = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit) return;
    
    // Add animation before submission
    setIsSubmitted(true);
    
    // Apply animation to the form container
    const formCard = document.querySelector('.comment-form-card');
    if (formCard) {
      formCard.classList.add('animate-pulse-subtle');
      setTimeout(() => {
        formCard.classList.remove('animate-pulse-subtle');
      }, 500);
    }
    
    // Delay actual submission slightly to show animation
    setTimeout(() => {
      onSubmit(e);
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmitWithAnimation}
      className={cn("w-full", className)}
      role="form"
      aria-label="Comment form"
    >
      <Card className={cn(
        "overflow-hidden transition-all animate-fade-in-scale comment-form-card hover-lift",
        isFocused ? "shadow-md ring-2 ring-primary/20 border-primary/50" : "",
        replyMode ? "border-l-4 border-l-primary/50" : "",
        hasInteracted && "shadow-md"
      )}>
        <CardContent className="p-3">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-background ring-1 ring-primary/10">
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
            
            <div className="flex-1 animate-slide-in">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="flex items-center justify-between mb-3">
                  <TabsList className="grid w-fit grid-cols-2 bg-muted/50 p-1">
                    <TabsTrigger 
                      value="write" 
                      className={cn(
                        "data-[state=active]:bg-background data-[state=active]:shadow-sm",
                        "transition-all duration-200 focus-ring",
                        "flex items-center gap-1.5 px-3 py-1.5"
                      )}
                      aria-label="Write mode"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span className="mobile-text-sm">Write</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview" 
                      className={cn(
                        "data-[state=active]:bg-background data-[state=active]:shadow-sm",
                        "transition-all duration-200 focus-ring",
                        "flex items-center gap-1.5 px-3 py-1.5"
                      )}
                      aria-label="Preview mode"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span className="mobile-text-sm">Preview</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="write" className="mt-0">
                  {showFormatting ? (
                    <Plate editor={editor}>
                      <EditorContainer className="comment-new editor-focus">
                        <Editor 
                          variant="demo" 
                          placeholder={placeholder}
                          className="min-h-[100px]"
                          onChange={(value) => {
                            // Convert editor content to markdown and update state
                            const content = editor?.children || [];
                            const markdownContent = content
                              .map(node => {
                                if (node.type === 'paragraph') {
                                  return node.children?.map(child => {
                                    if (child.bold) return `**${child.text}**`;
                                    if (child.italic) return `_${child.text}_`;
                                    if (child.underline) return `__${child.text}__`;
                                    return child.text;
                                  }).join('');
                                }
                                return '';
                              })
                              .filter(Boolean)
                              .join('\n');
                            onChange(markdownContent);
                          }}
                        />
                      </EditorContainer>
                    </Plate>
                  ) : (
                    <Textarea
                      ref={textareaRef}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={placeholder}
                      className={cn(
                        "min-h-[100px] resize-none text-sm",
                        isOverLimit ? "text-destructive" : ""
                      )}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => {
                        setTimeout(() => {
                          if (!document.activeElement?.closest('form')) {
                            setIsFocused(false);
                          }
                        }, 100);
                      }}
                      disabled={isSubmitting}
                    />
                  )}
                  
                  <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                    {showFormatting && (
                      <div className={cn(
                        "flex items-center gap-2 p-2 bg-muted/30 rounded-lg border",
                        "toolbar-slide-in mobile-stack"
                      )}>
                        {/* Text Formatting Group */}
                        <div className="flex items-center">
                          <ToggleGroup type="multiple" size="sm" className="gap-0.5">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ToggleGroupItem
                                    value="bold"
                                    className="h-8 w-8 p-0 focus-ring hover:bg-muted transition-colors"
                                    onClick={() => formatText("bold")}
                                    aria-label="Bold text"
                                  >
                                    <Bold className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="flex items-center gap-2">
                                    <span>Bold</span>
                                    <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">{shortcuts.bold}</kbd>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ToggleGroupItem
                                    value="italic"
                                    className="h-8 w-8 p-0 focus-ring hover:bg-muted transition-colors"
                                    onClick={() => formatText("italic")}
                                    aria-label="Italic text"
                                  >
                                    <Italic className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="flex items-center gap-2">
                                    <span>Italic</span>
                                    <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">{shortcuts.italic}</kbd>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ToggleGroupItem
                                    value="underline"
                                    className="h-8 w-8 p-0 focus-ring hover:bg-muted transition-colors"
                                    onClick={() => formatText("underline")}
                                    aria-label="Underline text"
                                  >
                                    <Underline className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="flex items-center gap-2">
                                    <span>Underline</span>
                                    <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">{shortcuts.underline}</kbd>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </ToggleGroup>
                        </div>
                        
                        <Separator orientation="vertical" className="h-6" />
                        
                        {/* Media & Links Group */}
                        <div className="flex items-center">
                          <ToggleGroup type="multiple" size="sm" className="gap-0.5">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ToggleGroupItem
                                    value="link"
                                    className="h-8 w-8 p-0 focus-ring hover:bg-muted transition-colors"
                                    onClick={() => formatText("link")}
                                    aria-label="Add link"
                                  >
                                    <Link2 className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>Add Link</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ToggleGroupItem
                                    value="image"
                                    className="h-8 w-8 p-0 focus-ring hover:bg-muted transition-colors"
                                    onClick={() => {
                                      const imageUrl = prompt('Enter image URL:');
                                      if (imageUrl) {
                                        const imageMarkdown = `![image](${imageUrl})`;
                                        onChange(value + imageMarkdown);
                                        textareaRef.current?.focus();
                                      }
                                    }}
                                    aria-label="Add image"
                                  >
                                    <Image className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>Add Image</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </ToggleGroup>
                        </div>
                        
                        {/* Interactive Tools Group */}
                        <div className="flex items-center">
                          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 focus-ring hover:bg-muted transition-colors"
                                      type="button"
                                      aria-label="Add emoji"
                                    >
                                      <Smile className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                </TooltipTrigger>
                                <TooltipContent>Add Emoji</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <PopoverContent className="w-full p-2 emoji-pop" align="start">
                              <div className="grid grid-cols-8 gap-1.5">
                                {EMOJIS.map((emoji) => (
                                  <Button
                                    key={emoji}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 emoji-pop transition-colors button-press"
                                    onClick={() => handleEmojiClick(emoji)}
                                    aria-label={`Add ${emoji} emoji`}
                                  >
                                    {emoji}
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                          
                          <Popover open={showMentionPicker} onOpenChange={setShowMentionPicker}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 focus-ring hover:bg-muted transition-colors"
                                      type="button"
                                      aria-label="Mention someone"
                                    >
                                      <AtSign className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                </TooltipTrigger>
                                <TooltipContent>Mention Someone</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <PopoverContent className="w-64 p-2 mention-slide" align="start">
                              <div className="space-y-1">
                                <div className="text-xs font-medium mb-1">Mention someone</div>
                                {['John Doe', 'Jane Smith', 'Alex Johnson', 'Sam Wilson'].map((user) => (
                                  <Button
                                    key={user}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start h-8 px-2 text-sm hover:bg-muted transition-colors button-press"
                                    onClick={() => {
                                      onChange(value + ` @${user} `);
                                      setShowMentionPicker(false);
                                      textareaRef.current?.focus();
                                    }}
                                    aria-label={`Mention ${user}`}
                                  >
                                    <Avatar className="h-5 w-5 mr-2">
                                      <AvatarImage src={`https://avatar.iran.liara.run/public/boy?username=${user}`} />
                                      <AvatarFallback>{user.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {user}
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <div className={cn(
                        "text-xs flex items-center gap-2 transition-all duration-300",
                        characterPercentage >= 70 && characterPercentage < 90 ? "text-amber-600 dark:text-amber-400" : "",
                        characterPercentage >= 90 && !isOverLimit ? "text-orange-600 dark:text-orange-400 counter-warning" : "",
                        isOverLimit ? "text-destructive counter-danger" : "text-muted-foreground"
                      )}>
                        <span className="font-mono tabular-nums">
                          {characterCount}/{maxLength}
                        </span>
                        {characterPercentage >= 70 && (
                          <div className="relative">
                            <Progress 
                              value={characterPercentage} 
                              className={cn(
                                "h-1.5 w-12 transition-all duration-300",
                                characterPercentage >= 90 ? "progress-fill" : ""
                              )}
                            />
                            {isOverLimit && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                            )}
                          </div>
                        )}
                        {isOverLimit && (
                          <span className="text-xs font-medium animate-pulse">
                            Too long!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <div className="min-h-[100px] p-3 border rounded-md bg-muted/20 text-sm fade-in preview-content">
                    {value ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {/* Simple markdown-like rendering */}
                        {value.split('\n').map((line, i) => {
                          // Process bold text
                          let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                          // Process italic text
                          processedLine = processedLine.replace(/_(.*?)_/g, '<em>$1</em>');
                          // Process underline
                          processedLine = processedLine.replace(/__(.*?)__/g, '<u>$1</u>');
                          // Process links
                          processedLine = processedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
                          
                          // Process images
                          if (line.match(/!\[(.*?)\]\((.*?)\)/)) {
                            const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
                            if (imgMatch && imgMatch[2]) {
                              return (
                                <div key={i} className="my-2 animate-fade-in-scale">
                                  <img 
                                    src={imgMatch[2]} 
                                    alt={imgMatch[1] || 'Image'} 
                                    className="max-w-full rounded-md shadow-sm border border-muted"
                                  />
                                </div>
                              );
                            }
                          }
                          
                          return <p key={i} dangerouslySetInnerHTML={{ __html: processedLine }} />;
                        })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Nothing to preview</span>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center p-3 pt-0 mobile-stack">
          <div className="flex items-center gap-1.5 mobile-full">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="text-muted-foreground hover:text-foreground hover-lift focus-ring transition-all mobile-text-sm"
              >
                <X className="mr-1.5 h-4 w-4" />
                Cancel
              </Button>
            )}
            
            {onLike && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={hasLiked ? "secondary" : "ghost"}
                      size="sm"
                      onClick={onLike}
                      className={cn(
                        "gap-1.5 transition-all duration-200 button-press focus-ring mobile-text-sm",
                        hasLiked 
                          ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50" 
                          : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover-lift"
                      )}
                    >
                      <ThumbsUp className={cn("h-4 w-4 transition-transform", hasLiked ? "scale-110" : "")} />
                      {likeCount > 0 && <span className="font-medium">{likeCount}</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Like this comment</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {onDislike && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={hasDisliked ? "secondary" : "ghost"}
                      size="sm"
                      onClick={onDislike}
                      className={cn(
                        "gap-1.5 transition-all duration-200 button-press focus-ring mobile-text-sm",
                        hasDisliked 
                          ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50" 
                          : "text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover-lift"
                      )}
                    >
                      <ThumbsDown className={cn("h-4 w-4 transition-transform", hasDisliked ? "scale-110" : "")} />
                      {dislikeCount > 0 && <span className="font-medium">{dislikeCount}</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Dislike this comment</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="flex items-center gap-2 mobile-full mobile-stack">
            {isOverLimit && (
              <div className="text-xs text-destructive font-medium animate-pulse mobile-text-sm">
                Please shorten your comment
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!value.trim() || isSubmitting || isOverLimit}
                    className={cn(
                      "gap-2 transition-all duration-300 font-medium mobile-full mobile-text-sm",
                      !value.trim() || isOverLimit 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover-lift focus-ring",
                      value.trim() && !isSubmitting && !isOverLimit 
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg" 
                        : "",
                      isSubmitted ? "success-pulse bg-green-600 hover:bg-green-700" : ""
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="skeleton-pulse">Sending...</span>
                      </>
                    ) : isSubmitted ? (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>Sent!</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send
                        {shortcuts.submit && (
                          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-1">
                            <span className="text-xs">⌘</span>↵
                          </kbd>
                        )}
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {!value.trim() 
                    ? "Write something to send" 
                    : isOverLimit 
                    ? "Comment is too long" 
                    : "Send comment (⌘+Enter)"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
