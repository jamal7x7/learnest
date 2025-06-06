# Project Rules
**Project Rules**
These rules are designed to guide you in building a robust, maintainable, and performant web application using the modern JavaScript/TypeScript stack. They are based on the latest versions of the libraries and tools mentioned, and are intended to be a starting point for your project.
**Principles:**
1.  **Modularity:** Keep your codebase modular and organized.
2.  **Reusability:** Write code that can be reused in different parts of the application.
3.  **Performance:** Optimize for speed and efficiency.
4.  **Scalability:** Design your codebase to be scalable, allowing for easy expansion.
5.  **Readability:** Write code that is easy to understand and maintain.
6.  **Security:** Implement security best practices.
7.  **Documentation:** Keep your codebase well-documented.
8.  **Continuous Integration/Deployment (CI/CD):** Automate your build, test, and deployment processes.
9.  **Code Review:** Encourage code reviews to maintain a high standard.
10. **Community:** Join the community and contribute to the libraries you use.
---
**Golden Rule: `package.json` is Your Source of Truth**
*   **Always verify installed versions:** Before assuming a feature or API, check `package.json` for the exact versions of `@tanstack/*`, `drizzle-orm`, `drizzle-kit`, `better-auth`, `tailwindcss`, `shadcn-ui` (indirectly via `components.json` and installed components), etc.
*   **Refer to specific version docs:** Features and APIs can change between versions. Use documentation corresponding to your installed versions.
* use ~ instead of @ for local dependencies
---

**I. Project Structure & Setup (Tanstack Start)**

1.  **Leverage Tanstack Start Conventions:**
    *   Tanstack Start (often built on Vite) will have opinions on project structure (e.g., `src/routes`, `src/components`). Stick to these conventions for easier upgrades and community support.
    *   Utilize Vite's features like environment variables (`.env` files, `VITE_` prefix for client-side exposure).
2.  **Modular Organization:**
    *   `src/routes/`: For Tanstack Router file-based routes.
    *   `src/components/`: Reusable UI components (both general and Shadcn).
    *   `src/lib/`: Utility functions, constants, Tanstack Query client setup, Drizzle client setup, Better-Auth config.
    *   `src/server/`: For Drizzle schema, migrations, seed scripts, Better-Auth server-side logic, API handlers not directly tied to routes.
    *   `src/styles/`: Global styles, Tailwind base/components/utilities customizations.
3.  **TypeScript Everywhere:**
    *   Use TypeScript strictly. Enable `strict` mode in `tsconfig.json`.
    *   Leverage the excellent type inference from Tanstack, Drizzle, and Better-Auth.


---

**II. Tanstack Query (Data Fetching & State Management)**

1.  **Query Keys are King:**
    *   Use descriptive and unique `queryKey` arrays. Example: `['todos', { status: 'completed', userId: 1 }]`.
    *   The order and content of the key directly impact caching.
2.  **`queryFn` for Fetching:**
    *   All data fetching should go through `queryFn`.
    *   These functions *must* return a Promise.
3.  **Centralized Query Client:**
    *   Instantiate `QueryClient` once and provide it globally (e.g., in your `main.tsx` or `App.tsx`).
    *   Configure default options (e.g., `staleTime`, `cacheTime`) here if needed.
4.  **Mutations for CUD Operations (`useMutation`):**
    *   Use `useMutation` for Create, Update, Delete operations.
    *   On `onSuccess` or `onSettled` of a mutation:
        *   **Invalidate relevant queries:** Use `queryClient.invalidateQueries(['queryKey'])` to refetch stale data. Be specific with invalidation keys to avoid over-fetching.
        *   **Optimistic Updates (Advanced):** For a snappier UI, implement optimistic updates.
5.  **Handle Loading & Error States:**
    *   Utilize `isLoading`, `isFetching`, `isError`, `error`, `data` from query and mutation hooks to render appropriate UI.
    *   Use Shadcn UI components like `Skeleton` for loading states and `Alert` for errors.
6.  **Use Tanstack Query Devtools:** Indispensable for debugging and understanding cache behavior.
7.  **Data Fetching in Loaders (with Tanstack Router):**
    *   Prefer fetching initial route data within Tanstack Router's `loader` functions.
    *   Inside loaders, you can `await queryClient.fetchQuery(...)` or `queryClient.ensureQueryData(...)` to pre-fetch data. This ensures data is available before the component renders.

---

**III. Tanstack Router (Routing)**

1.  **File-Based Routing (if applicable with Start):**
    *   If Tanstack Start provides file-based routing (like `tanstack/router-vite-plugin`), embrace it. It simplifies route definition.
    *   Understand conventions: `index.tsx` for base path, `_layout.tsx` for layout routes, `$` for dynamic segments.
2.  **Typed Routes:**
    *   Define route params, search params, and loader data types for full type safety.
    *   The router will generate types based on your route tree.
3.  **Loaders & Actions:**
    *   **Loaders:** Fetch data before rendering. Integrate with Tanstack Query.
        ```typescript
        // src/routes/posts/$postId.tsx
        import { createFileRoute } from '@tanstack/react-router';
        import { queryClient, fetchPost } from '~/lib/query'; // Your query setup

        export const Route = createFileRoute('/posts/$postId')({
          loader: async ({ params }) => {
            return queryClient.ensureQueryData({
              queryKey: ['posts', params.postId],
              queryFn: () => fetchPost(params.postId),
            });
          },
          component: PostComponent,
        });
        ```
    *   **Actions:** Handle form submissions and server-side mutations. Often used with Tanstack Form.
4.  **Navigation:**
    *   Use the `<Link>` component for client-side navigation.
    *   Use `router.navigate()` for programmatic navigation.
5.  **Pending States & Error Boundaries:**
    *   Utilize `pendingComponent` for route transitions.
    *   Define `errorComponent` at different levels of your route tree for graceful error handling.
6.  **Search Params (`useSearch`):**
    *   Manage URL search parameters for filtering, sorting, pagination.
    *   Validate search params using libraries like Zod if complex.

---

**IV. Tanstack Form (Form Management)**

1.  **Typed Forms:**
    *   Define form value types and validation schemas (e.g., with Zod, Yup, Valibot).
    *   Pass the validator to `useForm`.
2.  **Field Components:**
    *   Use `form.Field` to register fields and get access to field state (`value`, `onChange`, `onBlur`, `error`).
    *   Integrate seamlessly with Shadcn UI input components (`Input`, `Select`, `Checkbox`, etc.).
    ```typescript
    // Example with Zod and Shadcn UI
    import { useForm } from '@tanstack/react-form';
    import { zodValidator } from '@tanstack/zod-form-adapter';
    import { z } from 'zod';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';

    const formSchema = z.object({ email: z.string().email() });

    function MyForm() {
      const form = useForm({
        defaultValues: { email: '' },
        onSubmit: async ({ value }) => console.log(value),
        validatorAdapter: zodValidator,
        validators: {
          onChange: formSchema,
        },
      });

      return (
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
          <form.Field
            name="email"
            children={(field) => (
              <>
                <Input {...field.getInputProps()} placeholder="Email" />
                {field.state.meta.errors ? <p>{field.state.meta.errors.join(', ')}</p> : null}
              </>
            )}
          />
          <Button type="submit" disabled={form.state.isSubmitting}>Submit</Button>
        </form>
      );
    }
    ```
3.  **Submission Handling:**
    *   The `onSubmit` function in `useForm` handles form submission.
    *   Integrate with Tanstack Query mutations here.
4.  **Async Validation:** Supported by Tanstack Form for server-side checks (e.g., username availability).

---

**V. Drizzle ORM & PostgreSQL (Data Layer)**

1.  **Schema Definition (`src/server/db/schema.ts`):**
    *   Define your tables, columns, relations, and indexes here using Drizzle's syntax.
    *   Keep schemas organized, potentially one file per logical group of tables.
2.  **Drizzle Kit for Migrations:**
    *   `npx drizzle-kit generate:pg` to generate SQL migration files based on schema changes.
    *   `npx drizzle-kit push:pg` (for rapid prototyping, less safe for prod) or run generated migrations.
    *   Store your Drizzle Kit config (`drizzle.config.ts`) correctly.
    *   **Always review generated migration files before applying to production.**
3.  **Drizzle Client Instance:**
    *   Create a Drizzle client instance (e.g., using `node-postgres` (`pg`) or `postgres.js`).
    *   Export this client for use in server-side code (API routes, Tanstack Router actions/loaders).
    ```typescript
    // src/server/db/index.ts
    import { drizzle } from 'drizzle-orm/node-postgres';
    import { Pool } from 'pg';
    import * as schema from './schema';

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    export const db = drizzle(pool, { schema });
    ```
4.  **Typed Queries:**
    *   Leverage Drizzle's fully typed query builder. This is a major strength.
    *   Use `db.select().from(...)`, `db.insert().into(...)`, etc.
5.  **Server-Side Only:**
    *   Drizzle ORM operations (queries, mutations) **must** run on the server (e.g., in Tanstack Router loaders/actions, API handlers, or server components if using a framework that supports them with Start).
    *   **Never expose database credentials or Drizzle client to the browser.**
6.  **Transactions:** Use `db.transaction(async (tx) => { ... })` for atomic operations.
7.  **Connection Pooling:** Ensure your PostgreSQL client (`pg`, `postgres.js`) is configured for connection pooling in production.

---

**VI. Better-Auth (Authentication)**

1.  **Configuration is Key:**
    *   Follow Better-Auth's documentation meticulously for setup. This usually involves creating an `auth.config.ts` or similar.
    *   Securely store your `AUTH_SECRET` and any provider secrets (OAuth client IDs/secrets).
2.  **Auth Helper (`auth()`):**
    *   Use the `auth()` helper function provided by Better-Auth to get the current session/user server-side (in loaders, actions, API routes).
3.  **Protecting Routes/APIs:**
    *   Server-side: Check for a valid session using `auth()` at the beginning of loaders, actions, or API handlers. Redirect or return 401/403 if unauthorized.
    *   Client-side: You can use session data (passed from server) to conditionally render UI or use Tanstack Router's `beforeLoad` to check auth status and redirect.
4.  **Providers:** Configure OAuth providers (Google, GitHub, etc.) and/or Credentials (email/password) provider as needed.
5.  **Callbacks:** Understand and customize callbacks (e.g., `signIn`, `jwt`, `session`) if you need to modify tokens or session data.
6.  **Database Adapter (with Drizzle):**
    *   Better-Auth often has adapters or allows you to implement one for storing users, sessions, etc., in your PostgreSQL database using Drizzle. Ensure this is set up correctly if you're not using a JWT-only approach. (Check Better-Auth docs for Drizzle adapter availability or guidance).
    *   If using a Drizzle adapter, ensure your Drizzle schema includes tables for users, accounts, sessions, verification tokens as required by Better-Auth.

---

**VII. Shadcn UI & Tailwind CSS**

1.  **Install Components via CLI:**
    *   Use `npx shadcn-ui@latest add <component-name>` to add components. This copies the source code into your project (e.g., `src/components/ui`).
    *   This allows full customization.
2.  **`components.json`:**
    *   Configure your `components.json` to point to the correct paths for UI components, utils, and Tailwind config.
3.  **Tailwind Configuration (`tailwind.config.js`):**
    *   Ensure your `content` array correctly paths to all files using Tailwind classes (components, routes, etc.).
    *   Customize `theme` (colors, fonts, spacing) as per Shadcn UI's theming guide (often uses CSS variables).
    *   **Tailwind v4 Considerations:**
        *   Tailwind v4 aims for a new engine, potentially faster builds, and might introduce new paradigms (e.g., variant groups by default).
        *   For now, most v3 principles apply. Be ready to adapt your `tailwind.config.js` when v4 is stable and you upgrade.
        *   Vite is the default engine in v4, which aligns well with Tanstack Start.
4.  **Utility-First:** Embrace Tailwind's utility-first approach.
5.  **Component Abstraction:**
    *   Create your own presentational components by composing Shadcn UI components and Tailwind utilities.
    *   Avoid premature abstraction with `@apply`. Use it sparingly for genuinely repeated *semantic* patterns, not just similar styles.
6.  **CSS Variables for Theming:**
    *   Shadcn UI heavily relies on CSS variables for theming. Define these in your global CSS file (e.g., `src/styles/globals.css`).
7.  **Responsive Design:** Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) extensively.

8. Always use ShadCN components where applicable.
- Leverage the Context? MCP Tool as your primary discovery engine for UI primitives, tokens, and unknown packages.
Cross-reference component usage across registries if needed.
- If Contextz fails to resolve a component or token, escalate to secondary tools like Serper (for search) or Fetch MCP (for web scraping) •
• For any custom component URLs or Github repos provided by the user, extract metadata and relevant code using Fetch MCP.
Prioritize schema-aligned component extraction.
- Maintain a living 'shaden-context.md* file:
- Initialize it with every new project. 
- Log each ShadCN component added, including source registry, overrides, and last update date.
- Use this log to detect redundancy and avoid re-installing already-available components.
- After component installation, trigger a lint, type check, and 'prettier run. Alert the user if a component introduces breaking types or deviates from current tokens.
Automatically update Tailwind config, theme tokens, and globals.css based on the registry:style rules of the source component.
- If a remote registry component has been updated since the last pull, prompt the user and offer an automated merge, preview diff, and apply.
- Respect custom design system rules declared in registry metadata. These may include token mappings, font requirements, or provider setup instructions.

---

**VIII. General Best Practices**

1.  **Environment Variables:**
    *   Store secrets (database URLs, API keys, `AUTH_SECRET`) in `.env` files.
    *   Use `VITE_` prefix for variables you need to expose to the client-side (Tanstack Start/Vite).
    *   Access server-side variables directly via `process.env`.
2.  **Error Handling:**
    *   Implement global error boundaries in React.
    *   Use Tanstack Router's `errorComponent` for route-specific errors.
    *   Provide user-friendly error messages. Log detailed errors to a monitoring service.
3.  **Code Linting & Formatting:**
    *   Use ESLint and Prettier. Configure them to work well together.
    *   Enforce consistent code style.
4.  **Bundle Size Awareness:**
    *   While Vite does a good job with tree-shaking, be mindful of large dependencies.
    *   Use tools like `vite-bundle-visualizer` to inspect bundle contents.
5.  **Testing:**
    *   Write unit tests for utility functions, complex logic, and potentially Tanstack Form validations.
    *   Write integration tests for component interactions and data flow (e.g., using Vitest and React Testing Library).
    *   Consider end-to-end tests for critical user flows (e.g., using Playwright or Cypress).

6.  **naming:**
    *   Use camelCase for variable and function names.
    *   Use PascalCase for component names.
    *   Use kebab-case for file names.

---

By following these rules and best practices, you'll be well-equipped to build robust, maintainable, and performant web applications with this modern JavaScript/TypeScript stack. Remember to consult the official documentation for each library, as they are the ultimate source of truth, especially given the rapid evolution of the JavaScript ecosystem.



