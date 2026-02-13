import { Link } from "react-router-dom"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PostMeta } from "@/types/blog"
import { formatDate } from "@/lib/utils"

interface PostCardProps {
  post: PostMeta
  index?: number
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <Link
      to={`/posts/${post.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <article className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5 transition-all duration-300">
        {/* Cover Image */}
        {post.cover && (
          <div className="sm:w-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-40 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="text-xs bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border-0"
              >
                {post.category}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-1.5">
              {post.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} 分钟
              </span>
            </div>
            <span className="text-xs text-brand-500 dark:text-brand-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              阅读全文 <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
