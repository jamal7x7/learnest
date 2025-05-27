import { useTeams } from '../context/teams-context'
import { CreateTeamDialog } from './create-team-dialog'
import { EditTeamDialog } from './edit-team-dialog'
import { DeleteTeamDialog } from './delete-team-dialog'
import { JoinTeamDialog } from './join-team-dialog'

export function TeamsDialogs() {
  const { open, setOpen } = useTeams()

  return (
    <>
      <CreateTeamDialog open={open === 'add'} />
      <EditTeamDialog open={open === 'edit'} />
      <DeleteTeamDialog open={open === 'delete'} />
      <JoinTeamDialog open={open === 'join'} onOpenChange={(isOpen) => setOpen(isOpen ? 'join' : '')} />
    </>
  )
}