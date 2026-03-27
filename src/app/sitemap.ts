import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flavglen.dev'
  const currentDate = new Date().toISOString().split('T')[0]

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/movie-finder`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/json-to-ts`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/json-compare`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/api-code-gen`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/qr-code-generator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Fetch published blog posts
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    // Fetch all posts and filter in memory to avoid index requirement
    const snapshot = await db.collection('blog_posts')
      .limit(1000) // Reasonable limit
      .get()

    const allPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    // Filter for published posts and ensure slug exists
    const publishedPosts = allPosts.filter((post: any) => 
      post.published === true && post.slug
    )

    blogPosts = publishedPosts.map((post: any) => {
      const lastModified = post.updatedAt || post.createdAt || currentDate
      const lastModDate = typeof lastModified === 'string' 
        ? lastModified.split('T')[0] 
        : currentDate
      
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: lastModDate,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }
    })

    console.log(`Sitemap: Found ${blogPosts.length} published blog posts`)
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    // Continue without blog posts if there's an error
  }

  return [...staticPages, ...blogPosts]
}

