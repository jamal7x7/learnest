// This script runs before React hydration to prevent flash of unstyled content for fonts

import { fonts } from '~/config/fonts'

type Font = (typeof fonts)[number]

// Function to apply font to document
function applyFont(font: Font) {
  if (!font || !fonts.includes(font)) {
    font = fonts[0]
  }
  
  // Apply font to document
  document.documentElement.classList.forEach((cls) => {
    if (cls.startsWith('font-')) document.documentElement.classList.remove(cls)
  })
  document.documentElement.classList.add(`font-${font}`)
  
  return font
}

// Export a function that can be used to create a font script
export function createFontScript() {
  return `(function() {
    try {
      const storageKey = 'font';
      let font = localStorage.getItem(storageKey);
      const availableFonts = ${JSON.stringify(fonts)};
      
      if (!font || !availableFonts.includes(font)) {
        font = availableFonts[0];
      }
      
      document.documentElement.classList.forEach((cls) => {
        if (cls.startsWith('font-')) document.documentElement.classList.remove(cls);
      });
      document.documentElement.classList.add(\`font-\${font}\`);
    } catch (e) {
      console.warn('Failed to set font from script:', e);
    }
  })();`
}

// Function to initialize font on client side
export function initializeFont(): Font {
  if (typeof window === 'undefined') return fonts[0];
  
  try {
    const storedFont = localStorage.getItem('font') as Font;
    return applyFont(storedFont);
  } catch (e) {
    console.warn('Failed to initialize font:', e);
    return fonts[0];
  }
}