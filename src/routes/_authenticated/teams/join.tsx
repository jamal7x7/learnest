import { createFileRoute } from '@tanstack/react-router'
import JoinTeam from '~/features/teams/join'

export const Route = createFileRoute('/_authenticated/teams/join')({  
  component: JoinTeam,
})