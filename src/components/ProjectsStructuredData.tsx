export default function ProjectsStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "My Projects - Glen Pais",
    "description": "A collection of personal projects showcasing React, TypeScript, Next.js, Firebase, and modern web development skills.",
    "url": "https://flavglen.dev/projects",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Personal Projects",
      "description": "Collection of personal web development projects by Glen Pais",
      "numberOfItems": 4,
      "itemListElement": [
        {
          "@type": "SoftwareApplication",
          "position": 1,
          "name": "Aira Club",
          "description": "An online lucky scheme portal with user authentication (OAuth), roles and permissions, payment gateway, and serverless functions using Firebase Cloud Functions and Firestore. Features Redis caching, reports, dashboards, and a media library.",
          "url": "https://airaclub.com",
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web Browser",
          "programmingLanguage": ["React", "TypeScript", "Firebase", "Node.js", "Express", "JavaScript"],
          "author": {
            "@type": "Person",
            "name": "Glen Pais",
            "url": "https://flavglen.dev",
            "jobTitle": "Full Stack Developer"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "SoftwareApplication",
          "position": 2,
          "name": "Flavglen.dev",
          "description": "Personal portfolio built with Next.js, Tailwind CSS, and TypeScript. Features expense tracker, Google authentication, role-based authentication, dashboards, and exports. Hosted on Vercel with serverless functions, Google Gmail SDK, and Vercel cron jobs.",
          "url": "https://flavglen.dev",
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web Browser",
          "programmingLanguage": ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript"],
          "author": {
            "@type": "Person",
            "name": "Glen Pais",
            "url": "https://flavglen.dev",
            "jobTitle": "Full Stack Developer"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "SoftwareApplication",
          "position": 3,
          "name": "AI Portfolio",
          "description": "A modern personal portfolio built using V0.dev, an AI tool that generates React and Tailwind components. Features interactive elements like custom cursor using Framer Motion and AI-generated components.",
          "url": "https://v0-melissa-portfolio.vercel.app",
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web Browser",
          "programmingLanguage": ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
          "author": {
            "@type": "Person",
            "name": "Glen Pais",
            "url": "https://flavglen.dev",
            "jobTitle": "Full Stack Developer"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "SoftwareApplication",
          "position": 4,
          "name": "Axios Error Handling",
          "description": "A React application demonstrating centralized error handling with Axios interceptors and Material-UI snackbars. Features comprehensive error types handling, automatic error display, and modern UI built with React, TypeScript, Tailwind CSS, and Material-UI.",
          "url": "https://github.com/flavglen/axios-error-handling",
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web Browser",
          "programmingLanguage": ["React", "TypeScript", "Axios", "Material-UI", "Tailwind CSS", "Vite"],
          "author": {
            "@type": "Person",
            "name": "Glen Pais",
            "url": "https://flavglen.dev",
            "jobTitle": "Full Stack Developer"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }
      ]
    },
    "author": {
      "@type": "Person",
      "name": "Glen Pais",
      "url": "https://flavglen.dev",
      "jobTitle": "Full Stack Developer",
      "description": "Full Stack Developer specializing in React, TypeScript, Next.js, Firebase, and modern web technologies. Passionate about building innovative solutions and continuous learning.",
      "knowsAbout": [
        "React",
        "TypeScript", 
        "Next.js",
        "Firebase",
        "Node.js",
        "Express",
        "JavaScript",
        "Web Development",
        "Frontend Development",
        "Backend Development",
        "Full Stack Development",
        "API Development",
        "Authentication",
        "Payment Gateways",
        "Error Handling",
        "Serverless Functions",
        "Cloud Functions",
        "Firestore",
        "Redis",
        "Caching",
        "Dashboards",
        "Analytics",
        "OAuth",
        "Role-based Authentication",
        "Google Authentication",
        "Vercel",
        "Serverless Architecture",
        "Material-UI",
        "Tailwind CSS",
        "Axios",
        "HTTP Interceptors",
        "Vite",
        "Lucide React",
        "Framer Motion"
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Full Stack Developer",
        "occupationLocation": {
          "@type": "Country",
          "name": "Canada"
        }
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://flavglen.dev"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Projects",
          "item": "https://flavglen.dev/projects"
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
