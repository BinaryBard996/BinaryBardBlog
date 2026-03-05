import { Link } from "react-router-dom"
import type { Category } from "@/types/blog"

interface CategoryListProps {
  categories: Category[]
  activeCategory?: string
}

export function CategoryList({ categories, activeCategory }: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to="/categories"
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all border ${
          !activeCategory
            ? "bg-anime-gold/15 border-anime-gold/40 text-anime-gold shadow-anime-gold"
            : "anime-panel-light text-[#9b97a0] hover:text-anime-gold hover:border-anime-gold/30"
        }`}
      >
        全部
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.name}
          to={`/categories?cat=${encodeURIComponent(cat.name)}`}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all border ${
            activeCategory === cat.name
              ? "bg-anime-gold/15 border-anime-gold/40 text-anime-gold shadow-anime-gold"
              : "anime-panel-light text-[#9b97a0] hover:text-anime-gold hover:border-anime-gold/30"
          }`}
        >
          {cat.name}
          <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
        </Link>
      ))}
    </div>
  )
}
