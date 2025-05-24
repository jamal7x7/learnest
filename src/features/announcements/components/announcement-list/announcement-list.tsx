import { useCallback } from 'react';
import { AnnouncementListItem } from './announcement-list-item';
import { AnnouncementStatus } from './announcement-status';
import { AnnouncementListProps } from './types';

export function AnnouncementList({
  announcements,
  onAnnouncementClick,
  onToggleRead,
  onToggleBookmark,
  readAnnouncements,
  bookmarkedAnnouncements,
  readCounts,
  bookmarkCounts,
}: AnnouncementListProps) {
  // Calculate counters for read and bookmarked announcements
  const readCount = Object.values(readAnnouncements).filter(Boolean).length;
  const bookmarkedCount = Object.values(bookmarkedAnnouncements).filter(Boolean).length;
  const totalAnnouncements = announcements.length;

  // Memoize the click handlers to prevent unnecessary re-renders
  const handleAnnouncementClick = useCallback((id: string) => {
    onAnnouncementClick(id);
  }, [onAnnouncementClick]);

  const handleToggleRead = useCallback((id: string, isRead: boolean) => {
    onToggleRead(id, isRead);
  }, [onToggleRead]);

  const handleToggleBookmark = useCallback((id: string, isBookmarked: boolean) => {
    onToggleBookmark(id, isBookmarked);
  }, [onToggleBookmark]);

  return (
    <div className="sm:w-2xl mx-auto mt-8 px-4 sm:px-6 announcements-container">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">Announcements</h1>
      
      <AnnouncementStatus 
        readCount={readCount} 
        bookmarkedCount={bookmarkedCount} 
        totalAnnouncements={totalAnnouncements} 
      />
      
      <div className="flex flex-col gap-4 animate-fade-in-scale">
        {announcements.map((announcement) => (
          <AnnouncementListItem
            key={announcement.id}
            announcement={announcement}
            isRead={!!readAnnouncements[announcement.id]}
            isBookmarked={!!bookmarkedAnnouncements[announcement.id]}
            readCount={readCounts[announcement.id] || 0}
            bookmarkCount={bookmarkCounts[announcement.id] || 0}
            onAnnouncementClick={handleAnnouncementClick}
            onToggleRead={handleToggleRead}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}
      </div>
    </div>
  );
}
