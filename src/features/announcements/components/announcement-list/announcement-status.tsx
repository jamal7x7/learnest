import { CheckCircle2, BookmarkCheck } from 'lucide-react';
import { AnnouncementStatusProps } from './types';

export function AnnouncementStatus({ readCount, bookmarkedCount, totalAnnouncements }: AnnouncementStatusProps) {
  return (
    <div className="flex items-center justify-between mb-4 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="status-counter text-primary">
          <CheckCircle2 className="w-4 h-4 fill-primary/20" />
          <span className="text-sm font-medium">{readCount} of {totalAnnouncements} read</span>
        </div>
        <div className="status-counter text-yellow-500">
          <BookmarkCheck className="w-4 h-4 fill-yellow-500/20" />
          <span className="text-sm font-medium">{bookmarkedCount} bookmarked</span>
        </div>
      </div>
    </div>
  );
}
