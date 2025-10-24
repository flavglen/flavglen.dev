import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Projects | Glen Pais - Full Stack Developer Portfolio',
  description: 'Explore my personal projects showcasing React, TypeScript, Next.js, Firebase, and modern web development. From portfolio websites to error handling libraries, discover my passion for building innovative solutions.',
  keywords: [
    'personal projects',
    'React projects',
    'TypeScript projects',
    'Next.js projects',
    'Firebase projects',
    'web development projects',
    'portfolio projects',
    'open source projects',
    'GitHub projects',
    'full stack developer',
    'frontend developer',
    'backend developer',
    'JavaScript projects',
    'Node.js projects',
    'Express projects',
    'Material-UI projects',
    'Tailwind CSS projects',
    'Glen Pais',
    'developer portfolio',
    'software engineer',
    'web applications',
    'mobile apps',
    'API development',
    'authentication systems',
    'payment gateways',
    'error handling',
    'Axios interceptors',
    'serverless functions',
    'Cloud Functions',
    'Firestore',
    'Redis caching',
    'dashboards',
    'analytics',
    'real-time data',
    'OAuth',
    'role-based authentication',
    'Google authentication',
    'Vercel deployment',
    'serverless architecture'
  ],
  openGraph: {
    title: 'My Projects | Glen Pais - Full Stack Developer',
    description: 'Explore my personal projects showcasing React, TypeScript, Next.js, Firebase, and modern web development. From portfolio websites to error handling libraries.',
    type: 'website',
    url: 'https://flavglen.dev/projects',
    siteName: 'Glen Pais Portfolio',
    images: [
      {
        url: 'https://flavglen.dev/placeholder.jpg',
        width: 1200,
        height: 630,
        alt: 'Glen Pais Personal Projects - React, TypeScript, Next.js Developer',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Projects | Glen Pais - Full Stack Developer',
    description: 'Explore my personal projects showcasing React, TypeScript, Next.js, Firebase, and modern web development.',
    images: ['https://flavglen.dev/placeholder.jpg'],
    creator: '@flavglen',
  },
  alternates: {
    canonical: 'https://flavglen.dev/projects',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: 'Glen Pais', url: 'https://flavglen.dev' }],
  creator: 'Glen Pais',
  publisher: 'Glen Pais',
  category: 'Technology',
  classification: 'Portfolio',
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
