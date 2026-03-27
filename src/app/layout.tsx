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
  applicationName: "Glen Flavian Pais - Developer Portfolio",
  title: "Glen Flavian Pais - Senior Full Stack Developer | React, Next.js, Angular, Vue, Node.js | Open to Work | Canada",
  description: "Senior Full Stack Developer with 9+ years of experience at Loblaws. Expert in React, Next.js, Angular, Vue.js, Node.js, TypeScript. Actively seeking full-time, contract, and remote opportunities in Canada and India. View resume and portfolio at flavglen.dev.",
  keywords: [
    // Personal identity
    "Glen Pais", "Glen Flavian Pais", "flavglen", "GlenPais developer",
    // Core role keywords
    "Senior Full Stack Developer", "Senior Frontend Developer", "React developer",
    "Next.js developer", "Angular developer", "Vue.js developer", "Node.js developer",
    "TypeScript developer", "JavaScript developer", "frontend engineer",
    // Hire intent keywords (high recruiter intent)
    "hire React developer", "hire Next.js developer", "hire full stack developer",
    "hire senior developer Canada", "hire frontend developer Canada",
    "React developer for hire", "Next.js developer for hire",
    "full stack developer for hire", "TypeScript developer for hire",
    "Angular developer for hire", "Vue developer for hire",
    "Node.js developer for hire", "developer for hire Canada",
    "developer for hire India", "remote developer for hire",
    // Availability signals
    "available for hire", "open to work", "seeking opportunities",
    "actively looking", "freelance developer", "contract developer",
    "contract React developer", "freelance Next.js developer",
    // Location-specific
    "React developer Canada", "developer Canada", "developer Ontario",
    "developer Toronto", "developer Vancouver", "React developer Toronto",
    "Next.js developer Toronto", "full stack developer Ontario",
    "React developer India", "developer Mumbai", "developer Bangalore",
    "developer Karnataka",
    // AI & modern stack
    "AI developer", "AI-enhanced development", "GitHub Copilot developer",
    "cursor ai developer", "v0.dev developer", "AI-powered development",
    // Experience / seniority signals
    "senior developer", "9 years experience developer", "Loblaws developer",
    "experienced React developer", "experienced Next.js developer",
    "experienced full stack developer",
    // Tech stack
    "React", "Next.js", "Angular", "Vue.js", "Node.js", "TypeScript",
    "JavaScript", "Firebase", "AWS", "Tailwind CSS", "GraphQL", "Docker",
    // Adjacent recruiter phrases
    "web developer portfolio", "frontend developer portfolio",
    "full stack developer portfolio", "developer resume Canada",
  ],
  authors: [{ name: "Glen Flavian Pais", url: "https://flavglen.dev" }],
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
    title: "Glen Flavian Pais - Senior Full Stack Developer | Open to Work | Canada",
    description: "Senior Full Stack Developer with 9+ years at Loblaws. Expert in React, Next.js, Angular, Vue.js, Node.js, TypeScript. Actively seeking full-time and contract opportunities in Canada and India.",
    url: "https://flavglen.dev/",
    siteName: "Glen Flavian Pais Portfolio",
    images: [
      {
        url: "https://flavglen.dev/gp-logo.png",
        width: 1200,
        height: 630,
        alt: "Glen Flavian Pais - Senior Full Stack Developer | Open to Work | Canada",
      },
    ],
    locale: "en_CA",
    type: "website",
    countryName: "Canada",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glen Flavian Pais - Senior Full Stack Developer | Open to Work | Canada",
    description: "Senior Full Stack Developer with 9+ years at Loblaws. Expert in React, Next.js, Angular, Vue.js, Node.js, TypeScript. Seeking new opportunities in Canada.",
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
