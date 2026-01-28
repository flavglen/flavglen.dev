import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/sections/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { StatsSection } from "@/components/sections/StatsSection"
import Footer from "@/components/footer"

// Dynamically import below-the-fold sections to reduce initial bundle size
// These will be code-split and loaded as needed
const AboutSection = dynamic(() => import("@/components/sections/AboutSection").then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="py-6 sm:py-8 md:py-12" />,
})

const ProjectsSection = dynamic(() => import("@/components/sections/ProjectsSection").then(mod => ({ default: mod.ProjectsSection })), {
  loading: () => <div className="py-6 sm:py-8 md:py-12" />,
})

const ToolsSection = dynamic(() => import("@/components/sections/ToolsSection").then(mod => ({ default: mod.ToolsSection })), {
  loading: () => <div className="py-6 sm:py-8 md:py-12" />,
})

// SkillsSection uses framer-motion which is heavy - definitely lazy load
const SkillsSection = dynamic(() => import("@/components/sections/SkillsSection").then(mod => ({ default: mod.SkillsSection })), {
  loading: () => <div className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20" />,
})

const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then(mod => ({ default: mod.ContactSection })), {
  loading: () => <div className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20" />,
})

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-4 sm:py-6 md:py-10">
        {/* Above-the-fold content - loaded immediately */}
        <HeroSection />
        <StatsSection />
        
        {/* Below-the-fold content - lazy loaded with Suspense for streaming */}
        <Suspense fallback={<div className="py-6 sm:py-8 md:py-12" />}>
          <AboutSection />
        </Suspense>
        
        <Suspense fallback={<div className="py-6 sm:py-8 md:py-12" />}>
          <ProjectsSection />
        </Suspense>
        
        <Suspense fallback={<div className="py-6 sm:py-8 md:py-12" />}>
          <ToolsSection />
        </Suspense>
        
        <Suspense fallback={<div className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20" />}>
          <SkillsSection />
        </Suspense>
        
        <Suspense fallback={<div className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20" />}>
          <ContactSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

