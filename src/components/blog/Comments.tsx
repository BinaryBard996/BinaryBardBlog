import { useEffect, useRef } from "react"

interface CommentsProps {
  slug: string
}

export function Comments({ slug }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const isDark = document.documentElement.classList.contains("dark")

    // Clear previous giscus instance
    containerRef.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", "BinaryBard996/BinaryBardBlog")
    script.setAttribute("data-repo-id", "YOUR_REPO_ID")
    script.setAttribute("data-category", "Announcements")
    script.setAttribute("data-category-id", "YOUR_CATEGORY_ID")
    script.setAttribute("data-mapping", "pathname")
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "top")
    script.setAttribute("data-theme", isDark ? "dark_dimmed" : "light")
    script.setAttribute("data-lang", "zh-CN")
    script.setAttribute("data-loading", "lazy")
    script.crossOrigin = "anonymous"
    script.async = true

    containerRef.current.appendChild(script)
  }, [slug])

  // Listen theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
      if (iframe) {
        const isDark = document.documentElement.classList.contains("dark")
        iframe.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: isDark ? "dark_dimmed" : "light" } } },
          "https://giscus.app"
        )
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        评论区
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        评论系统基于 GitHub Discussions，请先登录 GitHub 账号。
        如需配置，请参考{" "}
        <a
          href="https://giscus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-500 hover:text-brand-600 underline"
        >
          Giscus 官网
        </a>
        {" "}获取你的仓库 ID 和分类 ID，然后更新 Comments.tsx 中的配置。
      </p>
      <div ref={containerRef} />
    </div>
  )
}
