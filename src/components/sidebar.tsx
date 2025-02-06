"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { X, Linkedin, Github, Globe, Mail, Menu} from "lucide-react"
import { Button } from "./ui/button"

export function Sidebar() {
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const sidebarContent = (
    <>
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-xl font-semibold mb-4">Glen Pais</h2>
        <Avatar className="w-32 h-32 mb-4">
          { <img
            src="https://www.flavglen.dev/logo.svg"
            alt="Profile"
          /> }
          <AvatarFallback>GP</AvatarFallback>
        </Avatar>
        <p className="text-sm text-center">
          Hi, my name is Glen Pais and I'm a Senior web Developer. Welcome to my personal website!
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <Link href="#" className="hover:opacity-80">
          <X className="w-5 h-5" />
        </Link>
        <Link href="#" className="hover:opacity-80">
          <Linkedin className="w-5 h-5" />
        </Link>
        <Link href="#" className="hover:opacity-80">
          <Github className="w-5 h-5" />
        </Link>
        <Link href="#" className="hover:opacity-80">
          <Globe className="w-5 h-5" />
        </Link>
        <Link href="#" className="hover:opacity-80">
          <Mail className="w-5 h-5" />
        </Link>
      </div>

      <nav className="space-y-4">
        <Link href="#about" className="block hover:opacity-80">
          About Me
        </Link>
        <Link href="#portfolio" className="block hover:opacity-80">
          Portfolio
        </Link>
        <Link href="#services" className="block hover:opacity-80">
          Services & Pricing
        </Link>
        <Link href="#resume" className="block hover:opacity-80">
          Resume
        </Link>
        <Link href="#blog" className="block hover:opacity-80">
          Blog
        </Link>
        <Link href="#contact" className="block hover:opacity-80">
          Contact
        </Link>
      </nav>

      {/* <div className="mt-8">
        <button className="w-full bg-white text-red-400 py-2 rounded-md hover:bg-opacity-90">Hire Me</button>
      </div> */}

      <div className="absolute bottom-8 left-8 flex items-center gap-2">
        <span className="text-sm">Dark Mode</span>
        <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-white" />
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
      className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-500 text-white rounded-md"
      onClick={toggleMobileMenu}
    >
      {isMobileMenuOpen ? <X /> : <Menu />}
    </Button>

      {/* Sidebar for larger screens */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-[250px] bg-slate-500 p-8 text-white overflow-y-auto">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-500 z-40 p-8 text-white overflow-y-auto">{sidebarContent}</div>
      )}
    </>
  )
}

