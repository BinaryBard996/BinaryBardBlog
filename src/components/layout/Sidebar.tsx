import { Link } from "react-router-dom"
import { Rss, TrendingUp, Tag, BookOpen } from "lucide-react"
import type { PostMeta, Category } from "@/types/blog"
import { formatDate } from "@/lib/utils"

interface SidebarProps {
  categories: Category[]
  tags: { name: string; count: number }[]
  recentPosts: PostMeta[]
  currentCategory?: string
}

export function Sidebar({ categories, tags, recentPosts, currentCategory }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="anime-panel p-5 diamond-corner">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-anime-gold" />
          <h3 className="text-sm font-semibold text-anime-gold tracking-wider">分类</h3>
        </div>
        <div className="space-y-1">
          <Link
            to="/categories"
            className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all ${
              !currentCategory
                ? "text-anime-gold bg-anime-gold/10 border-l-2 border-anime-gold"
                : "text-[#9b97a0] hover:text-anime-gold-light hover:bg-anime-panel-light/50 border-l-2 border-transparent"
            }`}
          >
            <span>全部</span>
            <span className="text-xs text-[#6b6773]">
              {categories.reduce((a, c) => a + c.count, 0)}
            </span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/categories?cat=${encodeURIComponent(cat.name)}`}
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all ${
                currentCategory === cat.name
                  ? "text-anime-gold bg-anime-gold/10 border-l-2 border-anime-gold"
                  : "text-[#9b97a0] hover:text-anime-gold-light hover:bg-anime-panel-light/50 border-l-2 border-transparent"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-[#6b6773]">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="anime-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-anime-sky" />
          <h3 className="text-sm font-semibold text-anime-sky tracking-wider">标签</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag.name} to={`/categories?tag=${encodeURIComponent(tag.name)}`}>
              <span className="inline-flex items-center px-2.5 py-1 text-xs text-[#9b97a0] rounded-full bg-anime-dark-mid/80 border border-anime-gold/10 hover:text-anime-gold hover:border-anime-gold/30 transition-all cursor-pointer">
                #{tag.name}
                <span className="ml-1 text-[#6b6773]">({tag.count})</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="anime-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-anime-lavender" />
          <h3 className="text-sm font-semibold text-anime-lavender tracking-wider">最近文章</h3>
        </div>
        <div className="space-y-3">
          {recentPosts.slice(0, 4).map((post) => (
            <Link
              key={post.slug}
              to={`/posts/${post.slug}`}
              className="block group"
            >
              <p className="text-sm text-[#c8c4bc] group-hover:text-anime-gold transition-colors line-clamp-2">
                {post.title}
              </p>
              <p className="text-xs text-[#6b6773] mt-1">
                {formatDate(post.date)}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* RSS */}
      <div className="anime-panel p-5 text-center bg-gradient-to-br from-anime-gold/5 to-anime-gold-dark/5 border-anime-gold/20">
        <div className="w-12 h-12 rounded-full bg-anime-gold/10 border border-anime-gold/20 flex items-center justify-center mx-auto mb-3">
          <Rss className="w-5 h-5 text-anime-gold" />
        </div>
        <h3 className="text-sm font-semibold text-anime-gold tracking-wider mb-2">
          订阅
        </h3>
        <p className="text-xs text-[#6b6773] mb-3">
          通过 RSS 获取最新文章推送
        </p>
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-anime-gold/10 border border-anime-gold/30 hover:bg-anime-gold/20 text-anime-gold text-sm font-medium transition-colors cursor-pointer shimmer-btn"
        >
          <Rss className="w-3.5 h-3.5" />
          订阅 RSS
        </a>
      </div>
    </aside>
  )
}
