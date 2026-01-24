"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, ChevronDown, PieChart, Database, Receipt, ShoppingCart, LayoutDashboard } from "lucide-react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Header() {
  const admin = useIsAdmin();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

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
    { href: "/blog", label: "Blog" }
  ];

  const adminSubmenu = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/expenses", label: "Expenses", icon: Receipt },
    { href: "/admin/grocery-tracker", label: "Grocery Tracker", icon: ShoppingCart },
    { href: "/admin/reports/dashboard", label: "Reports Dashboard", icon: PieChart },
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
              <Image
                src="/gp-logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="inline-block rounded-full transition-transform duration-300 shadow-md group-hover:scale-110"
                priority
              />
            </div>
            <span className="gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Glen
            </span>
            <span className="font-semibold">Pais</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 relative">
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
            <div className="relative">
              <Link
                href="/admin"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/5 flex items-center gap-1",
                  pathname.startsWith("/admin") 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Admin
              </Link>
            </div>
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
            reportsSubmenu={admin ? adminSubmenu : []}
          />
        </div>
      </div>
    </header>
  )
}
