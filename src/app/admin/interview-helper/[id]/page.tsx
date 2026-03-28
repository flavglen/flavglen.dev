"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import {
  Play,
  Save,
  X,
  Code2,
  Tag,
  Loader2,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-muted">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
})

interface InterviewQuestion {
  id: string
  title: string
  description: string
  language: "javascript" | "html" | "css"
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  starterCode: string
  savedCode?: string
  notes?: string
  createdAt: string
  updatedAt: string
  savedAt?: string
}

type Language = "javascript" | "html" | "css"
type Difficulty = "easy" | "medium" | "hard"

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "bg-green-500/15 text-green-600 border-green-500/30",
  medium: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  hard: "bg-red-500/15 text-red-600 border-red-500/30",
}

const LANGUAGE_COLORS: Record<Language, string> = {
  javascript: "bg-yellow-400/15 text-yellow-600 border-yellow-400/30",
  html: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  css: "bg-blue-500/15 text-blue-600 border-blue-500/30",
}

const DEFAULT_STARTER: Record<Language, string> = {
  javascript: `// Write your solution here\nfunction solution() {\n  \n}\n`,
  html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Solution</title>\n</head>\n<body>\n  \n</body>\n</html>`,
  css: `/* Write your CSS here */\nbody {\n  \n}`,
}

function buildRunnerHTML(language: Language, code: string): string {
  if (language === "javascript") {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script>
(function() {
  const logs = [];
  const push = (type, args) => {
    logs.push({ type, text: args.map(a => {
      try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
      catch(_) { return String(a); }
    }).join(' ') });
  };
  const _log = console.log.bind(console);
  const _warn = console.warn.bind(console);
  const _error = console.error.bind(console);
  console.log = (...a) => { push('log', a); _log(...a); };
  console.warn = (...a) => { push('warn', a); _warn(...a); };
  console.error = (...a) => { push('error', a); _error(...a); };
  try {
    ${code}
  } catch(e) {
    push('error', [e.toString()]);
  }
  window.parent.postMessage({ type: 'RUNNER_RESULT', logs }, '*');
})();
</script>
</body>
</html>`
  }

  if (language === "css") {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>${code}</style>
</head>
<body>
<p>CSS Preview — add HTML elements below to test your styles</p>
<div class="preview-box">Preview Box</div>
<button class="btn">Button</button>
<a href="#" class="link">Link</a>
</body>
</html>`
  }

  return code
}

export default function InterviewEditorPage() {
  const params = useParams()
  const id = params?.id as string
  const isAdmin = useIsAdmin()
  const router = useRouter()

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showMessage = useCallback((text: string, type: "success" | "error" = "success") => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    setMessage({ text, type })
    messageTimerRef.current = setTimeout(() => setMessage(null), 4000)
  }, [])

  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [editorCode, setEditorCode] = useState("")
  const [editorLanguage, setEditorLanguage] = useState<Language>("javascript")
  const [outputLogs, setOutputLogs] = useState<{ type: string; text: string }[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSavingAnswer, setIsSavingAnswer] = useState(false)
  const [answerSaved, setAnswerSaved] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (isAdmin === false) router.push("/unauthorized")
  }, [isAdmin, router])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "RUNNER_RESULT") {
        setOutputLogs(e.data.logs || [])
        setIsRunning(false)
      }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true)
    try {
      const res = await fetch("/api/protected/interview-questions")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const qs: InterviewQuestion[] = data.data || []
      setQuestions(qs)
      const found = qs.find((q) => q.id === id)
      if (found) {
        setCurrentQuestion(found)
        setEditorLanguage(found.language)
        setEditorCode(found.savedCode || found.starterCode || DEFAULT_STARTER[found.language])
        setAnswerSaved(!!found.savedCode)
      }
    } catch (err) {
      showMessage(err instanceof Error ? err.message : "Failed to load", "error")
    } finally {
      setLoadingQuestions(false)
    }
  }, [id, showMessage])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const loadQuestion = (q: InterviewQuestion) => {
    setCurrentQuestion(q)
    setEditorLanguage(q.language)
    setEditorCode(q.savedCode || q.starterCode || DEFAULT_STARTER[q.language])
    setOutputLogs([])
    setAnswerSaved(!!q.savedCode)
    // Update URL without full reload
    window.history.replaceState(null, "", `/admin/interview-helper/${q.id}`)
  }

  const handleRun = () => {
    if (!editorCode.trim()) return
    setIsRunning(true)
    setOutputLogs([])
    if (editorLanguage === "javascript") {
      if (iframeRef.current) iframeRef.current.srcdoc = buildRunnerHTML("javascript", editorCode)
    } else {
      if (iframeRef.current) iframeRef.current.srcdoc = buildRunnerHTML(editorLanguage, editorCode)
      setIsRunning(false)
      setOutputLogs([{ type: "info", text: "Rendered in preview below." }])
    }
  }

  const resetCode = () => {
    if (currentQuestion) {
      setEditorCode(currentQuestion.starterCode || DEFAULT_STARTER[editorLanguage])
      setAnswerSaved(!!currentQuestion.savedCode)
    } else {
      setEditorCode(DEFAULT_STARTER[editorLanguage])
      setAnswerSaved(false)
    }
    setOutputLogs([])
  }

  const handleSaveAnswer = async () => {
    if (!currentQuestion) return
    setIsSavingAnswer(true)
    try {
      const res = await fetch(`/api/protected/interview-questions/${currentQuestion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedCode: editorCode, savedAt: new Date().toISOString() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCurrentQuestion((prev) => prev ? { ...prev, savedCode: editorCode, savedAt: data.data?.savedAt } : prev)
      setQuestions((prev) =>
        prev.map((q) => q.id === currentQuestion.id ? { ...q, savedCode: editorCode } : q)
      )
      setAnswerSaved(true)
      showMessage("Answer saved — your solution will be loaded next time.")
    } catch (err) {
      showMessage(err instanceof Error ? err.message : "Failed to save answer", "error")
    } finally {
      setIsSavingAnswer(false)
    }
  }

  if (isAdmin === null || loadingQuestions) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-2.5 shrink-0">
        <Link
          href="/admin/interview-helper"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
          Questions
        </Link>
        <span className="text-muted-foreground/40 shrink-0">/</span>
        <span className="text-sm font-medium truncate">
          {currentQuestion?.title ?? "Not found"}
        </span>
        <div className="ml-auto shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 gap-1.5 text-xs"
            title={sidebarOpen ? "Hide question list" : "Show question list"}
          >
            <List className="h-4 w-4" />
            {sidebarOpen ? (
              <ChevronLeft className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: question list */}
        {sidebarOpen && (
          <aside className="w-60 shrink-0 border-r flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Questions</span>
              <span className="text-xs text-muted-foreground">{questions.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {questions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => loadQuestion(q)}
                  className={`w-full text-left px-3 py-2.5 border-b hover:bg-muted/50 transition-colors ${
                    q.id === currentQuestion?.id ? "bg-muted border-l-2 border-l-primary" : ""
                  }`}
                >
                  <p className="text-xs font-medium leading-snug line-clamp-2">{q.title}</p>
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    <span className={`text-[10px] px-1 py-0.5 rounded border font-medium ${LANGUAGE_COLORS[q.language]}`}>
                      {q.language}
                    </span>
                    <span className={`text-[10px] px-1 py-0.5 rounded border font-medium ${DIFFICULTY_COLORS[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                    {q.savedCode && (
                      <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Main editor area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {currentQuestion ? (
            <>
              {/* Question detail */}
              <div className="border-b px-5 py-3 shrink-0 max-h-44 overflow-y-auto">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-base font-semibold">{currentQuestion.title}</h2>
                  <div className="flex gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${LANGUAGE_COLORS[currentQuestion.language]}`}>
                      {currentQuestion.language}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${DIFFICULTY_COLORS[currentQuestion.difficulty]}`}>
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentQuestion.description}</p>
                {currentQuestion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentQuestion.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                )}
                {currentQuestion.notes && (
                  <p className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded p-2 mt-2">
                    📝 {currentQuestion.notes}
                  </p>
                )}
              </div>

              {/* Inline message banner */}
              {message && (
                <div className={`flex items-center justify-between px-4 py-2 text-sm shrink-0 ${
                  message.type === "error"
                    ? "bg-destructive/10 text-destructive border-b border-destructive/20"
                    : "bg-green-500/10 text-green-700 dark:text-green-400 border-b border-green-500/20"
                }`}>
                  <span className="flex items-center gap-2">
                    {message.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                    {message.text}
                  </span>
                  <button onClick={() => setMessage(null)} className="opacity-60 hover:opacity-100 ml-4">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Editor toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 shrink-0">
                <div className="flex items-center gap-2">
                  <select
                    value={editorLanguage}
                    onChange={(e) => setEditorLanguage(e.target.value as Language)}
                    className="h-7 w-36 text-xs rounded-md border border-input bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                  {answerSaved && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      Saved
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={resetCode} className="h-7 gap-1.5 text-xs">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveAnswer}
                    disabled={isSavingAnswer}
                    className="h-7 gap-1.5 text-xs"
                  >
                    {isSavingAnswer ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    Save Answer
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRun}
                    disabled={isRunning}
                    className="h-7 gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isRunning ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                    Run
                  </Button>
                </div>
              </div>

              {/* Editor + Output */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 min-h-0">
                  <MonacoEditor
                    height="100%"
                    language={editorLanguage}
                    value={editorCode}
                    onChange={(val) => setEditorCode(val || "")}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      tabSize: 2,
                      wordWrap: "on",
                      lineNumbers: "on",
                      automaticLayout: true,
                      padding: { top: 12 },
                    }}
                  />
                </div>

                {/* Output Panel */}
                <div className="h-40 border-t flex flex-col shrink-0">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Output</span>
                    {outputLogs.length > 0 && (
                      <button
                        onClick={() => setOutputLogs([])}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {editorLanguage === "javascript" ? (
                    <div className="flex-1 overflow-y-auto font-mono text-xs px-3 py-2 space-y-0.5 bg-[#1e1e1e]">
                      {outputLogs.length === 0 ? (
                        <span className="text-zinc-500">Press Run to execute your code…</span>
                      ) : (
                        outputLogs.map((log, i) => (
                          <div
                            key={i}
                            className={
                              log.type === "error"
                                ? "text-red-400"
                                : log.type === "warn"
                                ? "text-yellow-400"
                                : log.type === "info"
                                ? "text-blue-400"
                                : "text-green-300"
                            }
                          >
                            <span className="text-zinc-500 mr-2">&gt;</span>
                            {log.text}
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 overflow-hidden">
                      <iframe
                        ref={iframeRef}
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full h-full border-0 bg-white"
                        title="Preview"
                      />
                    </div>
                  )}
                </div>

                {/* Hidden iframe for JS execution */}
                {editorLanguage === "javascript" && (
                  <iframe
                    ref={iframeRef}
                    sandbox="allow-scripts"
                    className="hidden"
                    title="JS Runner"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <Code2 className="h-12 w-12 opacity-30" />
              <div className="text-center">
                <p className="text-base font-medium">Question not found</p>
                <p className="text-sm">This question may have been deleted</p>
              </div>
              <Link href="/admin/interview-helper">
                <Button variant="outline" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Back to Questions
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
