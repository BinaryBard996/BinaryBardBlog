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
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          !activeCategory
            ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        全部
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.name}
          to={`/categories?cat=${encodeURIComponent(cat.name)}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === cat.name
              ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {cat.name}
          <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
        </Link>
      ))}
    </div>
  )
}
