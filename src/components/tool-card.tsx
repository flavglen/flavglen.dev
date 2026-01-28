"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface Tool {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href: string
  image: string
  comingSoon?: boolean
}

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon

  return (
    <Card className="h-full flex flex-col overflow-hidden group border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm">
      {/* Image Section - Fixed Height */}
      <div className="relative h-36 overflow-hidden">
        <Image
          src={tool.image || "/placeholder.svg"}
          alt={tool.title}
          width={400}
          height={144}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
          {!tool.comingSoon && (
            <Button size="sm" variant="secondary" asChild className="bg-white/95 hover:bg-white text-gray-900">
              <Link href={tool.href}>
                <ExternalLink className="mr-1 h-3 w-3" /> Try Tool
              </Link>
            </Button>
          )}
        </div>
        {/* Icon Badge - Top Left */}
        <div className="absolute top-2 left-2">
          <div className="p-1.5 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        {/* Coming Soon Badge - Top Right */}
        {tool.comingSoon && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-muted text-muted-foreground backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              Coming Soon
            </span>
          </div>
        )}
      </div>
      
      {/* Content Section - Flexible Height */}
      <CardContent className="p-3 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="font-semibold text-base font-montserrat mb-1.5 line-clamp-2">{tool.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
        </div>
        
        {/* Action Button - Bottom Aligned */}
        <div className="mt-auto pt-2">
          {tool.comingSoon ? (
            <Button variant="outline" disabled className="w-full cursor-not-allowed">
              Coming Soon
            </Button>
          ) : (
            <Button 
              asChild 
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-sm"
            >
              <Link href={tool.href}>
                Use Tool
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
