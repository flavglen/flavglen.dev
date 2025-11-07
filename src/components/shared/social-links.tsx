"use client"

import { X, Linkedin, Github, Globe, Mail, Youtube, Instagram } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const SocialLinks = () => {
    const socialLinks = [
        { href: "https://x.com/flavglen", icon: X, label: "Twitter/X" },
        { href: "https://www.linkedin.com/in/flavglen/", icon: Linkedin, label: "LinkedIn" },
        { href: "https://github.com/flavglen", icon: Github, label: "GitHub" },
        { href: "https://www.youtube.com/@AerialRoamers", icon: Youtube, label: "YouTube" },
        { href: "https://www.instagram.com/glenpais", icon: Instagram, label: "Instagram" },
    ];

    return (
        <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                    <Button
                        key={social.href}
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-9 w-9 rounded-full hover:scale-110 hover:bg-primary/10 transition-all duration-200"
                    >
                        <Link 
                            href={social.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group"
                            aria-label={social.label}
                        >
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                    </Button>
                );
            })}
        </div>
    )
}