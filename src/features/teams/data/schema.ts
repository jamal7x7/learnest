import { z } from 'zod'

const teamTypeSchema = z.union([
  z.literal('class'),
  z.literal('study-group'),
  z.literal('club'),
  z.literal('committee'),
])
export type TeamType = z.infer<typeof teamTypeSchema>

const teamStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('archived'),
])
export type TeamStatus = z.infer<typeof teamStatusSchema>

const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: teamTypeSchema,
  status: teamStatusSchema,
  memberCount: z.number(),
  maxMembers: z.number().optional(),
  inviteCode: z.string(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Team = z.infer<typeof teamSchema>

export const teamListSchema = z.array(teamSchema)
export type TeamList = z.infer<typeof teamListSchema>