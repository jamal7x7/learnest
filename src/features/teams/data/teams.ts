import { Team } from './schema'

export const teams: Team[] = [
  {
      id: '1',
      name: 'Advanced Mathematics',
      description: 'Advanced calculus and linear algebra course',
      type: 'class',
      status: 'active',
      memberCount: 25,
      maxMembers: 30,
      createdBy: 'Prof. Smith',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      inviteCode: '8ui9hj'
  },
  {
      id: '2',
      name: 'React Study Group',
      description: 'Weekly React.js learning sessions',
      type: 'study-group',
      status: 'active',
      memberCount: 12,
      maxMembers: 15,
      createdBy: 'John Doe',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      inviteCode: 'nhjbhg'
  },
  {
      id: '3',
      name: 'Photography Club',
      description: 'Campus photography enthusiasts',
      type: 'club',
      status: 'active',
      memberCount: 18,
      createdBy: 'Jane Wilson',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      inviteCode: 'aqwerty'
  },
  {
      id: '4',
      name: 'Student Council',
      description: 'Student government committee',
      type: 'committee',
      status: 'active',
      memberCount: 8,
      maxMembers: 10,
      createdBy: 'Admin',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      inviteCode: 'gyhgyu'
  },
]