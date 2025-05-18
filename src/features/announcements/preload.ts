/**
 * Preload utility for the announcements feature
 * This helps reduce perceived loading time by preloading components
 * when the user hovers over links to the announcements page
 */

// Preload the announcement components
export function preloadAnnouncementComponents() {
  // Use dynamic imports with prefetch to load the components in the background
  // This tells the browser to load these resources with a lower priority
  import(/* webpackPrefetch: true */ './components/announcement-card');
  import(/* webpackPrefetch: true */ './components/announcement-detail');
}

// Function to attach preload to navigation elements
export function attachAnnouncementPreload() {
  // Find all links that point to the announcements page
  const announcementLinks = document.querySelectorAll('a[href*="announcements"]');
  
  // Add hover listeners to preload components
  announcementLinks.forEach(link => {
    link.addEventListener('mouseenter', preloadAnnouncementComponents);
    link.addEventListener('touchstart', preloadAnnouncementComponents, { passive: true });
  });
}