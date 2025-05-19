import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { ANNOUNCEMENTS } from './data/announcements';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnnouncementList } from './components/announcement-list';

export function AnnouncementsList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Track read and bookmarked announcements in local state
  const [readAnnouncements, setReadAnnouncements] = React.useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('readAnnouncements');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [bookmarkedAnnouncements, setBookmarkedAnnouncements] = React.useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('bookmarkedAnnouncements');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Track per-announcement interaction counts
  const [readCounts, setReadCounts] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('readCounts');
    if (saved) {
      return JSON.parse(saved);
    } else {
      const defaultCounts: Record<string, number> = {};
      ANNOUNCEMENTS.forEach(a => {
        defaultCounts[a.id] = 0;
      });
      return defaultCounts;
    }
  });
  
  const [bookmarkCounts, setBookmarkCounts] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('bookmarkCounts');
    if (saved) {
      return JSON.parse(saved);
    } else {
      const defaultCounts: Record<string, number> = {};
      ANNOUNCEMENTS.forEach(a => {
        defaultCounts[a.id] = 0;
      });
      return defaultCounts;
    }
  });
  
  // Use TanStack Query to store and retrieve scroll position
  const { data: scrollPosition } = useQuery({
    queryKey: ['announcements', 'scrollPosition'],
    queryFn: () => 0,
    initialData: 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5, // Keep for 5 minutes
  });
  
  // Save to localStorage when state changes
  React.useEffect(() => {
    localStorage.setItem('readAnnouncements', JSON.stringify(readAnnouncements));
  }, [readAnnouncements]);
  
  React.useEffect(() => {
    localStorage.setItem('bookmarkedAnnouncements', JSON.stringify(bookmarkedAnnouncements));
  }, [bookmarkedAnnouncements]);
  
  React.useEffect(() => {
    localStorage.setItem('readCounts', JSON.stringify(readCounts));
  }, [readCounts]);
  
  React.useEffect(() => {
    localStorage.setItem('bookmarkCounts', JSON.stringify(bookmarkCounts));
  }, [bookmarkCounts]);
  
  // Restore scroll position when returning from detail view
  React.useEffect(() => {
    document.body.classList.add('fade-in');
    
    if (scrollPosition > 0 && containerRef.current) {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'auto'
      });
    }
    
    return () => document.body.classList.remove('fade-in');
  }, [scrollPosition]);
  
  // Handle navigation to announcement detail
  const handleAnnouncementClick = (announcementId: string) => {
    const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
    queryClient.setQueryData(['announcements', 'scrollPosition'], currentScrollPosition);
    navigate({ to: '/announcements/$announcementId', params: { announcementId } });
  };

  // Handle toggling read status
  const handleToggleRead = (id: string, isRead: boolean) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setReadAnnouncements(prev => ({
          ...prev,
          [id]: !isRead
        }));
        
        setReadCounts(prev => ({
          ...prev,
          [id]: !isRead ? (prev[id] || 0) + 1 : Math.max(0, (prev[id] || 0) - 1)
        }));
      });
    } else {
      setReadAnnouncements(prev => ({
        ...prev,
        [id]: !isRead
      }));
      
      setReadCounts(prev => ({
        ...prev,
        [id]: !isRead ? (prev[id] || 0) + 1 : Math.max(0, (prev[id] || 0) - 1)
      }));
    }
  };

  // Handle toggling bookmark status
  const handleToggleBookmark = (id: string, isBookmarked: boolean) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setBookmarkedAnnouncements(prev => ({
          ...prev,
          [id]: !isBookmarked
        }));
        
        setBookmarkCounts(prev => ({
          ...prev,
          [id]: !isBookmarked ? (prev[id] || 0) + 1 : Math.max(0, (prev[id] || 0) - 1)
        }));
      });
    } else {
      setBookmarkedAnnouncements(prev => ({
        ...prev,
        [id]: !isBookmarked
      }));
      
      setBookmarkCounts(prev => ({
        ...prev,
        [id]: !isBookmarked ? (prev[id] || 0) + 1 : Math.max(0, (prev[id] || 0) - 1)
      }));
    }
  };

  return (
    <div ref={containerRef}>
      <AnnouncementList
        announcements={ANNOUNCEMENTS}
        onAnnouncementClick={handleAnnouncementClick}
        onToggleRead={handleToggleRead}
        onToggleBookmark={handleToggleBookmark}
        readAnnouncements={readAnnouncements}
        bookmarkedAnnouncements={bookmarkedAnnouncements}
        readCounts={readCounts}
        bookmarkCounts={bookmarkCounts}
      />
    </div>
  );
}

