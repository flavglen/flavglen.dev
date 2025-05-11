"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import * as LucideIcons from "lucide-react"

interface Skill {
  name: string
  icon: string
  level: number
  category: string
  years?: number
  color?: string
}

interface InteractiveSkillGridProps {
  skills: Skill[]
  className?: string
}

export function InteractiveSkillGrid({ skills, className }: InteractiveSkillGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  const filteredSkills = activeCategory ? skills.filter((skill) => skill.category === activeCategory) : skills

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const getLevelLabel = (level: number): string => {
    if (level >= 90) return "Expert"
    if (level >= 80) return "Advanced"
    if (level >= 70) return "Proficient"
    if (level >= 50) return "Intermediate"
    return "Beginner"
  }

  const getLevelColor = (level: number): string => {
    if (level >= 90) return "bg-purple-600"
    if (level >= 80) return "bg-purple-500"
    if (level >= 70) return "bg-purple-400"
    if (level >= 50) return "bg-purple-300"
    return "bg-purple-200"
  }

  // Create a mapping of icon names to Lucide components
  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>
    const Icon = icons[name] || icons.HelpCircle // Fallback to HelpCircle if icon not found
    return <Icon className={className} />
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Badge
          variant="outline"
          className={cn(
            "cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105",
            !activeCategory ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-muted hover:bg-muted/80",
          )}
          onClick={() => setActiveCategory(null)}
        >
          All Skills
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant="outline"
            className={cn(
              "cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105",
              activeCategory === category
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-muted hover:bg-muted/80",
            )}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <TooltipProvider>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={item}
              className={cn(
                "relative flex flex-col items-center p-4 rounded-lg transition-all duration-300",
                hoveredSkill === skill.name
                  ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 shadow-lg scale-105"
                  : "bg-card hover:shadow-md",
                "border border-border",
              )}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="absolute top-2 right-2">
                <Badge
                  variant="outline"
                  className={cn("text-xs", getLevelColor(skill.level), "text-white border-transparent")}
                >
                  {getLevelLabel(skill.level)}
                </Badge>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-3">
                    <IconComponent name={skill.icon} className={cn("w-6 h-6", skill.color || "text-purple-600")} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-medium">{skill.name}</p>
                    <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1">{skill.level}% Proficiency</p>
                    {skill.years && <p className="text-xs mt-1">{skill.years} years experience</p>}
                  </div>
                </TooltipContent>
              </Tooltip>

              <p className="font-medium text-sm text-center">{skill.name}</p>

              {hoveredSkill === skill.name && (
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </TooltipProvider>
    </div>
  )
}
