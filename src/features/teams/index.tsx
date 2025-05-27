import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { TopNav } from '~/components/layout/top-nav'
import { columns } from './components/teams-columns'
import { TeamsDialogs } from './components/teams-dialogs'
import { TeamsPrimaryButtons } from './components/teams-primary-buttons'
import { TeamsTable } from './components/teams-table'
import TeamsProvider from './context/teams-context'
import { teamListSchema } from './data/schema'
import { teams } from './data/teams'

export default function Teams() {
  // Parse team list
  const teamList = teamListSchema.parse(teams)

  return (
    <TeamsProvider>
      <Header fixed>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search placeholder='Search teams' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Teams Management</h2>
            <p className='text-muted-foreground'>
              Create and manage classes, study groups, clubs, and committees.
            </p>
          </div>
          <TeamsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <TeamsTable data={teamList} columns={columns} />
        </div>
      </Main>

      <TeamsDialogs />
    </TeamsProvider>
  )
}

const topNav = [
  {
    title: 'Teams Management',
    href: '/teams',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Create Code',
    href: '/teams/create-code',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Join Team',
    href: '/teams/join',
    isActive: false,
    disabled: false,
  },
]