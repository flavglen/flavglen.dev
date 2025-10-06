import type { Metadata } from "next";
import AuthSessionProvider from "@/components/SessionProvider";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL('https://flavglen.dev'),
  title: "Glen Flavian Pais - AI-Enhanced Frontend Developer | React, Next.js Expert | Canada & India",
  description: "Expert AI-enhanced frontend developer with 9+ years experience in React, Next.js, TypeScript, and AI-powered development tools. Available for hire in Canada and India. Specializing in modern web applications, e-commerce platforms, and intelligent user interfaces.",
  keywords: [
    "Glen Pais", "AI developer", "frontend developer", "React developer", "Next.js developer", "TypeScript developer", 
    "Canada developer", "India developer", "freelance developer", "web developer", "full stack developer",
    "cursor ai", "github copilot", "v0.dev", "portfolio", "hire developer", "remote developer",
    "AI-enhanced development", "modern web development", "responsive design", "e-commerce development",
    "Vue.js developer", "Angular developer", "Node.js developer", "Firebase developer", "AWS developer",
    "Toronto developer", "Vancouver developer", "Mumbai developer", "Bangalore developer", "Delhi developer"
  ],
  authors: [{ name: "Glen Flavian Pais" }],
  creator: "Glen Flavian Pais",
  publisher: "Glen Flavian Pais",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Glen Flavian Pais - AI-Enhanced Frontend Developer | React, Next.js Expert",
    description: "Expert AI-enhanced frontend developer with 9+ years experience in React, Next.js, TypeScript, and AI-powered development tools. Available for hire in Canada and India.",
    url: "https://flavglen.dev/",
    siteName: "Glen Flavian Pais Portfolio",
    images: [
      {
        url: "https://flavglen.dev/gp-logo.png",
        width: 1200,
        height: 630,
        alt: "Glen Flavian Pais - AI-Enhanced Frontend Developer",
      },
    ],
    locale: "en_CA",
    type: "website",
    countryName: "Canada",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glen Flavian Pais - AI-Enhanced Frontend Developer | React, Next.js Expert",
    description: "Expert AI-enhanced frontend developer with 9+ years experience. Available for hire in Canada and India. Specializing in React, Next.js, TypeScript, and modern web development.",
    images: ["https://flavglen.dev/gp-logo.png"],
    creator: "@flavglen",
    site: "@flavglen"
  },
  alternates: {
    canonical: "https://flavglen.dev/",
    languages: {
      'en-CA': 'https://flavglen.dev/',
      'en-IN': 'https://flavglen.dev/',
    }
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  category: "Technology",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body>
        <GoogleAnalytics />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem >
            <AuthSessionProvider>
              {/* <Sidebar /> */}
              <main className="flex-1 p-4">
                  {children}
              </main>
            </AuthSessionProvider>
         </ThemeProvider>
         <Toaster  />
      </body>
    </html>
  );
}
