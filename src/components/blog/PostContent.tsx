import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import { CodeBlock } from "./CodeBlock"
import { GitHubRepoCard } from "./GitHubRepoCard"
import "highlight.js/styles/atom-one-dark.css"

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          pre({ children, ...props }) {
            // children is the <code> element rendered by rehype-highlight
            const codeElement = children as React.ReactElement
            if (
              codeElement &&
              typeof codeElement === "object" &&
              "props" in codeElement
            ) {
              const codeProps = codeElement.props as {
                className?: string
                children?: React.ReactNode
              }
              const className = codeProps.className || ""
              return (
                <CodeBlock className={className}>
                  {codeProps.children}
                </CodeBlock>
              )
            }
            return <pre {...props}>{children}</pre>
          },
          code({ className, children, ...props }) {
            // Only handle inline code here; block code is handled by `pre` above
            if (className) {
              // This is inside a <pre> — let rehype-highlight output pass through
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className="bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                {children}
              </code>
            )
          },
          a({ href, children, ...props }) {
            // Detect github-card pattern: [github-card:owner/repo](url)
            const childText = typeof children === "string" ? children : ""
            const githubCardMatch = childText.match(/^github-card:(.+?)\/(.+)$/)
            if (githubCardMatch && href) {
              return (
                <GitHubRepoCard
                  owner={githubCardMatch[1]}
                  repo={githubCardMatch[2]}
                  href={href}
                />
              )
            }
            const isExternal = href?.startsWith("http")
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-brand-600 dark:text-brand-400 underline underline-offset-2 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                {...props}
              >
                {children}
              </a>
            )
          },
          img({ src, alt, ...props }) {
            const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')
            const resolvedSrc = src && src.startsWith('/') ? `${baseUrl}${src}` : src
            return (
              <figure className="my-6">
                <img
                  src={resolvedSrc}
                  alt={alt}
                  className="rounded-xl shadow-lg mx-auto"
                  loading="lazy"
                  {...props}
                />
                {alt && (
                  <figcaption className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {alt}
                  </figcaption>
                )}
              </figure>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
