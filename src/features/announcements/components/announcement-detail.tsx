import { Separator } from "~/components/ui/separator";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card } from "~/components/ui/card";
import { type Announcement } from "../types";
import { useState } from "react";

interface AnnouncementDetailProps {
  announcement: Announcement | null;
  onAddComment: (comment: string) => void;
}

// Use default export for better code splitting
export default function AnnouncementDetail({ announcement, onAddComment }: AnnouncementDetailProps) {
  const [comment, setComment] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(comment);
      setComment("");
    }
  }

  if (!announcement) {
    return (
      <div className="text-muted-foreground text-center mt-20">
        Select an announcement to view details.
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <Avatar>
          <img src={announcement.avatar} alt={announcement.author} />
        </Avatar>
        <div>
          <div className="font-semibold">{announcement.author}</div>
          <div className="text-sm text-muted-foreground">{announcement.content}</div>
          <div className="text-xs text-muted-foreground mt-1">{announcement.time}</div>
        </div>
      </div>
      <Separator className="my-4" />
      <div>
        <div className="font-medium mb-2">Comments</div>
        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
          {announcement.comments.length === 0 && (
            <div className="text-muted-foreground text-sm">No comments yet.</div>
          )}
          {announcement.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar className="w-7 h-7">
                <img src={c.avatar} alt={c.author} />
              </Avatar>
              <div>
                <div className="text-xs font-semibold">{c.author}</div>
                <div className="text-xs">{c.content}</div>
                <div className="text-[10px] text-muted-foreground">{c.time}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="resize-none min-h-[40px]"
          />
          <Button type="submit" disabled={!comment.trim()}>
            Comment
          </Button>
        </form>
      </div>
    </Card>
  );
}