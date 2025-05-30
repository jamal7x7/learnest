import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { 
  IconUser, 
  IconInfoCircle, 
  IconQrcode,
  IconCopy,
  IconCheck,
  IconUsersGroup,
  IconCalendar,
  IconLock,
  IconWorld,
  IconX
} from '@tabler/icons-react'
import dynamic from 'next/dynamic'

// Lazy load QRCode component to avoid SSR issues
const QRCode = dynamic<{
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}>(
  () => import('qrcode.react').then(mod => {
    // Handle both ESM and CJS imports
    const QRCodeComponent = 'default' in mod ? mod.default : mod.QRCodeSVG;
    return { default: QRCodeComponent };
  }) as Promise<{
    default: React.ComponentType<{
      value: string;
      size?: number;
      level?: 'L' | 'M' | 'Q' | 'H';
      includeMargin?: boolean;
    }>;
  }>,
  { 
    ssr: false,
    loading: () => (
      <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center">
        Loading QR...
      </div>
    )
  }
)

import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { TopNav } from '~/components/layout/top-nav'
import { Button } from '~/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '~/components/ui/card'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Badge } from '~/components/ui/badge'
// Tooltip components are imported by the Button component
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { joinTeamByInviteCode } from '../api/teams.api'
import { topNav } from '../index'

// Types
interface TeamPreview {
  id: string
  name: string
  memberCount: number
  description?: string
  createdBy: string
  createdAt: string
  isPublic: boolean
}

const formSchema = z.object({
  inviteCode: z
    .string()
    .min(6, 'Invite code must be 6 characters')
    .max(6, 'Invite code must be 6 characters')
    .toUpperCase()
    .regex(/^[A-Z0-9]+$/, 'Invite code can only contain letters and numbers')
})

type FormValues = z.infer<typeof formSchema>

// Mock function to simulate team preview
async function getTeamPreview(inviteCode: string): Promise<TeamPreview> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'team-' + Math.random().toString(36).substr(2, 9),
        name: 'Team ' + inviteCode.substr(0, 3).toUpperCase(),
        memberCount: Math.floor(Math.random() * 50) + 1,
        description: 'A collaborative team working on exciting projects',
        createdBy: 'team@example.com',
        createdAt: new Date().toISOString(),
        isPublic: Math.random() > 0.5
      })
    }, 500)
  })
}

export default function JoinTeam() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [teamPreview, setTeamPreview] = useState<TeamPreview | null>(null)
  const [activeTab, setActiveTab] = useState('code')
  const [copied, setCopied] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteCode: ''
    }
  })
  
  // Watch for invite code changes
  const watchInviteCode = form.watch('inviteCode', '')
  
  // Handle copy to clipboard
  const handleCopyCode = useCallback(() => {
    const code = form.getValues('inviteCode')
    if (!code) return
    
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true)
        const timer = setTimeout(() => setCopied(false), 2000)
        return () => clearTimeout(timer)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
        toast.error('Failed to copy invite code to clipboard')
      })
  }, [form])
  
  // Effect to handle preview when invite code changes
  useEffect(() => {
    let isMounted = true
    
    const updateState = {
      teamPreview: (preview: TeamPreview | null) => {
        if (isMounted) setTeamPreview(preview)
      },
      error: (message: string) => {
        if (isMounted) setError(message)
      },
      loading: (isLoading: boolean) => {
        if (isMounted) setIsLoadingPreview(isLoading)
      }
    }
    
    const fetchTeamPreview = async (code: string) => {
      try {
        updateState.loading(true)
        updateState.error('')
        const preview = await getTeamPreview(code)
        updateState.teamPreview(preview)
      } catch (err) {
        const errorMessage = err instanceof Error ? 
          err.message : 'Failed to load team preview'
        updateState.error(errorMessage)
        updateState.teamPreview(null)
      } finally {
        updateState.loading(false)
      }
    }
    
    if (watchInviteCode?.length === 6) {
      const timer = setTimeout(() => {
        fetchTeamPreview(watchInviteCode)
      }, 500) // Debounce for 500ms
      
      return () => {
        isMounted = false
        clearTimeout(timer)
      }
    } else {
      updateState.teamPreview(null)
    }
  }, [watchInviteCode])
  
  // Render QR code section
  const renderQRCode = () => {
    if (activeTab !== 'qr') return null
    
    const inviteUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/teams/join?code=${form.getValues('inviteCode')}`
      : ''
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          {inviteUrl && (
            <QRCode 
              value={inviteUrl}
              size={128}
              level="H"
              includeMargin={true}
            />
          )}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Scan this QR code with your device camera to join the team
        </p>
      </div>
    )
  }
  
  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    try {
      setError('')
      setIsSubmitting(true)
      
      // In a real app, you'd use the actual user ID from auth context
      const dummyUserId = 'user123' 
      
      // Simulate API call delay
      setTimeout(async () => {
        try {
          await joinTeamByInviteCode({
            inviteCode: values.inviteCode,
            userId: dummyUserId
          })
          
          toast.success('Successfully joined team', {
            description: 'You have been added to the team',
          })
          
          // Navigate after a short delay to allow the toast to be seen
          setTimeout(() => {
            navigate({ to: '/teams' })
          }, 1000)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to join team'
          setError(errorMessage)
          toast.error('Failed to join team', {
            description: errorMessage,
          })
          setIsSubmitting(false)
        }
      }, 800)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join team'
      setError(errorMessage)
      toast.error('Failed to join team', {
        description: errorMessage,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header fixed>
        <TopNav
          links={topNav.map(link => ({
            ...link,
            isActive: link.href === '/teams/join'
          }))}
        />
      </Header>

      <Main className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Join a Team
            </h1>
            <p className="text-muted-foreground">
              Enter an invite code to join an existing team
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
            defaultValue="code"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">
                <IconCopy className="h-4 w-4 mr-2" />
                Enter Code
              </TabsTrigger>
              <TabsTrigger value="scan">
                <IconQrcode className="h-4 w-4 mr-2" />
                Scan QR
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="mt-6">
              <Card className="border-2 shadow-lg overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Enter Invite Code</CardTitle>
                  <CardDescription>
                    Ask a team admin for the 6-character invite code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="inviteCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Invite Code</FormLabel>
                            <FormControl>
<div className="relative group">
  <Input
    placeholder="e.g. ABC123"
    className="text-center font-mono text-lg tracking-widest h-12 bg-muted/30 pr-20"
    maxLength={6}
    autoComplete="off"
    {...field}
    onChange={(e) => {
      // Convert to uppercase and remove non-alphanumeric
      const value = e.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
      field.onChange(value)
    }}
  />
  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
    {field.value && field.value.length > 0 && (
      <button
        type="button"
        onClick={() => field.onChange('')}
        className="text-muted-foreground hover:text-foreground transition-colors"
        title="Clear"
      >
        <IconX className="h-4 w-4" />
      </button>
    )}
    {field.value && field.value.length === 6 && (
      <button
        type="button"
        onClick={handleCopyCode}
        className="text-muted-foreground hover:text-foreground transition-colors"
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <IconCheck className="h-4 w-4 text-green-500" />
        ) : (
          <IconCopy className="h-4 w-4" />
        )}
      </button>
    )}
  </div>
</div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

<AnimatePresence>
  {isLoadingPreview && watchInviteCode?.length === 6 && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <Card className="border border-border/50 bg-muted/20 animate-pulse">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="flex space-x-2">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    </motion.div>
  )}

                        {teamPreview && !isLoadingPreview && watchInviteCode?.length === 6 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 pt-2"
                          >
<Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
  <CardHeader className="pb-3">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary text-lg">
            {teamPreview.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-lg">{teamPreview.name}</h3>
          <div className="flex items-center mt-1 space-x-2">
            <Badge 
              variant={teamPreview.isPublic ? 'default' : 'secondary'}
              className="text-xs"
            >
              {teamPreview.isPublic ? (
                <>
                  <IconWorld className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <IconLock className="h-3 w-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <IconUsersGroup className="h-3 w-3 mr-1" />
              <span>{teamPreview.memberCount} members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CardHeader>
  <CardContent className="space-y-3 pt-0">
    {teamPreview.description && (
      <p className="text-sm text-muted-foreground">
        {teamPreview.description}
      </p>
    )}
    <div className="flex items-center text-xs text-muted-foreground">
      <IconCalendar className="h-3 w-3 mr-1 flex-shrink-0" />
      <span>Created {new Date(teamPreview.createdAt).toLocaleDateString()}</span>
    </div>
  </CardContent>
</Card>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive p-3 bg-destructive/10 rounded-md"
                        >
                          {error}
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        className="w-full mt-2 h-11 text-base"
                        disabled={isSubmitting || !teamPreview}
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="mr-2">Joining...</span>
                            <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin"></span>
                          </>
                        ) : (
                          `Join ${teamPreview?.name || 'Team'}`
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scan" className="mt-6">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Scan QR Code</CardTitle>
                  <CardDescription>
                    Scan a team's QR code to join
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                  {renderQRCode()}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast.info('QR Code scanning coming soon!', {
                        description: 'This feature will be available in the next update.'
                      })
                    }}
                  >
                    <IconQrcode className="h-4 w-4 mr-2" />
                    Open Camera
                  </Button>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t p-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <IconInfoCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Having trouble scanning? Ask the team admin for an invite code.</span>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Don't have an invite? Ask your team admin to send you one.</p>
          </div>
        </motion.div>
      </Main>
    </>
  )
}
