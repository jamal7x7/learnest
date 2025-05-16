// Announcements UI clone (Threads.com style) with dummy data

import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import '../../styles/view-transitions.css';

type Announcement = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  comments: { id: number; author: string; avatar: string; content: string; time: string }[];
};

const DUMMY_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    author: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    content: "🚀 Excited to announce our new feature! Check it out below.",
    time: "2h ago",
    comments: [
      {
        id: 1,
        author: "John Smith",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        content: "Looks awesome! Congrats to the team.",
        time: "1h ago",
      },
    ],
  },
  {
    id: 2,
    author: "Alice Lee",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    content: "Reminder: All hands meeting tomorrow at 10am. Don't miss it!",
    time: "4h ago",
    comments: [],
  },
];

export default function AnnouncementsPage() {
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [comment, setComment] = useState("");
  const [announcements, setAnnouncements] = useState(DUMMY_ANNOUNCEMENTS);

  function handleSelect(announcement: Announcement) {
    setSelected(announcement);
    setComment("");
  }

  function handleAddComment() {
    if (!selected || !comment.trim()) return;
    const newComment = {
      id: Date.now(),
      author: "You",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      content: comment,
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
    setComment("");
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* List */}
      <div className="flex-1 max-w-md space-y-4">
        <h2 className="text-xl font-bold mb-2">Announcements</h2>
        {announcements.map((a) => (
          <Card
            key={a.id}
            className={`cursor-pointer hover:bg-muted transition ${selected?.id === a.id ? "border-primary border-2" : ""}`}
            onClick={() => handleSelect(a)}
          >
            <div className="flex items-start gap-3 p-4">
              <Avatar>
                <img src={a.avatar} alt={a.author} />
              </Avatar>
              <div>
                <div className="font-semibold">{a.author}</div>
                <div className="text-sm text-muted-foreground">{a.content}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.time}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* Detail */}
      <div className="flex-1">
        {selected ? (
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <Avatar>
                <img src={selected.avatar} alt={selected.author} />
              </Avatar>
              <div>
                <div className="font-semibold">{selected.author}</div>
                <div className="text-sm text-muted-foreground">{selected.content}</div>
                <div className="text-xs text-muted-foreground mt-1">{selected.time}</div>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <div className="font-medium mb-2">Comments</div>
              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                {selected.comments.length === 0 && (
                  <div className="text-muted-foreground text-sm">No comments yet.</div>
                )}
                {selected.comments.map((c) => (
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
              <form
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  handleAddComment();
                }}
                className="flex gap-2"
              >
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
        ) : (
          <div className="text-muted-foreground text-center mt-20">Select an announcement to view details.</div>
        )}
      </div>
    </div>
  );
}
