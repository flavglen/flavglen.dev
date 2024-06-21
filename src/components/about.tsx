import { Button } from "./ui/button"

export const About  = () => {
    return (
        <section className="container mt-5">
                <div className="grid md:grid-cols-2 md:grid-flow-col  grid-cols-1 grid-flow-row  gap-4 items-center">
                        <div className="md:col-span-2 md:order-1 col-auto order-2">
                            <h1 className="text-4xl font-bold text-center text-blue-700 mt-8 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300">&lt;Glen Flavian Pais /&gt;</h1>
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
                            {/* <p className="mt-2">
                                When I'm not coding, you can usually find me behind a  lens, capturing the world around me through 
                                photography. As an avid photographer, I love to explore new locations and experiment with different
                                techniques to create stunning images that tell a story !! Whether I'm working on a complex web project or 
                                capturing a beautiful sunset, I always bring a creative and detail-oriented approach to my work.
                            </p>

                            <p className="mt-2">
                                I love to unwind and have fun by playing games on my PlayStation 4 (PS4).
                                Some of my favorite games include epic multiplayer battles in 'Battlefield,' intense and
                                action-packed missions in 'Call of Duty,' diving into the dark and gritty world of 'Max Payne,'
                                and immersing myself in the thrilling adventures of 'Batman.
                            </p> */}
                        </div>
                        <div className="md:justify-self-end justify-self-center md:order-2 order-1">
                            <img className="rounded-full shadow-xl" src="https://flavglen.github.io/images/PXL_dp.jpg" alt="Glen Pais" width={200} height={200} />
                        </div>
                </div>
         </section>
    )
}
