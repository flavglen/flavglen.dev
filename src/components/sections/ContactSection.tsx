import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, Phone, Calendar, MessageCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimateInView } from "@/components/animate-in-view"

export function ContactSection() {
  return (
    <section id="contact" className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 scroll-mt-20 overflow-hidden">
      <AnimateInView>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-montserrat">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">Ready to collaborate? I&apos;m always excited to discuss new opportunities and innovative projects.</p>
        </div>
      </AnimateInView>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-6">
        {/* Contact Information Card */}
        <AnimateInView direction="left">
          <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm h-full">
            <CardContent className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-montserrat gradient-text">Get In Touch</h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6 flex-1">
                {/* Location */}
                <div className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Location</p>
                    <p className="text-sm sm:text-base font-semibold">Canada</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Availability</p>
                    <p className="text-sm sm:text-base font-semibold">Open to Opportunities</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateInView>

        {/* Social Links Card */}
        <AnimateInView direction="right">
          <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30 backdrop-blur-sm h-full">
            <CardContent className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Github className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-montserrat gradient-text">Connect Online</h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6 flex-1">
                {/* GitHub */}
                <div className="group">
                  <Link 
                    href="https://github.com/flavglen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Github className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">GitHub</p>
                      <p className="text-xs sm:text-sm font-semibold break-all">github.com/flavglen</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors flex-shrink-0" />
                  </Link>
                </div>

                {/* LinkedIn */}
                <div className="group">
                  <Link 
                    href="https://linkedin.com/in/flavglen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">LinkedIn</p>
                      <p className="text-xs sm:text-sm font-semibold break-all">linkedin.com/in/flavglen</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors flex-shrink-0" />
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
