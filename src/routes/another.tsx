import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/another')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1>
      Hello "/another"!
      </h1>

  <Button type="button" asChild variant={"default"} className="mb-2 w-fit bg-indigo-600" size="lg">

  <Link to="/dashboard">Go</Link>
  </Button>
  <Button type="button" asChild variant={"default"} className="mb-2 w-fit bg-indigo-600" size="lg">

  <Link to="/current-user/$currentUserId" params={{currentUserId:'X1mYaqFMAuguZEOf77gCAOErgczJiPsc'}}>Go to Users</Link>
  </Button>
  </div>
}
