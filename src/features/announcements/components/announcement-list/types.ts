import { Announcement } from '../types';

export interface AnnouncementListProps {
  announcements: Announcement[];
  onAnnouncementClick: (id: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  onToggleBookmark: (id: string, isBookmarked: boolean) => void;
  readAnnouncements: Record<string, boolean>;
  bookmarkedAnnouncements: Record<string, boolean>;
  readCounts: Record<string, number>;
  bookmarkCounts: Record<string, number>;
}

export interface AnnouncementStatusProps {
  readCount: number;
  bookmarkedCount: number;
  totalAnnouncements: number;
}

export interface AnnouncementListItemProps {
  announcement: Announcement;
  isRead: boolean;
  isBookmarked: boolean;
  readCount: number;
  bookmarkCount: number;
  onAnnouncementClick: (id: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  onToggleBookmark: (id: string, isBookmarked: boolean) => void;
}

export interface AnnouncementActionsProps {
  id: string;
  isRead: boolean;
  isBookmarked: boolean;
  readCount: number;
  bookmarkCount: number;
  commentCount: number;
  onToggleRead: (id: string, isRead: boolean) => void;
  onToggleBookmark: (id: string, isBookmarked: boolean) => void;
}
