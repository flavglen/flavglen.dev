"use client"

import { Header } from "@/components/sections/Header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Github } from "lucide-react"
import ProjectsStructuredData from "@/components/ProjectsStructuredData"

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

// Project data - only personal projects
const projects:Project[] = [
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
  image: null,
  category: "Personal",
  tags: ["Typescript", "React", "Next js", "CSS", "HTML", "JavaScript", "Quickblox", "Cursor", "AI", "V0", "Firebase", "node.js", "Express", ],
  demoUrl: 'https://flavglen.dev',
  githubUrl: 'https://github.com/flavglen/flavglen.dev'
}, 
{
  id: 8,
  title: "AI Portfolio",
  company: "Portfolio",
  description:`A modern personal portfolio built using V0.dev, an AI tool that generates React and Tailwind components. I used AI to quickly design and structure the site, then customized it with interactive elements like a custom cursor using Framer Motion.`,
  image: 'logonew.svg',
  category: "Personal",
  tags: ["Typescript", "React", "Next js", "CSS", "HTML", "JavaScript", "Quickblox", "Python", "NET", "Firebase", "node.js", "Express", ],
  demoUrl: 'https://v0-melissa-portfolio.vercel.app/',
  githubUrl: 'https://github.com/flavglen/melissa-portfolio'
},
{
  id: 9,
  title: "Axios Error Handling",
  company: "Personal",
  description:`A React application demonstrating centralized error handling with Axios interceptors and Material-UI snackbars. Features comprehensive error types handling, automatic error display, and modern UI built with React, TypeScript, Tailwind CSS, and Material-UI.`,
  image: null,
  category: "Personal",
  tags: ["React", "TypeScript", "Axios", "Material-UI", "Tailwind CSS", "Vite", "Lucide React", "Error Handling", "HTTP Interceptors"],
  demoUrl: null,
  githubUrl: 'https://github.com/flavglen/axios-error-handling'
},
]

export default function ProjectsSection() {
  return (
    <div className="min-h-screen bg-background">
      <ProjectsStructuredData />
      <Header />
      <section className="container py-12 mx-auto">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          My Personal Projects - React, TypeScript & Full Stack Development
        </h1>
        <p className="max-w-4xl text-lg text-muted-foreground mb-8">
          Explore my collection of personal projects showcasing expertise in React, TypeScript, Next.js, 
          Firebase, and modern web development. From full-stack applications to error handling libraries, 
          these projects demonstrate my passion for building innovative solutions, implementing authentication 
          systems, payment gateways, and creating seamless user experiences with cutting-edge technologies.
        </p>
        <div className="max-w-3xl text-sm text-muted-foreground mb-8">
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

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Explore More Projects & Open Source Contributions</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Discover additional React, TypeScript, and full-stack development projects on my GitHub profile. 
          Follow my journey in web development, explore open source contributions, and see the latest 
          innovations in modern web technologies.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg">
            <a href="https://github.com/flavglen" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              View GitHub Profile
            </a>
          </Button>
          <Button variant="outline" asChild size="lg">
            <a href="https://flavglen.dev" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              Visit Portfolio
            </a>
          </Button>
        </div>
      </div>
      </section>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const getDefaultImage = (projectTitle: string) => {
    const title = projectTitle.toLowerCase()
    if (title.includes('aira')) return '/airaclub.webp'
    if (title.includes('flavglen')) return '/placeholder.svg'
    if (title.includes('ai portfolio')) return '/logonew.svg'
    if (title.includes('axios')) return '/placeholder.svg'
    return '/placeholder.svg'
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = getDefaultImage(project.title)
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden p-2 bg-gradient-to-br from-blue-50 to-indigo-100">
        <img
          src={project.image || getDefaultImage(project.title)}
          alt={project.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
          onError={handleImageError}
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

