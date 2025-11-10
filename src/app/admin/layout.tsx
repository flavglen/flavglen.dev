"use client"

import { Header } from "@/components/sections/Header"
import { AdminNav } from "@/components/admin-nav"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const hideNav = pathname === "/admin/grocery-tracker"
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {!hideNav && <AdminNav />}
      {children}
    </div>
  );
}
