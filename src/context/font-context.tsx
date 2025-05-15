import React, { createContext, useContext, useEffect, useState } from 'react'
import { fonts } from '~/config/fonts'
import { createFontScript, initializeFont } from '~/lib/font-script'

type Font = (typeof fonts)[number]

interface FontContextType {
  font: Font
  setFont: (font: Font) => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

// Script to be injected into the head of the document to prevent FOUC
export const fontScript = createFontScript()

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize font state with a function to ensure consistent server/client rendering
  const [font, _setFont] = useState<Font>(() => {
    // For SSR, return the default font
    if (typeof window === "undefined") return fonts[0]
    
    // For client-side, initialize font and apply it immediately
    return initializeFont()
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    
    // Apply font whenever it changes
    document.documentElement.classList.forEach((cls) => {
      if (cls.startsWith('font-')) document.documentElement.classList.remove(cls)
    })
    document.documentElement.classList.add(`font-${font}`)
  }, [font])

  const setFont = (font: Font) => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem('font', font)
    }
    _setFont(font)
  }

  return <FontContext value={{ font, setFont }}>{children}</FontContext>
}

//// eslint-disable-next-line react-refresh/only-export-components
export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}
