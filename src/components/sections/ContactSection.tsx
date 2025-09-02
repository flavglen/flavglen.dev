import Link from "next/link"
import { Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimateInView } from "@/components/animate-in-view"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 scroll-mt-20">
      <AnimateInView>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-montserrat">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground">Feel free to contact me for work or collaboration</p>
        </div>
      </AnimateInView>

      <div className="grid md:grid-cols-1 gap-10" style={{ margin: "0 auto" }}>
        <AnimateInView direction="left">
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold font-montserrat gradient-text">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Linkedin className="h-5 w-5 text-purple-600" />
                  </div>
                  <Link target="_blank" className="group-hover:translate-x-1 transition-transform" href={'https://linkedin.com/in/flavglen'}>linkedin.com/in/flavglen</Link>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Github className="h-5 w-5 text-purple-600" />
                  </div>
                  <Link target="_blank" className="group-hover:translate-x-1 transition-transform" href={'https://github.com/flavglen'}>github.com/in/flavglen</Link>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-xl font-semibold font-montserrat gradient-text mb-4">Follow Me</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:scale-110 transition-transform hover:bg-purple-100 dark:hover:bg-purple-900/20"
                    asChild
                  >
                    <Link href="https://linkedin.com/in/flavglen" target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:scale-110 transition-transform hover:bg-purple-100 dark:hover:bg-purple-900/20"
                    asChild
                  >
                    <Link href="https://linkedin.com/in/flavglen" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateInView>
      </div>
    </section>
  )
}
