'use client'

import Script from 'next/script'

export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Glen Flavian Pais",
    "jobTitle": "AI-Enhanced Frontend Developer",
    "description": "Expert AI-enhanced frontend developer with 9+ years experience in React, Next.js, TypeScript, and AI-powered development tools. Available for hire in Canada and India.",
    "url": "https://flavglen.dev",
    "image": "https://flavglen.dev/dp.jpeg",
    "logo": "https://flavglen.dev/gp-logo.png",
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
    "knowsAbout": [
      "React",
      "Next.js", 
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Angular",
      "Vue.js",
      "AI Development",
      "Frontend Development",
      "Web Development",
      "E-commerce Development",
      "Firebase",
      "AWS",
      "GitHub Copilot",
      "Cursor AI",
      "V0.dev"
    ],
    "offers": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Frontend Development Services",
        "description": "AI-enhanced frontend development using React, Next.js, TypeScript, and modern AI tools"
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "Canada"
        },
        {
          "@type": "Country", 
          "name": "India"
        }
      ],
      "availability": "https://schema.org/InStock"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance Developer"
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Glen Flavian Pais Portfolio",
    "url": "https://flavglen.dev",
    "description": "Portfolio of Glen Flavian Pais - AI-Enhanced Frontend Developer specializing in React, Next.js, and modern web development",
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
    "name": "Glen Flavian Pais - Frontend Development Services",
    "description": "AI-enhanced frontend development services specializing in React, Next.js, TypeScript, and modern web technologies",
    "provider": {
      "@type": "Person",
      "name": "Glen Flavian Pais",
      "jobTitle": "AI-Enhanced Frontend Developer"
    },
    "url": "https://flavglen.dev",
    "areaServed": [
      {
        "@type": "Country",
        "name": "Canada"
      },
      {
        "@type": "Country",
        "name": "India"
      }
    ],
    "serviceType": "Web Development",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "React Development",
            "description": "Custom React applications and components"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Next.js Development",
            "description": "Full-stack Next.js applications with server-side rendering"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "AI-Enhanced Development",
            "description": "Development using AI tools like Cursor, GitHub Copilot, and V0.dev"
          }
        }
      ]
    }
  }

  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema)
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <Script
        id="professional-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema)
        }}
      />
    </>
  )
}
