import { Button } from "./ui/button"

export const About  = () => {
    return (
        <section className="container mt-5">
                <div className="grid md:grid-cols-2 md:grid-flow-col  grid-cols-1 grid-flow-row  gap-4 items-center">
                        <div className="md:col-span-2 md:order-1 col-auto order-2">
                            <h1 className="text-4xl font-bold text-center text-blue-700 mt-8 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-indigo-400 duration-300">&lt;Glen Flavian Pais /&gt;</h1>
                            <p className="text-lg mt-3">
                                Hello, I&apos;m <span className="font-bold">Glen</span>, A frontend and node developer with a passion for crafting beautiful and 
                                responsive web interfaces. I&apos;ve spent 9+ working on a variety of web projects, from single-page 
                                applications to complex e-commerce websites. I specialize in Angular, React, Typescript, Vue Js, 
                                Node js, HTML, CSS, Next Js . I&apos;m always looking for new ways to improve my coding skills and stay up-to-date with the latest web development trends. Additionally, I have expertise in serverless architecture and cloud computing, 
                                leveraging the power of AWS to build scalable and reliable web applications
                            </p>

                            <span className="flex gap-4 mt-4">
                                <Button> Resume</Button>
                                <Button> More</Button>
                            </span>
                        </div>
                        <div className="md:justify-self-end justify-self-center md:order-2 order-1">
                            <img className="rounded-full shadow-xl" src="https://flavglen.github.io/images/PXL_dp.jpg" alt="Glen Pais" width={200} height={200} />
                        </div>
                </div>
         </section>
    )
}
