import { themeScript } from '~/context/theme-context'
import { fontScript } from '~/context/font-context'
import { sidebarScript } from '~/context/sidebar-visibility-context'

/**
 * This component injects the theme, font, and sidebar scripts into the document head
 * to prevent flash of unstyled content (FOUC) during page load.
 * It should be used in your root layout or app component.
 */
export function InjectThemeScript() {
  return (
    <>
      <script
        id="theme-script"
        dangerouslySetInnerHTML={{ __html: themeScript }}
      />
      <script
        id="font-script"
        dangerouslySetInnerHTML={{ __html: fontScript }}
      />
      <script
        id="sidebar-script"
        dangerouslySetInnerHTML={{ __html: sidebarScript }}
      />
    </>
  )
}

/**
 * This function can be used in frameworks that support document head modification
 * like Next.js (_document.js) or similar.
 */
export function getThemeScriptTag() {
  return `<script id="theme-script">${themeScript}</script><script id="font-script">${fontScript}</script><script id="sidebar-script">${sidebarScript}</script>`
}