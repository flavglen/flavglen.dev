import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink } from "lucide-react"

// Project Card Component
export function ProjectCard({ project }: { project: any }) {
    return (
      <>
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
                { 
                project.demo && (<Link href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </Link>
               )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="bg-black/50 text-white border-white/50 hover:bg-black/70"
              >
                {
                project.github && (<Link href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Code
                </Link>
                )}
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
     
      </>
    )
  }