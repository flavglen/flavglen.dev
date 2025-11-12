"use client"

import Link from "next/link"
import { Github, Linkedin, ChevronDown, PieChart, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const admin = useIsAdmin();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
    { href: "/gallery", label: "Gallery" },
    ...(admin ? [
      { href: "/admin/expenses", label: "Expenses" },
      { href: "/admin/grocery-tracker", label: "Grocery Tracker" }
    ] : [])
  ];

  const reportsSubmenu = [
    { href: "/admin/reports/dashboard", label: "Dashboard", icon: PieChart },
    { href: "/admin/reports/analytics", label: "Analytics", icon: Database }
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl shadow-lg border-primary/20" 
          : "bg-background/95 backdrop-blur-sm border-border/40"
      )}
    >
      <div className="container flex h-16 md:h-18 items-center justify-between px-4 md:px-6">
        <div className="font-bold text-xl md:text-2xl font-montserrat">
          <Link 
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <img
                src="/gp-logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="inline-block rounded-full transition-transform duration-300 shadow-md group-hover:scale-110"
              />
            </div>
            <span className="gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Glen
            </span>
            <span className="font-semibold">Pais</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-primary/5 group"
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
            </Link>
          ))}
          {admin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/5 group flex items-center gap-1 cursor-pointer",
                    pathname.startsWith("/admin/reports") 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="relative z-10">Reports</span>
                  <ChevronDown className="h-4 w-4" />
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="!z-[9999]">
                {reportsSubmenu.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link 
                        href={item.href} 
                        className={cn(
                          "flex items-center gap-2",
                          isActive && "bg-accent"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden md:flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="hover:scale-110 hover:bg-primary/10 transition-all duration-200 rounded-full"
            >
              <Link 
                href="https://github.com/flavglen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative group"
              >
                <Github className="h-5 w-5 transition-colors group-hover:text-primary" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="hover:scale-110 hover:bg-primary/10 transition-all duration-200 rounded-full"
            >
              <Link 
                href="https://linkedin.com/in/flavglen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative group"
              >
                <Linkedin className="h-5 w-5 transition-colors group-hover:text-primary" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
          <MobileMenu
            links={navLinks.filter(Boolean)}
            reportsSubmenu={admin ? reportsSubmenu : []}
          />
        </div>
      </div>
    </header>
  )
}
