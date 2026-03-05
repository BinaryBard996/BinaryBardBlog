import { Link } from "react-router-dom"
import { Badge } from "../../components/ui/badge"

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
              className="cursor-pointer border-border text-muted-foreground hover:bg-anime-gold/10 hover:border-anime-gold/30 hover:text-anime-gold transition-all duration-300"
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
