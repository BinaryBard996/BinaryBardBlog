import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import { CodeBlock } from "./CodeBlock"
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
          code({ className, children, ...props }) {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <CodeBlock className={className}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            )
          },
          a({ href, children, ...props }) {
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
            return (
              <figure className="my-6">
                <img
                  src={src}
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
