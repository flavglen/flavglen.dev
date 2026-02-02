import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Public Tools - Glen Pais",
  description: "Free public tools and utilities for developers and creators",
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
