import type { Metadata } from "next";
import AuthSessionProvider from "@/components/SessionProvider";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Glen Flavian Pais - AI-Enhanced Frontend Developer - Canada",
  description: "Hello, I'm Glen, an AI-enhanced frontend developer specializing in modern web development with AI-powered tools like Cursor, GitHub Copilot, and V0.dev. I've spent 9+ years building intelligent web interfaces and complex applications.",
  keywords: [
    "Glen Pais", "AI developer", "frontend", "react", "next.js", "cursor ai", "github copilot", "v0.dev", "canada", "portfolio", "freelancer", "typescript", "tailwindcss", "AI-enhanced development"
  ],
  openGraph: {
    title: "Glen Flavian Pais - AI-Enhanced Frontend Developer - Canada",
    description: "Hello, I'm Glen, an AI-enhanced frontend developer specializing in modern web development with AI-powered tools like Cursor, GitHub Copilot, and V0.dev. I've spent 9+ years building intelligent web interfaces and complex applications.",
    url: "https://flavglen.dev/",
    siteName: "Glen Flavian Pais Portfolio",
    images: [
      {
        url: "/gp-logo.png",
        width: 1200,
        height: 630,
        alt: "Glen Flavian Pais Logo",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glen Flavian Pais - Senior web Developer and Freelancer - Canada",
    description: "Hello, I'm Glen, a frontend and node developer with a passion for crafting beautiful and responsive web interfaces. I've spent 9+ years working on a variety of web projects, from single-page applications to complex e-commerce Appliations.",
    images: ["/gp-logo.png"],
    creator: "@flavglen"
  },
  alternates: {
    canonical: "https://flavglen.dev/"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
