import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimateInView } from "@/components/animate-in-view"

export function HeroSection() {
  return (
    <section className="py-12 md:py-16 flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>
      <AnimateInView className="flex-1 space-y-6 text-center md:text-left" direction="left">
        <Badge className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white dark:text-white border-purple-500/60 dark:border-purple-500/50 dark:bg-gradient-to-r dark:from-purple-700/60 dark:to-pink-700/60 font-semibold shadow-md">
          Available for hire
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-montserrat">
          Hi, I&apos;m <span className="gradient-text">Glen</span>
          <br />
          AI-Enhanced Frontend Developer
        </h1>
        <p className="text-xl text-muted-foreground max-w-md font-semibold">
          Expert Full Stack Developer building intelligent web interfaces with AI-powered development workflows. 
          <span className="block mt-2 text-lg font-bold text-purple-600 dark:text-purple-400">
            Available for Hire | React, Next.js, Angular, Vue, Node.js | Remote or On-site | Canada & India
          </span>
        </p>
        <div className="flex gap-4 pt-4 justify-center md:justify-start">
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
        <div className="relative group">
          {/* Subtle outer glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
          
          {/* Main photo container - smaller and cleaner */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
            {/* Photo */}
            <img
              src="/dp.jpeg"
              alt="Glen Pais - AI-Enhanced Frontend Developer"
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Simple corner accent - top-left */}
            <div className="absolute top-4 left-4 w-8 h-8">
              <div className="absolute top-0 left-0 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
              <div className="absolute top-0 left-0 w-0.5 h-6 bg-gradient-to-b from-purple-500 to-transparent"></div>
            </div>
            
            {/* Simple corner accent - bottom-right */}
            <div className="absolute bottom-4 right-4 w-8 h-8">
              <div className="absolute bottom-0 right-0 w-6 h-0.5 bg-gradient-to-l from-blue-500 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-0.5 h-6 bg-gradient-to-t from-blue-500 to-transparent"></div>
            </div>
          </div>
        </div>
      </AnimateInView>
    </section>
  )
}
