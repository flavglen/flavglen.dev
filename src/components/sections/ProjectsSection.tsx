import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimateInView } from "@/components/animate-in-view"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/data/projects"

export function ProjectsSection() {
  return (
    <section id="projects" className="py-12 scroll-mt-20">
      <AnimateInView>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-montserrat">
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground">Check out some of my recent work</p>
        </div>
      </AnimateInView>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-gradient-to-r from-purple-600/10 to-pink-600/10">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="web"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all"
            >
              Personal
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all"
            >
              Professional
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <AnimateInView key={project.id} delay={index * 100}>
                <ProjectCard project={project} />
              </AnimateInView>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="web" className="mt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .filter((p) => p.category === "personal")
              .map((project, index) => (
                <AnimateInView key={project.id} delay={index * 100}>
                  <ProjectCard project={project} />
                </AnimateInView>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="mt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .filter((p) => p.category === "professional")
              .map((project, index) => (
                <AnimateInView key={project.id} delay={index * 100}>
                  <ProjectCard project={project} />
                </AnimateInView>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
