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
    <nav className="anime-panel p-4">
      <h3 className="text-sm font-semibold text-anime-gold mb-3 tracking-wider">
        目录
      </h3>
      <div className="space-y-0.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`block w-full text-left text-sm py-1.5 transition-all border-l-2 cursor-pointer ${
              item.level === 2 ? "pl-3" : item.level === 3 ? "pl-6" : "pl-9"
            } ${
              activeId === item.id
                ? "border-anime-gold text-anime-gold font-medium"
                : "border-transparent text-[#6b6773] hover:text-[#c8c4bc] hover:border-anime-gold/20"
            }`}
          >
            {item.text}
          </button>
        ))}
      </div>
    </nav>
  )
}
