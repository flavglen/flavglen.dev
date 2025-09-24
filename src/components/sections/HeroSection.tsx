import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimateInView } from "@/components/animate-in-view"

export function HeroSection() {
  return (
    <section className="py-12 md:py-16 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>
      <AnimateInView className="flex-1 space-y-6" direction="left">
        <Badge className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white dark:text-white border-purple-500/60 dark:border-purple-500/50 dark:bg-gradient-to-r dark:from-purple-700/60 dark:to-pink-700/60 font-semibold shadow-md">
          Available for hire
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-montserrat">
          Hi, I&apos;m <span className="gradient-text">Glen</span>
          <br />
          AI-Enhanced Frontend Developer
        </h1>
        <p className="text-xl text-muted-foreground max-w-md font-semibold">
          Building intelligent web interfaces with AI-powered development workflows.  
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
        <div className="relative group">
          {/* Outer glow effect */}
          <div className="absolute -inset-6 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-blue-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
          
          {/* Main photo container */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
            {/* Photo */}
            <img
              src="/dp.jpeg"
              alt="Glen Pais - AI-Enhanced Frontend Developer"
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Top-left corner border - Enhanced */}
            <div className="absolute top-0 left-0 w-32 h-32">
              {/* Main corner lines */}
              <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent shadow-lg"></div>
              <div className="absolute top-0 left-0 w-1 h-20 bg-gradient-to-b from-purple-500 via-pink-500 to-transparent shadow-lg"></div>
              
              {/* Secondary accent lines */}
              <div className="absolute top-2 left-2 w-12 h-0.5 bg-gradient-to-r from-purple-400/80 to-transparent"></div>
              <div className="absolute top-2 left-2 w-0.5 h-12 bg-gradient-to-b from-purple-400/80 to-transparent"></div>
              
              {/* Corner accent dot */}
              <div className="absolute top-6 left-6 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-md"></div>
              
              {/* Subtle inner glow */}
              <div className="absolute top-1 left-1 w-16 h-16 border-l border-t border-purple-300/30 dark:border-purple-500/40"></div>
            </div>
            
            {/* Bottom-right corner border - Enhanced */}
            <div className="absolute bottom-0 right-0 w-32 h-32">
              {/* Main corner lines */}
              <div className="absolute bottom-0 right-0 w-20 h-1 bg-gradient-to-l from-blue-500 via-cyan-500 to-transparent shadow-lg"></div>
              <div className="absolute bottom-0 right-0 w-1 h-20 bg-gradient-to-t from-blue-500 via-cyan-500 to-transparent shadow-lg"></div>
              
              {/* Secondary accent lines */}
              <div className="absolute bottom-2 right-2 w-12 h-0.5 bg-gradient-to-l from-blue-400/80 to-transparent"></div>
              <div className="absolute bottom-2 right-2 w-0.5 h-12 bg-gradient-to-t from-blue-400/80 to-transparent"></div>
              
              {/* Corner accent dot */}
              <div className="absolute bottom-6 right-6 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-md"></div>
              
              {/* Subtle inner glow */}
              <div className="absolute bottom-1 right-1 w-16 h-16 border-r border-b border-blue-300/30 dark:border-blue-500/40"></div>
            </div>
            
            {/* Smooth rounded corners for top-right and bottom-left */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-green-500/20 to-transparent rounded-br-2xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-tl-2xl"></div>
            
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
          </div>
          
          {/* Floating corner elements - Two decorative corners only */}
          <div className="absolute -top-3 -left-3 w-8 h-8 border-l-2 border-t-2 border-purple-500/50 group-hover:border-purple-400 group-hover:scale-110 transition-all duration-300 shadow-lg"></div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-r-2 border-b-2 border-blue-500/50 group-hover:border-blue-400 group-hover:scale-110 transition-all duration-300 shadow-lg"></div>
          
          {/* Enhanced corner dots with glow - Two decorative corners only */}
          <div className="absolute top-3 left-3 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:scale-150 transition-transform duration-300 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="absolute bottom-3 right-3 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full group-hover:scale-150 transition-transform duration-300 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </AnimateInView>
    </section>
  )
}
