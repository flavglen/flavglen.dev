'use client';

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* 404 Animation/Icon */}
          <div className="relative">
            <div className="text-8xl font-bold text-primary/20 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileQuestion className="h-16 w-16 text-primary animate-pulse" />
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button asChild className="flex-1">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/projects" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Projects
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <Card className="w-full max-w-lg mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
              <CardDescription>
                Here are some popular pages you might be looking for:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="ghost" asChild className="justify-start h-auto p-3">
                  <Link href="/" className="flex flex-col items-start">
                    <span className="font-medium">Home</span>
                    <span className="text-sm text-muted-foreground">Main page</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start h-auto p-3">
                  <Link href="/projects" className="flex flex-col items-start">
                    <span className="font-medium">Projects</span>
                    <span className="text-sm text-muted-foreground">My work</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start h-auto p-3">
                  <Link href="/gallery" className="flex flex-col items-start">
                    <span className="font-medium">Gallery</span>
                    <span className="text-sm text-muted-foreground">Photos</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start h-auto p-3">
                  <Link href="/coming-soon" className="flex flex-col items-start">
                    <span className="font-medium">Coming Soon</span>
                    <span className="text-sm text-muted-foreground">New features</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </CardFooter>
          </Card>

          {/* Fun 404 Message */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              &quot;The page you&apos;re looking for has gone on a coffee break ☕&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
