"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Pages that should use full-width layout without sidebar
  const fullWidthPages = ["/admin/grocery-tracker"]
  const useSidebar = !fullWidthPages.includes(pathname)
  
  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [pathname])
  
  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])
  
  if (!useSidebar) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    )
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto lg:ml-0">
        {/* Mobile Header with Menu Button */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>
        
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
