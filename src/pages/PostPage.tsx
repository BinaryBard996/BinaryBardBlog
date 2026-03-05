import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { PostContent } from "../components/blog/PostContent"
import { TableOfContents } from "../components/blog/TableOfContents"
import { RelatedPosts } from "../components/blog/RelatedPosts"
import { Comments } from "../components/blog/Comments"
import { ReadingProgressBar } from "../components/common/ReadingProgressBar"
import { AnimatedPage } from "../components/common/AnimatedPage"
import { extractTOC } from "../lib/toc"
import { getRelatedPosts } from "../lib/posts"
import { formatDate } from "../lib/utils"
import type { BlogPost } from "../types/blog"
import allPosts from "virtual:blog-posts"
import allPostsFull from "virtual:blog-posts-full"

export function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post: BlogPost | null = slug ? allPostsFull[slug] ?? null : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return (
      <AnimatedPage>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="text-6xl text-anime-gold font-bold mb-4">404</div>
          <h1 className="text-2xl font-bold text-foreground mb-4">文章未找到</h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-panel text-anime-gold hover:border-anime-gold/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </AnimatedPage>
    )
  }

  const tocItems = extractTOC(post.content)
  const relatedPosts = getRelatedPosts(allPosts, post)

  return (
    <AnimatedPage>
      <ReadingProgressBar />
      <article>
        {/* Post Header */}
        <div className="relative bg-card border-b border-border overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-anime-gold/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-anime-sky/5 rounded-full blur-[60px]" />
          </div>

          <motion.div
            className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-anime-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="tracking-wider">返回</span>
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 text-xs tracking-wider text-anime-sky bg-anime-sky/10 border border-anime-sky/20 rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground leading-tight mb-4 font-heading">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-anime-gold/60" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-anime-gold/60" />
                {post.readingTime} 分钟阅读
              </span>
              {post.tags.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-anime-gold/60" />
                  {post.tags.join(" · ")}
                </span>
              )}
            </div>
          </motion.div>
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
    </AnimatedPage>
  )
}
