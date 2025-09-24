import { AnimateInView } from "@/components/animate-in-view"
import { InteractiveSkillGrid } from "@/components/interactive-skill-grid"
import { skills } from "@/data/skills"

export function SkillsSection() {
  return (
    <section id="skills" className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 scroll-mt-20">
      <AnimateInView>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl font-bold font-montserrat">
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-muted-foreground">Technologies I work with</p>
        </div>
      </AnimateInView>
      <AnimateInView>
        <InteractiveSkillGrid skills={skills} />
      </AnimateInView>
    </section>
  )
}
