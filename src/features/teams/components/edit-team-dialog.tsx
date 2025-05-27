import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { useTeams } from '../context/teams-context'
import { TeamType, TeamStatus } from '../data/schema'

interface EditTeamDialogProps {
  open: boolean
}

export function EditTeamDialog({ open }: EditTeamDialogProps) {
  const { setOpen, currentTeam } = useTeams()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '' as TeamType | '',
    status: '' as TeamStatus | '',
    maxMembers: '',
  })

  useEffect(() => {
    if (currentTeam) {
      setFormData({
        name: currentTeam.name,
        description: currentTeam.description || '',
        type: currentTeam.type,
        status: currentTeam.status,
        maxMembers: currentTeam.maxMembers?.toString() || '',
      })
    }
  }, [currentTeam])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle team update logic here
    console.log('Updating team:', formData)
    setOpen('')
  }

  const handleClose = () => {
    setOpen('')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Update team information and settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='type' className='text-right'>
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: TeamType) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='class'>Class</SelectItem>
                  <SelectItem value='study-group'>Study Group</SelectItem>
                  <SelectItem value='club'>Club</SelectItem>
                  <SelectItem value='committee'>Committee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: TeamStatus) => setFormData({ ...formData, status: value })}
                required
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                  <SelectItem value='archived'>Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='maxMembers' className='text-right'>
                Max Members
              </Label>
              <Input
                id='maxMembers'
                type='number'
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='description' className='text-right pt-2'>
                Description
              </Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit'>Update Team</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}