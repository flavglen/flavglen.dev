// Google Analytics configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Enhanced tracking functions for comprehensive analytics

// Track gallery interactions
export const trackGalleryEvent = (action: string, photoId?: string, photoTitle?: string) => {
  event({
    action,
    category: 'Gallery',
    label: photoId ? `${photoTitle || 'Photo'} (ID: ${photoId})` : undefined,
  })
}

// Track photo interactions
export const trackPhotoView = (photoId: string, photoTitle: string, photographer: string) => {
  event({
    action: 'photo_view',
    category: 'Gallery',
    label: `${photoTitle} by ${photographer}`,
  })
}

export const trackPhotoDownload = (photoId: string, photoTitle: string) => {
  event({
    action: 'photo_download',
    category: 'Gallery',
    label: photoTitle,
  })
}

export const trackPhotoShare = (photoId: string, photoTitle: string, method: string = 'native') => {
  event({
    action: 'photo_share',
    category: 'Gallery',
    label: `${photoTitle} via ${method}`,
  })
}

// Track gallery page interactions
export const trackGalleryPageView = () => {
  event({
    action: 'page_view',
    category: 'Gallery',
    label: 'Gallery Page',
  })
}

export const trackGalleryLoadMore = (currentCount: number) => {
  event({
    action: 'load_more',
    category: 'Gallery',
    label: `Loaded ${currentCount} photos`,
    value: currentCount,
  })
}

export const trackGalleryError = (errorType: string, errorMessage: string) => {
  event({
    action: 'gallery_error',
    category: 'Gallery',
    label: `${errorType}: ${errorMessage}`,
  })
}

// Track portfolio interactions
export const trackPortfolioEvent = (action: string, section: string, element?: string) => {
  event({
    action,
    category: 'Portfolio',
    label: element ? `${section} - ${element}` : section,
  })
}

// Track contact form interactions
export const trackContactEvent = (action: string, method?: string) => {
  event({
    action,
    category: 'Contact',
    label: method,
  })
}

// Track project interactions
export const trackProjectEvent = (action: string, projectTitle: string, projectId?: string) => {
  event({
    action,
    category: 'Projects',
    label: projectId ? `${projectTitle} (ID: ${projectId})` : projectTitle,
  })
}

// Track skill interactions
export const trackSkillEvent = (action: string, skillName: string, skillCategory?: string) => {
  event({
    action,
    category: 'Skills',
    label: skillCategory ? `${skillName} (${skillCategory})` : skillName,
  })
}

// Track navigation
export const trackNavigation = (from: string, to: string, method: string = 'click') => {
  event({
    action: 'navigation',
    category: 'Navigation',
    label: `${from} → ${to} (${method})`,
  })
}

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  event({
    action: 'scroll_depth',
    category: 'Engagement',
    label: `${depth}%`,
    value: depth,
  })
}

// Track time on page
export const trackTimeOnPage = (timeInSeconds: number, page: string) => {
  event({
    action: 'time_on_page',
    category: 'Engagement',
    label: page,
    value: timeInSeconds,
  })
}

// Track external link clicks
export const trackExternalLink = (url: string, linkText: string) => {
  event({
    action: 'external_link_click',
    category: 'External Links',
    label: `${linkText} → ${url}`,
  })
}

// Track social media interactions
export const trackSocialShare = (platform: string, content: string) => {
  event({
    action: 'social_share',
    category: 'Social Media',
    label: `${platform}: ${content}`,
  })
}

// Track download events
export const trackDownload = (fileName: string, fileType: string, source: string) => {
  event({
    action: 'file_download',
    category: 'Downloads',
    label: `${fileName} (${fileType}) from ${source}`,
  })
}

// Track search events
export const trackSearch = (query: string, resultsCount: number, source: string) => {
  event({
    action: 'search',
    category: 'Search',
    label: `"${query}" in ${source}`,
    value: resultsCount,
  })
}

// Track conversion events
export const trackConversion = (conversionType: string, value?: number, currency?: string) => {
  event({
    action: 'conversion',
    category: 'Conversions',
    label: conversionType,
    value: value,
  })
  
  // Also track as conversion for GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      event_category: 'Conversions',
      event_label: conversionType,
      value: value,
      currency: currency || 'USD',
    })
  }
}

// Track user engagement
export const trackEngagement = (engagementType: string, details?: string) => {
  event({
    action: 'user_engagement',
    category: 'Engagement',
    label: details ? `${engagementType}: ${details}` : engagementType,
  })
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}
