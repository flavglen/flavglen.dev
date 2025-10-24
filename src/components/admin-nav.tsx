"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Database, 
  FileText, 
  Home,
  ChevronRight,
  PieChart
} from "lucide-react"

const adminNavItems = [
  {
    href: "/admin/expenses",
    label: "Expenses",
    description: "Manage expense records",
    icon: FileText
  },
  {
    href: "/admin/expense-summary",
    label: "Summary",
    description: "Basic analytics view",
    icon: BarChart3
  },
  {
    href: "/admin/expense-analytics",
    label: "Analytics (Firebase)",
    description: "Advanced Firebase analytics",
    icon: Database
  },
  {
    href: "/admin/expense-dashboard",
    label: "Dashboard",
    description: "Visual charts and graphs",
    icon: PieChart
  }
]

export function AdminNav() {
  const pathname = usePathname()
  
  return (
    <div className="border-b bg-background/95 backdrop-blur">
      <div className="container py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Admin</span>
          {pathname !== "/admin" && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">
                {adminNavItems.find(item => item.href === pathname)?.label || "Admin"}
              </span>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "outline"}
                size="sm"
                asChild
                className={cn(
                  "h-auto p-2 sm:p-3 flex flex-col items-start space-y-1 flex-1 sm:flex-none min-w-0",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Link href={item.href}>
                  <div className="flex items-center space-x-2 min-w-0">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm truncate">{item.label}</span>
                  </div>
                  <span className="text-xs opacity-70 hidden sm:block">{item.description}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
