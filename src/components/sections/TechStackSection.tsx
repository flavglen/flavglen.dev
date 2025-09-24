"use client"

import { AnimateInView } from "@/components/animate-in-view"
import { Badge } from "@/components/ui/badge"

const techStack = [
  { name: "React", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800", isAI: false },
  { name: "Next.js", color: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700", isAI: false },
  { name: "TypeScript", color: "bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600", isAI: false },
  { name: "AI-Powered Dev", color: "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-600 font-semibold", isAI: true },
  { name: "Cursor AI", color: "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-600", isAI: true },
  { name: "GitHub Copilot", color: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400 border-green-300 dark:border-green-600", isAI: true },
  { name: "V0.dev", color: "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-600", isAI: true },
  { name: "Tailwind CSS", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-600", isAI: false },
  { name: "Node.js", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-300 dark:border-green-600", isAI: false },
  { name: "Angular", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600", isAI: false },
  { name: "Vue.js", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600", isAI: false },
  { name: "GraphQL", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-300 dark:border-pink-600", isAI: false },
  { name: "Firebase", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-600", isAI: false },
  { name: "AWS", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600", isAI: false },
  { name: "Docker", color: "bg-blue-400/10 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600", isAI: false },
  { name: "Git", color: "bg-red-600/10 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600", isAI: false },
]

export function TechStackSection() {
  return (
    <section className="py-8">
      <AnimateInView>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-montserrat mb-2">
            AI-Enhanced <span className="gradient-text">Frontend</span> Stack
          </h2>
          <p className="text-muted-foreground dark:text-gray-300">Modern development with AI-powered tools and traditional technologies</p>
        </div>
      </AnimateInView>
      
      <div className="flex flex-wrap justify-center gap-3">
        {techStack.map((tech, index) => (
          <Badge 
            key={tech.name}
            className={`px-4 py-2 text-sm font-medium border transition-all duration-200 hover:scale-105 hover:shadow-md ${tech.color} ${
              tech.isAI ? 'hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30' : 'hover:shadow-gray-500/10 dark:hover:shadow-gray-500/20'
            }`}
          >
            {tech.name}
          </Badge>
        ))}
      </div>
    </section>
  )
}
