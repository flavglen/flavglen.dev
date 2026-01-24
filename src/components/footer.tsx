"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Mail, Sparkles, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/shared/social-links"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
    { href: "/gallery", label: "Gallery" },
  ];

  return (
    <footer className="relative border-t bg-gradient-to-br from-background via-purple-50/30 to-pink-50/30 dark:via-purple-950/10 dark:to-pink-950/10">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Image
                  src="/gp-logo.png"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="rounded-full shadow-md"
                  loading="lazy"
                />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-xl md:text-2xl font-montserrat">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Glen
                  </span>
                  <span className="font-semibold"> Pais</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  AI-Enhanced Full Stack Developer
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building modern, intelligent web applications with cutting-edge technology.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <SocialLinks />
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 relative group w-fit"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Info */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Get In Touch
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:contact@flavglen.dev"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>contact@flavglen.dev</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Github className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href="https://github.com/flavglen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  github.com/flavglen
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Linkedin className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href="https://linkedin.com/in/flavglen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  linkedin.com/in/flavglen
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Glen Flavian Pais. All rights reserved.
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-200"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default Footer


