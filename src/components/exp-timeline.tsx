"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Briefcase, Award, ArrowRight, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Experience {
  id: string
  role: string
  company: string
  period: string
  description: string
  achievements: string[]
  skills: string[]
  logo?: string
  color?: string
  link?: string
}

interface ExperienceTimelineProps {
  experiences: Experience[]
  className?: string
}

export function ExperienceTimeline({ experiences, className }: ExperienceTimelineProps) {
  const [activeExperience, setActiveExperience] = useState<string>(experiences[0].id)

  const getActiveExperience = () => {
    return experiences.find((exp) => exp.id === activeExperience) || experiences[0]
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Timeline Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 relative">
        <div className="hidden sm:block absolute left-1/2 top-6 h-0.5 w-[calc(100%-4rem)] -translate-x-1/2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-purple-900/30 z-0"></div>

        {experiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            className={cn(
              "relative flex-1 cursor-pointer z-10",
              activeExperience === experience.id ? "opacity-100" : "opacity-70 hover:opacity-90",
            )}
            onClick={() => setActiveExperience(experience.id)}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                  activeExperience === experience.id
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-110"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-center">
                <h4
                  className={cn(
                    "font-medium transition-all duration-300",
                    activeExperience === experience.id ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {experience.company}
                </h4>
                <p className="text-xs text-muted-foreground">{experience.period}</p>
              </div>
            </div>

            {index < experiences.length - 1 && (
              <div className="hidden sm:block absolute top-6 right-0 transform translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="text-muted-foreground/50" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Experience Details */}
      <motion.div
        key={activeExperience}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10 rounded-xl p-6 shadow-lg border border-purple-100/50 dark:border-purple-900/20"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo/Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center shadow-inner">
              {getActiveExperience().logo ? (
                <img
                  src={getActiveExperience().logo || "/placeholder.svg"}
                  alt={getActiveExperience().company}
                  className="w-12 h-12 md:w-14 md:h-14 object-contain"
                />
              ) : (
                <Briefcase
                  className={cn("w-8 h-8 md:w-10 md:h-10", getActiveExperience().color || "text-purple-600")}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl md:text-2xl font-bold font-montserrat gradient-text">
                  {getActiveExperience().role}
                </h3>
                {getActiveExperience().link && (
                  <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
                    <a href={getActiveExperience().link} target="_blank" rel="noopener noreferrer">
                      Visit <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground font-medium">{getActiveExperience().company}</span>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {getActiveExperience().period}
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">{getActiveExperience().description}</p>

            {getActiveExperience().achievements.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {getActiveExperience().achievements.map((achievement, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <Award className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {getActiveExperience().skills.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getActiveExperience().skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 hover:scale-105 transition-transform"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
