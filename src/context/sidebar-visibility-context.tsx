import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface SidebarVisibilityContextType {
  visibleItems: string[];
  setVisibleItems: Dispatch<SetStateAction<string[]>>;
}

const SidebarVisibilityContext = createContext<SidebarVisibilityContextType | undefined>(undefined);

export function SidebarVisibilityProvider({ children, initialVisibleItems = [] }: { children: ReactNode; initialVisibleItems?: string[] }) {
  const [visibleItems, setVisibleItems] = useState<string[]>(initialVisibleItems);

  return (
    <SidebarVisibilityContext.Provider value={{ visibleItems, setVisibleItems }}>
      {children}
    </SidebarVisibilityContext.Provider>
  );
}

export function useSidebarVisibility() {
  const context = useContext(SidebarVisibilityContext);
  if (context === undefined) {
    throw new Error('useSidebarVisibility must be used within a SidebarVisibilityProvider');
  }
  return context;
}