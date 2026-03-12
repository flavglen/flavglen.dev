"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/sections/Header"
import Footer from "@/components/footer"

const RESUME_PDF_URL = "/resume-flavglen.dev.pdf"

export default function ResumePage() {
  const [loading, setLoading] = useState(true)

  // <object> doesn't reliably fire onLoad in all browsers — hide loader after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl md:text-2xl font-bold font-montserrat">Resume</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={RESUME_PDF_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Open in new tab
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={RESUME_PDF_URL} download="Glen_Flavian_Pais_Resume.pdf">
                <Download className="w-4 h-4 mr-1" />
                Download
              </a>
            </Button>
          </div>
        </div>

        {/* PDF viewer */}
        <div className="relative w-full rounded-xl border border-border/60 overflow-hidden shadow-lg bg-muted/30"
          style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading resume…</span>
              </div>
            </div>
          )}
          <object
            data={`${RESUME_PDF_URL}#view=FitH`}
            type="application/pdf"
            className="w-full h-full"
          >
            <embed
              src={`${RESUME_PDF_URL}#view=FitH`}
              type="application/pdf"
              className="w-full h-full"
            />
          </object>
        </div>

        {/* Fallback for browsers that don't support inline PDF */}
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Can&apos;t see the preview?{" "}
          <a
            href={RESUME_PDF_URL}
            download="Glen_Flavian_Pais_Resume.pdf"
            className="text-primary underline underline-offset-2 hover:opacity-80"
          >
            Download the PDF
          </a>{" "}
          instead.
        </p>
      </main>

      <Footer />
    </div>
  )
}
