"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  links: {
    href: string
    label: string
  }[]
  reportsSubmenu?: {
    href: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function MobileMenu({ links, reportsSubmenu = [] }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }

  useEffect(() => {
    return () => {
      document.body.style.overflow = "" // Cleanup on unmount
    }
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden hover:bg-transparent"
        onClick={toggleMobileMenu}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={toggleMobileMenu}
      />

      {/* Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          className={cn(
            "fixed h-screen inset-0 z-50 w-full bg-background shadow-lg transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-end mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <nav className="flex flex-col gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    document.body.style.overflow = ""
                  }}
                  className="text-xl font-medium text-foreground hover:text-purple-600 transition-colors relative group py-2"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              {reportsSubmenu.length > 0 && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      document.body.style.overflow = ""
                    }}
                    className="text-xl font-medium text-foreground hover:text-purple-600 transition-colors relative group py-2"
                  >
                    Admin Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className="text-lg font-semibold text-foreground hover:text-purple-600 transition-colors relative group py-2 flex items-center gap-2 w-full text-left"
                  >
                    <span>More Admin</span>
                    <ChevronDown className={cn("h-5 w-5 transition-transform", isAdminMenuOpen && "rotate-180")} />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {isAdminMenuOpen && (
                    <div className="flex flex-col gap-2 pl-4">
                      {reportsSubmenu.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              setIsAdminMenuOpen(false)
                              document.body.style.overflow = ""
                            }}
                            className="text-lg font-medium text-foreground hover:text-purple-600 transition-colors relative group py-2 flex items-center gap-2"
                          >
                            {Icon && <Icon className="h-5 w-5" />}
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
              
              {/* Theme Toggle for Mobile */}
              <div className="flex items-center justify-center pt-4">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
