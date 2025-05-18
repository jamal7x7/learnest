export type Announcement = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  comments: Comment[];
};

export type Comment = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
};

export const DUMMY_ANNOUNCEMENTS: Announcement[] = [
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