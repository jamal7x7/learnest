import React, { createContext, useContext, useState } from 'react'
import { Team } from '../data/schema'

type TeamsContextType = {
  open: 'add' | 'edit' | 'delete' | 'join' | ''
  setOpen: (open: 'add' | 'edit' | 'delete' | 'join' | '') => void
  selectedTeam: Team | null
  setSelectedTeam: (team: Team | null) => void
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined)

export default function TeamsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<'add' | 'edit' | 'delete' | 'join' | ''>('')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  return (
    <TeamsContext.Provider value={{ open, setOpen, selectedTeam, setSelectedTeam }}>
      {children}
    </TeamsContext.Provider>
  )
}

export const useTeams = () => {
  const context = useContext(TeamsContext)
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider')
  }
  return context
}