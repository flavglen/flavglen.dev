import { Metadata } from "next"

export const metadata: Metadata = {
  title: "QR Code Generator - Free Online QR Creator | Glen Pais",
  description:
    "Generate QR codes instantly for URLs, text, emails, phone numbers, and more. Free online QR code generator with custom colors and download options. No sign-up required.",
  keywords: [
    "QR code generator",
    "free QR code",
    "create QR code",
    "QR code maker",
    "online QR generator",
    "custom QR code",
    "QR code download",
    "URL to QR code",
    "text to QR code",
    "QR code tool",
  ],
  authors: [{ name: "Glen Pais", url: "https://flavglen.dev" }],
  creator: "Glen Pais",
  publisher: "Glen Pais",
  openGraph: {
    title: "QR Code Generator - Free Online QR Creator | Glen Pais",
    description:
      "Generate QR codes instantly for URLs, text, emails, and more. Free with custom colors and download.",
    type: "website",
    url: "https://flavglen.dev/tools/qr-code-generator",
    siteName: "Glen Pais Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator | Glen Pais",
    description: "Generate QR codes instantly for URLs, text, emails, and more. Free with custom colors and download.",
    creator: "@flavglen",
    site: "@flavglen",
  },
  alternates: {
    canonical: "https://flavglen.dev/tools/qr-code-generator",
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

export default function QRCodeGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
