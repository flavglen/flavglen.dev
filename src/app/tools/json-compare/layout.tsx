import { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON Compare - Diff Two JSON Objects | Glen Pais",
  description: "Compare two JSON objects and see differences. Free online tool to diff JSON by key: added, removed, and changed values. Perfect for API responses and config comparison.",
  keywords: [
    "JSON compare",
    "JSON diff",
    "compare JSON",
    "JSON difference",
    "diff two JSON",
    "JSON comparison tool",
    "free JSON diff",
    "API response compare",
    "JSON validator",
    "JSON merge",
  ],
  authors: [{ name: "Glen Pais", url: "https://flavglen.dev" }],
  creator: "Glen Pais",
  publisher: "Glen Pais",
  openGraph: {
    title: "JSON Compare - Diff Two JSON Objects | Glen Pais",
    description: "Compare two JSON objects and see differences. Free online tool to diff JSON.",
    type: "website",
    url: "https://flavglen.dev/tools/json-compare",
    siteName: "Glen Pais Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Compare - Diff Two JSON Objects",
    description: "Compare two JSON objects and see differences. Free online tool to diff JSON.",
    creator: "@flavglen",
    site: "@flavglen",
  },
  alternates: {
    canonical: "https://flavglen.dev/tools/json-compare",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Tools",
}

export default function JsonCompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
