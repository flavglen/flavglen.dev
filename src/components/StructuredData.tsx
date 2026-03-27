'use client'

import Script from 'next/script'

export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Glen Flavian Pais",
    "givenName": "Glen",
    "familyName": "Pais",
    "jobTitle": "Senior Full Stack Developer",
    "description": "Senior Full Stack Developer with 9+ years of experience at Loblaws. Expert in React, Next.js, Angular, Vue.js, Node.js, and TypeScript. Actively seeking full-time and contract opportunities in Canada and India.",
    "url": "https://flavglen.dev",
    "image": "https://flavglen.dev/dp.jpeg",
    "logo": "https://flavglen.dev/gp-logo.png",
    "email": "mailto:flavglen@gmail.com",
    "sameAs": [
      "https://github.com/flavglen",
      "https://linkedin.com/in/glen-pais",
      "https://twitter.com/flavglen"
    ],
    "address": [
      {
        "@type": "PostalAddress",
        "addressCountry": "CA",
        "addressRegion": "Ontario"
      },
      {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "Karnataka"
      }
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Mangalore University",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "Karnataka"
      }
    },
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "Master of Computer Applications (MCA)",
      "credentialCategory": "degree",
      "recognizedBy": {
        "@type": "EducationalOrganization",
        "name": "Mangalore University"
      }
    },
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Senior Full Stack Developer",
      "description": "Design and build web applications using React, Next.js, Angular, Vue.js, Node.js, and TypeScript. AI-enhanced development using GitHub Copilot and Cursor.",
      "occupationLocation": [
        { "@type": "Country", "name": "Canada" },
        { "@type": "Country", "name": "India" }
      ],
      "skills": "React, Next.js, Angular, Vue.js, Node.js, TypeScript, JavaScript, Firebase, AWS, GraphQL, Docker, Tailwind CSS, GitHub Copilot, Cursor AI"
    },
    "knowsAbout": [
      "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
      "Angular", "Vue.js", "AI Development", "Frontend Development",
      "Full Stack Development", "Web Development", "E-commerce Development",
      "Firebase", "AWS", "Docker", "GraphQL", "Tailwind CSS",
      "GitHub Copilot", "Cursor AI", "V0.dev", "Microfrontend Architecture",
      "Performance Optimization", "Test-Driven Development"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Loblaws",
      "url": "https://www.loblaws.ca",
      "address": { "@type": "PostalAddress", "addressCountry": "CA" }
    },
    "offers": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Full Stack Development Services",
        "description": "Senior full stack development using React, Next.js, Angular, Vue.js, Node.js, TypeScript, and AI-enhanced workflows"
      },
      "areaServed": [
        { "@type": "Country", "name": "Canada" },
        { "@type": "Country", "name": "India" },
        { "@type": "AdministrativeArea", "name": "Remote" }
      ],
      "availability": "https://schema.org/InStock"
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Glen Flavian Pais Portfolio",
    "url": "https://flavglen.dev",
    "description": "Portfolio of Glen Flavian Pais - Senior Full Stack Developer specializing in React, Next.js, Angular, Vue.js, Node.js, and TypeScript. Open to work in Canada and India.",
    "author": {
      "@type": "Person",
      "name": "Glen Flavian Pais"
    },
    "inLanguage": "en-CA",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://flavglen.dev/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Glen Flavian Pais - Full Stack Development Services",
    "description": "Senior full stack development services specializing in React, Next.js, Angular, Vue.js, Node.js, TypeScript, and modern web technologies. Available for full-time, contract, and freelance work.",
    "provider": {
      "@type": "Person",
      "name": "Glen Flavian Pais",
      "jobTitle": "Senior Full Stack Developer"
    },
    "url": "https://flavglen.dev",
    "areaServed": [
      { "@type": "Country", "name": "Canada" },
      { "@type": "Country", "name": "India" }
    ],
    "serviceType": "Web Development",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "React Development", "description": "Custom React applications and components" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Next.js Development", "description": "Full-stack Next.js applications with server-side rendering and static generation" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Angular Development", "description": "Enterprise Angular applications with TypeScript" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Vue.js Development", "description": "Modern Vue.js applications with Vue 3 and Composition API" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Node.js Development", "description": "Server-side Node.js applications and RESTful APIs" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "AI-Enhanced Development", "description": "Accelerated development using AI tools like Cursor, GitHub Copilot, and V0.dev" }
        }
      ]
    }
  }

  // Candidate schema — signals active job seeking to search engines and recruiters
  const candidateSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Glen Flavian Pais",
    "jobTitle": "Senior Full Stack Developer",
    "description": "Senior Full Stack Developer actively seeking full-time, contract, and remote opportunities in Canada and India. 9+ years of experience in React, Next.js, Angular, Vue.js, Node.js, and TypeScript.",
    "url": "https://flavglen.dev",
    "address": [
      { "@type": "PostalAddress", "addressCountry": "CA", "addressRegion": "Ontario" },
      { "@type": "PostalAddress", "addressCountry": "IN", "addressRegion": "Karnataka" }
    ],
    "seeks": {
      "@type": "Demand",
      "name": "Full Stack Developer Position",
      "description": "Seeking full-time, contract, or freelance opportunities as a React, Next.js, Angular, Vue.js, or Node.js developer. Open to remote, hybrid, or on-site roles in Canada and India.",
      "itemOffered": {
        "@type": "Occupation",
        "name": "Senior Full Stack Developer",
        "skills": "React, Next.js, Angular, Vue.js, Node.js, TypeScript, JavaScript, Firebase, AWS, GraphQL, Docker",
        "occupationLocation": [
          { "@type": "Country", "name": "Canada" },
          { "@type": "Country", "name": "India" },
          { "@type": "AdministrativeArea", "name": "Remote" }
        ]
      }
    },
    "sameAs": [
      "https://github.com/flavglen",
      "https://linkedin.com/in/glen-pais",
      "https://twitter.com/flavglen"
    ]
  }

  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="professional-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <Script
        id="candidate-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(candidateSchema) }}
      />
    </>
  )
}
