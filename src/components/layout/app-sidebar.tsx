import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar'
import { NavGroup } from "~/components/layout/nav-group";
import { NavUser } from "~/components/layout/nav-user";
import { TeamSwitcher } from "~/components/layout/team-switcher";
import { sidebarData } from './data/sidebar-data'

export interface UserData {
  id?: string
  name?: string | null
  email?: string | null
  emailVerified?: boolean
  image?: string | null
  avatar?: string | null
  displayName?: string | null
  role?: string | null
  banned?: boolean | null
  banReason?: string | null
  banExpires?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export function AppSidebar({ userData, ...props }: React.ComponentProps<typeof Sidebar> & { userData?: UserData | null }) {
  return (
    <Sidebar  collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent >
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData || sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
