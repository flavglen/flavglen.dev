import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import AuthSessionProvider from "@/components/SessionProvider";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Glen Flavian Pais - Senior web Developer and Freelancer - Canada",
  description: "Hello, I'm Glen, a frontend and node developer with a passion for crafting beautiful and responsive web interfaces. I've spent 9+ years working on a variety of web projects, from single-page applications to complex e-commerce Appliations.",
  keywords: [
    "Glen Pais", "web developer", "frontend", "react", "next.js", "node.js", "canada", "portfolio", "freelancer", "typescript", "tailwindcss", "AI developer"
  ],
  openGraph: {
    title: "Glen Flavian Pais - Senior web Developer and Freelancer - Canada",
    description: "Hello, I'm Glen, a frontend and node developer with a passion for crafting beautiful and responsive web interfaces. I've spent 9+ years working on a variety of web projects, from single-page applications to complex e-commerce Appliations.",
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
