"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

// Project Card Component
export function ProjectCard({ project }: { project: any }) {
  const [showAllTech, setShowAllTech] = useState(false)
  const maxVisibleTech = 4 // Show only 4 technologies initially
  
  const visibleTechnologies = showAllTech 
    ? project.technologies 
    : project.technologies.slice(0, maxVisibleTech)
  
  const hasMoreTech = project.technologies.length > maxVisibleTech

  return (
    <>
    <Card className="h-full flex flex-col overflow-hidden group border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm">
      {/* Image Section - Fixed Height */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image || "placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
          <div className="flex gap-2">
            {project.demo && (
              <Button size="sm" variant="secondary" asChild className="bg-white/95 hover:bg-white text-gray-900">
                <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3 w-3" /> Demo
                </Link>
              </Button>
            )}
            {project.github && (
              <Button
                size="sm"
                variant="outline"
                asChild
                className="bg-black/80 text-white border-white/30 hover:bg-black/90"
              >
                <Link href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-1 h-3 w-3" /> Code
                </Link>
              </Button>
            )}
          </div>
        </div>
        {/* Category Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className="bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/50 text-xs"
          >
            {project.category}
          </Badge>
        </div>
      </div>
      
      {/* Content Section - Flexible Height */}
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-semibold text-lg font-montserrat mb-2 line-clamp-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{project.description}</p>
        </div>
        
        {/* Tech Stack - Bottom Aligned */}
        <div className="mt-auto">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {visibleTechnologies.map((tech: any) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs px-2 py-1 bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-900/30 dark:to-pink-900/30 hover:scale-105 transition-transform border-0"
              >
                {tech}
              </Badge>
            ))}
          </div>
          {hasMoreTech && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllTech(!showAllTech)}
              className="text-xs text-muted-foreground hover:text-foreground p-1 h-auto w-full justify-center"
            >
              {showAllTech ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  +{project.technologies.length - maxVisibleTech} More
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
   
    </>
  )
}