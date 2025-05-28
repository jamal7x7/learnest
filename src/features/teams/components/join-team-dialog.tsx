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
import { Alert, AlertDescription } from '~/components/ui/alert'
import { joinTeamByInviteCode } from '../api/teams.api'
import { toast } from 'sonner'
import authClient from '~/lib/auth-client'
import { useQuery } from '@tanstack/react-query'

interface JoinTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinTeamDialog({ open, onOpenChange }: JoinTeamDialogProps) {
  const [inviteCode, setInviteCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ teamName: string } | null>(null)

  // Get the current session
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const session = await authClient.api.getSession()
        return session?.user || null
      } catch (error) {
        return null
      }
    },
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      toast.error('You must be logged in to join a team')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const team = await joinTeamByInviteCode({
        inviteCode: inviteCode.trim().toUpperCase(),
        userId: session.id,
      })
      
      setSuccess({ teamName: team.name })
      setInviteCode('')
      toast.success(`Successfully joined ${team.name}!`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join team'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setInviteCode('')
    setError('')
    setSuccess(null)
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Successfully Joined Team!</DialogTitle>
            <DialogDescription>
              You have successfully joined "{success.teamName}". You can now access team resources and participate in team activities.
            </DialogDescription>
          </DialogHeader>
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
          <DialogTitle>Join Team</DialogTitle>
          <DialogDescription>
            Enter the 6-character invite code provided by your teacher to join a team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                if (value.length <= 6) {
                  setInviteCode(value)
                }
              }}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="font-mono text-center text-lg tracking-wider"
              required
            />
            <p className="text-sm text-muted-foreground">
              Code should be 6 characters (letters and numbers)
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || inviteCode.length !== 6}>
              {isLoading ? 'Joining...' : 'Join Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}