import { Link } from "react-router-dom"
import { Calendar, Clock } from "lucide-react"
import type { PostMeta } from "@/types/blog"
import { formatDate } from "@/lib/utils"

interface RelatedPostsProps {
  posts: PostMeta[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        相关文章推荐
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/posts/${post.slug}`}
            className="group block p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all"
          >
            {post.cover && (
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
                loading="lazy"
              />
            )}
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
              {post.title}
            </h4>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} 分钟
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
