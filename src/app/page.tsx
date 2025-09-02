import { Header } from "@/components/sections/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { StatsSection } from "@/components/sections/StatsSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import { SkillsSection } from "@/components/sections/SkillsSection"
import { ContactSection } from "@/components/sections/ContactSection"
import Footer from "@/components/footer"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-10">
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

