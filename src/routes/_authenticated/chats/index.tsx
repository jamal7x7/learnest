import { createFileRoute, redirect } from '@tanstack/react-router'
import Chats from '~/features/chats'

export const Route = createFileRoute('/_authenticated/chats/')({
  component: Chats,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  }
})
