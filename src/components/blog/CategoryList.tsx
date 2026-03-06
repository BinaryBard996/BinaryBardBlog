import { Link } from "react-router-dom"
import type { Category } from "../../types/blog"

interface CategoryListProps {
  categories: Category[]
  activeCategory?: string
  basePath?: string
}

export function CategoryList({ categories, activeCategory, basePath = "/categories" }: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to={basePath}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 border cursor-pointer ${
          !activeCategory
            ? "bg-anime-gold/15 border-anime-gold/40 text-anime-gold shadow-glow-gold"
            : "bg-secondary/50 border-border text-muted-foreground hover:text-anime-gold hover:border-anime-gold/30"
        }`}
      >
        全部
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.name}
          to={`${basePath}?cat=${encodeURIComponent(cat.name)}`}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 border cursor-pointer ${
            activeCategory === cat.name
              ? "bg-anime-gold/15 border-anime-gold/40 text-anime-gold shadow-glow-gold"
              : "bg-secondary/50 border-border text-muted-foreground hover:text-anime-gold hover:border-anime-gold/30"
          }`}
        >
          {cat.name}
          <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
        </Link>
      ))}
    </div>
  )
}
