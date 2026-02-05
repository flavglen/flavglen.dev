import { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Code Generator - cURL & fetch() | Glen Pais",
  description:
    "Generate cURL and fetch() code from any API URL and payload. Select REST method, enter URL and body, get ready-to-use code.",
  keywords: [
    "API code generator",
    "cURL generator",
    "fetch generator",
    "REST API",
    "HTTP request",
    "cURL command",
    "JavaScript fetch",
  ],
  openGraph: {
    title: "API Code Generator - cURL & fetch() | Glen Pais",
    description:
      "Generate cURL and fetch() code from any API URL and payload. Select REST method, enter URL and body.",
    type: "website",
    url: "https://flavglen.dev/tools/api-code-gen",
  },
  alternates: {
    canonical: "https://flavglen.dev/tools/api-code-gen",
  },
}

export default function ApiCodeGenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
