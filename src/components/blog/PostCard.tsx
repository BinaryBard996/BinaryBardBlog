import { Link } from "react-router-dom"
import { Calendar, Clock, ArrowRight, Pin } from "lucide-react"
import { motion } from "framer-motion"
import type { PostMeta } from "../../types/blog"
import { formatDate } from "../../lib/utils"

interface PostCardProps {
  post: PostMeta
  index?: number
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/posts/${post.slug}`} className="group block">
        <article className="relative flex flex-col sm:flex-row gap-4 p-4 glass-panel overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
          {post.pinned && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-anime-gold/15 border border-anime-gold/30 text-anime-gold text-xs font-medium">
              <Pin className="w-3 h-3" />置顶
            </div>
          )}
          {post.cover && (
            <div className="sm:w-52 sm:h-36 flex-shrink-0 overflow-hidden rounded-lg border border-border">
              <img
                src={post.cover.startsWith("/") ? `${import.meta.env.BASE_URL.replace(/\/$/, "")}${post.cover}` : post.cover}
                alt={post.title}
                className="w-full h-44 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs tracking-wider text-anime-sky bg-anime-sky/10 border border-anime-sky/20 rounded-full">{post.category}</span>
              </div>
              <h2 className="text-lg font-bold text-foreground group-hover:text-anime-gold transition-colors line-clamp-2 mb-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.description}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-anime-gold/60" />{formatDate(post.date)}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-anime-gold/60" />{post.readingTime} min</span>
              </div>
              <span className="text-xs text-anime-gold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                阅读全文 <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
