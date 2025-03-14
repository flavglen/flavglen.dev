"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, Menu} from "lucide-react"
import { Button } from "./ui/button"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { SocialLinks } from "./shared/social-links"

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

  const admin =  useIsAdmin()
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const sidebarContent = (
    <>
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-xl font-semibold mb-4">Glen Pais</h2>
        <Link href="/">
          <Avatar className="w-32 h-32 mb-4">
            { <img
              src="logo.svg"
              alt="Profile"
            /> }
            <AvatarFallback>GP</AvatarFallback>
          </Avatar>
        </Link>
        <p className="text-sm text-center">
          Hi, my name is Glen Pais and I&apos;m a Senior web Developer. Welcome to my personal website!
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
            <SocialLinks />
      </div>

      <nav className="space-y-4">
        <Link href="/" className="block hover:opacity-80" onClick={toggleMobileMenu}>
          Home
        </Link>
        <Link href="/coming-soon" className="block hover:opacity-80" onClick={toggleMobileMenu}>
          About Me
        </Link>
        <Link href="/coming-soon" className="block hover:opacity-80" onClick={toggleMobileMenu}>
          Projects
        </Link>
        <Link href="/coming-soon" className="block hover:opacity-80" onClick={toggleMobileMenu}>
          Blog
        </Link>
       {admin &&  <Link href="/admin/expenses" className="block hover:opacity-80" onClick={toggleMobileMenu}>
          Expenses
        </Link>}
        {/* <Link href="#contact" className="block hover:opacity-80">
          Contact
        </Link> */}
      </nav>

      {/* <div className="mt-8">
        <button className="w-full bg-white text-red-400 py-2 rounded-md hover:bg-opacity-90">Hire Me</button>
      </div> */}

      {/* <div className="absolute bottom-8 left-8 flex items-center gap-2">
        <span className="text-sm">Dark Mode</span>
        <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-white" />
      </div> */}
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
      className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-500 text-white rounded-md"
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

