import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { AnnouncementCardProps } from "../types";

export function AnnouncementDetailCard({ 
  announcement,
  className,
  ...props 
}: AnnouncementCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const { 
    id, 
    author, 
    avatar, 
    content, 
    date, 
    isRead, 
    isBookmarked 
  } = announcement;

  return (
    <Card 
      className={cn(
        "pb-0 pt-0 w-full border-[0.5px]  bg-accent/20 backdrop-blur-sm   sm:w-2xl animate-slide-in shadow-md hover:shadow-lg transition-all duration-300 announcement-card-hover",
        isRead ? "border-1 border-primary/5" : "",
        isBookmarked ? "border-1 border-yellow-500/5" : "",
        className
      )}
      style={{ viewTransitionName: `announcement-card-${id}` }}
      {...props}
    >
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Avatar 
            className="rounded-xl w-12 h-12 ring-2 ring-primary/10 transition-all duration-300 avatar-hover"
            style={{ viewTransitionName: `announcement-avatar-${id}` }}
          >
            <AvatarImage
              src={avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(author)}`}
              alt={author}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(author)}`;
              }}
            />
            <AvatarFallback>
              {author
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{author}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </div>
        <div 
          className="text-lg mt-4 leading-relaxed"
          style={{ viewTransitionName: `announcement-content-${id}` }}
        >
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
