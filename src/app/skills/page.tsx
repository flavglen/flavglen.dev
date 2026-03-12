import { Metadata } from "next"
import Script from "next/script"
import { Header } from "@/components/sections/Header"
import { SkillsSection } from "@/components/sections/SkillsSection"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Skills - Glen Pais | React, Next.js, Angular, Vue.js, Node.js, TypeScript",
  description: "Explore Glen Pais's technical skills: React, Next.js, Angular, Vue.js, Node.js, TypeScript, Firebase, AWS, and AI-enhanced development tools like Cursor, GitHub Copilot, and V0.",
  alternates: { canonical: "https://flavglen.dev/skills" },
}

const skillsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "url": "https://flavglen.dev/skills",
  "name": "Glen Pais Technical Skills",
  "description": "Technical skills and technologies used by Glen Flavian Pais.",
  "itemListElement": [
    "React", "Next.js", "Angular", "Vue.js", "Node.js", "TypeScript",
    "JavaScript", "Firebase", "AWS", "Tailwind CSS", "GraphQL",
    "GitHub Copilot", "Cursor AI", "V0.dev"
  ].map((skill, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": skill
  }))
}

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script id="skills-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(skillsSchema) }} />
      <Header />
      <main className="container py-4 sm:py-6 md:py-10">
        <SkillsSection />
      </main>
      <Footer />
    </div>
  )
}
