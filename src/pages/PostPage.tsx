import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PostContent } from "@/components/blog/PostContent"
import { TableOfContents } from "@/components/blog/TableOfContents"
import { RelatedPosts } from "@/components/blog/RelatedPosts"
import { Comments } from "@/components/blog/Comments"
import { extractTOC } from "@/lib/toc"
import { getRelatedPosts } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/types/blog"
import allPosts from "virtual:blog-posts"

export function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)

    import(/* @vite-ignore */ `virtual:blog-post:${slug}`)
      .then((mod) => {
        setPost(mod.default)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load post:", err)
        setIsLoading(false)
      })

    window.scrollTo(0, 0)
  }, [slug])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded mt-8" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          文章未找到
        </h1>
        <Link to="/">
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </Link>
      </div>
    )
  }

  const tocItems = extractTOC(post.content)
  const relatedPosts = getRelatedPosts(allPosts, post)

  return (
    <article>
      {/* Post Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border-0">
              {post.category}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} 分钟阅读
            </span>
            {post.tags.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {post.tags.join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content + TOC */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-10">
          <div className="flex-1 min-w-0 max-w-4xl">
            <PostContent content={post.content} />
            <Comments slug={post.slug} />
            <RelatedPosts posts={relatedPosts} />
          </div>
          {tocItems.length > 2 && (
            <div className="hidden xl:block w-56 flex-shrink-0">
              <div className="sticky top-20">
                <TableOfContents items={tocItems} />
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
