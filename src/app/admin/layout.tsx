import { Header } from "@/components/sections/Header"
import { AdminNav } from "@/components/admin-nav"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdminNav />
      {children}
    </div>
  );
}
