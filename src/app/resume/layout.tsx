import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume - Glen Flavian Pais | Senior Full Stack Developer | 9+ Years Experience | Canada",
  description: "View and download Glen Flavian Pais's resume. Senior Full Stack Developer with 9+ years experience at Loblaws. Expert in React, Next.js, Angular, Vue.js, Node.js, TypeScript. Open to full-time, contract, and remote opportunities in Canada and India.",
  keywords: [
    "Glen Pais resume", "Glen Flavian Pais CV", "Glen Pais developer portfolio",
    "senior developer resume Canada", "full stack developer CV Canada",
    "React developer resume", "Next.js developer CV", "TypeScript developer resume",
    "Angular developer for hire", "Node.js developer Canada",
    "hire senior developer Canada", "download developer resume",
    "Loblaws developer", "9 years experience developer",
    "open to work developer Canada", "remote developer resume",
  ],
  alternates: { canonical: "https://flavglen.dev/resume" },
  openGraph: {
    title: "Resume - Glen Flavian Pais | Senior Full Stack Developer | Available for Hire",
    description: "Senior Full Stack Developer with 9+ years experience at Loblaws. Expert in React, Next.js, Angular, Vue.js, Node.js, TypeScript. Actively seeking new opportunities in Canada.",
    url: "https://flavglen.dev/resume",
    type: "profile",
    images: [
      {
        url: "https://flavglen.dev/gp-logo.png",
        width: 1200,
        height: 630,
        alt: "Glen Flavian Pais Resume - Senior Full Stack Developer",
      },
    ],
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
