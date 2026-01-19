"use client"

// This file is a wrapper to isolate ReactQuill from Next.js build analysis
// It will only be loaded on the client side

let ReactQuill: any = null;

export async function loadReactQuill() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!ReactQuill) {
    const reactQuillModule = await import('react-quill');
    ReactQuill = reactQuillModule.default;
  }
  
  return ReactQuill;
}
