"use client"

import { useState } from "react"
import { Header } from "@/components/sections/Header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Film, FileCode, ArrowLeft, GitCompare, Code, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type ToolCategory = "all" | "developer" | "fun"

const CATEGORIES: { value: ToolCategory; label: string; icon: typeof Code }[] = [
  { value: "all", label: "All", icon: Code },
  { value: "developer", label: "Developer", icon: Code },
  { value: "fun", label: "Fun", icon: Sparkles },
]

const tools: Array<{
  id: string
  title: string
  description: string
  icon: typeof Film
  href: string
  comingSoon: boolean
  category: "developer" | "fun"
}> = [
  {
    id: "movie-finder",
    title: "Movie Finder",
    description: "Discover movies from around the world. Filter by country, year, rating, and more using the IMDB API.",
    icon: Film,
    href: "/tools/movie-finder",
    comingSoon: false,
    category: "fun",
  },
  {
    id: "json-to-ts",
    title: "JSON to TypeScript",
    description: "Convert JSON objects to TypeScript interfaces and types. Generate type definitions instantly from your JSON data.",
    icon: FileCode,
    href: "/tools/json-to-ts",
    comingSoon: false,
    category: "developer",
  },
  {
    id: "json-compare",
    title: "JSON Compare",
    description: "Compare two JSON objects and see differences. See what was added, removed, or changed between two JSON blobs.",
    icon: GitCompare,
    href: "/tools/json-compare",
    comingSoon: false,
    category: "developer",
  },
]

export default function ToolsPage() {
  const [category, setCategory] = useState<ToolCategory>("all")

  const filteredTools =
    category === "all" ? tools : tools.filter((tool) => tool.category === category)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container py-8 md:py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Go Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">
              <span className="gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Public Tools
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Free tools and utilities for developers, designers, and creators.
              All tools are open to everyone - no login required.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <Button
                  key={cat.value}
                  variant={category === cat.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "gap-2",
                    category === cat.value &&
                      "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                  )}
                  onClick={() => setCategory(cat.value)}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </Button>
              )
            })}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Card 
                  key={tool.id} 
                  className="h-full flex flex-col overflow-hidden group border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {tool.comingSoon && (
                        <span className="ml-auto px-2 py-1 text-xs font-semibold rounded-full bg-muted text-muted-foreground">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <CardTitle className="font-montserrat">{tool.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end">
                    {tool.comingSoon ? (
                      <div className="w-full text-center py-2 text-sm text-muted-foreground">
                        Available soon
                      </div>
                    ) : (
                      <Link 
                        href={tool.href}
                        className="w-full text-center py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                      >
                        Use Tool
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>About Public Tools</CardTitle>
                <CardDescription>
                  These tools are freely available to all visitors. No account or login required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Have a tool idea? Feel free to reach out and suggest new tools you'd like to see here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
