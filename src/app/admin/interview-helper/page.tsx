"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useRouter } from "next/navigation"
import {
  Plus,
  Trash2,
  Edit,
  X,
  Code2,
  Tag,
  Loader2,
  Save,
  BookOpen,
  CheckCircle2,
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

export default function InterviewHelperPage() {
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
  const [loading, setLoading] = useState(true)
  const [filterLanguage, setFilterLanguage] = useState<string>("all")
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<InterviewQuestion | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formLanguage, setFormLanguage] = useState<Language>("javascript")
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>("medium")
  const [formTags, setFormTags] = useState("")
  const [formStarterCode, setFormStarterCode] = useState("")
  const [formNotes, setFormNotes] = useState("")

  useEffect(() => {
    if (isAdmin === false) router.push("/unauthorized")
  }, [isAdmin, router])

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/protected/interview-questions")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setQuestions(data.data || [])
    } catch (err) {
      showMessage(err instanceof Error ? err.message : "Failed to load questions", "error")
    } finally {
      setLoading(false)
    }
  }, [showMessage])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const openCreateForm = () => {
    setEditingQuestion(null)
    setFormTitle("")
    setFormDescription("")
    setFormLanguage("javascript")
    setFormDifficulty("medium")
    setFormTags("")
    setFormStarterCode(DEFAULT_STARTER["javascript"])
    setFormNotes("")
    setShowForm(true)
  }

  const openEditForm = (q: InterviewQuestion) => {
    setEditingQuestion(q)
    setFormTitle(q.title)
    setFormDescription(q.description)
    setFormLanguage(q.language)
    setFormDifficulty(q.difficulty)
    setFormTags(q.tags.join(", "))
    setFormStarterCode(q.starterCode)
    setFormNotes(q.notes || "")
    setShowForm(true)
  }

  const handleFormLanguageChange = (lang: Language) => {
    setFormLanguage(lang)
    if (!editingQuestion) setFormStarterCode(DEFAULT_STARTER[lang])
  }

  const handleSave = async () => {
    if (!formTitle.trim() || !formDescription.trim()) {
      showMessage("Title and description are required.", "error")
      return
    }
    setIsSaving(true)
    try {
      const payload = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        language: formLanguage,
        difficulty: formDifficulty,
        tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
        starterCode: formStarterCode,
        notes: formNotes,
      }
      const url = editingQuestion
        ? `/api/protected/interview-questions/${editingQuestion.id}`
        : "/api/protected/interview-questions"
      const res = await fetch(url, {
        method: editingQuestion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showMessage(editingQuestion ? "Question updated." : "Question created.")
      setShowForm(false)
      await fetchQuestions()
    } catch (err) {
      showMessage(err instanceof Error ? err.message : "Failed to save", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/protected/interview-questions/${deletingId}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      showMessage("Question deleted.")
      await fetchQuestions()
    } catch (err) {
      showMessage(err instanceof Error ? err.message : "Failed to delete", "error")
    } finally {
      setDeletingId(null)
    }
  }

  const filteredQuestions = questions.filter((q) => {
    if (filterLanguage !== "all" && q.language !== filterLanguage) return false
    if (filterDifficulty !== "all" && q.difficulty !== filterDifficulty) return false
    if (
      searchQuery &&
      !q.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
      return false
    return true
  })

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <Code2 className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold">Interview Helper</h1>
            <p className="text-xs text-muted-foreground">Private coding question bank</p>
          </div>
        </div>
        <Button onClick={openCreateForm} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Question
        </Button>
      </div>

      {/* Message banner */}
      {message && (
        <div className={`flex items-center justify-between px-6 py-2 text-sm shrink-0 ${
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

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-muted/20 shrink-0 flex-wrap">
        <Input
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 text-sm w-56"
        />
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="h-8 text-xs rounded-md border border-input bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Languages</option>
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="h-8 text-xs rounded-md border border-input bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <span className="text-xs text-muted-foreground ml-auto">
          {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Question grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
            <BookOpen className="h-10 w-10 opacity-40" />
            <div className="text-center">
              <p className="font-medium">No questions found</p>
              <p className="text-sm">Create your first question to get started</p>
            </div>
            <Button variant="outline" onClick={openCreateForm} className="gap-2 mt-2">
              <Plus className="h-4 w-4" />
              New Question
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="group relative border rounded-xl p-4 bg-card hover:shadow-md transition-all flex flex-col gap-3"
              >
                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditForm(q)}
                    className="p-1.5 rounded hover:bg-muted"
                    title="Edit"
                  >
                    <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setDeletingId(q.id)}
                    className="p-1.5 rounded hover:bg-muted"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>

                <h3 className="text-sm font-semibold leading-tight pr-14 line-clamp-2">{q.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{q.description}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${LANGUAGE_COLORS[q.language]}`}>
                    {q.language}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${DIFFICULTY_COLORS[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                  {q.savedCode && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded border font-medium bg-green-500/15 text-green-600 border-green-500/30 flex items-center gap-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      answered
                    </span>
                  )}
                </div>

                {/* Tags */}
                {q.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {q.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Tag className="h-2.5 w-2.5" />
                        {t}
                      </span>
                    ))}
                    {q.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">+{q.tags.length - 3}</span>
                    )}
                  </div>
                )}

                <Link
                  href={`/admin/interview-helper/${q.id}`}
                  className="flex items-center justify-center gap-2 w-full mt-auto py-1.5 rounded-lg border text-xs font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  Open in Editor
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Form Slide-over */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-lg bg-background border-l shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingQuestion ? "Edit Question" : "New Question"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="q-title">Title *</Label>
                <Input
                  id="q-title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Reverse a String"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-desc">Description *</Label>
                <Textarea
                  id="q-desc"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Problem statement, constraints, examples…"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Language *</Label>
                  <select
                    value={formLanguage}
                    onChange={(e) => handleFormLanguageChange(e.target.value as Language)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Difficulty</Label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-tags">Tags (comma separated)</Label>
                <Input
                  id="q-tags"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="e.g. arrays, recursion, dynamic-programming"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Starter Code</Label>
                <div className="h-52 border rounded overflow-hidden">
                  <MonacoEditor
                    height="100%"
                    language={formLanguage}
                    value={formStarterCode}
                    onChange={(val) => setFormStarterCode(val || "")}
                    theme="vs-dark"
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      tabSize: 2,
                      wordWrap: "on",
                      automaticLayout: true,
                      padding: { top: 8 },
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-notes">Notes (optional)</Label>
                <Textarea
                  id="q-notes"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Hints, edge cases, approach ideas…"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingQuestion ? "Save Changes" : "Create Question"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeletingId(null)} />
          <div className="relative z-10 w-full max-w-sm mx-4 bg-background rounded-lg border shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Question</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. The question will be permanently removed from your interview bank.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
              <Button
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
