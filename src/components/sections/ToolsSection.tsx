"use client"

import { AnimateInView } from "@/components/animate-in-view"
import { ToolCard } from "@/components/tool-card"
import { Film, FileCode } from "lucide-react"

const tools = [
  {
    id: "movie-finder",
    title: "Movie Finder",
    description: "Discover movies from around the world. Filter by country, year, rating, genre, and more using the IMDB API.",
    icon: Film,
    href: "/tools/movie-finder",
    image: "/tools/movie-finder-og.png",
    comingSoon: false,
  },
  {
    id: "json-to-ts",
    title: "JSON to TypeScript",
    description: "Convert JSON objects to TypeScript interfaces and types. Generate type definitions instantly from your JSON data.",
    icon: FileCode,
    href: "/tools/json-to-ts",
    image: "/tools/json-to-ts-og.png",
    comingSoon: false,
  },
]

export function ToolsSection() {
  return (
    <section id="tools" className="py-6 sm:py-8 md:py-12 scroll-mt-20">
      <AnimateInView>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl font-bold font-montserrat">
            Free <span className="gradient-text">Tools</span>
          </h2>
          <p className="text-muted-foreground">
            Useful developer tools and utilities - all free and open to everyone
          </p>
        </div>
      </AnimateInView>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {tools.map((tool, index) => (
          <AnimateInView key={tool.id} delay={index * 100}>
            <ToolCard tool={tool} />
          </AnimateInView>
        ))}
      </div>
    </section>
  )
}
