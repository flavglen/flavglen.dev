import { GalleryComponent } from "@/components/gallery-component"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Gallery - Flavglen Portfolio | Photography & Visual Stories",
  description: "Explore my curated gallery featuring photography, visual stories, and memorable moments. A collection showcasing my creative work and personal journey through images.",
  keywords: "gallery, photography, portfolio, visual stories, creative work, images, moments, memories",
  openGraph: {
    title: "Gallery - Flavglen Portfolio",
    description: "Explore my curated gallery featuring photography, visual stories, and memorable moments. A collection showcasing my creative work and personal journey through images.",
    type: "website",
    images: [
      {
        url: "/mygallery.png",
        width: 1200,
        height: 630,
        alt: "Flavglen Gallery - Photography Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery - Flavglen Portfolio",
    description: "Explore my curated gallery featuring photography, visual stories, and memorable moments.",
    images: ["/mygallery.png"],
  },
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-montserrat mb-4">
            My <span className="gradient-text">Gallery</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            A collection of moments and memories
          </p>
        </div>
        
        <GalleryComponent />
      </div>
    </div>
  )
}
