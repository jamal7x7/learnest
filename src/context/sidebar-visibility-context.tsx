import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { createSidebarScript, initializeSidebarVisibility } from '~/lib/sidebar-script';

interface SidebarVisibilityContextType {
  visibleItems: string[];
  setVisibleItems: Dispatch<SetStateAction<string[]>>;
}

const SidebarVisibilityContext = createContext<SidebarVisibilityContextType | undefined>(undefined);

// Script to be injected into the head of the document to prevent FOUC
export const sidebarScript = createSidebarScript();

const SIDEBAR_VISIBILITY_STORAGE_KEY = 'sidebarVisibleItems';

export function SidebarVisibilityProvider({ children }: { children: ReactNode }) {
  // Initialize sidebar visibility state with a function to ensure consistent server/client rendering
  const [visibleItems, setVisibleItems] = useState<string[]>(() => {
    // For SSR, we can't access localStorage, so we'll initialize with an empty array
    // The actual values will be set on the client side
    if (typeof window === "undefined") return [];
    
    // For client-side, initialize sidebar visibility from script or localStorage
    return initializeSidebarVisibility();
  });

  // Save sidebar visibility to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      window.localStorage.setItem(SIDEBAR_VISIBILITY_STORAGE_KEY, JSON.stringify(visibleItems));
    } catch (error) {
      console.error('Error saving sidebar visibility to localStorage', error);
    }
  }, [visibleItems]);

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