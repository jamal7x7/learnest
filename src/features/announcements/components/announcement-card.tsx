import { Card } from "~/components/ui/card";
import { Avatar } from "~/components/ui/avatar";
import { type Announcement } from "~/features/announcements/types";

interface AnnouncementCardProps {
  announcement: Announcement;
  isSelected: boolean;
  onSelect: (announcement: Announcement) => void;
}

// Use default export for better code splitting
export default function AnnouncementCard({ announcement, isSelected, onSelect }: AnnouncementCardProps) {
  return (
    <Card
      key={announcement.id}
      className={`cursor-pointer hover:bg-muted transition ${isSelected ? "border-primary border-2" : ""}`}
      onClick={() => onSelect(announcement)}
    >
      <div className="flex items-start gap-3 p-4">
        <Avatar>
          <img src={announcement.avatar} alt={announcement.author} />
        </Avatar>
        <div>
          <div className="font-semibold">{announcement.author}</div>
          <div className="text-sm text-muted-foreground">{announcement.content}</div>
          <div className="text-xs text-muted-foreground mt-1">{announcement.time}</div>
        </div>
      </div>
    </Card>
  );
}