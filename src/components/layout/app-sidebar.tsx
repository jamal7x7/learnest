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

export function AppSidebar({ userData, ...props }: React.ComponentProps<typeof Sidebar> & { userData?: { name?: string; email?: string; avatar?: string |null } }) {
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
        <NavUser user={userData?.name && userData?.email && userData?.avatar ? { name: userData.name, email: userData.email, avatar: userData.avatar || '' } : sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
