import type { Metadata } from "next"
import { Header } from "@/components/sections/Header"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import Footer from "@/components/footer"
import ProjectsStructuredData from "@/components/ProjectsStructuredData"

export const metadata: Metadata = {
  title: "Projects - Glen Pais | React, Next.js, Angular & Full Stack Portfolio",
  description: "Explore Glen Flavian Pais's portfolio of web development projects built with React, Next.js, Angular, Vue.js, Node.js, TypeScript, and Firebase. 9+ years of full-stack development experience at Loblaws and beyond.",
  keywords: [
    "Glen Pais projects", "React portfolio", "Next.js projects", "full stack portfolio",
    "Angular projects", "Vue.js portfolio", "TypeScript developer portfolio",
    "web development projects Canada", "frontend developer portfolio",
    "Glen Flavian Pais work samples",
  ],
  alternates: { canonical: "https://flavglen.dev/projects" },
  openGraph: {
    title: "Projects - Glen Pais | React, Next.js, Angular & Full Stack Portfolio",
    description: "Full stack developer portfolio with 9+ years of React, Next.js, Angular, Vue.js, and Node.js projects.",
    url: "https://flavglen.dev/projects",
    images: [{ url: "https://flavglen.dev/gp-logo.png", width: 1200, height: 630 }],
  },
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ProjectsStructuredData />
      <Header />
      <main className="container py-4 sm:py-6 md:py-10">
        <ProjectsSection showPageHeader />
      </main>
      <Footer />
    </div>
  )
}

