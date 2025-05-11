"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SkillProgressProps {
  name: string
  level: number
  icon?: string
  className?: string
}

export function SkillProgress({ name, level, icon, className }: SkillProgressProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(level)
    }, 100)

    return () => clearTimeout(timer)
  }, [level])

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-6 h-6 flex items-center justify-center">
              <img src={icon || "placeholder.svg"} alt={name} className="w-5 h-5" />
            </div>
          )}
          <span className="font-medium text-sm">{name}</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
