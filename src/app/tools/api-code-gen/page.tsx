"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/sections/Header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Code, ArrowLeft, Copy, Check, Terminal, FileCode, Zap, Globe } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { CodeBlock } from "@/components/ui/code-block"

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const
type HttpMethod = (typeof HTTP_METHODS)[number]

const BODY_METHODS: HttpMethod[] = ["POST", "PUT", "PATCH"]

function generateCurl(method: HttpMethod, url: string, body: string): string {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) return ""

  const escapedUrl = trimmedUrl.includes(" ") ? `'${trimmedUrl}'` : trimmedUrl
  let curl = `curl -X ${method} ${escapedUrl}`

  const trimmedBody = body.trim()
  if (trimmedBody && BODY_METHODS.includes(method)) {
    // Escape single quotes in body for shell
    const escapedBody = trimmedBody.replace(/'/g, "'\"'\"'")
    curl += ` -H 'Content-Type: application/json' -d '${escapedBody}'`
  }

  // Add response handling examples
  return `${curl}\n\n# With response handling:\n# Show response headers\n${curl} -i\n\n# Save response to file\n${curl} -o response.json\n\n# Show verbose output (includes headers, status, etc.)\n${curl} -v\n\n# Follow redirects\n${curl} -L\n\n# Check HTTP status code only\n${curl} -o /dev/null -w "%{http_code}"\n\n# Handle errors (exit on HTTP error)\n${curl} -f ${escapedUrl} || echo "Request failed"`
}

function generateFetch(method: HttpMethod, url: string, body: string): string {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) return ""

  const escapedUrl = JSON.stringify(trimmedUrl)
  const trimmedBody = body.trim()

  // Build the request code
  let requestCode: string
  
  if (method === "GET" || method === "HEAD" || method === "OPTIONS" || !trimmedBody || !BODY_METHODS.includes(method)) {
    requestCode = `fetch(${escapedUrl}, {\n  method: '${method}',\n})`
  } else {
    // Try to parse as JSON and format nicely, otherwise use as string literal
    let bodyArg: string
    try {
      const parsed = JSON.parse(trimmedBody)
      // Format the JSON object nicely - this gives us the object literal code
      const formattedJson = JSON.stringify(parsed, null, 2)
        .split('\n')
        .map((line, index) => {
          // Add 4 spaces indentation for each line (to align with the fetch call indentation)
          return index === 0 ? line : '    ' + line
        })
        .join('\n')
      // Output as JSON.stringify with the formatted object literal
      bodyArg = `JSON.stringify(${formattedJson})`
    } catch {
      // If not valid JSON, treat as plain string and wrap in JSON.stringify
      // This ensures the string is properly escaped for the fetch() call
      bodyArg = JSON.stringify(trimmedBody)
    }
    
    requestCode = `fetch(${escapedUrl}, {\n  method: '${method}',\n  headers: {\n    'Content-Type': 'application/json',\n  },\n  body: ${bodyArg},\n})`
  }

  // Add response and error handling
  return `// Using async/await\ntry {\n  const response = await ${requestCode}\n  \n  if (!response.ok) {\n    throw new Error(\`HTTP error! status: \${response.status}\`)\n  }\n  \n  const data = await response.json()\n  console.log('Success:', data)\n} catch (error) {\n  console.error('Error:', error)\n}\n\n// Using .then()/.catch()\n${requestCode}\n  .then(response => {\n    if (!response.ok) {\n      throw new Error(\`HTTP error! status: \${response.status}\`)\n    }\n    return response.json()\n  })\n  .then(data => {\n    console.log('Success:', data)\n  })\n  .catch(error => {\n    console.error('Error:', error)\n  })`
}

function generateAxios(method: HttpMethod, url: string, body: string): string {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) return ""

  const escapedUrl = JSON.stringify(trimmedUrl)
  const trimmedBody = body.trim()
  const methodLower = method.toLowerCase()

  // Generate the request code
  let requestCode: string
  
  if (method === "GET" || method === "DELETE" || method === "HEAD" || method === "OPTIONS") {
    if (method === "GET") {
      requestCode = `axios.get(${escapedUrl})`
    } else if (method === "DELETE") {
      requestCode = `axios.delete(${escapedUrl})`
    } else if (method === "HEAD") {
      requestCode = `axios.head(${escapedUrl})`
    } else {
      requestCode = `axios.request({\n  method: '${methodLower}',\n  url: ${escapedUrl},\n})`
    }
  } else if (!trimmedBody || !BODY_METHODS.includes(method)) {
    requestCode = `axios.${methodLower}(${escapedUrl})`
  } else {
    // Format body for axios
    let bodyArg: string
    try {
      const parsed = JSON.parse(trimmedBody)
      const formattedJson = JSON.stringify(parsed, null, 2)
        .split('\n')
        .map((line, index) => {
          return index === 0 ? line : '    ' + line
        })
        .join('\n')
      bodyArg = formattedJson
    } catch {
      bodyArg = JSON.stringify(trimmedBody)
    }

    if (method === "POST") {
      requestCode = `axios.post(${escapedUrl}, ${bodyArg})`
    } else if (method === "PUT") {
      requestCode = `axios.put(${escapedUrl}, ${bodyArg})`
    } else if (method === "PATCH") {
      requestCode = `axios.patch(${escapedUrl}, ${bodyArg})`
    } else {
      requestCode = `axios.request({\n  method: '${methodLower}',\n  url: ${escapedUrl},\n  data: ${bodyArg},\n})`
    }
  }

  // Add response and error handling
  return `// Using async/await\ntry {\n  const response = await ${requestCode}\n  console.log('Success:', response.data)\n} catch (error) {\n  if (error.response) {\n    // Server responded with error status\n    console.error('Error:', error.response.status, error.response.data)\n  } else if (error.request) {\n    // Request made but no response\n    console.error('Error: No response received', error.request)\n  } else {\n    // Error setting up request\n    console.error('Error:', error.message)\n  }\n}\n\n// Using .then()/.catch()\n${requestCode}\n  .then(response => {\n    console.log('Success:', response.data)\n  })\n  .catch(error => {\n    if (error.response) {\n      console.error('Error:', error.response.status, error.response.data)\n    } else if (error.request) {\n      console.error('Error: No response received', error.request)\n    } else {\n      console.error('Error:', error.message)\n    }\n  })`
}

function generateJQuery(method: HttpMethod, url: string, body: string): string {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) return ""

  const escapedUrl = JSON.stringify(trimmedUrl)
  const trimmedBody = body.trim()
  const methodUpper = method.toUpperCase()

  // Generate the request code and optional body for alternative $.ajax
  let requestCode: string
  let bodyArg: string | null = null

  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    requestCode = `$.ajax({\n  url: ${escapedUrl},\n  method: '${methodUpper}',\n})`
  } else if (!trimmedBody || !BODY_METHODS.includes(method)) {
    requestCode = `$.ajax({\n  url: ${escapedUrl},\n  method: '${methodUpper}',\n})`
  } else {
    // Format body for jQuery
    try {
      const parsed = JSON.parse(trimmedBody)
      const formattedJson = JSON.stringify(parsed, null, 2)
        .split('\n')
        .map((line, index) => {
          return index === 0 ? line : '    ' + line
        })
        .join('\n')
      bodyArg = formattedJson
    } catch {
      bodyArg = JSON.stringify(trimmedBody)
    }

    requestCode = `$.ajax({\n  url: ${escapedUrl},\n  method: '${methodUpper}',\n  contentType: 'application/json',\n  data: JSON.stringify(${bodyArg}),\n})`
  }

  const altDataOpts = bodyArg != null
    ? `\n  contentType: 'application/json',\n  data: JSON.stringify(${bodyArg}),`
    : ''

  // Add response and error handling
  return `${requestCode}\n  .done(function(response) {\n    console.log('Success:', response)\n  })\n  .fail(function(xhr, status, error) {\n    console.error('Error:', status, error)\n    console.error('Response:', xhr.responseText)\n  })\n\n// Alternative: Using success/error callbacks\n$.ajax({\n  url: ${escapedUrl},\n  method: '${methodUpper}',${altDataOpts}\n  success: function(response) {\n    console.log('Success:', response)\n  },\n  error: function(xhr, status, error) {\n    console.error('Error:', status, error)\n    console.error('Response:', xhr.responseText)\n  }\n})`
}

export default function ApiCodeGenPage() {
  const [method, setMethod] = useState<HttpMethod>("GET")
  const [url, setUrl] = useState("")
  const [body, setBody] = useState("")
  const [copiedCurl, setCopiedCurl] = useState(false)
  const [copiedFetch, setCopiedFetch] = useState(false)
  const [copiedAxios, setCopiedAxios] = useState(false)
  const [copiedJQuery, setCopiedJQuery] = useState(false)
  const { toast } = useToast()

  const curlCode = useMemo(() => generateCurl(method, url, body), [method, url, body])
  const fetchCode = useMemo(() => generateFetch(method, url, body), [method, url, body])
  const axiosCode = useMemo(() => generateAxios(method, url, body), [method, url, body])
  const jQueryCode = useMemo(() => generateJQuery(method, url, body), [method, url, body])

  const hasOutput = Boolean(url.trim())

  const handleCopyCurl = async () => {
    if (!curlCode) return
    try {
      await navigator.clipboard.writeText(curlCode)
      setCopiedCurl(true)
      toast({ title: "Copied!", description: "cURL command copied to clipboard" })
      setTimeout(() => setCopiedCurl(false), 2000)
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleCopyFetch = async () => {
    if (!fetchCode) return
    try {
      await navigator.clipboard.writeText(fetchCode)
      setCopiedFetch(true)
      toast({ title: "Copied!", description: "fetch() code copied to clipboard" })
      setTimeout(() => setCopiedFetch(false), 2000)
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleCopyAxios = async () => {
    if (!axiosCode) return
    try {
      await navigator.clipboard.writeText(axiosCode)
      setCopiedAxios(true)
      toast({ title: "Copied!", description: "axios code copied to clipboard" })
      setTimeout(() => setCopiedAxios(false), 2000)
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleCopyJQuery = async () => {
    if (!jQueryCode) return
    try {
      await navigator.clipboard.writeText(jQueryCode)
      setCopiedJQuery(true)
      toast({ title: "Copied!", description: "jQuery code copied to clipboard" })
      setTimeout(() => setCopiedJQuery(false), 2000)
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container py-8 md:py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/tools">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Code className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold font-montserrat">
                <span className="gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  API Code Generator
                </span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter an API URL and optional body to generate cURL, fetch(), axios, and jQuery code.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Request</CardTitle>
              <CardDescription>Configure method, URL, and body. Code updates as you type.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method">Method</Label>
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value as HttpMethod)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                  >
                    {HTTP_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-3 space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Body (JSON or Plain Text)</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"} or plain text'
                  className="min-h-[120px] font-mono text-sm"
                  disabled={method === "GET"}
                />
                <p className="text-xs text-muted-foreground">
                  Optional. Used for POST, PUT, and PATCH. Accepts JSON objects or plain text strings. Leave empty for GET or no body.
                </p>
              </div>
            </CardContent>
          </Card>

          {hasOutput && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <CardTitle>cURL</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyCurl}>
                    {copiedCurl ? (
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
                </CardHeader>
                <CardContent className="p-0">
                  <CodeBlock code={curlCode} language="bash" className="rounded-b-xl [&>div]:rounded-b-xl" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    <CardTitle>fetch()</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyFetch}>
                    {copiedFetch ? (
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
                </CardHeader>
                <CardContent className="p-0">
                  <CodeBlock code={fetchCode} language="javascript" className="rounded-b-xl [&>div]:rounded-b-xl" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle>axios</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyAxios}>
                    {copiedAxios ? (
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
                </CardHeader>
                <CardContent className="p-0">
                  <CodeBlock code={axiosCode} language="javascript" className="rounded-b-xl [&>div]:rounded-b-xl" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle>jQuery</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyJQuery}>
                    {copiedJQuery ? (
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
                </CardHeader>
                <CardContent className="p-0">
                  <CodeBlock code={jQueryCode} language="javascript" className="rounded-b-xl [&>div]:rounded-b-xl" />
                </CardContent>
              </Card>
            </div>
          )}

          {!hasOutput && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Code className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Enter a URL</h3>
                <p className="text-muted-foreground">
                  Add an API URL above to generate cURL, fetch(), axios, and jQuery code.
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
