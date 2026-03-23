import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Developer Tools - JSON, QR Code, API & More | Glen Pais",
  description:
    "Free online developer tools by Glen Pais: JSON to TypeScript converter, JSON diff/compare, QR code generator, API code generator, movie finder, and more. No sign-up required.",
  keywords: [
    "free developer tools",
    "online tools",
    "JSON tools",
    "QR code generator",
    "API code generator",
    "JSON to TypeScript",
    "JSON compare",
    "developer utilities",
    "free online converter",
    "Glen Pais tools",
  ],
  authors: [{ name: "Glen Pais", url: "https://flavglen.dev" }],
  creator: "Glen Pais",
  openGraph: {
    title: "Free Developer Tools | Glen Pais",
    description:
      "Free online developer tools: JSON to TypeScript, JSON compare, QR code generator, API code generator, and more.",
    type: "website",
    url: "https://flavglen.dev/tools",
    siteName: "Glen Pais Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Developer Tools | Glen Pais",
    description: "Free online developer tools: JSON, QR code, API code generator, and more.",
    creator: "@flavglen",
    site: "@flavglen",
  },
  alternates: {
    canonical: "https://flavglen.dev/tools",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Tools",
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
