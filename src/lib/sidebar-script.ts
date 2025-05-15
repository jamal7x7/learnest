// This script runs before React hydration to prevent flash of unstyled content for sidebar visibility

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

const SIDEBAR_VISIBILITY_STORAGE_KEY = 'sidebarVisibleItems';

// Export a function that can be used to create a sidebar visibility script
export function createSidebarScript() {
  return `(function() {
    try {
      const storageKey = '${SIDEBAR_VISIBILITY_STORAGE_KEY}';
      const defaultItems = ${JSON.stringify(defaultInitialItems)};
      
      // Try to get stored items from localStorage
      let visibleItems;
      try {
        const storedItems = localStorage.getItem(storageKey);
        visibleItems = storedItems ? JSON.parse(storedItems) : defaultItems;
      } catch (e) {
        console.warn('Error reading sidebar visibility from localStorage', e);
        visibleItems = defaultItems;
      }
      
      // Store the sidebar visibility in a global variable that React can access later
      window.__SIDEBAR_VISIBLE_ITEMS__ = visibleItems;
    } catch (e) {
      console.warn('Failed to set sidebar visibility from script:', e);
    }
  })();`
}

// Function to initialize sidebar visibility on client side
export function initializeSidebarVisibility(): string[] {
  if (typeof window === 'undefined') return defaultInitialItems;
  
  try {
    // Check if we have the global variable set by the script
    if (window.__SIDEBAR_VISIBLE_ITEMS__) {
      return window.__SIDEBAR_VISIBLE_ITEMS__;
    }
    
    // Fallback to localStorage
    const storedItems = window.localStorage.getItem(SIDEBAR_VISIBILITY_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : defaultInitialItems;
  } catch (e) {
    console.warn('Failed to initialize sidebar visibility:', e);
    return defaultInitialItems;
  }
}

// Add this to make TypeScript happy with the global variable
declare global {
  interface Window {
    __SIDEBAR_VISIBLE_ITEMS__?: string[];
  }
}