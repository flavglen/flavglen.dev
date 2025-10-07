'use client'

import { useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

interface AnalyticsTrackerProps {
  children: React.ReactNode
  pageName: string
}

export function AnalyticsTracker({ children, pageName }: AnalyticsTrackerProps) {
  const { trackClick, trackHover, trackFocus } = useAnalytics()

  useEffect(() => {
    // Track clicks on all interactive elements
    const handleClick = (event: Event) => {
      try {
        const target = event.target
        if (!target || !(target as any).tagName) return
        
        const element = (target as any).tagName.toLowerCase()
        const className = (target as any).className || ''
        const id = (target as any).id || ''
        
        trackClick(`${element}${id ? `#${id}` : ''}${className ? `.${className.split(' ')[0]}` : ''}`, pageName)
      } catch (error) {
        // Silently ignore errors to prevent breaking the app
      }
    }

    // Track hover events
    const handleMouseEnter = (event: Event) => {
      try {
        const target = event.target
        if (!target || !(target as any).tagName) return
        
        const element = (target as any).tagName.toLowerCase()
        const className = (target as any).className || ''
        const id = (target as any).id || ''
        
        trackHover(`${element}${id ? `#${id}` : ''}${className ? `.${className.split(' ')[0]}` : ''}`, pageName)
      } catch (error) {
        // Silently ignore errors to prevent breaking the app
      }
    }

    // Track focus events
    const handleFocus = (event: Event) => {
      try {
        const target = event.target
        if (!target || !(target as any).tagName) return
        
        const element = (target as any).tagName.toLowerCase()
        const className = (target as any).className || ''
        const id = (target as any).id || ''
        
        trackFocus(`${element}${id ? `#${id}` : ''}${className ? `.${className.split(' ')[0]}` : ''}`, pageName)
      } catch (error) {
        // Silently ignore errors to prevent breaking the app
      }
    }

    // Add event listeners
    document.addEventListener('click', handleClick, true)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('focus', handleFocus, true)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('focus', handleFocus, true)
    }
  }, [pageName, trackClick, trackHover, trackFocus])

  return <>{children}</>
}
