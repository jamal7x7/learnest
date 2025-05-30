import { useEffect, useState, useRef } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const isMounted = useRef(true)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Update state only if component is still mounted
    const updateMatches = () => {
      if (isMounted.current) {
        setMatches(media.matches)
      }
    }
    
    // Set initial value
    updateMatches()
    
    // Add listener for changes
    media.addEventListener('change', updateMatches)
    
    // Cleanup
    return () => {
      isMounted.current = false
      media.removeEventListener('change', updateMatches)
    }
  }, [query])

  return matches
}
