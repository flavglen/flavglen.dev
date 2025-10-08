'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { 
  trackGalleryPageView, 
  trackScrollDepth, 
  trackTimeOnPage, 
  trackEngagement,
  trackNavigation 
} from '@/lib/analytics'

export function useAnalytics() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const scrollDepthRef = useRef<number>(0)
  const maxScrollDepthRef = useRef<number>(0)
  const lastPathnameRef = useRef<string>(pathname)

  // Track page view when pathname changes
  useEffect(() => {
    const currentTime = Date.now()
    const timeOnPreviousPage = Math.round((currentTime - startTimeRef.current) / 1000)
    
    // Track time on previous page
    if (lastPathnameRef.current !== pathname && lastPathnameRef.current !== '') {
      trackTimeOnPage(timeOnPreviousPage, lastPathnameRef.current)
    }
    
    // Track navigation
    if (lastPathnameRef.current !== pathname && lastPathnameRef.current !== '') {
      trackNavigation(lastPathnameRef.current, pathname)
    }
    
    // Reset for new page
    startTimeRef.current = currentTime
    scrollDepthRef.current = 0
    maxScrollDepthRef.current = 0
    lastPathnameRef.current = pathname
    
    // Track specific page views
    if (pathname === '/gallery') {
      trackGalleryPageView()
    }
    
    // Track general engagement
    trackEngagement('page_view', pathname)
  }, [pathname])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100)
      
      if (scrollPercent > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = scrollPercent
        scrollDepthRef.current = scrollPercent
        
        // Track scroll milestones in GA
        if (scrollPercent >= 25 && scrollPercent < 50) {
          trackScrollDepth(25)
        } else if (scrollPercent >= 50 && scrollPercent < 75) {
          trackScrollDepth(50)
        } else if (scrollPercent >= 75 && scrollPercent < 90) {
          trackScrollDepth(75)
        } else if (scrollPercent >= 90) {
          trackScrollDepth(90)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track time on page when component unmounts
  useEffect(() => {
    return () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
      if (timeOnPage > 0) {
        trackTimeOnPage(timeOnPage, pathname)
      }
    }
  }, [pathname])

  // Track click events
  const trackClick = useCallback((element: string, category: string = 'Click') => {
    trackEngagement('click', `${category}: ${element}`)
  }, [])

  // Track hover events
  const trackHover = useCallback((element: string, category: string = 'Hover') => {
    trackEngagement('hover', `${category}: ${element}`)
  }, [])

  // Track focus events
  const trackFocus = useCallback((element: string, category: string = 'Focus') => {
    trackEngagement('focus', `${category}: ${element}`)
  }, [])

  return {
    trackClick,
    trackHover,
    trackFocus,
  }
}

// Hook specifically for gallery analytics
export function useGalleryAnalytics() {
  const { trackClick, trackHover } = useAnalytics()

  const trackPhotoClick = useCallback((photoId: string, photoTitle: string) => {
    trackClick(`Photo: ${photoTitle} (ID: ${photoId})`, 'Gallery')
  }, [trackClick])

  const trackPhotoHover = useCallback((photoId: string, photoTitle: string) => {
    trackHover(`Photo: ${photoTitle} (ID: ${photoId})`, 'Gallery')
  }, [trackHover])

  const trackGalleryAction = useCallback((action: string, details?: string) => {
    trackClick(`${action}${details ? `: ${details}` : ''}`, 'Gallery')
  }, [trackClick])

  return {
    trackPhotoClick,
    trackPhotoHover,
    trackGalleryAction,
  }
}
