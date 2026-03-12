import { Metadata } from "next"
import Script from "next/script"
import { Header } from "@/components/sections/Header"
import { ContactSection } from "@/components/sections/ContactSection"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Contact Glen Pais - Hire a Full Stack Developer | Canada & India",
  description: "Get in touch with Glen Flavian Pais — available for freelance and full-time opportunities in Canada and India. React, Next.js, Angular, Node.js expert. Open to new projects.",
  alternates: { canonical: "https://flavglen.dev/contact" },
}

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "url": "https://flavglen.dev/contact",
  "name": "Contact Glen Flavian Pais",
  "description": "Get in touch with Glen Flavian Pais for freelance and full-time opportunities.",
  "mainEntity": {
    "@type": "Person",
    "name": "Glen Flavian Pais",
    "jobTitle": "AI-Enhanced Full Stack Developer",
    "url": "https://flavglen.dev",
    "email": "mailto:flavglen@gmail.com",
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
    "availableChannel": [
      { "@type": "ServiceChannel", "serviceUrl": "https://github.com/flavglen" },
      { "@type": "ServiceChannel", "serviceUrl": "https://linkedin.com/in/glen-pais" }
    ]
  }
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script id="contact-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <Header />
      <main className="container py-4 sm:py-6 md:py-10">
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
