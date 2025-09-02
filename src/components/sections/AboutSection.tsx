import { AnimateInView } from "@/components/animate-in-view"
import { TimeLine } from "@/components/timeline"
import { ExperienceTimeline } from "@/components/exp-timeline"
import { experiences } from "@/data/exp"

export function AboutSection() {
  return (
    <section id="about" className="py-20 scroll-mt-20">
      <AnimateInView>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-montserrat">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground">Get to know me and my background</p>
        </div>
      </AnimateInView>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <AnimateInView direction="left">
          <div className="relative">
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl opacity-70 -z-10"></div>
            <div className="w-full h-[600px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow bg-white dark:bg-gray-900 overflow-hidden">
              <TimeLine />
            </div>
          </div>
        </AnimateInView>
        <AnimateInView direction="right" delay={200}>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-montserrat">
              My <span className="gradient-text">Journey</span>
            </h3>
            <p className="text-muted-foreground">
              With 9+ years of experience building everything from sleek single-page applications to 
              large-scale e-commerce platforms, I specialize in crafting performant, accessible, and user-centric 
              web solutions using React, Angular, Vue.js, Next.js, TypeScript, Node.js, HTML, and CSS.
            </p>
            <p className="text-muted-foreground">
              Passionate about staying at the forefront of web innovation, I actively explore AI-enhanced development workflows using tools 
              like <b>Cursor, GitHub Copilot,</b> and intelligent debugging to accelerate and optimize the developer experience.
              My expertise also extends to serverless architecture and cloud-native applications, 
              leveraging AWS and modern DevOps practices to deliver scalable, resilient systems.
            </p>
            <p className="text-muted-foreground">
             Whether it&apos;s implementing AI-assisted features, integrating APIs, or streamlining performance, I
              thrive on transforming complex challenges into elegant frontend experiences.
               I&apos;m constantly learning and adapting—exploring how AI, automation, and cloud computing can reshape how we build for the web.
            </p>
            <div className="pt-4">
              <h4 className="font-semibold mb-2 gradient-text-blue">Education</h4>
              <p className="text-muted-foreground">Master of Computer Applications (MCA), Mangalore University, INDIA (2011-2014)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 gradient-text-blue">Experience</h4>
              <ExperienceTimeline experiences={experiences} />
            </div>
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}
