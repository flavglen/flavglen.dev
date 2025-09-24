import { AnimateInView } from "@/components/animate-in-view"
import { TimeLine } from "@/components/timeline"
import { ExperienceTimeline } from "@/components/exp-timeline"
import { experiences } from "@/data/exp"

export function AboutSection() {
  return (
    <section id="about" className="py-12 scroll-mt-20">
      <AnimateInView>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-montserrat">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground dark:text-gray-300">Get to know me and my background</p>
        </div>
      </AnimateInView>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Timeline and Experience - Left Column */}
        <AnimateInView direction="left">
          <div className="space-y-8">
            {/* Timeline */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl opacity-70 -z-10"></div>
              <div className="w-full h-[400px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow bg-white dark:bg-gray-900 overflow-hidden">
                <TimeLine />
              </div>
            </div>
            
            {/* Experience */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-green-50/60 to-emerald-50/60 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/40 dark:border-green-800/40 hover:shadow-lg dark:hover:shadow-green-500/10 transition-all duration-300">
              <h4 className="font-semibold mb-4 gradient-text flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                Experience
              </h4>
              <div className="text-sm text-muted-foreground dark:text-gray-300">
                <ExperienceTimeline experiences={experiences} />
              </div>
            </div>
          </div>
        </AnimateInView>
        
        {/* Content - Right Column */}
        <AnimateInView direction="right" delay={200}>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold font-montserrat mb-6 text-foreground dark:text-white">
                My <span className="gradient-text">Journey</span>
              </h3>
            </div>
            
            {/* Main content with better spacing */}
            <div className="space-y-6">
              <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">
                With 9+ years of experience building everything from sleek single-page applications to 
                large-scale e-commerce platforms, I specialize in crafting performant, accessible, and user-centric 
                web solutions using React, Angular, Vue.js, Next.js, TypeScript, Node.js, HTML, and CSS.
              </p>
              
              <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">
                Passionate about staying at the forefront of web innovation, I specialize in <b className="text-foreground dark:text-white">AI-enhanced frontend development</b> using cutting-edge tools 
                like <b className="text-foreground dark:text-white">Cursor AI, GitHub Copilot, V0.dev,</b> and intelligent debugging to accelerate and optimize the developer experience.
                My expertise combines traditional frontend mastery with modern AI workflows, delivering faster, more efficient, and innovative web solutions.
              </p>
              
              <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">
                Whether it&apos;s implementing AI-assisted features, integrating APIs, or streamlining performance, I
                thrive on transforming complex challenges into elegant frontend experiences.
                I&apos;m constantly learning and adapting—exploring how AI, automation, and cloud computing can reshape how we build for the web.
              </p>
            </div>
            
            {/* Skills showcase to fill space */}
            <div className="pt-6">
              <h4 className="font-semibold mb-4 gradient-text text-foreground dark:text-white">Key Expertise</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/30 dark:border-blue-800/30 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300">
                  <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Frontend</h5>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">React, Next.js, TypeScript, Vue.js, Angular</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200/30 dark:border-purple-800/30 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all duration-300">
                  <h5 className="font-medium text-purple-600 dark:text-purple-400 mb-2">AI Tools</h5>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">Cursor AI, GitHub Copilot, V0.dev</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/30 dark:border-green-800/30 hover:shadow-lg dark:hover:shadow-green-500/10 transition-all duration-300">
                  <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Backend</h5>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">Node.js, Express, GraphQL, Firebase</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200/30 dark:border-orange-800/30 hover:shadow-lg dark:hover:shadow-orange-500/10 transition-all duration-300">
                  <h5 className="font-medium text-orange-600 dark:text-orange-400 mb-2">Cloud</h5>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">AWS, Vercel, Docker, Serverless</p>
                </div>
              </div>
            </div>
            
            {/* Education */}
            <div className="pt-6">
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/40 dark:border-blue-800/40 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300">
                <h4 className="font-semibold mb-3 gradient-text flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Education
                </h4>
                <div className="space-y-1">
                  <p className="text-muted-foreground dark:text-gray-300 font-medium">Master of Computer Applications (MCA)</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Mangalore University, INDIA (2011-2014)</p>
                </div>
              </div>
            </div>
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}
