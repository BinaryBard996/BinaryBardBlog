import { useScrollSpy } from "@/hooks/useScrollSpy"
import type { TOCItem } from "@/types/blog"

interface TableOfContentsProps {
  items: TOCItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const ids = items.map((item) => item.id)
  const activeId = useScrollSpy(ids)

  if (items.length === 0) return null

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav className="space-y-1">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-wider">
        目录
      </h3>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`block w-full text-left text-sm py-1 transition-all border-l-2 cursor-pointer ${
            item.level === 2 ? "pl-3" : item.level === 3 ? "pl-6" : "pl-9"
          } ${
            activeId === item.id
              ? "border-brand-500 text-brand-600 dark:text-brand-400 font-medium"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
        >
          {item.text}
        </button>
      ))}
    </nav>
  )
}
