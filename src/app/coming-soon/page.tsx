import React from "react"
import { SocialLinks } from "@/components/shared/social-links";

export default function ComingSoonPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
            <div className="w-full max-w-3xl space-y-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Coming Soon</h1>
                <p className="text-xl text-muted-foreground">I am working hard to bring you something amazing. Stay tuned!</p>
                <div className="flex justify-center gap-2 mb-8">
                    <SocialLinks />
                </div>
            </div>
        </main>
    )
}