import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimateInView } from "@/components/animate-in-view"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/data/projects"
import { Badge } from "../ui/badge"

export function ProjectsSection({ showPageHeader = false }: { showPageHeader?: boolean }) {
  return (
    <section id="projects" className="py-6 sm:py-8 md:py-12 scroll-mt-20">
      <AnimateInView>
        <div className="space-y-4 text-center \ mx-auto mb-8 sm:mb-12 md:mb-16">
          {showPageHeader ? (
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                My Personal Projects - React, TypeScript &amp; Full Stack Development
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explore my collection of personal projects showcasing expertise in React, TypeScript, Next.js,
                Firebase, and modern web development. From full-stack applications to error handling libraries,
                these projects demonstrate my passion for building innovative solutions, implementing authentication
                systems, payment gateways, and creating seamless user experiences with cutting-edge technologies.
              </p>
              <div className="text-sm text-muted-foreground mb-8">
                <p>
                  Featured technologies include React, TypeScript, Next.js, Firebase, Node.js, Express,
                  Material-UI, Tailwind CSS, Axios, OAuth authentication, serverless functions,
                  Cloud Functions, Firestore, Redis caching, and modern web development practices.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-sm">React</Badge>
                <Badge variant="secondary" className="text-sm">TypeScript</Badge>
                <Badge variant="secondary" className="text-sm">Next.js</Badge>
                <Badge variant="secondary" className="text-sm">Firebase</Badge>
                <Badge variant="secondary" className="text-sm">Node.js</Badge>
                <Badge variant="secondary" className="text-sm">Express</Badge>
                <Badge variant="secondary" className="text-sm">Tailwind CSS</Badge>
                <Badge variant="secondary" className="text-sm">Material-UI</Badge>
                <Badge variant="secondary" className="text-sm">Axios</Badge>
                <Badge variant="secondary" className="text-sm">OAuth</Badge>
                <Badge variant="secondary" className="text-sm">Serverless</Badge>
                <Badge variant="secondary" className="text-sm">Cloud Functions</Badge>
              </div>
            </div>
          ) : (
            <h2 className="text-3xl font-bold font-montserrat">
              My <span className="gradient-text">Projects</span>
            </h2>
          )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {projects.map((project, index) => (
              <AnimateInView key={project.id} delay={index * 100}>
                <ProjectCard project={project} />
              </AnimateInView>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="web" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
