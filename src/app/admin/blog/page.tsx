"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import dynamic from "next/dynamic"
import DOMPurify from "isomorphic-dompurify"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

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

export default function AdminBlogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [published, setPublished] = useState(false)

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  }

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image',
    'blockquote', 'code-block'
  ]

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/protected/blog-posts?limit=1000")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blog posts")
      }

      setPosts(data.data || [])
    } catch (err) {
      console.error("Error fetching blog posts:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to load blog posts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setShowForm(true)
    setTitle(post.title)
    setContent(post.content)
    setExcerpt(post.excerpt || "")
    setImageUrl(post.imageUrl || "")
    setPublished(post.published)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewPost = () => {
    setEditingPost(null)
    setShowForm(true)
    setTitle("")
    setContent("")
    setExcerpt("")
    setImageUrl("")
    setPublished(false)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    setEditingPost(null)
    setShowForm(false)
    setTitle("")
    setContent("")
    setExcerpt("")
    setImageUrl("")
    setPublished(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Sanitize content to prevent XSS
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
        ALLOW_DATA_ATTR: false
      })

      const url = editingPost 
        ? `/api/protected/blog-posts/${editingPost.id}`
        : "/api/protected/blog-posts"
      
      const method = editingPost ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: sanitizedContent,
          excerpt: excerpt.trim(),
          imageUrl: imageUrl.trim(),
          published
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${editingPost ? 'update' : 'create'} blog post`)
      }

      toast({
        title: "Success",
        description: `Blog post ${editingPost ? 'updated' : 'created'} successfully!`,
      })

      // Reset form and refresh list
      handleCancelEdit()
      fetchPosts()
    } catch (error) {
      console.error(`Error ${editingPost ? 'updating' : 'creating'} blog post:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${editingPost ? 'update' : 'create'} blog post`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (postId: string, postTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${postTitle}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/protected/blog-posts/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete blog post")
      }

      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      })

      await fetchPosts()
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete blog post",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container py-4 sm:py-8 px-2 sm:px-6 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Blog Management</h1>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Create, edit, and manage your blog posts
            </p>
          </div>
          {!showForm && (
            <Button onClick={handleNewPost} className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          )}
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingPost ? "Edit Blog Post" : "New Blog Post"}</CardTitle>
            <CardDescription>
              {editingPost ? "Update the blog post details below" : "Fill in the details below to create a new blog post"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog post title"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {editingPost ? "Slug will remain the same" : "SEO-friendly URL will be generated automatically from the title"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the blog post"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Featured Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <div className="min-h-[300px]">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your blog post content here..."
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish immediately
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (editingPost ? "Updating..." : "Creating...") : (editingPost ? "Update Post" : "Create Post")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Blog Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>
            {posts.length} total post{posts.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No blog posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      {post.published ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          <Eye className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {post.excerpt || "No excerpt"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Slug: {post.slug}</span>
                      {post.createdAt && (
                        <span>Created: {format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                      )}
                      {post.author && <span>By: {post.author}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
