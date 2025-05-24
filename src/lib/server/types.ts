import type { InferSelectModel } from "drizzle-orm";
import type { user as userTable } from "./schema";

export type User = InferSelectModel<typeof userTable>;

// Define priority levels centrally
export enum AnnouncementPriority {
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

// Define announcement status types
export enum AnnouncementStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  CANCELLED = "cancelled",
}
