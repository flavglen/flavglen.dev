import { Github, Linkedin, Mail, ExternalLink, Code, Users, Award, Coffee } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl font-montserrat">
            <Link href="/">
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
            <Badge className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-700 dark:text-purple-300 border-purple-300/20">
              Available for hire
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-montserrat">
              Hi, I&apos;m <span className="gradient-text">Glen</span>
              <br />
              Frontend Developer
            </h1>
            <p className="text-xl text-muted-foreground max-w-md font-semibold">
              Crafting Exceptional & Accessible Digital Experiences for the Web.
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
                   I&apos;ve spent 9+ years working on a variety of web projects, 
                  from single-page applications to complex e-commerce Applications. I specialize in Angular, React, Typescript, Vue.js, Node.js, HTML, CSS, and Next.js
                </p>
                <p className="text-muted-foreground">
                  I&apos;m always looking for new ways to improve my coding skills and stay up-to-date with the 
                  latest web development trends. Additionally, I have expertise in serverless architecture and 
                  cloud computing, leveraging the power of 
                  AWS to build scalable and reliable web applications. Check out my Online Resume.
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
                      <p className="group-hover:translate-x-1 transition-transform">linkedin.com/in/flavglen</p>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Github className="h-5 w-5 text-purple-600" />
                      </div>
                      <p className="group-hover:translate-x-1 transition-transform">github.com/flavglen</p>
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

            {/* <AnimateInView direction="right" delay={200}>
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold font-montserrat gradient-text mb-4">Send Me a Message</h3>
                  <form className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <input
                            id="name"
                            placeholder="Your name"
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            placeholder="Your email"
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <input
                          id="subject"
                          placeholder="Subject"
                          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <textarea
                          id="message"
                          placeholder="Your message"
                          className="w-full px-3 py-2 border rounded-md text-sm min-h-[120px] focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AnimateInView> */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="font-bold text-xl font-montserrat mb-2">
              <span className="gradient-text">Glen</span> Pais
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Glen F Pais. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#skills"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Skills
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Project Card Component
function ProjectCard({ project }: { project: any }) {
  return (
    <Card className="overflow-hidden group border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image || "placeholder.svg"}
          alt={project.title}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-pink-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" asChild className="bg-white/90 hover:bg-white">
              <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="bg-black/50 text-white border-white/50 hover:bg-black/70"
            >
              <Link href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> Code
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg font-montserrat">{project.title}</h3>
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 text-purple-700 dark:text-purple-300 border-purple-300/20"
          >
            {project.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech: any) => (
            <Badge
              key={tech}
              variant="secondary"
              className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 hover:scale-105 transition-transform"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Sample Data
const projects = [
  {
    id: 1,
    title: "Quick Market Reports",
    description: "For Quick Market Reports, a tool delivering timely market insights, I built various pages from scratch, developed APIs, and integrated a payment gateway using Angular, React, and PHP, while optimizing performance for a seamless user experience",
    image: "placeholder.svg",
    category: "professional",
    technologies: ["Angular", "PHP", "CSS", "Bootstrap", "MySQL", "jQuery", "Jasmine"],
    demo: "",
    github: "",
  },
  {
    id: 2,
    title: "Underwriter tool",
    description: "For the new Underwriter Tool, I developed complex forms with dynamic validation, intricate calculations, and micro frontends using Angular, React, and TypeScript, ensuring scalability, code reusability, and robust test coverage.",
    image: "placeholder.svg",
    category: "professional",
    technologies: ["Angular", "Javascript" , "React", "Cypress", "TypeScript", "Redux", "Firebase", "Vue.js"],
    demo: "",
    github: "",
  },
  {
    id: 3,
    title: "Connect Audit Manager",
    description: "For Connect Audit Manager, an internal audit management solution, I built high-performance shared components, dynamic forms, and state management using Angular and React, ensuring reusability, efficiency, and a seamless audit workflow for team heads, managers, and auditors.",
    image: "placeholder.svg",
    category: "professional",
    technologies: ["Angular", "React",  "C#", "Python", "Node", "Express", "PHP", "SQL", "MongoDB"],
    demo: "",
    github: "",
  },
  {
    id: 4,
    title: "Video Chat App",
    description: "For the Video Calling App, I implemented user authentication, signaling, media streaming, and push notifications using the QuickBlox API, Angular, and PHP, ensuring a seamless, secure, and high-quality communication experience across multiple platforms.",
    image: "placeholder.svg",
    category: "professional",
    technologies: ["React", "AngularJS", "Chart.js", "WebRTC", "QuickBlox", "Firebase", "Node.js", "Express"],
    demo: "",
    github: "",
  },
  {
    id: 5,
    title: "Aira Club",
    description: "For Aira Club, an online lucky scheme portal, I built user authentication (OAuth), roles and permissions, payment gateway, and serverless functions using Firebase Cloud Functions and Firestore. I also implemented Redis caching, reports, dashboards, and a media library to enhance performance and user experience.",
    image: "placeholder.svg",
    category: "personal",
    technologies: ["React", "nextJs", "Chart.js", "Firebase", "Node.js", "Express", "jest", "Cypress"],
    demo: "https://airaclub.com",
    github: "https://github.com/flavglen/aria-club",
  },
  {
    id: 6,
    title: "Flavglen.dev",
    description: "For my personal portfolio, built with Next.js, Tailwind CSS, and TypeScript, I integrated multiple apps such as an expense tracker, Google authentication, role-based authentication, dashboards, and exports. Hosted on Vercel, it utilizes Vercel's serverless functions, Google Gmail SDK, and Vercel cron jobs to enhance functionality and performance.",
    image: "placeholder.svg",
    category: "personal",
    technologies: ["React", "TypeScript", "Angular", "OpenAI", "Cursor", "SQL", "Firebase", "Docker", "Deepseek", "Next.js", "Zustand / Redux", "Tailwind CSS", "Jest", "Cypress", "GraphQL", "Node.js"],
    demo: "https://flavglen.dev",
    github: "https://github.com/flavglen/flavglen.dev",
  },
  {
    id: 6,
    title: "AI Portfolio",
    description: "A modern personal portfolio built using V0.dev, an AI tool that generates React and Tailwind components. I used AI to quickly design and structure the site, then customized it with interactive elements like a custom cursor using Framer Motion.",
    image: "placeholder.svg",
    category: "personal",
    technologies: ["React", "V0", "TypeScript", "Angular", "OpenAI", "Cursor", "SQL", "Firebase", "Docker", "Deepseek", "Next.js", "Zustand / Redux", "Tailwind CSS", "Jest", "Cypress", "GraphQL", "Node.js"],
    demo: "https://v0-melissa-portfolio.vercel.app/",
    github: "https://github.com/flavglen/melissa-portfolio",
  },
].sort((a, b) => b.id - a.id)
