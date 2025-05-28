import { createAPIFileRoute } from "@tanstack/react-start/api";
import { z } from 'zod';
import { createTeam } from '~/features/teams/api/teams.api';

const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().optional(),
  type: z.string().optional(),
  maxMembers: z.number().optional(),
  createdBy: z.string(),
  organizationId: z.string(),
});

export const APIRoute = createAPIFileRoute("/api/teams/$")({
  POST: async (args) => {
    try {
      const body = await args.request.json();
      const data = createTeamSchema.parse(body);
      const team = await createTeam(data);
      
      return new Response(JSON.stringify(team), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
});
