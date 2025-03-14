"use client"

import type React from "react"

interface SkillCardProps {
  image: string
  title: string
  description: string
}

export function SkillCard({ image, title, description }: SkillCardProps) {
  return (
    <div className="border rounded-lg p-6">
      <div className="mb-4"><i className={`${image} text-2xl`}/> </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

