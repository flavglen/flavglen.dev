import { Header } from "@/components/sections/Header"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import Footer from "@/components/footer"
import ProjectsStructuredData from "@/components/ProjectsStructuredData"

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

