import { Github, Linkedin, Code, Users, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimateInView } from "@/components/animate-in-view"
import { Counter } from "@/components/counter"
import { InteractiveSkillGrid } from "@/components/interactive-skill-grid"
import { skills } from "../data/skills";
import { MobileMenu } from "@/components/mobile-menu"
import { ExperienceTimeline } from "@/components/exp-timeline"
import { experiences } from "@/data/exp"
import { TimeLine } from "@/components/timeline"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/data/projects"
import Footer from "@/components/footer"


export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl font-montserrat">
            <Link href="/">
              <img
                src="gp-logo.png"
                alt="Logo"
                width={80}
                height={50}
                className="inline-block ml-2 rounded-full"/>
                <span className="gradient-text">Glen</span>Pais
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#projects"
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#skills"
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Skills
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform">
                <Link href="https://github.com/flavglen" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform">
                <Link href="https://linkedin.com/in/flavglen" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              {/* <Button
                variant="default"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
              >
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Button> */}
            </div>
            <MobileMenu
              links={[
                { href: "#about", label: "About" },
                { href: "#projects", label: "Projects" },
                { href: "#skills", label: "Skills" },
                { href: "#contact", label: "Contact" },
              ]}
            />
          </div>
        </div>
      </header>

      <main className="container py-10">
        {/* Hero Section */}
        <section className="py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
          <AnimateInView className="flex-1 space-y-6" direction="left">
            <Badge className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white dark:text-purple-300 border-purple-300/20">
              Available for hire
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-montserrat">
              Hi, I&apos;m <span className="gradient-text">Glen</span>
              <br />
              Frontend Developer
            </h1>
            <p className="text-xl text-muted-foreground max-w-md font-semibold">
                 Empowering Web Interfaces with Code & AI Intelligence.  
            </p>
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="#projects">View My Work</Link>
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                className="relative hover:scale-105 transition-transform border-2 border-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--background), var(--background)), linear-gradient(to right, #9333ea, #db2777)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
                asChild
              >
                <Link href="#contact">Get In Touch</Link>
              </Button> */}
            </div>
          </AnimateInView>
          <AnimateInView className="flex-1 flex justify-center" direction="right" delay={200}>
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-purple-300/20 animate-pulse-slow">
              <div className="absolute inset-0 from-purple-600/20 to-pink-600/20 rounded-full"></div>
              <img
                src="dp.jpeg"
                alt="Developer portrait"
                className="object-cover"
              />
            </div>
          </AnimateInView>
        </section>

        {/* Stats Section */}
        <AnimateInView>
          <section className="py-10">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardContent className="p-2 md:p-6 text-center">
                  <Code className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-3xl font-bold font-montserrat gradient-text">
                    <Counter end={50} suffix="+" />
                  </h3>
                  <p className="text-muted-foreground">Projects Completed</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardContent className="p-2 md:p-6 text-center">
                  <Users className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-3xl font-bold font-montserrat gradient-text">
                    <Counter end={50} suffix="+" />
                  </h3>
                  <p className="text-muted-foreground">Happy Clients</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardContent className="p-2 md:p-6 text-center">
                  <Award className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-3xl font-bold font-montserrat gradient-text">
                    <Counter end={10} />
                  </h3>
                  <p className="text-muted-foreground">Years Experience</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </AnimateInView>

        {/* About Section */}
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
                  With 9+ years of experience building everything from sleek single-page applications to large-scale e-commerce platforms, I specialize in crafting performant, accessible, and user-centric web solutions using React, Angular, Vue.js, Next.js, TypeScript, Node.js, HTML, and CSS.
                </p>
                <p className="text-muted-foreground">
                  Passionate about staying at the forefront of web innovation, I actively explore AI-enhanced development workflows using tools like Cursor, GitHub Copilot, and intelligent debugging to accelerate and optimize the developer experience. My expertise also extends to serverless architecture and cloud-native applications, leveraging AWS and modern DevOps practices to deliver scalable, resilient systems.
                </p>
                <p className="text-muted-foreground">
                 Whether it's implementing AI-assisted features, integrating APIs, or streamlining performance, I thrive on transforming complex challenges into elegant frontend experiences. I'm constantly learning and adapting—exploring how AI, automation, and cloud computing can reshape how we build for the web.
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

        {/* Projects Section */}
        <section id="projects" className="py-20 scroll-mt-20">
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

        {/* Skills Section */}
        <section id="skills" className="py-20 scroll-mt-20">
          <AnimateInView>
            <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
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

        {/* Contact Section */}
        <section id="contact" className="py-20 scroll-mt-20">
          <AnimateInView>
            <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold font-montserrat">
                Get In <span className="gradient-text">Touch</span>
              </h2>
              <p className="text-muted-foreground">Feel free to contact me for work or collaboration</p>
            </div>
          </AnimateInView>

          <div className="grid md:grid-cols-1 gap-10" style={{ margin: "0 auto" }}>
            <AnimateInView direction="left">
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold font-montserrat gradient-text">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Linkedin className="h-5 w-5 text-purple-600" />
                      </div>
                      <Link  target="_blank" className="group-hover:translate-x-1 transition-transform" href={'https://linkedin.com/in/flavglen'}>linkedin.com/in/flavglen</Link>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Github className="h-5 w-5 text-purple-600" />
                      </div>
                      <Link target="_blank" className="group-hover:translate-x-1 transition-transform" href={'https://github.com/flavglen'}>github.com/in/flavglen</Link>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-xl font-semibold font-montserrat gradient-text mb-4">Follow Me</h3>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:scale-110 transition-transform hover:bg-purple-100 dark:hover:bg-purple-900/20"
                        asChild
                      >
                        <Link href="https://linkedin.com/in/flavglen" target="_blank" rel="noopener noreferrer">
                          <Github className="h-5 w-5" />
                          <span className="sr-only">GitHub</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:scale-110 transition-transform hover:bg-purple-100 dark:hover:bg-purple-900/20"
                        asChild
                      >
                        <Link href="https://linkedin.com/in/flavglen" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-5 w-5" />
                          <span className="sr-only">LinkedIn</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimateInView>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

