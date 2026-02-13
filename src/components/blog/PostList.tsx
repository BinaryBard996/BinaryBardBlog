import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostCard } from "./PostCard"
import type { PostMeta } from "@/types/blog"
import { paginatePosts } from "@/lib/posts"

interface PostListProps {
  posts: PostMeta[]
  perPage?: number
}

export function PostList({ posts, perPage = 5 }: PostListProps) {
  const [page, setPage] = useState(1)
  const { posts: pagedPosts, totalPages, currentPage } = paginatePosts(posts, page, perPage)

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          暂无文章
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          敬请期待，精彩内容即将发布
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pagedPosts.map((post, index) => (
        <PostCard key={post.slug} post={post} index={index} />
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一页
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === currentPage ? "default" : "ghost"}
                size="sm"
                onClick={() => setPage(p)}
                className="w-8 h-8 p-0 cursor-pointer"
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            下一页
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
