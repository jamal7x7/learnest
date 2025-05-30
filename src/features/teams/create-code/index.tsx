import { useState } from 'react'
import { 
  IconCopy, 
  IconCheck, 
  IconRefresh,
  IconUsers,
  IconInfoCircle,
  IconPlus,
  IconClock,
  IconUserCheck,
  IconCalendar,
  IconCopy as IconCopySmall,
  IconQrcode
} from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'

// Define QR code props type
interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

// Simple QR code component for TanStack Start
const QRCode = (props: QRCodeProps) => {
  return (
    <QRCodeSVG
      value={props.value}
      size={props.size || 128}
      level={props.level || 'H'}
      includeMargin={props.includeMargin || false}
      className="rounded"
    />
  )
}
import { toast } from 'sonner'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { TopNav } from '~/components/layout/top-nav'
import { Button } from '~/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '~/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '~/components/ui/select'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '~/components/ui/tabs'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '~/components/ui/tooltip'
import { Badge } from '~/components/ui/badge'
// generateInviteCode would be imported from the API in a real app
// import { generateInviteCode } from '../api/teams.api'
import { topNav } from '../index'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer'
import { useIsMobile } from '~/hooks/use-mobile'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

// Types
type TeamType = 'Development' | 'Design' | 'Marketing' | 'Other'

interface InviteHistory {
  id: string
  code: string
  teamId: string
  teamName: string
  teamType: TeamType
  createdAt: Date
  expiresAt: Date | null
  used: boolean
  usedBy?: string
}

interface Team {
  id: string
  name: string
  members: number
  type: TeamType
}

interface ExpirationOption {
  value: string
  label: string
}

// Mock data
const mockTeams: Team[] = [
  { id: '1', name: 'Web Development Team', members: 12, type: 'Development' },
  { id: '2', name: 'Design Team', members: 8, type: 'Design' },
  { id: '3', name: 'Marketing Squad', members: 5, type: 'Marketing' },
]

const EXPIRATION_OPTIONS: ExpirationOption[] = [
  { value: '1h', label: '1 hour' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'never', label: 'Never' },
]

// Mock invite history data
const mockInviteHistory: InviteHistory[] = [
  {
    id: '1',
    code: 'ABC123',
    teamId: '1',
    teamName: 'Web Development Team',
    teamType: 'Development',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22), // 22 hours from now
    used: false
  },
  {
    id: '2',
    code: 'XYZ789',
    teamId: '2',
    teamName: 'Design Team',
    teamType: 'Design',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    expiresAt: null, // Never expires
    used: true,
    usedBy: 'user@example.com'
  },
]

function CreateCode() {
  const [inviteCode, setInviteCode] = useState<string>('')
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [expiration, setExpiration] = useState<string>('24h')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('active')
  const isMobile = useIsMobile()
  const isDesktop = !isMobile
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [inviteHistory, setInviteHistory] = useState<InviteHistory[]>(mockInviteHistory)



  const handleCopyCode = () => {
    if (!inviteCode) return
    
    navigator.clipboard.writeText(inviteCode)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
        toast.error('Failed to copy invite code to clipboard')
      })
  }

  const selectedTeamData = mockTeams.find(team => team.id === selectedTeam)

  const handleGenerateCode = async () => {
    if (!selectedTeam) {
      toast.error('Please select a team first')
      return
    }

    setIsGenerating(true)
    try {
      // In a real app, you would call your API here
      // const response = await generateInviteCode(selectedTeam, expiration)
      // const newCode = response.code
      
      // Mock response for now
      const mockCode = `${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      setInviteCode(mockCode)
      toast.success('Invite code generated successfully')
    } catch (error) {
      console.error('Error generating invite code:', error)
      toast.error('Failed to generate invite code')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <TopNav
          links={topNav.map(link => ({
            ...link,
            isActive: link.href === '/teams/create-code'
          }))}
        />
      </Header>

      <Main className="container mx-auto py-8 px-4 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Team Invites
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate and manage team invitation codes
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-card rounded-xl p-0.5">
          <div className="bg-background rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Create New Invite</h2>
                <p className="text-muted-foreground text-sm">
                  Generate a new invitation code for team members
                </p>
              </div>
              {isDesktop ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="group relative overflow-hidden">
                      <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 flex items-center">
                        <IconPlus className="mr-2 h-4 w-4" />
                        New Invite
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl rounded-3xl p-2">
                    <div className="space-y-6">
                      <Card className="w-full border-0 bg-transparent shadow-sm overflow-auto pb-0 pt-0">
                        <CardHeader className="text-center pb-2 pt-8">
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            Create Team Invite
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Generate an invite code or QR code to share with your team members
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            {/* Team Selection */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium leading-none">Select Team</label>
                              <Select onValueChange={setSelectedTeam} value={selectedTeam}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a team" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockTeams.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                      <div className="flex items-center gap-2">
                                        <IconUsers className="h-4 w-4 text-muted-foreground" />
                                        <span>{team.name}</span>
                                        <Badge variant="outline" className="ml-auto">
                                          {team.type}
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Expiration */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none">Expiration</label>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger type="button">
                                      <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-[200px]">
                                      <p>How long the invite will remain valid</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <Select onValueChange={setExpiration} value={expiration}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select expiration" />
                                </SelectTrigger>
                                <SelectContent>
                                  {EXPIRATION_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <Button
                              onClick={handleGenerateCode}
                              size="lg"
                              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-200 font-medium mt-2"
                              disabled={isGenerating || !selectedTeam}
                            >
                              {isGenerating ? (
                                <>
                                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <IconRefresh className="mr-2 h-4 w-4" />
                                  Generate Invite Code
                                </>
                              )}
                            </Button>
                          </div>

                          <AnimatePresence mode="wait">
                            {inviteCode && selectedTeamData && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: '2rem' }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <Tabs defaultValue="code" onValueChange={setActiveTab} className="w-full">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="code">Invite Code</TabsTrigger>
                                    <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="code" className="mt-6">
                                    <div className="space-y-4">
                                      <div className="relative">
                                        <div className="flex items-center justify-center rounded-lg bg-muted/50 p-6 border border-border">
                                          <span className="text-3xl font-mono font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                                            {inviteCode.split('').map((char, charIndex) => (
                                              <motion.span
                                                key={`${char}-${charIndex}`}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: charIndex * 0.05 }}
                                                className="inline-block"
                                              >
                                                {char}
                                              </motion.span>
                                            ))}
                                          </span>
                                        </div>
                                        <Button
                                          onClick={handleCopyCode}
                                          variant="default"
                                          size="icon"
                                          className="absolute -right-2 -top-2 h-8 w-8 rounded-full shadow-md"
                                          aria-label="Copy code"
                                        >
                                          {isCopied ? (
                                            <IconCheck className="h-4 w-4" />
                                          ) : (
                                            <IconCopy className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                      
                                      <div className="text-sm text-muted-foreground text-center">
                                        Share this code with others to let them join
                                      </div>
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="qrcode" className="mt-6 flex flex-col items-center">
                                    <div className="p-4 bg-white rounded-lg border border-border">
                                      <QRCode 
                                        value={`${window.location.origin}/teams/join?code=${inviteCode}`}
                                        size={200}
                                        level="H"
                                        includeMargin={false}
                                      />
                                    </div>
                                    <p className="mt-4 text-sm text-muted-foreground text-center">
                                      Scan this QR code to join {selectedTeamData.name}
                                    </p>
                                  </TabsContent>
                                </Tabs>
                                
                                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <IconInfoCircle className="h-4 w-4 text-primary" />
                                    Invite Details
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Team:</span>
                                      <span className="font-medium">{selectedTeamData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Expires:</span>
                                      <span className="font-medium">
                                        {expiration === 'never' ? 'Never' : `${expiration} from now`}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Type:</span>
                                      <Badge variant="outline">{selectedTeamData.type}</Badge>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                        
                        {inviteCode && (
                          <CardFooter className="bg-muted/30 border-t p-4 justify-center">
                            <p className="text-xs text-muted-foreground text-center">
                              This invite code will expire {expiration === 'never' ? 'never' : `in ${expiration}`}.
                              {activeTab === 'code' && ' Or share the QR code for easy mobile access.'}
                            </p>
                          </CardFooter>
                        )}
                      </Card>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button className="group relative overflow-hidden w-full md:w-auto">
                      <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 flex items-center">
                        <IconPlus className="mr-2 h-4 w-4" />
                        New Invite
                      </span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="rounded-t-2xl p-2">
                    <div className="space-y-6">
                      <Card className="w-full border-0 bg-transparent shadow-sm overflow-auto pb-0 pt-0">
                        {!inviteCode ? (
                          <>
                            <CardHeader className="text-center pb-2 pt-4">
                              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                Create Team Invite
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                              {/* Team Selection */}
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium leading-none">Select Team</label>
                                  <Select onValueChange={setSelectedTeam} value={selectedTeam}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select a team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {mockTeams.map((team) => (
                                        <SelectItem key={team.id} value={team.id}>
                                          <div className="flex items-center gap-2">
                                            <IconUsers className="h-4 w-4 text-muted-foreground" />
                                            <span>{team.name}</span>
                                            <Badge variant="outline" className="ml-auto">
                                              {team.type}
                                            </Badge>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Expiration */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium leading-none">Expiration</label>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger type="button">
                                          <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-[200px]">
                                          <p>How long the invite will remain valid</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <Select onValueChange={setExpiration} value={expiration}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select expiration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {EXPIRATION_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Button
                                  onClick={handleGenerateCode}
                                  size="lg"
                                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-200 font-medium mt-2"
                                  disabled={isGenerating || !selectedTeam}
                                >
                                  {isGenerating ? (
                                    <>
                                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <IconRefresh className="mr-2 h-4 w-4" />
                                      Generate Invite Code
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </>
                        ) : (
                          <>
                            <CardHeader className="text-center pb-2 pt-4">
                              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                Invite Created!
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                              <Tabs defaultValue="code" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="code">Invite Code</TabsTrigger>
                                  <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="code" className="mt-6">
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-muted/30 rounded-lg p-3 font-mono text-sm overflow-x-auto">
                                        {inviteCode}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCopyCode}
                                        className="shrink-0"
                                      >
                                        {isCopied ? (
                                          <IconCheck className="h-4 w-4" />
                                        ) : (
                                          <IconCopy className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                    <div className="text-sm text-muted-foreground text-center">
                                      Share this code with others to let them join
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="qrcode" className="mt-6 flex flex-col items-center">
                                  <div className="p-4 bg-white rounded-lg border border-border">
                                    <QRCode 
                                      value={`${window.location.origin}/teams/join?code=${inviteCode}`}
                                      size={200}
                                      level="H"
                                      includeMargin={false}
                                    />
                                  </div>
                                  <p className="mt-4 text-sm text-muted-foreground text-center">
                                    Scan this QR code to join {selectedTeamData?.name}
                                  </p>
                                </TabsContent>
                              </Tabs>
                              
                              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <IconInfoCircle className="h-4 w-4 text-primary" />
                                  Invite Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Team:</span>
                                    <span className="font-medium">{selectedTeamData?.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Expires:</span>
                                    <span className="font-medium">
                                      {expiration === 'never' 
                                        ? 'Never' 
                                        : (() => {
                                            try {
                                              const hours = parseInt(expiration, 10);
                                              if (isNaN(hours)) return 'Invalid date';
                                              const expirationDate = new Date();
                                              expirationDate.setHours(expirationDate.getHours() + hours);
                                              return formatDistanceToNow(expirationDate) + ' from now';
                                            } catch (e) {
                                              console.error('Error calculating expiration:', e);
                                              return 'Error calculating expiration';
                                            }
                                          })()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button 
                                variant="outline" 
                                className="w-full mt-4"
                                onClick={() => {
                                  setInviteCode('')
                                  setSelectedTeam('')
                                  setExpiration('24h')
                                }}
                              >
                                Create Another Invite
                              </Button>
                            </CardContent>
                          </>
                        )}
                      </Card>
                    </div>
                  </DrawerContent>
                </Drawer>
              )}
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inviteHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No invites found
                </TableCell>
              </TableRow>
            ) : (
              inviteHistory.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell className="font-mono font-medium">
                    {invite.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{invite.teamType}</Badge>
                      <span>{invite.teamName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <IconCalendar className="h-4 w-4" />
                      {formatDistanceToNow(invite.createdAt, { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {invite.expiresAt ? (
                      <div className="flex items-center gap-1">
                        <IconClock className="h-4 w-4" />
                        {formatDistanceToNow(invite.expiresAt, { addSuffix: true })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {invite.used ? (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-800">
                        <IconUserCheck className="mr-1 h-3 w-3" /> Used
                      </Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <IconCopySmall className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <IconQrcode className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      {/* </ScrollArea> */}
    </Main>
  </div>
  )
}

export default CreateCode