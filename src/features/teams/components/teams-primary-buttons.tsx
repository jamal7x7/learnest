import { IconPlus } from '@tabler/icons-react'
import { Button } from '~/components/ui/button'
import { useTeams } from '../context/teams-context'

export function TeamsPrimaryButtons() {
  const { setOpen } = useTeams()
  
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Create Team</span> <IconPlus size={18} />
      </Button>
      <Button variant="outline" onClick={() => setOpen('join')}>
        Join Team
      </Button>
    </div>
  )
}