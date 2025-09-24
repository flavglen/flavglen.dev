import { Code, Users, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { AnimateInView } from "@/components/animate-in-view"
import { Counter } from "@/components/counter"

export function StatsSection() {
  return (
    <AnimateInView>
      <section className="py-4 sm:py-6 md:py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-2 md:p-6 text-center">
              <Code className="w-10 h-10 mx-auto mb-4 text-purple-600" />
              <h3 className="text-3xl font-bold font-montserrat gradient-text">
                <Counter end={50} suffix="+" />
              </h3>
              <p className="text-muted-foreground">Projects Completed</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-2 md:p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-4 text-purple-600" />
              <h3 className="text-3xl font-bold font-montserrat gradient-text">
                <Counter end={50} suffix="+" />
              </h3>
              <p className="text-muted-foreground">Happy Clients</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-2 md:p-6 text-center">
              <Award className="w-10 h-10 mx-auto mb-4 text-purple-600" />
              <h3 className="text-3xl font-bold font-montserrat gradient-text">
                <Counter end={10} />
              </h3>
              <p className="text-muted-foreground">Years Experience</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </AnimateInView>
  )
}
