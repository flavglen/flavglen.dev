import { GalleryComponent } from "@/components/gallery-component"

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
