import { useState, useEffect, useRef, type ReactNode } from "react"
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react"

const COLLAPSE_THRESHOLD = 15
const COLLAPSED_HEIGHT = 300

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (node == null || typeof node === "boolean") return ""
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (typeof node === "object" && "props" in node) return extractText((node as React.ReactElement).props.children)
  return ""
}

export function CodeBlock({ children, className }: { children: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [shouldCollapse, setShouldCollapse] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const lang = className?.replace(/^.*language-/, "").replace(/\s.*$/, "") || "text"

  useEffect(() => {
    const lines = extractText(children).split("\n").length
    if (lines > COLLAPSE_THRESHOLD) { setShouldCollapse(true); setCollapsed(true) }
  }, [children])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(extractText(children))
    setCopied(true)
  }

  useEffect(() => {
    if (copied) { const t = setTimeout(() => setCopied(false), 2000); return () => clearTimeout(t) }
  }, [copied])

  return (
    <div className="relative group rounded-xl overflow-hidden my-4 border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
        <span className="text-xs text-muted-foreground font-mono uppercase">{lang}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
          {copied ? <><Check className="w-3 h-3 text-anime-emerald" /><span className="text-anime-emerald">已复制</span></> : <><Copy className="w-3 h-3" /><span>复制</span></>}
        </button>
      </div>
      <div className="relative">
        <pre ref={codeRef} className="!mt-0 !rounded-t-none transition-[max-height] duration-300 overflow-hidden" style={shouldCollapse && collapsed ? { maxHeight: `${COLLAPSED_HEIGHT}px` } : undefined}>
          <code className={className}>{children}</code>
        </pre>
        {shouldCollapse && collapsed && <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />}
      </div>
      {shouldCollapse && (
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center justify-center gap-1.5 w-full py-2 bg-secondary/80 border-t border-border text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          {collapsed ? <><ChevronDown className="w-3.5 h-3.5" />展开代码</> : <><ChevronUp className="w-3.5 h-3.5" />收起代码</>}
        </button>
      )}
    </div>
  )
}
