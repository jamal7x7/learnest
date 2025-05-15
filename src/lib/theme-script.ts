// This script runs before React hydration to prevent flash of unstyled content

type Theme = 'dark' | 'light' | 'system'

// Function to apply theme to document
function applyTheme(theme: Theme, storageKey: string = 'vite-ui-theme') {
  // If theme is not provided, try to get it from localStorage
  if (!theme) {
    const storedTheme = localStorage.getItem(storageKey) as Theme
    theme = storedTheme || 'system'
  }

  // Get system preference
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  
  // Determine which theme to apply
  const effectiveTheme = theme === 'system' ? systemTheme : theme
  
  // Apply theme to document
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(effectiveTheme)
  
  // Store the theme for future reference
  return effectiveTheme
}

// Export a function that can be used to create a theme script
export function createThemeScript(storageKey: string = 'vite-ui-theme') {
  return `(function() {
    try {
      const storageKey = '${storageKey}';
      let theme = localStorage.getItem(storageKey);
      if (!theme) theme = 'system';
      
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const effectiveTheme = theme === 'system' ? systemTheme : theme;
      
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(effectiveTheme);
    } catch (e) {
      console.warn('Failed to set theme from script:', e);
    }
  })();`
}

// Function to initialize theme on client side
export function initializeTheme(storageKey: string = 'vite-ui-theme'): Theme {
  if (typeof window === 'undefined') return 'system';
  
  try {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    const theme = storedTheme || 'system';
    return applyTheme(theme, storageKey);
  } catch (e) {
    console.warn('Failed to initialize theme:', e);
    return 'system';
  }
}

// Function to handle system theme changes
export function setupThemeListener(theme: Theme, onChange: () => void, storageKey: string = 'vite-ui-theme') {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = () => {
    if (theme === 'system') {
      applyTheme('system', storageKey);
      onChange();
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}