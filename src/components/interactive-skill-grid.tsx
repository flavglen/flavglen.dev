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
      <div className="flex flex-wrap gap-1.5 justify-center mb-6">
        <button
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105",
            !activeCategory 
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105",
              activeCategory === category
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <TooltipProvider>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
        >
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={item}
              className={cn(
                "relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 group cursor-pointer overflow-hidden",
                hoveredSkill === skill.name
                  ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 shadow-lg scale-110"
                  : "bg-card hover:shadow-md hover:scale-105",
                "border border-border/50 hover:border-purple-200 dark:hover:border-purple-800",
              )}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {/* Skill Level Indicator - Bottom Border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                <div
                  className={cn(
                    "h-full transition-all duration-700 ease-out",
                    skill.level >= 90 ? "bg-gradient-to-r from-purple-600 to-pink-600" :
                    skill.level >= 80 ? "bg-gradient-to-r from-blue-500 to-purple-500" :
                    skill.level >= 70 ? "bg-gradient-to-r from-green-500 to-blue-500" :
                    skill.level >= 50 ? "bg-gradient-to-r from-yellow-500 to-green-500" :
                    "bg-gradient-to-r from-gray-400 to-yellow-500"
                  )}
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              {/* Skill Level Stars */}
              <div className="absolute top-2 right-2 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 h-1 rounded-full transition-all duration-300",
                      i < Math.ceil(skill.level / 20) 
                        ? "bg-yellow-400" 
                        : "bg-gray-300 dark:bg-gray-600"
                    )}
                  />
                ))}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent name={skill.icon} className={cn("w-5 h-5", skill.color || "text-purple-600")} />
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

              <p className="font-medium text-xs text-center leading-tight">{skill.name}</p>

              {/* Animated background on hover */}
              {hoveredSkill === skill.name && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl animate-pulse" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </TooltipProvider>
    </div>
  )
}
