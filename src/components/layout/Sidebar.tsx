import { Link } from "react-router-dom"
import { Rss, TrendingUp, Tag, BookOpen } from "lucide-react"
import type { PostMeta, Category } from "../../types/blog"
import { formatDate } from "../../lib/utils"

interface SidebarProps {
  categories: Category[]
  tags: { name: string; count: number }[]
  recentPosts: PostMeta[]
  currentCategory?: string
}

export function Sidebar({ categories, tags, recentPosts, currentCategory }: SidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="glass-panel p-5 diamond-corner">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-anime-gold" />
          <h3 className="text-sm font-semibold text-anime-gold tracking-wider">分类</h3>
        </div>
        <div className="space-y-1">
          <Link to="/archives" className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all ${!currentCategory ? "text-anime-gold bg-anime-gold/10 border-l-2 border-anime-gold" : "text-muted-foreground hover:text-anime-gold-light border-l-2 border-transparent hover:bg-secondary/40"}`}>
            <span>全部</span>
            <span className="text-xs text-muted-foreground">{categories.reduce((a, c) => a + c.count, 0)}</span>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.name} to={`/archives?cat=${encodeURIComponent(cat.name)}`}
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all ${currentCategory === cat.name ? "text-anime-gold bg-anime-gold/10 border-l-2 border-anime-gold" : "text-muted-foreground hover:text-anime-gold-light border-l-2 border-transparent hover:bg-secondary/40"}`}>
              <span>{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-anime-sky" />
          <h3 className="text-sm font-semibold text-anime-sky tracking-wider">标签</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag.name} to={`/archives?tag=${encodeURIComponent(tag.name)}`}>
              <span className="inline-flex items-center px-2.5 py-1 text-xs text-muted-foreground rounded-full bg-secondary/60 border border-border hover:text-anime-gold hover:border-anime-gold/30 transition-all cursor-pointer">
                #{tag.name}<span className="ml-1 opacity-50">({tag.count})</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-anime-lavender" />
          <h3 className="text-sm font-semibold text-anime-lavender tracking-wider">最近文章</h3>
        </div>
        <div className="space-y-3">
          {recentPosts.slice(0, 4).map((post) => (
            <Link key={post.slug} to={`/posts/${post.slug}`} className="block group">
              <p className="text-sm text-foreground/80 group-hover:text-anime-gold transition-colors line-clamp-2">{post.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(post.date)}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5 text-center border-anime-gold/15">
        <div className="w-12 h-12 rounded-full bg-anime-gold/10 border border-anime-gold/20 flex items-center justify-center mx-auto mb-3">
          <Rss className="w-5 h-5 text-anime-gold" />
        </div>
        <h3 className="text-sm font-semibold text-anime-gold tracking-wider mb-2">订阅</h3>
        <p className="text-xs text-muted-foreground mb-3">通过 RSS 获取最新文章</p>
        <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-anime-gold/10 border border-anime-gold/25 hover:bg-anime-gold/20 text-anime-gold text-sm font-medium transition-colors cursor-pointer shimmer-btn">
          <Rss className="w-3.5 h-3.5" />订阅 RSS
        </a>
      </div>
    </aside>
  )
}
