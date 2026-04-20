import { useState, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import { CodeBlock } from "./CodeBlock"
import { MermaidBlock } from "./MermaidBlock"
import { GitHubRepoCard } from "./GitHubRepoCard"
import { ImageLightbox } from "../common/ImageLightbox"
import "highlight.js/styles/atom-one-dark.css"

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  const [lbSrc, setLbSrc] = useState<string | null>(null)
  const [lbAlt, setLbAlt] = useState("")

  const openLightbox = useCallback((src: string, alt: string) => {
    setLbSrc(src)
    setLbAlt(alt)
  }, [])

  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          pre({ children, ...props }) {
            const el = children as React.ReactElement
            if (el && typeof el === "object" && "props" in el) {
              const cp = el.props as { className?: string; children?: React.ReactNode }
              const isMermaid = cp.className?.includes("language-mermaid")
              if (isMermaid) {
                const code = typeof cp.children === "string" ? cp.children : ""
                return <MermaidBlock code={code} />
              }
              return <CodeBlock className={cp.className || ""}>{cp.children}</CodeBlock>
            }
            return <pre {...props}>{children}</pre>
          },
          code({ className, children, ...props }) {
            if (className) return <code className={className} {...props}>{children}</code>
            return <code {...props}>{children}</code>
          },
          a({ href, children, ...props }) {
            const text = typeof children === "string" ? children : ""
            const m = text.match(/^github-card:(.+?)\/(.+)$/)
            if (m && href) return <GitHubRepoCard owner={m[1]} repo={m[2]} href={href} />
            const ext = href?.startsWith("http")
            return <a href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined} {...props}>{children}</a>
          },
          img({ src, alt, ...props }) {
            const base = import.meta.env.BASE_URL.replace(/\/$/, "")
            const resolved = src && src.startsWith("/") ? `${base}${src}` : src
            return (
              <figure className="my-6">
                <img src={resolved} alt={alt} className="rounded-xl shadow-lg mx-auto cursor-pointer hover:scale-[1.02] transition-transform" loading="lazy" onClick={() => resolved && openLightbox(resolved, alt || "")} {...props} />
                {alt && <figcaption className="text-center text-sm text-muted-foreground mt-2">{alt}</figcaption>}
              </figure>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
      <ImageLightbox src={lbSrc} alt={lbAlt} onClose={() => setLbSrc(null)} />
    </div>
  )
}
