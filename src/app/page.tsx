
import { SkillCard } from "@/components/skill-card";
import { Button } from "@/components/ui/button";
import { Skills } from "@/schema/skils";
import Link from "next/link";

export default async function Page() {
  const data = await fetch(`${process.env.BASE_API_URL}/skills`, {
    cache: 'no-store'
  })
  const skills = await data.json()

  return (
    <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h1 className="text-4xl font-bold mb-2">Glen Pais</h1>
              <p className="text-xl text-muted-foreground mb-4">Senior web Developer</p>
              <p className="mb-4">
                Hello, I&apos;m Glen, a frontend and node developer with a passion for crafting beautiful and responsive web interfaces. I&apos;ve spent 9+ years working on a variety of web projects, from single-page applications to complex e-commerce websites. I specialize in Angular, React, Typescript, Vue.js, Node.js, HTML, CSS, and Next.js. I&apos;m always looking for new ways to improve my coding skills and stay up-to-date with the latest web development trends. Additionally, I have expertise in serverless architecture and cloud computing, leveraging the power of AWS to build scalable and reliable web applications. Check out my Online Resume.
              </p>
              <div className="flex gap-4 border-1 border w-36 p-2 text-center align-middle justify-center">
                <Link href="https://github.com/flavglen/resume/blob/main/GLEN%20-%20Senior%20FE%20.pdf" target="__blank">View Resume</Link>
              </div>
            </div>
            <img
              src="dp.jpeg"
              alt="Profile"
              width={250}
              height={250}
              className="rounded-lg"
            />
          </div>

          <section className="grid">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <div className="w-1 h-8 bg-slate-500" />
              What I do
            </h2>
            <p className="mb-8">
              I have more than 10 years&apos; experience building software for clients all over the world. Below is a quick
              overview of my main technical skill sets and technologies I use. Want to find out more about my
              experience?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {skills.data.map((skill: Skills, index: number) => (
                <SkillCard key={index} title={skill.technology} description={skill.description}  image={skill.image}/>
              ))}
            </div>

            <Button className="tex" variant="link">More Skills</Button>
          </section>
        </div>
  );
}

