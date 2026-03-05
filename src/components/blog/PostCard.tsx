import { Link } from "react-router-dom"
import { Calendar, Clock, ArrowRight } from "lucide-react"
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
      <article className="relative flex flex-col sm:flex-row gap-4 p-4 anime-panel anime-card overflow-hidden">
        {/* Cover Image */}
        {post.cover && (
          <div className="sm:w-52 sm:h-36 flex-shrink-0 overflow-hidden rounded-lg border border-anime-gold/10">
            <img
              src={post.cover?.startsWith('/') ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${post.cover}` : post.cover}
              alt={post.title}
              className="w-full h-44 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs tracking-wider text-anime-sky bg-anime-sky/10 border border-anime-sky/20 rounded-full">
                {post.category}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#e8e4dc] group-hover:text-anime-gold transition-colors line-clamp-2 mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-[#6b6773] line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-[#6b6773]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-anime-gold/60" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-anime-gold/60" />
                {post.readingTime} min
              </span>
            </div>
            <span className="text-xs text-anime-gold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              阅读全文 <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
