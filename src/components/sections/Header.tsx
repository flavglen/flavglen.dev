"use client"

import Link from "next/link"
import { Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"

export function Header() {
  const admin = useIsAdmin();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const animateLogo = () => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    };

    // Animate every 8-15 seconds randomly
    const getRandomInterval = () => Math.random() * 7000 + 8000; // 8-15 seconds

    const scheduleNextAnimation = () => {
      setTimeout(() => {
        animateLogo();
        scheduleNextAnimation();
      }, getRandomInterval());
    };

    // Start the animation cycle
    scheduleNextAnimation();
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="font-bold text-xl font-montserrat">
          <Link href="/">
            <img
              src="/gp-logo.png"
              alt="Logo"
              width={80}
              height={50}
              className={`inline-block ml-2 rounded-full transition-all duration-1000 ${
                isAnimating 
                  ? 'animate-bounce scale-110 drop-shadow-lg' 
                  : 'hover:scale-105 transition-transform duration-300'
              }`}/>
              <span className="gradient-text">Glen</span>Pais
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="#about"
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="#projects"
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Projects
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="#skills"
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Skills
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="#contact"
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          <Link
            href="/gallery"
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Gallery
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {admin && <Link
            href="/admin/expenses"
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Expenses
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>}

        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform">
              <Link href="https://github.com/flavglen" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform">
              <Link href="https://linkedin.com/in/flavglen" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
          <MobileMenu
            links={[
              { href: "#about", label: "About" },
              { href: "#projects", label: "Projects" },
              { href: "#skills", label: "Skills" },
              { href: "#contact", label: "Contact" },
              { href: "/gallery", label: "Gallery" },
              ...(admin ? [{ href: "/admin/expenses", label: "Expenses" }] : [])
            ].filter(Boolean)}
          />
        </div>
      </div>
    </header>
  )
}
