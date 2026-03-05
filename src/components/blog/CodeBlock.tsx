import { useState, useEffect, useRef, type ReactNode } from "react"
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react"

const COLLAPSE_THRESHOLD = 15
const COLLAPSED_HEIGHT = 300

interface CodeBlockProps {
  children: ReactNode
  className?: string
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (node == null || typeof node === "boolean") return ""
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (typeof node === "object" && "props" in node) {
    return extractText((node as React.ReactElement).props.children)
  }
  return ""
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [shouldCollapse, setShouldCollapse] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const language = className?.replace(/^.*language-/, "").replace(/\s.*$/, "") || "text"

  useEffect(() => {
    const text = extractText(children)
    const lineCount = text.split("\n").length
    if (lineCount > COLLAPSE_THRESHOLD) {
      setShouldCollapse(true)
      setCollapsed(true)
    }
  }, [children])

  const handleCopy = async () => {
    const text = extractText(children)
    await navigator.clipboard.writeText(text)
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
      {/* Code content already highlighted by rehype-highlight */}
      <div className="relative">
        <pre
          ref={codeRef}
          className="!mt-0 !rounded-t-none transition-[max-height] duration-300 overflow-hidden"
          style={
            shouldCollapse && collapsed
              ? { maxHeight: `${COLLAPSED_HEIGHT}px` }
              : undefined
          }
        >
          <code className={className}>{children}</code>
        </pre>
        {shouldCollapse && collapsed && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0d0d20] to-transparent pointer-events-none" />
        )}
      </div>
      {shouldCollapse && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-800/80 border-t border-slate-700/50 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors cursor-pointer"
        >
          {collapsed ? (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>展开代码</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>收起代码</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
