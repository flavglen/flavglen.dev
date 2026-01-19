"use client"

import { useEffect, useState } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [ReactQuill, setReactQuill] = useState<any>(null)

  useEffect(() => {
    // Only load ReactQuill on client side after mount
    if (typeof window !== 'undefined') {
      // Load ReactQuill dynamically
      import('react-quill').then((module) => {
        setReactQuill(() => module.default)
        setMounted(true)
      }).catch((err) => {
        console.error('Failed to load ReactQuill:', err)
      })
      
      // Load Quill CSS dynamically
      if (!document.querySelector('link[href*="quill.snow.css"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
        document.head.appendChild(link)
      }
    }
  }, [])

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  }

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image',
    'blockquote', 'code-block'
  ]

  if (!mounted || !ReactQuill) {
    return <div className="min-h-[300px] flex items-center justify-center">Loading editor...</div>
  }

  const QuillComponent = ReactQuill

  return (
    <QuillComponent
      theme="snow"
      value={value}
      onChange={onChange}
      modules={quillModules}
      formats={quillFormats}
      placeholder={placeholder}
      className="bg-background"
    />
  )
}
