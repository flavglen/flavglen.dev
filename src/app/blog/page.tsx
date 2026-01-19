"use client"

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DOMPurify from "isomorphic-dompurify"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/sections/Header"
import Footer from "@/components/footer"
import { getAuthorDisplayName } from "@/lib/utils"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  imageUrl?: string
  author?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async (page: number = 1) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/blog-posts?page=${page}&limit=10`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blog posts")
      }

      setPosts(data.data || [])
      setPagination(data.pagination || pagination)
    } catch (err) {
      console.error("Error fetching blog posts:", err)
      setError(err instanceof Error ? err.message : "Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(1)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPosts(newPage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Sanitize HTML content for safe display
  const sanitizeContent = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
      ALLOW_DATA_ATTR: false
    })
  }

  // Get excerpt from content if no excerpt is provided
  const getExcerpt = (post: BlogPost) => {
    if (post.excerpt) return post.excerpt
    
    // Strip HTML and get first 150 characters
    const textContent = DOMPurify.sanitize(post.content, { ALLOWED_TAGS: [] })
    return textContent.length > 150 
      ? textContent.substring(0, 150) + "..." 
      : textContent
  }

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => fetchPosts(pagination.page)} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground">
          Read our latest posts and articles
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts available yet.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <div className="w-full h-48 overflow-hidden rounded-t-xl bg-muted">
                  <img
                    src={post.imageUrl || "https://dummyimage.com/600x400/000/fff"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to default image if image fails to load
                      const target = e.target as HTMLImageElement;
                      if (target.src !== "https://dummyimage.com/600x400/000/fff") {
                        target.src = "https://dummyimage.com/600x400/000/fff";
                      }
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {post.createdAt && (
                      <time dateTime={post.createdAt}>
                        {format(new Date(post.createdAt), "MMMM d, yyyy")}
                      </time>
                    )}
                    {post.author && (
                      <span className="ml-2">by {getAuthorDisplayName(post.author)}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {getExcerpt(post)}
                  </p>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and pages around current
                    if (page === 1 || page === pagination.totalPages) return true
                    if (Math.abs(page - pagination.page) <= 1) return true
                    return false
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there's a gap
                    const showEllipsisBefore = index > 0 && page - array[index - 1] > 1
                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsisBefore && <span className="px-2">...</span>}
                        <Button
                          variant={pagination.page === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                        >
                          {page}
                        </Button>
                      </div>
                    )
                  })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total posts)
          </div>
        </>
      )}
      </main>
      <Footer />
    </div>
  )
}

