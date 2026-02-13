import { Link } from "react-router-dom"
import { Rss, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
      <Card className="border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            文章分类
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Link
            to="/categories"
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              !currentCategory
                ? "bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-medium"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span>全部</span>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
              {categories.reduce((a, c) => a + c.count, 0)}
            </span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/categories?cat=${encodeURIComponent(cat.name)}`}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                currentCategory === cat.name
                  ? "bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-medium"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {cat.count}
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">标签云</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag.name} to={`/categories?tag=${encodeURIComponent(tag.name)}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {tag.name} ({tag.count})
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card className="border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">最新文章</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentPosts.slice(0, 4).map((post) => (
            <Link
              key={post.slug}
              to={`/posts/${post.slug}`}
              className="block group"
            >
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                {post.title}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {formatDate(post.date)}
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* RSS */}
      <Card className="border-orange-200/70 dark:border-orange-900/30 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 shadow-sm">
        <CardContent className="pt-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mx-auto">
            <Rss className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              订阅更新
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              通过 RSS 获取最新文章推送
            </p>
          </div>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Rss className="w-3.5 h-3.5" />
            订阅 RSS
          </a>
        </CardContent>
      </Card>
    </aside>
  )
}
