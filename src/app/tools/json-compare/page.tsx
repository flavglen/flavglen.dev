"use client"

import { useState } from "react"
import { Header } from "@/components/sections/Header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, GitCompare, AlertCircle, Plus, Minus, Edit3 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

type DiffKind = "added" | "removed" | "changed"

interface DiffItem {
  path: string
  kind: DiffKind
  left?: unknown
  right?: unknown
}

function compareJson(a: unknown, b: unknown, path = ""): DiffItem[] {
  const diffs: DiffItem[] = []

  if (a === b) return diffs

  if (typeof a !== typeof b) {
    diffs.push({ path: path || "(root)", kind: "changed", left: a, right: b })
    return diffs
  }

  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    if (a !== b) {
      diffs.push({ path: path || "(root)", kind: "changed", left: a, right: b })
    }
    return diffs
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length)
    for (let i = 0; i < maxLen; i++) {
      const p = path ? `${path}[${i}]` : `[${i}]`
      if (i >= a.length) {
        diffs.push({ path: p, kind: "added", right: b[i] })
      } else if (i >= b.length) {
        diffs.push({ path: p, kind: "removed", left: a[i] })
      } else {
        diffs.push(...compareJson(a[i], b[i], p))
      }
    }
    return diffs
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    diffs.push({ path: path || "(root)", kind: "changed", left: a, right: b })
    return diffs
  }

  const objA = a as Record<string, unknown>
  const objB = b as Record<string, unknown>
  const keysA = new Set(Object.keys(objA))
  const keysB = new Set(Object.keys(objB))

  for (const k of keysB) {
    const p = path ? `${path}.${k}` : k
    if (!keysA.has(k)) {
      diffs.push({ path: p, kind: "added", right: objB[k] })
    } else {
      diffs.push(...compareJson(objA[k], objB[k], p))
    }
  }
  for (const k of keysA) {
    if (!keysB.has(k)) {
      const p = path ? `${path}.${k}` : k
      diffs.push({ path: p, kind: "removed", left: objA[k] })
    }
  }

  return diffs
}

function formatValue(value: unknown): string {
  if (value === undefined) return "undefined"
  if (value === null) return "null"
  if (typeof value === "string") return JSON.stringify(value)
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

export default function JsonComparePage() {
  const [jsonA, setJsonA] = useState("")
  const [jsonB, setJsonB] = useState("")
  const [diffs, setDiffs] = useState<DiffItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCompare = () => {
    setError(null)
    setDiffs(null)

    if (!jsonA.trim() || !jsonB.trim()) {
      setError("Please enter JSON in both panels.")
      toast({
        title: "Missing input",
        description: "Enter JSON in both left and right panels.",
        variant: "destructive",
      })
      return
    }

    let a: unknown
    let b: unknown

    try {
      a = JSON.parse(jsonA)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON"
      setError(`Left (JSON A): ${msg}`)
      toast({ title: "Invalid JSON (left)", description: msg, variant: "destructive" })
      return
    }

    try {
      b = JSON.parse(jsonB)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON"
      setError(`Right (JSON B): ${msg}`)
      toast({ title: "Invalid JSON (right)", description: msg, variant: "destructive" })
      return
    }

    const result = compareJson(a, b)
    setDiffs(result)
    if (result.length === 0) {
      toast({ title: "No differences", description: "Both JSON values are equal." })
    }
  }

  const handleClear = () => {
    setJsonA("")
    setJsonB("")
    setDiffs(null)
    setError(null)
  }

  const added = diffs?.filter((d) => d.kind === "added").length ?? 0
  const removed = diffs?.filter((d) => d.kind === "removed").length ?? 0
  const changed = diffs?.filter((d) => d.kind === "changed").length ?? 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container py-8 md:py-12 flex-1">
        <div className="max-w-7xl mx-auto">
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
              <GitCompare className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold font-montserrat">
                <span className="gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  JSON Compare
                </span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste two JSON objects and see exactly what was added, removed, or changed. Great for API responses and configs.
            </p>
          </div>

          {/* Two panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">JSON A (left / original)</CardTitle>
                <CardDescription>First JSON object or array</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jsonA}
                  onChange={(e) => {
                    setJsonA(e.target.value)
                    setError(null)
                  }}
                  placeholder='{"name": "John", "age": 30}'
                  className="min-h-[280px] font-mono text-sm resize-y"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">JSON B (right / modified)</CardTitle>
                <CardDescription>Second JSON object or array</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jsonB}
                  onChange={(e) => {
                    setJsonB(e.target.value)
                    setError(null)
                  }}
                  placeholder='{"name": "Jane", "age": 30, "role": "admin"}'
                  className="min-h-[280px] font-mono text-sm resize-y"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              onClick={handleCompare}
              disabled={!jsonA.trim() || !jsonB.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            >
              <GitCompare className="mr-2 h-4 w-4" />
              Compare JSON
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              disabled={!jsonA && !jsonB && !diffs}
            >
              Clear
            </Button>
          </div>

          {error && (
            <Card className="mb-6 border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {diffs && (
            <>
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <strong>{added}</strong> added
                    </span>
                    <span className="flex items-center gap-2">
                      <Minus className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <strong>{removed}</strong> removed
                    </span>
                    <span className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <strong>{changed}</strong> changed
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Differences</CardTitle>
                  <CardDescription>Path and value changes between JSON A and JSON B</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {diffs.map((d, i) => (
                      <div
                        key={`${d.path}-${i}`}
                        className="rounded-lg border p-4 font-mono text-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={
                              d.kind === "added"
                                ? "text-green-600 dark:text-green-400"
                                : d.kind === "removed"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-amber-600 dark:text-amber-400"
                            }
                          >
                            {d.kind === "added" && <Plus className="h-4 w-4 inline mr-1" />}
                            {d.kind === "removed" && <Minus className="h-4 w-4 inline mr-1" />}
                            {d.kind === "changed" && <Edit3 className="h-4 w-4 inline mr-1" />}
                            {d.kind}
                          </span>
                          <span className="font-semibold text-foreground">{d.path}</span>
                        </div>
                        {d.kind === "removed" && (
                          <div className="bg-red-500/10 dark:bg-red-500/20 rounded p-2 break-all">
                            {formatValue(d.left)}
                          </div>
                        )}
                        {d.kind === "added" && (
                          <div className="bg-green-500/10 dark:bg-green-500/20 rounded p-2 break-all">
                            {formatValue(d.right)}
                          </div>
                        )}
                        {d.kind === "changed" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="text-xs text-muted-foreground">A (left)</span>
                              <div className="bg-red-500/10 dark:bg-red-500/20 rounded p-2 break-all mt-1">
                                {formatValue(d.left)}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">B (right)</span>
                              <div className="bg-green-500/10 dark:bg-green-500/20 rounded p-2 break-all mt-1">
                                {formatValue(d.right)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!diffs && !error && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <GitCompare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Ready to compare</h3>
                <p className="text-muted-foreground">
                  Enter JSON in both panels and click &quot;Compare JSON&quot; to see added, removed, and changed keys and values.
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
