import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/server/db'
import { team, teamMember } from '~/lib/server/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

export const joinTeamByInviteCode = createServerFn()
  .validator(
    z.object({
      inviteCode: z.string(),
      userId: z.string(),
    })
  )
  .handler(async ({ data }) => {
    // Find the team by invite code
    const [foundTeam] = await db
      .select()
      .from(team)
      .where(eq(team.inviteCode, data.inviteCode.toUpperCase()))
      .limit(1)

    if (!foundTeam) {
      throw new Error('Invalid invite code')
    }

    // Check if user is already a member
    const [existingMember] = await db
      .select()
      .from(teamMember)
      .where(and(
        eq(teamMember.teamId, foundTeam.id),
        eq(teamMember.userId, data.userId)
      ))
      .limit(1)

    if (existingMember) {
      throw new Error('You are already a member of this team')
    }

    // Check if team has reached max capacity
    if (foundTeam.maxMembers && foundTeam.memberCount >= foundTeam.maxMembers) {
      throw new Error('Team has reached maximum capacity')
    }

    // Add user to team
    await db.insert(teamMember).values({
      id: crypto.randomUUID(),
      teamId: foundTeam.id,
      userId: data.userId,
      role: 'member',
      joinedAt: new Date(),
    })

    // Update member count
    await db
      .update(team)
      .set({
        memberCount: foundTeam.memberCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(team.id, foundTeam.id))

    return foundTeam
  }) 