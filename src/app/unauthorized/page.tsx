'use client';

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Shield, Home, ArrowLeft, LogIn } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-destructive/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* 401 Animation/Icon */}
          <div className="relative">
            <div className="text-8xl font-bold text-destructive/20 select-none">401</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-16 w-16 text-destructive animate-pulse" />
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Unauthorized Access
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              You don&apos;t have permission to access this page. This area is restricted to authorized users only.
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
              <Link href="/api/auth/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <Card className="w-full max-w-lg mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Access Denied</CardTitle>
              <CardDescription>
                This page requires administrator privileges. If you believe this is an error, please contact support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">
                    🔒 Restricted Area
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This section is only accessible to authorized administrators.
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>If you&apos;re an administrator:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Make sure you&apos;re signed in with the correct account</li>
                <li>Check that your session hasn&apos;t expired</li>
                <li>Contact the system administrator if issues persist</li>
                  </ul>
                </div>
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

          {/* Security Notice */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              &quot;Access denied. This incident has been logged for security purposes.&quot; 🛡️
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
