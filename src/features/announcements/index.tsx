// Announcements UI clone (Threads.com style) with dummy data

import { useState, lazy, Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import '../../styles/view-transitions.css';
import { DUMMY_ANNOUNCEMENTS, type Announcement } from "./types";

// Lazy load components to reduce initial bundle size
const AnnouncementCard = lazy(() => import("./components/announcement-card"));
const AnnouncementDetail = lazy(() => import("./components/announcement-detail"));

// Loading fallback components
const CardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
  </div>
);

const DetailSkeleton = () => (
  <div className="space-y-5">
    <div className="flex gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <Skeleton className="h-px w-full" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-24" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

export default function AnnouncementsPage() {
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [announcements, setAnnouncements] = useState(DUMMY_ANNOUNCEMENTS);

  function handleSelect(announcement: Announcement) {
    setSelected(announcement);
  }

  function handleAddComment(commentText: string) {
    if (!selected || !commentText.trim()) return;
    
    const newComment = {
      id: Date.now(),
      author: "You",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      content: commentText,
      time: "now",
    };
    
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === selected.id
          ? { ...a, comments: [...a.comments, newComment] }
          : a
      )
    );
    
    setSelected((prev) =>
      prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* List */}
      <div className="flex-1 max-w-md space-y-4">
        <h2 className="text-xl font-bold mb-2">Announcements</h2>
        <Suspense fallback={<CardSkeleton />}>
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isSelected={selected?.id === announcement.id}
              onSelect={handleSelect}
            />
          ))}
        </Suspense>
      </div>
      
      {/* Detail */}
      <div className="flex-1">
        <Suspense fallback={<DetailSkeleton />}>
          <AnnouncementDetail 
            announcement={selected} 
            onAddComment={handleAddComment} 
          />
        </Suspense>
      </div>
    </div>
  );
}
