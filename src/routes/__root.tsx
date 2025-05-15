import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { ThemeProvider } from "~/context/theme-context";
import { FontProvider } from "~/context/font-context";
import { SidebarVisibilityProvider } from "~/context/sidebar-visibility-context";
import { InjectThemeScript } from "~/lib/inject-theme-script";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { auth } from "~/lib/server/auth";
import appCss from "~/lib/styles/app.css?url";

const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({ headers });

  return session?.user || null;
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: Awaited<ReturnType<typeof getUser>>;
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: ["user"],
      queryFn: ({ signal }) => getUser({ signal }),
    }); // we're using react-query for caching, see router.tsx
    return { user };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Learnest",
      },
      {
        name: "description",
        content: "Secure communication and learning with Learnest.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <FontProvider>
        <SidebarVisibilityProvider>
          <RootDocument>
            <Outlet />
          </RootDocument>
        </SidebarVisibilityProvider>
      </FontProvider>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
        <InjectThemeScript />
      </head>
      <body>

        {children}

        {/* <ReactQueryDevtools  buttonPosition="bottom-left" /> */}
        {/* <TanStackRouterDevtools position="bottom-right" /> */}

        <Scripts />
      </body>
    </html>
  );
}
