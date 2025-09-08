"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimateInView } from "@/components/animate-in-view"
import { ExternalLink, Calendar, MapPin, Camera, Share2, Download } from "lucide-react"
import Image from "next/image"

interface Photo {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  dateTaken: string
  location?: string
  tags: string[]
  photographer: string
  photographerUrl: string
  alt: string
  width: number
  height: number
}

export function GalleryComponent() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [viewMode] = useState<'masonry'>('masonry')
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        
        // Load from Pexels API (collections)
        const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY
        const PEXELS_COLLECTION_ID = process.env.NEXT_PUBLIC_PEXELS_COLLECTION_ID || "ggcylaq"
        const SEARCH_QUERY = "nature landscape photography"
        
        if (!PEXELS_API_KEY) {
          throw new Error("Pexels API key not configured")
        }

        // Fetch photos from your Pexels collection
        const apiUrl = `https://api.pexels.com/v1/collections/${PEXELS_COLLECTION_ID}?per_page=20`

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': PEXELS_API_KEY
          }
        })

        // If collection fails, fallback to search
        if (!response.ok) {
          console.warn(`Collection failed (${response.status}), falling back to search`)
          const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(SEARCH_QUERY)}&per_page=20&orientation=landscape`
          const searchResponse = await fetch(searchUrl, {
            headers: {
              'Authorization': PEXELS_API_KEY
            }
          })
          
          if (!searchResponse.ok) {
            throw new Error(`HTTP error! status: ${searchResponse.status}`)
          }
          
          const searchData = await searchResponse.json()
          const searchPhotosArray = searchData.media || searchData.photos
          if (!searchPhotosArray) {
            throw new Error('Invalid response from Pexels API')
          }

          const pexelsPhotos: Photo[] = searchPhotosArray.map((photo: any) => ({
            id: photo.id.toString(),
            title: photo.alt || "Beautiful Photo",
            description: `Photographed by ${photo.photographer}`,
            url: photo.src.large2x || photo.src.large,
            thumbnail: photo.src.large, // Use higher quality for thumbnails
            dateTaken: new Date().toISOString().split('T')[0],
            location: "",
            tags: [SEARCH_QUERY, "photography", "pexels"],
            photographer: photo.photographer,
            photographerUrl: photo.photographer_url,
            alt: photo.alt || "Beautiful photo",
            width: photo.width,
            height: photo.height
          }))
          
          setPhotos(pexelsPhotos)
          return
        }

        const data = await response.json()
        
        // Handle both collections API (data.media) and search API (data.photos) responses
        const photosArray = data.media || data.photos
        
        if (!photosArray) {
          throw new Error('Invalid response from Pexels API')
        }

        const pexelsPhotos: Photo[] = photosArray.map((photo: any) => ({
          id: photo.id.toString(),
          title: photo.alt || "Beautiful Photo",
          description: `Photographed by ${photo.photographer}`,
          url: photo.src.large2x || photo.src.large,
          thumbnail: photo.src.large, // Use higher quality for thumbnails
          dateTaken: new Date().toISOString().split('T')[0],
          location: "",
          tags: ["my collection", "photography", "pexels"],
          photographer: photo.photographer,
          photographerUrl: photo.photographer_url,
          alt: photo.alt || "Beautiful photo",
          width: photo.width,
          height: photo.height
        }))
        
        setPhotos(pexelsPhotos)
      } catch (err) {
        console.error("Error fetching photos:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load photos"
        setError(errorMessage)
        
        // Log additional debugging info
        if (err instanceof Error && err.message.includes('500')) {
          console.error("500 error - this might be due to:")
          console.error("1. Invalid Pexels User ID format")
          console.error("2. User doesn't exist on Pexels")
          console.error("3. API rate limiting")
          console.error("4. Invalid API key")
        }
        
        // Set empty photos array to show no results view
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  // Helper functions

  const handleShare = useCallback(async (photo: Photo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description,
          url: photo.url,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(photo.url)
    }
  }, [])

  const handleDownload = useCallback(async (photo: Photo) => {
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${photo.title}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.log('Error downloading:', err)
    }
  }, [])

  // Calculate aspect ratio for masonry layout
  const getAspectRatio = (width: number, height: number) => {
    return height / width
  }

  // Calculate proper height based on aspect ratio for masonry
  const getMasonryHeight = (width: number, height: number) => {
    const aspectRatio = height / width
    // Use responsive container width based on screen size
    const containerWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? 150 : 300
    return containerWidth * aspectRatio
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading photos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-lg mx-auto">
          {/* Animated Camera Icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl animate-pulse"></div>
            <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center border-4 border-purple-200/50 dark:border-purple-700/30">
              <Camera className="w-16 h-16 text-purple-600 dark:text-purple-400 animate-bounce" />
            </div>
          </div>
          
          {/* Fancy Text */}
          <div className="space-y-4 mb-8">
            <h3 className="text-3xl font-bold font-montserrat gradient-text">
              No Photos Found
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              No photos found.
            </p>
          </div>
          
          {/* Fancy Button */}
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Refresh Gallery
            </Button>
            
            {/* Decorative Elements */}
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Masonry Photo Layout */}
      <div className="masonry-container columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
        {photos.map((photo, index) => {
          const aspectRatio = getAspectRatio(photo.width, photo.height)
          const masonryHeight = getMasonryHeight(photo.width, photo.height)
          
          return (
            <AnimateInView key={photo.id} delay={index * 50}>
              <Card 
                className="gallery-card masonry-item overflow-hidden group border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer break-inside-avoid mb-4"
                onClick={() => setSelectedPhoto(photo)}
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
                style={{ height: `${masonryHeight}px` }}
              >
                <div className="relative overflow-hidden" style={{ height: '100%' }}>
                  <Image
                    src={photo.thumbnail}
                    alt={photo.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    priority={index < 8} // Prioritize first 8 images
                  />
                  
                  {/* Instagram-style overlay */}
                  <div className="instagram-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-black/70 hover:bg-black/80 backdrop-blur-sm border-white/30 text-white shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShare(photo)
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-black/70 hover:bg-black/80 backdrop-blur-sm border-white/30 text-white shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(photo)
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 pr-20">{photo.title}</h3>
                        <p className="text-sm text-gray-200 line-clamp-2 pr-20">{photo.description}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-4 text-white text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(photo.dateTaken).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button size="sm" className="bg-black/70 hover:bg-black/80 backdrop-blur-sm border-white/30 text-white shadow-lg self-start sm:self-auto">
                          <Camera className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Pinterest-style hover effect */}
                  {hoveredPhoto === photo.id && (
                    <div className="pinterest-hover absolute inset-0 transition-opacity duration-300" />
                  )}
                </div>
                
              </Card>
            </AnimateInView>
          )
        })}
      </div>

      {/* 80% Screen Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-xl w-[80vw] h-[80vh] flex flex-col overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header with controls */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1 min-w-0">
                <h2 className="text-gray-900 dark:text-white text-xl font-bold truncate pr-4">{selectedPhoto.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm truncate pr-4">{selectedPhoto.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare(selectedPhoto)
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(selectedPhoto)
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPhoto(null)}
                >
                  ×
                </Button>
              </div>
            </div>

            {/* Image area */}
            <div className="flex-1 flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-800 overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  priority
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              </div>
            </div>

            {/* Footer with metadata and actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(selectedPhoto.dateTaken).toLocaleDateString()}</span>
                  </div>
                  {selectedPhoto.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedPhoto.location}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {selectedPhoto.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{selectedPhoto.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button asChild size="sm">
                    <a href={selectedPhoto.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Full Size
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(selectedPhoto)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare(selectedPhoto)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pexels Integration Note */}
      {error && (
        <div className="text-center py-8 border-t">
          <p className="text-muted-foreground text-sm">
            {error.includes("Pexels API key not configured") ? (
              <>
                To display beautiful photos, add your Pexels API key to your environment variables.
                <br />
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                  NEXT_PUBLIC_PEXELS_API_KEY=your_api_key_here
                </code>
                <br />
                <a 
                  href="https://www.pexels.com/api/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  Get your free Pexels API key here
                </a>
              </>
            ) : error.includes("500") || error.includes("404") || error.includes("403") ? (
              <>
                Pexels API returned an error. This usually means:
                <br />
                • Collection ID doesn&apos;t exist or is incorrect
                <br />
                • Collection is private or requires different permissions
                <br />
                • API rate limiting
                <br />
                • Temporary server issue
                <br />
                <br />
                <strong>Solution:</strong> Using search API instead of collection.
                <br />
                Switch to &quot;My Photos&quot; mode to use your own images.
              </>
            ) : (
              <>
                Unable to load photos from Pexels. Showing fallback content.
                <br />
                Check your API key configuration.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
