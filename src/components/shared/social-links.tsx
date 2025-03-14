import { X, Linkedin, Github, Globe, Mail, Youtube, Instagram } from "lucide-react"
import Link from "next/link"

export const SocialLinks = () => {
    return (
        <>
            <Link href="https://x.com/flavglen" target="__blank" className="hover:opacity-80">
                <X className="w-5 h-5" />
            </Link>
            <Link href="https://www.linkedin.com/in/flavglen/" target="__blank" className="hover:opacity-80">
                <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="https://github.com/flavglen" target="__blank"  className="hover:opacity-80">
                <Github className="w-5 h-5" />
            </Link>
            <Link href="https://www.youtube.com/@AerialRoamers" target="__blank"  className="hover:opacity-80">
                <Youtube className="w-5 h-5" />
            </Link>
            <Link href="https://www.instagram.com/glenpais" target="__blank"  className="hover:opacity-80">
                <Instagram className="w-5 h-5" />
            </Link>
        </>
    )

}