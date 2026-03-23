import { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Code Generator - cURL, fetch & axios | Glen Pais",
  description:
    "Generate ready-to-use cURL, fetch(), axios, and jQuery code from any API URL. Select REST method, enter URL and body — code updates instantly. Free online tool, no sign-up required.",
  keywords: [
    "API code generator",
    "cURL generator",
    "fetch generator",
    "axios code generator",
    "REST API code",
    "HTTP request generator",
    "cURL command generator",
    "JavaScript fetch code",
    "free API tool",
    "online cURL builder",
  ],
  authors: [{ name: "Glen Pais", url: "https://flavglen.dev" }],
  creator: "Glen Pais",
  publisher: "Glen Pais",
  openGraph: {
    title: "API Code Generator - cURL, fetch & axios | Glen Pais",
    description:
      "Generate cURL, fetch(), axios code from any API URL. Select method, enter URL and body, get instant code.",
    type: "website",
    url: "https://flavglen.dev/tools/api-code-gen",
    siteName: "Glen Pais Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Code Generator - cURL, fetch & axios | Glen Pais",
    description: "Generate cURL, fetch(), and axios code from any API URL instantly. Free online tool.",
    creator: "@flavglen",
    site: "@flavglen",
  },
  alternates: {
    canonical: "https://flavglen.dev/tools/api-code-gen",
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

export default function ApiCodeGenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
