import { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON to TypeScript Converter - Free Online Tool | Glen Pais",
  description: "Convert JSON objects to TypeScript interfaces and types instantly. Free online tool to generate TypeScript definitions from JSON data. Perfect for developers working with APIs and TypeScript projects.",
  keywords: [
    "JSON to TypeScript",
    "JSON converter",
    "TypeScript generator",
    "JSON to TS",
    "TypeScript interface generator",
    "JSON type generator",
    "TypeScript converter",
    "free TypeScript tool",
    "JSON parser",
    "TypeScript definitions",
    "API type generator",
    "JSON schema to TypeScript",
  ],
  authors: [{ name: "Glen Pais", url: "https://flavglen.dev" }],
  creator: "Glen Pais",
  publisher: "Glen Pais",
  openGraph: {
    title: "JSON to TypeScript Converter - Free Online Tool | Glen Pais",
    description: "Convert JSON objects to TypeScript interfaces and types instantly. Free online tool to generate TypeScript definitions from JSON data. Perfect for developers working with APIs and TypeScript projects.",
    type: "website",
    url: "https://flavglen.dev/tools/json-to-ts",
    siteName: "Glen Pais Portfolio",
    images: [
      {
        url: "https://flavglen.dev/tools/json-to-ts-og.png",
        width: 1200,
        height: 630,
        alt: "JSON to TypeScript Converter - Free Online Tool",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to TypeScript Converter - Free Online Tool",
    description: "Convert JSON objects to TypeScript interfaces and types instantly. Free online tool to generate TypeScript definitions from JSON data.",
    images: ["https://flavglen.dev/tools/json-to-ts-og.png"],
    creator: "@flavglen",
    site: "@flavglen",
  },
  alternates: {
    canonical: "https://flavglen.dev/tools/json-to-ts",
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

export default function JsonToTsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
