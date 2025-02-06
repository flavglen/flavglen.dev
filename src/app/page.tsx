
import { SkillCard } from "@/components/skill-card";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h1 className="text-4xl font-bold mb-2">Glen Pais</h1>
              <p className="text-xl text-muted-foreground mb-4">Senior web Developer</p>
              <p className="mb-4">
              Hello, I'm Glen, A frontend and node developer with a passion for crafting beautiful and responsive web interfaces. I've spent 9+ working on a variety of web projects, from single-page applications to complex e-commerce websites. I specialize in Angular, React, Typescript, Vue Js, Node js, HTML, CSS, Next Js . I'm always looking for new ways to improve my coding skills and stay up-to-date with the latest web development trends. Additionally, I have expertise in serverless architecture and cloud computing, leveraging the power of AWS to build scalable and reliable web applications
                . Want to know how I may help your project? Check out my project{" "}
                <a href="#" className="text-red-400 hover:underline">
                  portfolio
                </a>{" "}
                and{" "}
                <a href="#" className="text-red-400 hover:underline">
                  online resume
                </a>
                .
              </p>
              <div className="flex gap-4">
                <Button className="bg-slate-500 hover:bg-red-500">View Portfolio</Button>
                <Button variant="outline">View Resume</Button>
              </div>
            </div>
            <img
              src="https://flavglen.github.io/images/PXL_dp.jpg"
              alt="Profile"
              width={250}
              height={250}
              className="rounded-lg"
            />
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <div className="w-1 h-8 bg-slate-500" />
              What I do
            </h2>
            <p className="mb-8">
              I have more than 10 years' experience building software for clients all over the world. Below is a quick
              overview of my main technical skill sets and technologies I use. Want to find out more about my
              experience?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <SkillCard
                icon={<div className="w-8 h-8 bg-slate-500 rounded" />}
                title="Vanilla JavaScript"
                description="List skills/technologies here. You can change the icon above to any of the 2000+ FontAwesome 5 free icons available. Aenean commodo ligula eget dolor."
              />
              <SkillCard
                icon={<div className="w-8 h-8 bg-slate-500 rounded" />}
                title="Angular, React & Vue"
                description="List skills/technologies here. You can change the icon above to any of the 2000+ FontAwesome 5 free icons available. Aenean commodo ligula eget dolor."
              />
              <SkillCard
                icon={<div className="w-8 h-8 bg-slate-500 rounded" />}
                title="Node.js"
                description="List skills/technologies here. You can change the icon above to any of the 2000+ FontAwesome 5 free icons available. Aenean commodo ligula eget dolor."
              />
              <SkillCard
                icon={<div className="w-8 h-8 bg-slate-500 rounded" />}
                title="Python & Django"
                description="List skills/technologies here. You can change the icon above to any of the 2000+ FontAwesome 5 free icons available. Aenean commodo ligula eget dolor."
              />
              <SkillCard
                icon={<div className="w-8 h-8 bg-slate-500 rounded" />}
                title="PHP"
                description="List skills/technologies here. You can change the icon above to any of the 2000+ FontAwesome 5 free icons available. Aenean commodo ligula eget dolor."
              />
              <SkillCard
                icon={<div className="w-8 h-8 bg-slate-500 rounded" />}
                title="HTML & CSS"
                description="List skills/technologies here. You can change the icon above to any of the 2000+ FontAwesome 5 free icons available. Aenean commodo ligula eget dolor."
              />
            </div>
{/* 
            <div className="flex justify-center">
              <Button className="bg-slate-500 hover:bg-red-500">Services & Pricing</Button>
            </div> */}
          </section>
        </div>
  );
}
