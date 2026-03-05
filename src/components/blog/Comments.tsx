import { useEffect, useRef } from "react"

interface CommentsProps {
  slug: string
}

const GISCUS_REPO = "BinaryBard996/BinaryBardBlog"
const GISCUS_REPO_ID = ""  // TODO: 前往 https://giscus.app 获取
const GISCUS_CATEGORY = "Announcements"
const GISCUS_CATEGORY_ID = ""  // TODO: 前往 https://giscus.app 获取

const isGiscusConfigured = GISCUS_REPO_ID !== "" && GISCUS_CATEGORY_ID !== ""

export function Comments({ slug }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !isGiscusConfigured) return

    const isDark = document.documentElement.classList.contains("dark")

    containerRef.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", GISCUS_REPO)
    script.setAttribute("data-repo-id", GISCUS_REPO_ID)
    script.setAttribute("data-category", GISCUS_CATEGORY)
    script.setAttribute("data-category-id", GISCUS_CATEGORY_ID)
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

  useEffect(() => {
    if (!isGiscusConfigured) return

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
    <div className="mt-12 pt-8 border-t border-anime-gold/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 bg-gradient-to-b from-anime-lavender to-anime-sky rounded-full" />
        <h3 className="text-xl font-bold text-[#e8e4dc] font-serif">评论区</h3>
      </div>
      {!isGiscusConfigured ? (
        <div className="text-sm text-[#9b97a0] anime-panel p-4">
          <p>
            评论系统尚未配置。请前往{" "}
            <a
              href="https://giscus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-anime-sky hover:text-anime-gold underline"
            >
              Giscus 官网
            </a>
            {" "}获取仓库 ID 和分类 ID，然后更新{" "}
            <code className="bg-anime-dark-mid px-1 py-0.5 rounded text-xs text-anime-gold-light">
              src/components/blog/Comments.tsx
            </code>
            {" "}中的配置。
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-[#6b6773] mb-4">
            评论系统基于 GitHub Discussions，请先登录 GitHub 账号。
          </p>
          <div ref={containerRef} />
        </>
      )}
    </div>
  )
}
