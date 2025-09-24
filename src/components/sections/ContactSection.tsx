import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, Phone, Calendar, MessageCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimateInView } from "@/components/animate-in-view"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 scroll-mt-20">
      <AnimateInView>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-montserrat">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground text-lg">Ready to collaborate? I&apos;m always excited to discuss new opportunities and innovative projects.</p>
        </div>
      </AnimateInView>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Information Card */}
        <AnimateInView direction="left">
          <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm h-full">
            <CardContent className="p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-montserrat gradient-text">Get In Touch</h3>
              </div>
              
              <div className="space-y-6 flex-1">
                {/* Location */}
                <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-lg font-semibold">Canada</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="text-lg font-semibold">Open to Opportunities</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateInView>

        {/* Social Links Card */}
        <AnimateInView direction="right">
          <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Github className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-montserrat gradient-text">Connect Online</h3>
              </div>
              
              <div className="space-y-6">
                {/* GitHub */}
                <div className="group">
                  <Link 
                    href="https://github.com/flavglen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Github className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">GitHub</p>
                      <p className="text-lg font-semibold">github.com/flavglen</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                  </Link>
                </div>

                {/* LinkedIn */}
                <div className="group">
                  <Link 
                    href="https://linkedin.com/in/flavglen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Linkedin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">LinkedIn</p>
                      <p className="text-lg font-semibold">linkedin.com/in/flavglen</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                  </Link>
                </div>

              </div>
            </CardContent>
          </Card>
        </AnimateInView>
      </div>
    </section>
  )
}
