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
  PieChart,
  ShoppingCart,
  BarChart2,
  Wallet
} from "lucide-react"

const adminNavItems = [
  {
    href: "/admin/expenses",
    label: "Expenses",
    description: "Manage expense records",
    icon: FileText
  },
  {
    href: "/admin/grocery-tracker",
    label: "Grocery Tracker",
    description: "Weekly grocery shopping list",
    icon: ShoppingCart
  },
  {
    href: "/admin/budget-settings",
    label: "Budget Settings",
    description: "Set category budgets",
    icon: Wallet
  },
  {
    href: "/admin/reports",
    label: "Reports",
    description: "Analytics and dashboards",
    icon: BarChart2
  },
  {
    href: "/admin/expense-summary",
    label: "Summary",
    description: "Basic analytics view",
    icon: BarChart3
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
                {adminNavItems.find(item => item.href === pathname)?.label || 
                 (pathname.startsWith("/admin/reports") ? "Reports" : "Admin")}
              </span>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href === "/admin/reports" && pathname.startsWith("/admin/reports"))
            
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "outline"}
                size="sm"
                asChild
                className={cn(
                  "h-auto p-2 sm:px-4 sm:py-2 flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 basis-[calc(50%-0.25rem)] sm:basis-auto sm:flex-initial flex-shrink-0",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Link href={item.href} className="w-full sm:w-auto">
                  <div className="flex items-center space-x-2 min-w-0 w-full sm:w-auto">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm truncate">{item.label}</span>
                  </div>
                  <span className="text-xs opacity-70 hidden sm:block sm:ml-0">{item.description}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
