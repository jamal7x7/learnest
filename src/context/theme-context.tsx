import { createContext, useContext, useEffect, useState } from 'react'
import { createThemeScript, initializeTheme, setupThemeListener } from '~/lib/theme-script'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Script to be injected into the head of the document to prevent FOUC
export const themeScript = createThemeScript('vite-ui-theme')

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  // Initialize theme state with a function to ensure consistent server/client rendering
  const [theme, _setTheme] = useState<Theme>(() => {
    // For SSR, return the default theme
    if (typeof window === "undefined") return defaultTheme
    
    // For client-side, initialize theme and apply it immediately
    return initializeTheme(storageKey) || defaultTheme
  })

  // Set up theme listener for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // Apply theme whenever it changes
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const effectiveTheme = theme === 'system' ? systemTheme : theme
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(effectiveTheme)
    
    // Set up listener for system theme changes
    return setupThemeListener(theme, () => {
      // This callback is called when system theme changes and current theme is 'system'
      // No need to update state as the theme script handles the class changes
    }, storageKey)
  }, [theme, storageKey])

  const setTheme = (theme: Theme) => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem(storageKey, theme)
    }
    _setTheme(theme)
  }

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

//// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
