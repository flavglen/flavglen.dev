"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DOMPurify from "isomorphic-dompurify"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/sections/Header"
import Footer from "@/components/footer"

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

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/blog-posts/${slug}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch blog post")
        }

        // Only show published posts
        if (!data.data.published) {
          throw new Error("Blog post not found")
        }

        setPost(data.data)
      } catch (err) {
        console.error("Error fetching blog post:", err)
        setError(err instanceof Error ? err.message : "Failed to load blog post")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  // Sanitize HTML content for safe display
  const sanitizeContent = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
      ALLOW_DATA_ATTR: false
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4 max-w-4xl">
          <div className="text-center">
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4 max-w-4xl">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Blog post not found"}</p>
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 px-4 max-w-4xl">
      <Link href="/blog">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            {post.createdAt && (
              <time dateTime={post.createdAt}>
                {format(new Date(post.createdAt), "MMMM d, yyyy")}
              </time>
            )}
            {post.author && (
              <span>by {post.author}</span>
            )}
          </div>

          <div className="w-full h-64 sm:h-96 overflow-hidden rounded-lg mb-6 bg-muted">
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

          {post.excerpt && (
            <p className="text-lg text-muted-foreground italic mb-6">
              {post.excerpt}
            </p>
          )}
        </header>

        <Card>
          <CardContent className="pt-6">
            <div
              className="blog-content space-y-4 text-base leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:my-4 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4"
              dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }}
            />
          </CardContent>
        </Card>
      </article>
      </main>
      <Footer />
    </div>
  )
}

