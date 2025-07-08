import Link from "next/link"

const Footer = () => (
  <footer className="border-t py-10 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
    <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-center md:text-left">
        <div className="font-bold text-xl font-montserrat mb-2">
          <span className="gradient-text">Glen</span> Pais
        </div>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Glen F Pais. All rights reserved.
        </p>
      </div>
      <div className="flex gap-6">
        <Link
          href="#about"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
        >
          About
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link
          href="#projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
        >
          Projects
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link
          href="#skills"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
        >
          Skills
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link
          href="#contact"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
        >
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>
    </div>
  </footer>
)

export default Footer


