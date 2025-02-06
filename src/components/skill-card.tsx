"use client"

import type React from "react"
import { Button } from "./ui/button"
import { useEffect } from "react"

interface SkillCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function SkillCard({ icon, title, description }: SkillCardProps) {
  useEffect(() => {
    console.error('Test')
  }, [])
  
  return (
    <div className="border rounded-lg p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

