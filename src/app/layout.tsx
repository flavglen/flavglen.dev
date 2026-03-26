import type { Metadata } from "next";
import AuthSessionProvider from "@/components/SessionProvider";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { PWARegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  metadataBase: new URL('https://flavglen.dev'),
  title: "Glen Flavian Pais - AI-Enhanced Full Stack Developer | React, Next.js, Angular, Vue, Node.js Expert | Canada & India",
  description: "Expert AI-enhanced full stack developer with 9+ years experience in React, Next.js, Angular, Vue.js, Node.js, TypeScript, and AI-powered development tools. Available for hire in Canada and India. Specializing in modern web applications, e-commerce platforms, and intelligent user interfaces.",
  keywords: [
    "Glen Pais", "AI developer", "frontend developer", "React developer", "Next.js developer", "TypeScript developer", 
    "Canada developer", "India developer", "freelance developer", "web developer", "full stack developer",
    "cursor ai", "github copilot", "v0.dev", "portfolio", "hire developer", "remote developer",
    "AI-enhanced development", "modern web development", "responsive design", "e-commerce development",
    "Vue.js developer", "Angular developer", "Node.js developer", "Firebase developer", "AWS developer",
    "Toronto developer", "Vancouver developer", "Mumbai developer", "Bangalore developer", "Delhi developer",
    // Recruiter-focused keywords
    "React developer for hire", "Next.js developer for hire", "full stack developer for hire",
    "hire React developer", "hire Next.js developer", "hire TypeScript developer",
    "React developer available", "developer for hire Canada", "developer for hire India",
    "available for hire", "seeking opportunities", "open to work", "contract developer",
    "React developer Canada", "React developer India", "Next.js developer Toronto",
    "Angular developer for hire", "Vue developer for hire", "Node.js developer for hire",
    "senior React developer", "experienced Next.js developer", "9+ years developer"
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
    title: "Glen Flavian Pais - AI-Enhanced Full Stack Developer | React, Next.js, Angular, Vue, Node.js Expert",
    description: "Expert AI-enhanced full stack developer with 9+ years experience in React, Next.js, Angular, Vue.js, Node.js, TypeScript, and AI-powered development tools. Available for hire in Canada and India.",
    url: "https://flavglen.dev/",
    siteName: "Glen Flavian Pais Portfolio",
    images: [
      {
        url: "https://flavglen.dev/gp-logo.png",
        width: 1200,
        height: 630,
        alt: "Glen Flavian Pais - AI-Enhanced Full Stack Developer | React, Next.js, Angular, Vue, Node.js Expert",
      },
    ],
    locale: "en_CA",
    type: "website",
    countryName: "Canada",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glen Flavian Pais - AI-Enhanced Full Stack Developer | React, Next.js, Angular, Vue, Node.js Expert",
    description: "Expert AI-enhanced full stack developer with 9+ years experience. Available for hire in Canada and India. Specializing in React, Next.js, Angular, Vue.js, Node.js, TypeScript, and modern web development.",
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
    google: "o8bZZCmM7Vq9rykJ7X2ms5a-gle1xSC6MhZMBTl4SOs", // Replace with actual verification code
  },
  category: "Technology",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#9333ea" },
    { media: "(prefers-color-scheme: dark)", color: "#9333ea" },
  ],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Glen Pais" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#9333ea" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>
        <GoogleAnalytics />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem >
            <AuthSessionProvider>
              <AnalyticsTracker pageName="Portfolio">
                {/* <Sidebar /> */}
                <main className="flex-1">
                    {children}
                </main>
              </AnalyticsTracker>
            </AuthSessionProvider>
         </ThemeProvider>
         <Toaster  />
         <PWARegister />
      </body>
    </html>
  );
}
