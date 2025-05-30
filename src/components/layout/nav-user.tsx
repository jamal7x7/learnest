import { Link, useNavigate } from '@tanstack/react-router'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import authClient from '~/lib/auth-client'
import type { UserData } from './app-sidebar' // Import UserData type
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: UserData | null
}) {
  const { isMobile } = useSidebar()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      queryClient.clear()
      navigate({ to: '/login' })
      toast.success('Successfully logged out')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Failed to log out. Please try again.')
    }
  }

  // If user is null, use the sidebar data fallback
  const displayUser = user || {
    name: 'User',
    email: '',
    avatar: ''
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage 
                  src={displayUser.avatar || `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(displayUser?.name || displayUser?.email || 'User')}` || displayUser.image || ''} 
                  alt={displayUser.name || displayUser.displayName || 'User'} 
                />
                <AvatarFallback className='rounded-lg'>
                  {displayUser.name?.[0]?.toUpperCase() || displayUser.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>     
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {displayUser.name || displayUser.displayName || displayUser.email || 'User'}
                </span>
                {displayUser.email && (
                  <span className='truncate text-xs'>{displayUser.email}</span>
                )}
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={  user?.avatar || `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(user?.name || user?.email || 'User')}`} alt={user?.name || 'User'} />
                  <AvatarFallback className='rounded-lg'>SN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user?.name || 'User'}</span>
                  <span className='truncate text-xs'>{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to='/settings/account'>
                  <BadgeCheck />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings'>
                  <CreditCard />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings/notifications'>
                  <Bell />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
