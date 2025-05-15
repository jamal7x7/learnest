import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { sidebarData } from '~/components/layout/data/sidebar-data';

// Helper to calculate all sidebar items
const allSidebarItems: { id: string; label: string }[] = [];
sidebarData.navGroups.forEach((group) => {
  group.items.forEach((item) => {
    if (item.title) {
      allSidebarItems.push({ id: item.title, label: item.title });
    }
    if (item.items) {
      item.items.forEach((subItem) => {
        if (subItem.title) {
          allSidebarItems.push({ id: subItem.title, label: subItem.title });
        }
      });
    }
  });
});

// Calculate default initial items
const defaultInitialItems: string[] = allSidebarItems.length > 1 ?
  [
    allSidebarItems[0].id,
    allSidebarItems[1].id,
    allSidebarItems[2].id,
    allSidebarItems[3].id,
    allSidebarItems[4].id,
  ].filter(id => id !== undefined) // Ensure no undefined ids if less than 5 items
  : allSidebarItems.length === 1 ? [allSidebarItems[0].id].filter(id => id !== undefined) : [];


interface SidebarVisibilityContextType {
  visibleItems: string[];
  setVisibleItems: Dispatch<SetStateAction<string[]>>;
}

const SidebarVisibilityContext = createContext<SidebarVisibilityContextType | undefined>(undefined);

const SIDEBAR_VISIBILITY_STORAGE_KEY = 'sidebarVisibleItems';

export function SidebarVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibleItems, setVisibleItems] = useState<string[]>(() => {
    try {
      const storedItems = window.localStorage.getItem(SIDEBAR_VISIBILITY_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : defaultInitialItems;
    } catch (error) {
      console.error('Error reading sidebar visibility from localStorage', error);
      return defaultInitialItems;
    }
  });

  useEffect(() => {
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