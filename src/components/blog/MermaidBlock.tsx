import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

let mermaidInitialized = false

function initMermaid() {
  if (mermaidInitialized) return
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      darkMode: true,
      background: "#1a1a2e",
      primaryColor: "#4a9eff",
      primaryTextColor: "#fff",
      primaryBorderColor: "#4a9eff",
      lineColor: "#a0a0b0",
      secondaryColor: "#2d2d44",
      tertiaryColor: "#1e1e36",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "14px",
    },
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      padding: 16,
    },
  })
  mermaidInitialized = true
}

let idCounter = 0

export function MermaidBlock({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string>("")
  const idRef = useRef(`mermaid-${Date.now()}-${idCounter++}`)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        initMermaid()
        const { svg: renderedSvg } = await mermaid.render(idRef.current, code.trim())
        if (!cancelled) {
          setSvg(renderedSvg)
          setError("")
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Mermaid 渲染失败")
          setSvg("")
        }
      }
    }

    render()
    return () => { cancelled = true }
  }, [code])

  if (error) {
    return (
      <div className="my-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
        <p className="text-red-400 text-sm mb-2">Mermaid 图表渲染失败</p>
        <pre className="text-xs text-muted-foreground overflow-auto">{code}</pre>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-xl border border-border bg-secondary/30 p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
