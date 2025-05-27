import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react'
import { Team, TeamType, TeamStatus } from '../data/schema'
import { useTeams } from '../context/teams-context'

const teamTypeColors: Record<TeamType, string> = {
  'class': 'bg-blue-100 text-blue-800',
  'study-group': 'bg-green-100 text-green-800',
  'club': 'bg-purple-100 text-purple-800',
  'committee': 'bg-orange-100 text-orange-800',
}

const statusColors: Record<TeamStatus, string> = {
  'active': 'bg-green-100 text-green-800',
  'inactive': 'bg-gray-100 text-gray-800',
  'archived': 'bg-red-100 text-red-800',
}

function ActionsCell({ team }: { team: Team }) {
  const { setOpen, setCurrentTeam } = useTeams()

  const handleEdit = () => {
    setCurrentTeam(team)
    setOpen('edit')
  }

  const handleDelete = () => {
    setCurrentTeam(team)
    setOpen('delete')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <IconDots className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleEdit}>
          <IconEdit className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
          <IconTrash className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Team>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as TeamType
      return (
        <Badge className={teamTypeColors[type]}>
          {type.replace('-', ' ').toUpperCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as TeamStatus
      return (
        <Badge className={statusColors[status]}>
          {status.toUpperCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'memberCount',
    header: 'Members',
    cell: ({ row }) => {
      const memberCount = row.getValue('memberCount') as number
      const maxMembers = row.original.maxMembers
      return (
        <span>
          {memberCount}{maxMembers ? `/${maxMembers}` : ''}
        </span>
      )
    },
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell team={row.original} />,
  },
]