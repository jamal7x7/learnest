import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { admin, organization } from "better-auth/plugins"

import { db } from "./db";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
  baseURL: process.env.VITE_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  // https://www.better-auth.com/docs/integrations/tanstack#usage-tips
  plugins: [ 
    admin({
      ac,
      roles,
      adminRoles: ["teacher", "staff", "dev"],
      defaultRole: "student"
    }),
    organization({
      teams: {
          enabled: true,
          maximumTeams: 10, // Optional: limit teams per organization
          allowRemovingAllTeams: false // Optional: prevent removing the last team
      }
    }),
    reactStartCookies()
  ],

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // https://www.better-auth.com/docs/concepts/oauth
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // https://www.better-auth.com/docs/authentication/email-password
  emailAndPassword: {
    enabled: true,
  },
});

