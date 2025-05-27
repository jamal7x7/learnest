import { useState } from 'react'
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
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Copy, Check } from 'lucide-react'
import { useTeams } from '../context/teams-context'
import { TeamType } from '../data/schema'
import { createTeam } from '../api/teams.api'

interface CreateTeamDialogProps {
  open: boolean
}

export function CreateTeamDialog({ open }: CreateTeamDialogProps) {
  const { setOpen } = useTeams()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '' as TeamType | '',
    maxMembers: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [createdTeam, setCreatedTeam] = useState<{ name: string; inviteCode: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'temp-user-id' // This should come from auth
      
      const team = await createTeam({
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type as TeamType,
        maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : undefined,
        createdBy: userId,
        organizationId: "temp-org-id", // TODO: Get actual organization ID
      })
      
      setCreatedTeam({ name: team.name, inviteCode: team.inviteCode })
    } catch (error) {
      console.error('Error creating team:', error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOpen('')
    setFormData({ name: '', description: '', type: '', maxMembers: '' })
    setCreatedTeam(null)
    setCopied(false)
  }

  const copyInviteCode = async () => {
    if (createdTeam?.inviteCode) {
      await navigator.clipboard.writeText(createdTeam.inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (createdTeam) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Team Created Successfully!</DialogTitle>
            <DialogDescription>
              Your team "{createdTeam.name}" has been created. Share the invite code below with students to let them join.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Invite Code:</p>
                    <p className="text-2xl font-mono font-bold tracking-wider">{createdTeam.inviteCode}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyInviteCode}
                    className="ml-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Students can join your team by entering this 6-character code. Keep it safe and share it only with intended members.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team for your class or organization.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter team name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter team description (optional)"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Team Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as TeamType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="study-group">Study Group</SelectItem>
                <SelectItem value="club">Club</SelectItem>
                <SelectItem value="committee">Committee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxMembers">Max Members (Optional)</Label>
            <Input
              id="maxMembers"
              type="number"
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
              placeholder="Enter maximum number of members"
              min="1"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}