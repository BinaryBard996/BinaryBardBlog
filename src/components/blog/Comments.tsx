import { useEffect, useRef } from "react"

const GISCUS_REPO = "BinaryBard996/BinaryBardBlog"
const GISCUS_REPO_ID = "R_kgDORPtmGQ"
const GISCUS_CATEGORY = "Announcements"
const GISCUS_CATEGORY_ID = "DIC_kwDORPtmGc4C-jMd"
const isConfigured = GISCUS_REPO_ID !== "" && GISCUS_CATEGORY_ID !== ""

export function Comments({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !isConfigured) return
    ref.current.innerHTML = ""
    const s = document.createElement("script")
    s.src = "https://giscus.app/client.js"
    s.setAttribute("data-repo", GISCUS_REPO)
    s.setAttribute("data-repo-id", GISCUS_REPO_ID)
    s.setAttribute("data-category", GISCUS_CATEGORY)
    s.setAttribute("data-category-id", GISCUS_CATEGORY_ID)
    s.setAttribute("data-mapping", "pathname")
    s.setAttribute("data-strict", "0")
    s.setAttribute("data-reactions-enabled", "1")
    s.setAttribute("data-emit-metadata", "0")
    s.setAttribute("data-input-position", "bottom")
    s.setAttribute("data-theme", document.documentElement.classList.contains("dark") ? "dark_dimmed" : "light")
    s.setAttribute("data-lang", "zh-CN")
    s.setAttribute("data-loading", "lazy")
    s.crossOrigin = "anonymous"
    s.async = true
    ref.current.appendChild(s)
  }, [slug])

  useEffect(() => {
    if (!isConfigured) return
    const obs = new MutationObserver(() => {
      const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
      if (iframe) {
        iframe.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: document.documentElement.classList.contains("dark") ? "dark_dimmed" : "light" } } },
          "https://giscus.app"
        )
      }
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 bg-gradient-to-b from-anime-lavender to-anime-sky rounded-full" />
        <h3 className="text-xl font-bold text-foreground font-serif">评论区</h3>
      </div>
      {!isConfigured ? (
        <div className="text-sm text-muted-foreground glass-panel p-4">
          评论系统尚未配置。请前往{" "}
          <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-anime-sky hover:text-anime-gold underline">Giscus</a>
          {" "}获取配置后更新 <code className="text-anime-gold-light text-xs">Comments.tsx</code>。
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">基于 GitHub Discussions，请先登录 GitHub。</p>
          <div ref={ref} />
        </>
      )}
    </div>
  )
}
