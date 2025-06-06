import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins"
import { ac, roles } from "./server/permissions";

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
  plugins: [
    adminClient({
      ac,
      roles
    }),
    organizationClient({
      teams: {
          enabled: true
      }
  })
  ]
});

export default authClient;
