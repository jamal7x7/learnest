import { db } from "~/lib/server/db";
import { team, teamMember } from "~/lib/server/schema";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";

// Generate a 6-character invite code
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Create a new team
export async function createTeam(data: {
  name: string;
  description?: string;
  type?: string;
  maxMembers?: number;
  createdBy: string;
  organizationId: string;
}) {
  const inviteCode = generateInviteCode();
  
  // Create the team
  const [newTeam] = await db.insert(team).values({
    id: nanoid(),
    name: data.name,
    description: data.description,
    type: data.type || 'class',
    status: 'active',
    memberCount: 1,
    maxMembers: data.maxMembers || 30,
    inviteCode,
    organizationId: data.organizationId,
    createdBy: data.createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  // Add the creator as a teacher/admin
  await db.insert(teamMember).values({
    id: nanoid(),
    teamId: newTeam.id,
    userId: data.createdBy,
    role: 'teacher',
    joinedAt: new Date(),
  });

  return newTeam;
}

// Join a team using invite code
export async function joinTeamByInviteCode({
  inviteCode,
  userId,
}: {
  inviteCode: string
  userId: string
}) {
  // Find the team by invite code
  const [foundTeam] = await db
    .select()
    .from(team)
    .where(eq(team.inviteCode, inviteCode.toUpperCase()))
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
      eq(teamMember.userId, userId)
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
    id: nanoid(),
    teamId: foundTeam.id,
    userId,
    role: 'member',
  })
  
  // Update member count
  await db
    .update(team)
    .set({ 
      memberCount: foundTeam.memberCount + 1,
      updatedAt: new Date()
    })
    .where(eq(team.id, foundTeam.id))
  
  return foundTeam
}

// Get teams for a user
export async function getUserTeams(userId: string) {
  return await db
    .select({
      id: team.id,
      name: team.name,
      description: team.description,
      type: team.type,
      status: team.status,
      memberCount: team.memberCount,
      maxMembers: team.maxMembers,
      inviteCode: team.inviteCode,
      createdBy: team.createdBy,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      userRole: teamMember.role,
    })
    .from(team)
    .innerJoin(teamMember, eq(team.id, teamMember.teamId))
    .where(eq(teamMember.userId, userId))
}

// Get team by ID (for teachers to see invite code)
export async function getTeamById(teamId: string, userId: string) {
  const [result] = await db
    .select({
      id: team.id,
      name: team.name,
      description: team.description,
      type: team.type,
      status: team.status,
      memberCount: team.memberCount,
      maxMembers: team.maxMembers,
      inviteCode: team.inviteCode,
      createdBy: team.createdBy,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      userRole: teamMember.role,
    })
    .from(team)
    .innerJoin(teamMember, eq(team.id, teamMember.teamId))
    .where(and(
      eq(team.id, teamId),
      eq(teamMember.userId, userId)
    ))
    .limit(1)
  
  return result
}