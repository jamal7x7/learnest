import { createFileRoute } from '@tanstack/react-router'
import CreateCode from '~/features/teams/create-code'

export const Route = createFileRoute('/_authenticated/teams/create-code')({  
  component: CreateCode,
})