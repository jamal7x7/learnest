import { createFileRoute } from '@tanstack/react-router';
import { AnnouncementDetail } from '~/features/announcements/AnnouncementDetail';
import { ANNOUNCEMENTS } from '~/features/announcements/data/announcements';
import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute("/_authenticated/announcements/$announcementId")({
  component: AnnouncementDetailRoute,
  
});

function AnnouncementDetailRoute() {
  const { announcementId } = Route.useParams() as { announcementId: string };
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  
  // Get read and bookmarked state from localStorage
  const [readAnnouncements, setReadAnnouncements] = React.useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('readAnnouncements');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [bookmarkedAnnouncements, setBookmarkedAnnouncements] = React.useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bookmarkedAnnouncements');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  // Find the announcement and enhance it with read/bookmarked state
  const baseAnnouncement = ANNOUNCEMENTS.find((a) => a.id === announcementId);
  
  // Create enhanced announcement with read/bookmarked state
  const announcement = baseAnnouncement ? {
    ...baseAnnouncement,
    isRead: readAnnouncements[announcementId] || false,
    isBookmarked: bookmarkedAnnouncements[announcementId] || false
  } : null;
  
  // Update localStorage when announcement is viewed/bookmarked
  React.useEffect(() => {
    if (announcement && announcement.isRead) {
      const newReadAnnouncements = { ...readAnnouncements, [announcementId]: true };
      localStorage.setItem('readAnnouncements', JSON.stringify(newReadAnnouncements));
    }
  }, [announcement?.isRead]);
  
  React.useEffect(() => {
    if (announcement && typeof announcement.isBookmarked !== 'undefined') {
      const newBookmarkedAnnouncements = { ...bookmarkedAnnouncements, [announcementId]: announcement.isBookmarked };
      localStorage.setItem('bookmarkedAnnouncements', JSON.stringify(newBookmarkedAnnouncements));
    }
  }, [announcement?.isBookmarked]);

  if (!announcement) {
    return <div className="p-8">Announcement not found.</div>;
  }

  return (
    <AnnouncementDetail
      announcement={announcement}
      onBack={() => {
        // Ensure state is updated before navigating back
        if (announcement) {
          const newReadAnnouncements = { ...readAnnouncements };
          if (announcement.isRead) {
            newReadAnnouncements[announcementId] = true;
            localStorage.setItem('readAnnouncements', JSON.stringify(newReadAnnouncements));
          }
          
          const newBookmarkedAnnouncements = { ...bookmarkedAnnouncements };
          newBookmarkedAnnouncements[announcementId] = announcement.isBookmarked || false;
          localStorage.setItem('bookmarkedAnnouncements', JSON.stringify(newBookmarkedAnnouncements));
        }
        
        // Get the stored scroll position from the query cache
        const scrollPosition = queryClient.getQueryData(['announcements', 'scrollPosition']) || 0;
        
        // Navigate back to the announcements list
        navigate({ to: '/announcements' });
      }}
    />
  );
}
