"use client"

import { useState } from "react"
import { Header } from "@/components/sections/Header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Code, ArrowLeft, Copy, Check, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Function to convert a string to PascalCase
function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
    .replace(/^[0-9]/, (match) => `_${match}`) // Handle leading numbers
}

// Function to sanitize TypeScript identifier names
function sanitizeIdentifier(name: string): string {
  // Replace invalid characters and ensure it starts with a letter or underscore
  const sanitized = name.replace(/[^a-zA-Z0-9_$]/g, "_")
  if (/^[0-9]/.test(sanitized)) {
    return `_${sanitized}`
  }
  return sanitized || "Item"
}

// Function to infer TypeScript type from a value
function inferType(value: unknown, seen = new Set<unknown>()): string {
  if (value === null) return "null"
  if (value === undefined) return "undefined"
  
  const type = typeof value
  
  if (type === "string") return "string"
  if (type === "number") return "number"
  if (type === "boolean") return "boolean"
  
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]"
    const types = new Set<string>()
    value.forEach((item) => {
      types.add(inferType(item, seen))
    })
    if (types.size === 1) {
      return `${Array.from(types)[0]}[]`
    }
    return `(${Array.from(types).join(" | ")})[]`
  }
  
  if (type === "object") {
    // Avoid circular references
    if (seen.has(value)) return "any"
    seen.add(value)
    
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 0) return "Record<string, unknown>"
    
    const properties = keys.map((key) => {
      const sanitizedKey = sanitizeIdentifier(key)
      const propType = inferType(obj[key], new Set(seen))
      const optional = obj[key] === null || obj[key] === undefined ? "?" : ""
      return `  ${sanitizedKey}${optional}: ${propType}`
    })
    
    return `{\n${properties.join(";\n")};\n}`
  }
  
  return "unknown"
}

// Function to generate TypeScript interface from object
function generateInterface(obj: Record<string, unknown>, name: string = "Root", depth: number = 0): string {
  const interfaceName = toPascalCase(name)
  const indent = "  ".repeat(depth)
  
  const properties: string[] = []
  const nestedInterfaces: string[] = []
  
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeIdentifier(key)
    const optional = value === null || value === undefined ? "?" : ""
    
    if (value === null || value === undefined) {
      properties.push(`${indent}  ${sanitizedKey}${optional}: null | undefined`)
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        properties.push(`${indent}  ${sanitizedKey}${optional}: unknown[]`)
      } else {
        const firstItem = value[0]
        if (typeof firstItem === "object" && firstItem !== null && !Array.isArray(firstItem)) {
          const nestedName = `${interfaceName}${toPascalCase(key)}Item`
          const nestedInterface = generateInterface(firstItem as Record<string, unknown>, nestedName, depth + 1)
          nestedInterfaces.push(nestedInterface)
          properties.push(`${indent}  ${sanitizedKey}${optional}: ${nestedName}[]`)
        } else {
          const itemType = inferType(firstItem)
          properties.push(`${indent}  ${sanitizedKey}${optional}: ${itemType}[]`)
        }
      }
    } else if (typeof value === "object" && value !== null) {
      const nestedName = `${interfaceName}${toPascalCase(key)}`
      const nestedInterface = generateInterface(value as Record<string, unknown>, nestedName, depth + 1)
      nestedInterfaces.push(nestedInterface)
      properties.push(`${indent}  ${sanitizedKey}${optional}: ${nestedName}`)
    } else {
      const type = inferType(value)
      properties.push(`${indent}  ${sanitizedKey}${optional}: ${type}`)
    }
  }
  
  const interfaceDef = `${indent}export interface ${interfaceName} {\n${properties.join(";\n")};\n${indent}}`
  
  return nestedInterfaces.length > 0 
    ? `${nestedInterfaces.join("\n\n")}\n\n${interfaceDef}`
    : interfaceDef
}

// Main conversion function
function jsonToTypeScript(jsonString: string, rootName: string = "Root"): string {
  try {
    const parsed = JSON.parse(jsonString)
    
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return generateInterface(parsed as Record<string, unknown>, rootName)
    } else if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        return `export type ${toPascalCase(rootName)} = unknown[]`
      }
      const firstItem = parsed[0]
      if (typeof firstItem === "object" && firstItem !== null && !Array.isArray(firstItem)) {
        const itemInterface = generateInterface(firstItem as Record<string, unknown>, `${toPascalCase(rootName)}Item`)
        return `${itemInterface}\n\nexport type ${toPascalCase(rootName)} = ${toPascalCase(rootName)}Item[]`
      } else {
        const itemType = inferType(firstItem)
        return `export type ${toPascalCase(rootName)} = ${itemType}[]`
      }
    } else {
      const type = inferType(parsed)
      return `export type ${toPascalCase(rootName)} = ${type}`
    }
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export default function JsonToTsPage() {
  const [jsonInput, setJsonInput] = useState("")
  const [tsOutput, setTsOutput] = useState("")
  const [rootName, setRootName] = useState("Root")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const { toast } = useToast()

  const handleConvert = () => {
    if (!jsonInput.trim()) {
      setError("Please enter some JSON")
      setTsOutput("")
      return
    }

    setIsConverting(true)
    setError(null)
    setCopied(false)

    try {
      const result = jsonToTypeScript(jsonInput, rootName || "Root")
      setTsOutput(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to convert JSON"
      setError(errorMessage)
      setTsOutput("")
      toast({
        title: "Conversion Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleCopy = async () => {
    if (!tsOutput) return

    try {
      await navigator.clipboard.writeText(tsOutput)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "TypeScript code copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleClear = () => {
    setJsonInput("")
    setTsOutput("")
    setError(null)
    setCopied(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container py-8 md:py-12 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Go Back Button */}
          <div className="mb-6">
            <Link href="/tools">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Button>
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Code className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold font-montserrat">
                <span className="gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  JSON to TypeScript
                </span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Convert JSON objects to TypeScript interfaces and types. Paste your JSON and get instant TypeScript definitions.
            </p>
          </div>

          {/* Root Name Input */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="rootName">Root Interface/Type Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="rootName"
                    type="text"
                    value={rootName}
                    onChange={(e) => setRootName(e.target.value)}
                    placeholder="Root"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  The name for the root interface or type (e.g., "User", "Product", "ApiResponse")
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>JSON Input</CardTitle>
              <CardDescription>Paste your JSON object or array here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value)
                    setError(null)
                  }}
                  placeholder='{"name": "John", "age": 30, "email": "john@example.com"}'
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleConvert}
                    disabled={isConverting || !jsonInput.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Code className="mr-2 h-4 w-4" />
                        Convert to TypeScript
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    disabled={!jsonInput && !tsOutput}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-6 border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive mb-1">Error</p>
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Output Section */}
          {tsOutput && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>TypeScript Output</CardTitle>
                    <CardDescription>Copy the generated TypeScript code</CardDescription>
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm font-mono">{tsOutput}</code>
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!tsOutput && !error && !isConverting && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Code className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Ready to Convert</h3>
                <p className="text-muted-foreground">
                  Paste your JSON in the input field above and click "Convert to TypeScript" to generate TypeScript definitions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
