import { Link, useNavigate, useLoaderData } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import authClient from '~/lib/auth-client';

export function ProfileDropdown() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const data = useLoaderData({ from: '/_authenticated' });
  const user: Partial<{ name: string; email: string; avatar: string; image: string | null }> = data?.user || {};

  const displayName = user?.name || user?.email || 'User';
  const displayEmail = user?.email || '';
  const displayAvatar = user?.avatar || user?.image || `/avatars/01.png`;
  const displayInitials = typeof displayName === 'string'
    ? displayName.split(' ').map((n: string) => n?.[0] || '').join('').toUpperCase() || 'U'
    : 'U';

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      queryClient.clear();
      navigate({ to: '/login' });
      toast.success('Successfully logged out');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout failed:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback>{displayInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{displayName}</p>
            {displayEmail && (
              <p className='text-muted-foreground text-xs leading-none'>{displayEmail}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
