import { createFileRoute } from '@tanstack/react-router';
import { AnnouncementsList } from '~/features/announcements/AnnouncementsList';

export const Route = createFileRoute('/_authenticated/announcements/')({
  component: AnnouncementsList,
});
