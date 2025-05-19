"use client"

import { useState, useCallback } from "react"
import { CommentForm } from "./CommentForm"
import { CommentsList } from "./CommentsList"
import { CommentNotification } from "./CommentNotification"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchComments, addComment, likeComment, editComment, deleteComment, addReply } from "~/lib/api"
import { Comment } from "../types"
import { useToast } from "~/hooks/use-toast"
import {
  Bold,
  Italic,
  Underline,
  Link2,
  ImageIcon,
  Smile,
  AtSign,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  ChevronDown,
  ArrowDownToLine,
  Loader2,
  Clock,
  Share2,
  AlertCircle,
  Edit,
  Trash2,
  Reply,
  Sun,
  Moon,
  Flag,
  Bookmark,
  Send,
  ChevronUp,
} from "lucide-react"
import { Separator } from "~/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchComments, addComment, likeComment, addReply, editComment, deleteComment } from "~/lib/api"
import type { Comment } from "~/lib/types"
import { useToast } from "~/hooks/use-toast"
import { Badge } from "~/components/ui/badge"
import { motion, AnimatePresence } from "motion/react"
import { Skeleton } from "~/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"
import { useTheme } from "next-themes"
import { cn } from "~/lib/utils"
import { useMediaQuery } from "~/hooks/use-media-query"

const MAX_COMMENT_LENGTH = 500
const REACTIONS = [
  { emoji: "👍", name: "thumbs_up" },
  { emoji: "❤️", name: "heart" },
  { emoji: "😂", name: "laugh" },
  { emoji: "😮", name: "wow" },
  { emoji: "😢", name: "sad" },
  { emoji: "🔥", name: "fire" },
]

export function CommentSection() {
  const [commentText, setCommentText] = useState("")
  const [sortOrder, setSortOrder] = useState<"recent" | "likes" | "oldest">("recent")
  const [activeToolbar, setActiveToolbar] = useState(false)
  const [showReplies, setShowReplies] = useState<Record<number, boolean>>({})
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
  const [isCompactView, setIsCompactView] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Focus the textarea when clicking on the comment area
  const handleCommentAreaClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      setActiveToolbar(true)
    }
  }

  // Hide toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        if (commentText.length === 0) {
          setActiveToolbar(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [commentText])

  // Focus reply input when replying
  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus()
    }
  }, [replyingTo])

  // Fetch comments
  const {
    data: comments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["comments", sortOrder],
    queryFn: () => fetchComments(sortOrder),
  })

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previousComments = queryClient.getQueryData(["comments", sortOrder])

      queryClient.setQueryData(["comments", sortOrder], (old: Comment[] = []) => {
        const optimisticComment: Comment = {
          id: Date.now(),
          author: {
            name: "You",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: newComment.content,
          timeAgo: "Just now",
          likes: 0,
          replies: [],
          reactions: [],
          hasLiked: false,
        }
        return [optimisticComment, ...old]
      })

      return { previousComments }
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(["comments", sortOrder], context?.previousComments)
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
    onSuccess: () => {
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      })
    },
  })

  // Add reply mutation
  const addReplyMutation = useMutation({
    mutationFn: addReply,
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previousComments = queryClient.getQueryData(["comments", sortOrder])

      queryClient.setQueryData(["comments", sortOrder], (old: Comment[] = []) => {
        return old.map((comment) => {
          if (comment.id === commentId) {
            const newReply: Comment = {
              id: Date.now(),
              author: {
                name: "You",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              content,
              timeAgo: "Just now",
              likes: 0,
              replies: [],
              reactions: [],
              hasLiked: false,
              isReply: true,
            }

            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            }
          }
          return comment
        })
      })

      return { previousComments }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["comments", sortOrder], context?.previousComments)
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
    onSuccess: () => {
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      })
    },
  })

  // Edit comment mutation
  const editCommentMutation = useMutation({
    mutationFn: editComment,
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previousComments = queryClient.getQueryData(["comments", sortOrder])

      queryClient.setQueryData(["comments", sortOrder], (old: Comment[] = []) => {
        return old.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content,
              isEdited: true,
            }
          }
          return comment
        })
      })

      return { previousComments }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["comments", sortOrder], context?.previousComments)
      toast({
        title: "Error",
        description: "Failed to edit comment. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
    onSuccess: () => {
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      })
    },
  })

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previousComments = queryClient.getQueryData(["comments", sortOrder])

      queryClient.setQueryData(["comments", sortOrder], (old: Comment[] = []) => {
        return old.filter((comment) => comment.id !== commentId)
      })

      return { previousComments }
    },
    onError: (err, commentId, context) => {
      queryClient.setQueryData(["comments", sortOrder], context?.previousComments)
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
    onSuccess: () => {
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      })
    },
  })

  // Like comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: likeComment,
    onMutate: async ({ commentId, like }) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previousComments = queryClient.getQueryData(["comments", sortOrder])

      queryClient.setQueryData(["comments", sortOrder], (old: Comment[] = []) => {
        return old.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: like ? comment.likes + 1 : comment.likes - 1,
              hasLiked: like,
            }
          }
          return comment
        })
      })

      return { previousComments }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["comments", sortOrder], context?.previousComments)
      toast({
        title: "Error",
        description: "Failed to like comment. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const handleSubmitComment = () => {
    if (!commentText.trim()) return

    addCommentMutation.mutate({ content: commentText })
    setCommentText("")
    setActiveToolbar(false)
    setShowEmojiPicker(false)
  }

  const handleSubmitReply = (commentId: number) => {
    if (!replyText.trim()) return

    addReplyMutation.mutate({ commentId, content: replyText })
    setReplyText("")
    setReplyingTo(null)
    setShowReplies({ ...showReplies, [commentId]: true })
  }

  const handleSubmitEdit = (commentId: number) => {
    if (!editText.trim()) return

    editCommentMutation.mutate({ commentId, content: editText })
    setEditText("")
    setEditingComment(null)
  }

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId)
  }

  const handleLikeComment = (commentId: number, currentlyLiked: boolean) => {
    likeCommentMutation.mutate({ commentId, like: !currentlyLiked })
  }

  const handleSortChange = (order: "recent" | "likes" | "oldest") => {
    setSortOrder(order)
  }

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId)
    if (replyingTo !== commentId) {
      setReplyText("")
    }
  }

  const handleEditClick = (commentId: number, currentContent: string) => {
    setEditingComment(editingComment === commentId ? null : commentId)
    setEditText(currentContent)
  }

  const handleAddEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji)
  }

  const handleToggleReplies = (commentId: number) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const handleToggleExpand = (commentId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const totalComments = comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0)
  }, 0)

  const renderComment = (comment: Comment, isReply = false) => {
    const isExpanded = expandedComments[comment.id] || false
    const isContentLong = comment.content.length > 280
    const shouldTruncate = isContentLong && !isExpanded && !isCompactView

    if (editingComment === comment.id) {
      return (
        <div className="pl-0 mt-2">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[80px] mb-2 border-orange-200 focus-visible:ring-orange-400"
            placeholder="Edit your comment..."
            maxLength={MAX_COMMENT_LENGTH}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingComment(null)}
              className="h-8 px-3 rounded-full text-sm"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleSubmitEdit(comment.id)}
              className="h-8 px-4 rounded-full text-sm bg-orange-500 hover:bg-orange-600"
              disabled={!editText.trim() || editText === comment.content}
            >
              Save
            </Button>
          </div>
        </div>
      )
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative group",
          isReply ? "pl-6 border-l-2 border-gray-100 dark:border-gray-800 ml-6 mt-3" : "",
          isCompactView ? "py-2" : "py-3",
        )}
      >
        <div className="flex gap-3">
          <Avatar className={cn("border", isCompactView ? "h-8 w-8" : "h-10 w-10")}>
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={cn("font-semibold text-gray-900 dark:text-gray-100", isCompactView ? "text-sm" : "")}>
                {comment.author.name}
              </span>
              {comment.author.isVerified && (
                <span className="bg-blue-500 text-white rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              <span className={cn("text-gray-500 dark:text-gray-400", isCompactView ? "text-xs" : "text-sm")}>
                {comment.timeAgo}
              </span>
              {comment.isEdited && <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>}
            </div>

            <div className={cn("mt-1", isCompactView ? "text-sm" : "")}>
              {shouldTruncate ? (
                <>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {comment.content.substring(0, 280)}...{" "}
                    <button
                      onClick={() => handleToggleExpand(comment.id)}
                      className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
                    >
                      Read more
                    </button>
                  </p>
                </>
              ) : (
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {comment.content}
                  {isContentLong && isExpanded && (
                    <button
                      onClick={() => handleToggleExpand(comment.id)}
                      className="ml-1 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
                    >
                      Show less
                    </button>
                  )}
                </p>
              )}
            </div>

            <div className={cn("flex items-center gap-1 mt-2", isCompactView ? "mt-1" : "mt-3")}>
              {/* Reaction buttons */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={comment.hasLiked ? "secondary" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 px-3 rounded-full text-sm transition-all",
                      comment.hasLiked
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
                        : "border-gray-200 dark:border-gray-800",
                      isCompactView ? "h-7 px-2 text-xs" : "",
                    )}
                  >
                    <ThumbsUp className={cn("mr-1", isCompactView ? "h-3 w-3" : "h-3.5 w-3.5")} />
                    <span>{comment.likes}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <div className="flex gap-1">
                    {REACTIONS.map((reaction) => (
                      <button
                        key={reaction.name}
                        className="text-xl hover:scale-125 transition-transform p-1"
                        onClick={() => {
                          // Handle reaction
                        }}
                      >
                        {reaction.emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-3 rounded-full text-sm border-gray-200 dark:border-gray-800",
                  isCompactView ? "h-7 px-2 text-xs" : "",
                )}
                onClick={() => handleReplyClick(comment.id)}
              >
                <Reply className={cn("mr-1", isCompactView ? "h-3 w-3" : "h-3.5 w-3.5")} />
                <span>Reply</span>
              </Button>

              {comment.replies && comment.replies.length > 0 && showReplies[comment.id] && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3 rounded-full text-sm text-gray-600 dark:text-gray-300",
                    isCompactView ? "h-7 px-2 text-xs" : "",
                  )}
                  onClick={() => handleToggleReplies(comment.id)}
                >
                  {showReplies[comment.id] ? (
                    <>
                      <ChevronUp className={cn("mr-1", isCompactView ? "h-3 w-3" : "h-3.5 w-3.5")} />
                      <span>Hide replies ({comment.replies.length})</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className={cn("mr-1", isCompactView ? "h-3 w-3" : "h-3.5 w-3.5")} />
                      <span>Show replies ({comment.replies.length})</span>
                    </>
                  )}
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 rounded-full ml-auto opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity",
                      isCompactView ? "h-7 w-7" : "",
                    )}
                  >
                    <MoreHorizontal className={cn(isCompactView ? "h-3.5 w-3.5" : "h-4 w-4")} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleEditClick(comment.id, comment.content)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleDeleteComment(comment.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Reply input */}
            {replyingTo === comment.id && (
              <div className="mt-3 pl-0">
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      ref={replyInputRef}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[60px] mb-2 border-gray-200 dark:border-gray-800 focus-visible:ring-orange-400"
                      placeholder={`Reply to ${comment.author.name}...`}
                      maxLength={MAX_COMMENT_LENGTH}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                        className="h-8 px-3 rounded-full text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                        className="h-8 px-4 rounded-full text-sm bg-orange-500 hover:bg-orange-600"
                        disabled={!replyText.trim()}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && showReplies[comment.id] && (
              <div className="mt-3 space-y-3">{comment.replies.map((reply) => renderComment(reply, true))}</div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="p-6">
      {/* Settings bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 rounded-full text-sm border-gray-200 dark:border-gray-800"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 mr-1" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 mr-1" />
                <span>Dark</span>
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 ml-2">
            <Switch
              id="compact-mode"
              checked={isCompactView}
              onCheckedChange={setIsCompactView}
              className="data-[state=checked]:bg-orange-500"
            />
            <Label htmlFor="compact-mode" className="text-sm cursor-pointer">
              Compact view
            </Label>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 text-sm font-medium border-gray-200 dark:border-gray-800"
            >
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {sortOrder === "recent" ? "Most recent" : sortOrder === "likes" ? "Most liked" : "Oldest first"}
              </span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleSortChange("recent")} className="cursor-pointer">
              <Clock className="h-4 w-4 mr-2" />
              Most recent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("likes")} className="cursor-pointer">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Most liked
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("oldest")} className="cursor-pointer">
              <Clock className="h-4 w-4 mr-2" />
              Oldest first
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Comment Input Area */}
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg p-4 mb-6 border transition-all duration-200 ${
          activeToolbar
            ? "border-orange-300 dark:border-orange-700 shadow-md"
            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
        }`}
        onClick={handleCommentAreaClick}
      >
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 border dark:border-gray-700">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              placeholder="Add a comment..."
              className="min-h-10 border-none bg-transparent dark:bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-gray-100"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={addCommentMutation.isPending}
              maxLength={MAX_COMMENT_LENGTH}
            />

            {/* Character counter */}
            {activeToolbar && (
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs ${
                    commentText.length > MAX_COMMENT_LENGTH * 0.8
                      ? "text-orange-500 dark:text-orange-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {commentText.length}/{MAX_COMMENT_LENGTH}
                </span>
              </div>
            )}

            {/* Toolbar */}
            <AnimatePresence>
              {activeToolbar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-hide">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <Bold className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Bold</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <Italic className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Italic</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <Underline className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Underline</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <Link2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add image</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="grid grid-cols-8 gap-1 p-2">
                            {[
                              "😀",
                              "😂",
                              "😍",
                              "🤔",
                              "😎",
                              "👍",
                              "❤️",
                              "🔥",
                              "👏",
                              "🙏",
                              "🎉",
                              "🤣",
                              "😊",
                              "🥰",
                              "😇",
                              "😜",
                            ].map((emoji) => (
                              <button
                                key={emoji}
                                className="text-xl hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
                                onClick={() => handleAddEmoji(emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <AtSign className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Mention someone</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <Button
                      className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-full px-5"
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || addCommentMutation.isPending}
                    >
                      {addCommentMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Submit
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Comments Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold dark:text-white">Comments</h2>
          <Badge
            variant="secondary"
            className="ml-2 bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
          >
            {totalComments}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
          <TabsTrigger
            value="all"
            className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="answers"
            className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
          >
            Answers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8 rounded-lg border border-red-100 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20">
              <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
              <p className="text-red-600 dark:text-red-400 font-medium">Failed to load comments</p>
              <p className="text-red-500 dark:text-red-500/70 text-sm mb-4">Please try again later</p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-200 dark:border-gray-800">
                  <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No comments yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <>
                  <AnimatePresence>
                    {comments.map((comment) => (
                      <div key={comment.id}>
                        {renderComment(comment)}
                        {comments.indexOf(comment) < comments.length - 1 && <Separator className="my-1 opacity-50" />}
                      </div>
                    ))}
                  </AnimatePresence>

                  {comments.length >= 5 && (
                    <Button
                      variant="outline"
                      className="w-full text-orange-500 dark:text-orange-400 border-orange-200 dark:border-orange-900/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center justify-center gap-1 mt-4 py-6"
                    >
                      <span>Show more comments</span>
                      <ArrowDownToLine className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="questions" className="mt-4">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Filtered by questions</p>
          </div>
        </TabsContent>

        <TabsContent value="answers" className="mt-4">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Filtered by answers</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
