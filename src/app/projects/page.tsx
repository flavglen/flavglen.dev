"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Github } from "lucide-react"

// type
type Project = {
  id: number;
  title: string;
  company: string;
  description: string;
  image: string | null;
  category: "Professional" | "Personal"; // assuming these are the two possible values
  tags: string[];
  demoUrl: string | null;
  githubUrl: string | null;
};

// Project data
const projects:Project[] = [
  {
    id: 1,
    title: "Loblaws.ca",
    company: "Loblaws",
    description:`At Loblaw.ca, I enhance Product Listing Pages, Product Detail Pages, and the Cart by adding features, ensuring accessibility, and optimizing performance. I led the Next.js migration, implementing SSR, SSG, and SEO optimizations to improve speed and user experience while maintaining high Lighthouse scores`,
    image: null,
    category: "Professional",
    tags: ["Next.js", "Typescript", "StoryBook", "Tailwind CSS", "React", "Node.js", "Express", "GraphQL", "Apollo Client", "Jest", "Cypress", "Git", "Jira", "Confluence", "Python"],
    demoUrl: null,
    githubUrl: null,
  },
 {
  id: 2,
  title: "Underwriter tool",
  company: "Confidential",
  description:`For the new Underwriter Tool, I developed complex forms with dynamic validation, intricate calculations, and micro frontends using Angular, React, and TypeScript, ensuring scalability, code reusability, and robust test coverage.`,
  image: null,
  category: "Professional",
  tags: ["Angular", "Typescript", "React", "Vue" , "Node.js", "Express", "Graphql", "Jest", "Cypress", "PHP", "Laravel", "Git", "python", "SQL", "MongoDB",],
  demoUrl: null,
  githubUrl: null,
},{
  id: 3,
  title: "Connect Audit Manager",
  company: "Confidential",
  description:`For Connect Audit Manager, an internal audit management solution, I built high-performance shared components, dynamic forms, and state management using Angular and React, ensuring reusability, efficiency, and a seamless audit workflow for team heads, managers, and auditors.`,
  image: null,
  category: "Professional",
  tags: ["Angular", "Typescript", "React", "Vue" , "Node.js", "Express", "Graphql", "Jest", "Cypress", "PHP", "Laravel", "C#", "ASP.NET", "SQL", "MongoDB"],
  demoUrl: null,
  githubUrl: null
},{
  id: 4,
  title: "Quick Market Reports",
  company: "Confidential",
  description:`For Quick Market Reports, a tool delivering timely market insights, I built various pages from scratch, developed APIs, and integrated a payment gateway using Angular, React, and PHP, while optimizing performance for a seamless user experience.`,
  image: null,
  category: "Professional",
  tags: ["Angular", "Typescript", "PHP", "Laravel", "Codeigniter", "SQL", "React", "Jest"],
  demoUrl: null,
  githubUrl: null
},
{
  id: 5,
  title: "Video Chat App",
  company: "Confidential",
  description:`For the Video Calling App, I implemented user authentication, signaling, media streaming, and push notifications using the QuickBlox API, Angular, and PHP, ensuring a seamless, secure, and high-quality communication experience across multiple platforms.`,
  image: null,
  category: "Professional",
  tags: ["Angular", "Typescript", "PHP", "Laravel", "Codeigniter", "SQL", "React", "CSS", "HTML", "JavaScript", "Quickblox", "Python", "NET", "Jest"],
  demoUrl: null,
  githubUrl: null
},
{
  id: 6,
  title: "Aira Club",
  company: "Aira Club",
  description:`For Aira Club, an online lucky scheme portal, I built user authentication (OAuth), roles and permissions, payment gateway, and serverless functions using Firebase Cloud Functions and Firestore. I also implemented Redis caching, reports, dashboards, and a media library to enhance performance and user experience.`,
  image: 'airaclub.webp',
  category: "Personal",
  tags: ["Typescript", "React",  "CSS", "HTML", "JavaScript", "Quickblox", "Python", "NET", "Firebase", "node.js", "Express", ],
  demoUrl: 'https://airaclub.com/',
  githubUrl: 'https://github.com/flavglen/aria-club'
},
{
  id: 7,
  title: "Flavglen.dev",
  company: "Portfolio",
  description:`For my personal portfolio, built with Next.js, Tailwind CSS, and TypeScript, I integrated multiple apps such as an expense tracker, Google authentication, role-based authentication, dashboards, and exports. Hosted on Vercel, it utilizes Vercel's serverless functions, Google Gmail SDK, and Vercel cron jobs to enhance functionality and performance.`,
  image: 'logonew.svg',
  category: "Personal",
  tags: ["Typescript", "React", "Next js", "CSS", "HTML", "JavaScript", "Quickblox", "Python", "NET", "Firebase", "node.js", "Express", ],
  demoUrl: 'https://flavglen.dev',
  githubUrl: 'https://github.com/flavglen/flavglen.dev'
}
]

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory)

  return (
    <section className="container py-12 mx-auto">
      <div className="flex flex-col items-center mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">My Projects</h2>
        <p className="max-w-2xl text-muted-foreground">
          A collection of projects I&apos;ve built, ranging from web applications to mobile apps and IoT solutions.
        </p>
      </div>

      <Tabs defaultValue="All" className="w-full mb-8">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="All" onClick={() => setActiveCategory("All")}>
              All Projects
            </TabsTrigger>
            <TabsTrigger value="professional" onClick={() => setActiveCategory("Professional")}>
              Professional
            </TabsTrigger>
            <TabsTrigger value="personal" onClick={() => setActiveCategory("Personal")}>
              Personal
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="All" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="professional" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personal" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden p-2">
        <img
          src={ project.image || "ni.svg"}
          alt={project.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
      <div className="rounded-md bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
          {project.category}
        </div>
      {project.githubUrl && (
        <Button variant="outline" size="sm" asChild>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            Code
          </a>
        </Button>
        )}   
        {project.demoUrl && (
          <Button size="sm" asChild>
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Demo
            </a>
          </Button>
        )}  
      </CardFooter>
    </Card>
  )
}

