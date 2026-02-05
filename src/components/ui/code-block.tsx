"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import { useMemo } from "react"

/** Allowed languages to prevent injection via language prop */
const ALLOWED_LANGUAGES = new Set(["javascript", "bash", "json", "text", "js"])

type CodeBlockProps = {
  code: string
  language: string
  className?: string
}

/**
 * Renders code with syntax highlighting. XSS-safe: code is passed as React
 * children and rendered as text by the highlighter (createElement with text
 * nodes), never as raw HTML.
 */
export function CodeBlock({ code, language, className = "" }: CodeBlockProps) {
  const { resolvedTheme } = useTheme()
  const style = useMemo(
    () => (resolvedTheme === "dark" ? oneDark : oneLight),
    [resolvedTheme]
  )

  // Defense in depth: ensure code is always a string (no object/ReactNode injection)
  const safeCode = typeof code === "string" ? code : String(code ?? "")
  // Restrict language to whitelist to avoid any parser edge cases
  const safeLanguage = ALLOWED_LANGUAGES.has(language) ? language : "text"

  return (
    <SyntaxHighlighter
      language={safeLanguage}
      style={style}
      customStyle={{
        margin: 0,
        padding: "1rem",
        borderRadius: "0.375rem",
        fontSize: "0.875rem",
        lineHeight: 1.5,
        overflow: "auto",
      }}
      codeTagProps={{
        style: { fontFamily: "var(--font-mono), ui-monospace, monospace" },
      }}
      showLineNumbers={false}
      wrapLongLines
      PreTag="div"
      className={className}
    >
      {safeCode}
    </SyntaxHighlighter>
  )
}
