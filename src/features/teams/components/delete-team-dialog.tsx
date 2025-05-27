import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useTeams } from '../context/teams-context'

interface DeleteTeamDialogProps {
  open: boolean
}

export function DeleteTeamDialog({ open }: DeleteTeamDialogProps) {
  const { setOpen, currentTeam } = useTeams()

  const handleDelete = () => {
    // Handle team deletion logic here
    console.log('Deleting team:', currentTeam?.name)
    setOpen('')
  }

  const handleClose = () => {
    setOpen('')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{currentTeam?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button type='button' variant='destructive' onClick={handleDelete}>
            Delete Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}