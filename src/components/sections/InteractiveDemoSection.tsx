"use client"

import { useState, useEffect } from "react"
import { AnimateInView } from "@/components/animate-in-view"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Code, 
  Palette, 
  Zap, 
  Smartphone, 
  Globe, 
  Database,
  Cpu,
  Layers,
  Search,
  Filter,
  Star,
  TrendingUp,
  Users,
  Clock
} from "lucide-react"

const projects = [
  {
    id: 1,
    name: "AI Dashboard",
    tech: ["React", "Next.js", "TypeScript", "OpenAI", "Tailwind CSS"],
    status: "Development",
    users: "Personal",
    rating: 4.9,
    color: "from-purple-500 to-pink-500",
    description: "AI-powered dashboard with intelligent insights and automation"
  },
  {
    id: 2,
    name: "Expense Tracker",
    tech: ["Next.js", "Firebase", "TypeScript", "Chart.js", "Vercel"],
    status: "Development",
    users: "Personal",
    rating: 4.8,
    color: "from-green-500 to-emerald-500",
    description: "Personal finance management with analytics and reporting"
  }
]

const skills = [
  { name: "React/Next.js", level: 95, icon: Code, color: "from-blue-500 to-cyan-500" },
  { name: "TypeScript", level: 90, icon: Cpu, color: "from-blue-600 to-blue-800" },
  { name: "UI/UX Design", level: 88, icon: Palette, color: "from-purple-500 to-pink-500" },
  { name: "Performance", level: 92, icon: Zap, color: "from-yellow-500 to-orange-500" },
  { name: "Mobile First", level: 85, icon: Smartphone, color: "from-green-500 to-emerald-500" },
  { name: "API Integration", level: 90, icon: Globe, color: "from-indigo-500 to-purple-500" }
]

export function InteractiveDemoSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedProject, setSelectedProject] = useState(0)
  const [isLive, setIsLive] = useState(false)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === "all" || project.status.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12">
      <AnimateInView>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-montserrat mb-4">
            Current <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground">AI Dashboard & Expense Tracker - Interactive project showcase</p>
        </div>
      </AnimateInView>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Project Management Interface */}
        <AnimateInView direction="left">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  Project Portfolio
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-muted-foreground">Live Data</span>
                </div>
              </div>
              
              {/* Search and Filter */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects or technologies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All Projects
                  </Button>
                  <Button
                    variant={filterStatus === "development" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("development")}
                  >
                    In Development
                  </Button>
                </div>
              </div>

              {/* Project List */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      selectedProject === index
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                    onClick={() => setSelectedProject(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{project.name}</h4>
                      <Badge className={`bg-gradient-to-r ${project.color} text-white`}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.tech.map(tech => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    <div className="flex items-center justify-end text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {project.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimateInView>

        {/* Real-time Analytics */}
        <AnimateInView direction="right">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Live Analytics
              </h3>
              
              {filteredProjects.length > 0 && (
                <div className="space-y-6">
                  {/* Selected Project Details */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">{filteredProjects[selectedProject]?.name}</h4>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-green-600">
                        {filteredProjects[selectedProject]?.rating}
                      </div>
                      <div className="text-sm text-muted-foreground">Project Rating</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {filteredProjects[selectedProject]?.tech.map(tech => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Skills Progress */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Technical Proficiency</h4>
                    {skills.slice(0, 4).map((skill, index) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <skill.icon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">{skill.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {Math.floor(Math.random() * 100) + 50}%
                      </div>
                      <div className="text-xs text-muted-foreground">Performance</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        {Math.floor(Math.random() * 50) + 20}ms
                      </div>
                      <div className="text-xs text-muted-foreground">Load Time</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimateInView>
      </div>

      {/* Code Implementation Demo */}
      <AnimateInView delay={400}>
        <Card className="mt-8 border-none shadow-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-sm text-gray-400">ProjectDashboard.tsx</span>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="text-green-400">
{`const ProjectDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProject, setSelectedProject] = useState(0);
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      project.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <ProjectList 
        projects={filteredProjects}
        onSelect={setSelectedProject}
      />
      <AnalyticsPanel 
        project={filteredProjects[selectedProject]}
      />
    </div>
  );
};`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </AnimateInView>
    </section>
  )
}
