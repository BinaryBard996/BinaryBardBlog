import { Link } from "react-router-dom"
import { Calendar, Clock } from "lucide-react"
import type { PostMeta } from "../../types/blog"
import { formatDate } from "../../lib/utils"

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 bg-gradient-to-b from-anime-sky to-anime-lavender rounded-full" />
        <h3 className="text-xl font-bold text-foreground font-serif">相关文章推荐</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link key={post.slug} to={`/posts/${post.slug}`} className="group block p-4 glass-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
            {post.cover && (
              <img src={post.cover.startsWith("/") ? `${import.meta.env.BASE_URL.replace(/\/$/, "")}${post.cover}` : post.cover} alt={post.title} className="w-full h-32 object-cover mb-3 rounded-lg border border-border" loading="lazy" />
            )}
            <h4 className="text-sm font-bold text-foreground group-hover:text-anime-gold transition-colors line-clamp-2">{post.title}</h4>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-anime-gold/60" />{formatDate(post.date)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-anime-gold/60" />{post.readingTime} min</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
