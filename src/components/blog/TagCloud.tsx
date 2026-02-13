import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

interface TagCloudProps {
  tags: { name: string; count: number }[]
}

export function TagCloud({ tags }: TagCloudProps) {
  const maxCount = Math.max(...tags.map((t) => t.count), 1)

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const scale = 0.8 + (tag.count / maxCount) * 0.4
        return (
          <Link
            key={tag.name}
            to={`/categories?tag=${encodeURIComponent(tag.name)}`}
          >
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400 transition-all"
              style={{ fontSize: `${scale * 0.75}rem` }}
            >
              #{tag.name}
            </Badge>
          </Link>
        )
      })}
    </div>
  )
}
