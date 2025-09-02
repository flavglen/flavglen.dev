import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimateInView } from "@/components/animate-in-view"

export function HeroSection() {
  return (
    <section className="py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
      <AnimateInView className="flex-1 space-y-6" direction="left">
        <Badge className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white dark:text-purple-300 border-purple-300/20">
          Available for hire
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-montserrat">
          Hi, I&apos;m <span className="gradient-text">Glen</span>
          <br />
          Frontend Developer
        </h1>
        <p className="text-xl text-muted-foreground max-w-md font-semibold">
          Empowering Web Interfaces with Code & AI Intelligence.  
        </p>
        <div className="flex gap-4 pt-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
            asChild
          >
            <Link href="#projects">View My Work</Link>
          </Button>
        </div>
      </AnimateInView>
      <AnimateInView className="flex-1 flex justify-center" direction="right" delay={200}>
        <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-purple-300/20 animate-pulse-slow">
          <div className="absolute inset-0 from-purple-600/20 to-pink-600/20 rounded-full"></div>
          <img
            src="dp.jpeg"
            alt="Developer portrait"
            className="object-cover"
          />
        </div>
      </AnimateInView>
    </section>
  )
}
