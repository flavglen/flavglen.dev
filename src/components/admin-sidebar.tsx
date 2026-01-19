"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  FileText, 
  Home,
  PieChart,
  ShoppingCart,
  BarChart2,
  Wallet,
  LayoutDashboard,
  Settings,
  Shield,
  TrendingUp,
  X,
  RefreshCw,
  BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const adminNavItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & analytics"
  },
  {
    href: "/admin/expenses",
    label: "Expenses",
    icon: FileText,
    description: "Manage expense records"
  },
  {
    href: "/admin/expense-dashboard",
    label: "Expense Analytics",
    icon: BarChart2,
    description: "Visual analytics"
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: PieChart,
    description: "Analytics and dashboards"
  },
  {
    href: "/admin/budget-settings",
    label: "Budget Settings",
    icon: Wallet,
    description: "Set category budgets"
  },
  {
    href: "/admin/grocery-tracker",
    label: "Grocery Tracker",
    icon: ShoppingCart,
    description: "Weekly grocery list"
  },
  {
    href: "/admin/security",
    label: "Security",
    icon: Shield,
    description: "Security logs"
  },
  {
    href: "/admin/migrate-categories",
    label: "Migrate Categories",
    icon: RefreshCw,
    description: "Update expense categories"
  },
  {
    href: "/admin/blog",
    label: "Blog Posts",
    icon: BookOpen,
    description: "Create and manage posts"
  },
]

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    // Check immediately
    if (typeof window !== 'undefined') {
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && isOpen && onClose) {
      onClose()
    }
  }, [pathname]) // Only depend on pathname to avoid infinite loops
  
  // On desktop (lg+), sidebar is always visible; on mobile, controlled by isOpen
  const shouldShow = isMobile ? isOpen : true
  
  return (
    <>
      {/* Mobile Overlay */}
      {shouldShow && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-[60] flex h-screen w-64 flex-col border-r bg-background shadow-lg lg:shadow-none transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          shouldShow ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
            <div className="relative flex-shrink-0">
              <img
                src="/gp-logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full transition-transform duration-300 shadow-sm hover:scale-110"
              />
            </div>
            <span className="font-semibold text-lg">Admin Panel</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href === "/admin" && pathname === "/admin") ||
              (item.href === "/admin/reports" && pathname.startsWith("/admin/reports"))
            
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-auto py-3 px-4",
                    isActive && "bg-secondary font-medium"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" onClick={onClose} className="flex-1">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Home className="h-5 w-5" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  )
}

