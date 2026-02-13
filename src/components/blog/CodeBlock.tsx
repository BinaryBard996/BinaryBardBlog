import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  children: string
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const language = className?.replace("language-", "") || "text"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  return (
    <div className="relative group rounded-xl overflow-hidden my-4">
      {/* Language tag + Copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700/50">
        <span className="text-xs text-slate-400 font-mono uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      {/* Code content rendered by react-markdown + rehype-highlight */}
      <pre className={className}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}
