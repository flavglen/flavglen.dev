import { Metadata } from "next"
import Script from "next/script"
import { Header } from "@/components/sections/Header"
import { AboutSection } from "@/components/sections/AboutSection"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "About Glen Pais - AI-Enhanced Full Stack Developer | 9+ Years Experience",
  description: "Learn about Glen Flavian Pais — an AI-enhanced Full Stack Developer with 9+ years of experience in React, Next.js, Angular, Vue.js, Node.js, TypeScript, and modern web development. Based in Canada.",
  alternates: { canonical: "https://flavglen.dev/about" },
}

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "url": "https://flavglen.dev/about",
  "name": "About Glen Flavian Pais",
  "description": "Learn about Glen Flavian Pais — an AI-enhanced Full Stack Developer with 9+ years of experience.",
  "mainEntity": {
    "@type": "Person",
    "name": "Glen Flavian Pais",
    "jobTitle": "AI-Enhanced Full Stack Developer",
    "url": "https://flavglen.dev",
    "image": "https://flavglen.dev/dp.jpeg",
    "sameAs": [
      "https://github.com/flavglen",
      "https://linkedin.com/in/glen-pais",
      "https://twitter.com/flavglen"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CA",
      "addressRegion": "Ontario"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Mangalore University"
    },
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "Master of Computer Applications (MCA)"
    }
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script id="about-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <Header />
      <main className="container py-4 sm:py-6 md:py-10">
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
