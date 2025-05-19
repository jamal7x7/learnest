export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  time: string;
  avatar?: string;
  likes?: number;
  hasLiked?: boolean;
  reactions?: string[];
  replies?: Comment[];
  isAuthor?: boolean;
  role?: string;
  isReply?: boolean;
  timeAgo?: string;
}

export interface Announcement {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  date: string;
  time: string;
  isRead?: boolean;
  isBookmarked?: boolean;
  comments: Comment[];
}

export interface AnnouncementDetailProps {
  announcement: Announcement;
  onBack: () => void;
}

export interface StatusAnimationProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface CommentFormProps {
  commentInput: string;
  onCommentInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export interface CommentItemProps {
  comment: Comment;
  isNew?: boolean;
}

export interface AnnouncementHeaderProps {
  onBack: () => void;
  onMarkAsRead: () => void;
  onBookmark: () => void;
  isRead: boolean;
  isBookmarked: boolean;
  announcementId: string;
}

export interface AnnouncementCardProps {
  announcement: Omit<Announcement, 'comments'>;
}