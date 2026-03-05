import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PostCard } from "./PostCard"
import type { PostMeta } from "../../types/blog"
import { paginatePosts } from "../../lib/posts"

interface PostListProps {
  posts: PostMeta[]
  perPage?: number
}

export function PostList({ posts, perPage = 5 }: PostListProps) {
  const [page, setPage] = useState(1)
  const { posts: paged, totalPages, currentPage } = paginatePosts(posts, page, perPage)

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 glass-panel">
        <div className="w-16 h-16 rounded-full bg-anime-gold/10 border border-anime-gold/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-anime-gold">?</span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">暂无文章</h3>
        <p className="text-sm text-muted-foreground">敬请期待</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {paged.map((post, i) => (
        <PostCard key={post.slug} post={post} index={i} />
      ))}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="flex items-center gap-1 px-3 py-2 text-xs rounded-lg glass-panel text-muted-foreground hover:text-anime-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
            <ChevronLeft className="w-3 h-3" />上一页
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 text-xs rounded-lg transition-all cursor-pointer ${p === currentPage ? "bg-anime-gold/20 border border-anime-gold/50 text-anime-gold shadow-glow-gold" : "glass-panel text-muted-foreground hover:text-anime-gold"}`}>{p}</button>
            ))}
          </div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="flex items-center gap-1 px-3 py-2 text-xs rounded-lg glass-panel text-muted-foreground hover:text-anime-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
            下一页<ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}
