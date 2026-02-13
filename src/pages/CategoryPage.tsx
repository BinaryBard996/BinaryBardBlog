import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { FolderOpen } from "lucide-react"
import { PostList } from "@/components/blog/PostList"
import { CategoryList } from "@/components/blog/CategoryList"
import { Sidebar } from "@/components/layout/Sidebar"
import { getCategories, getAllTags, filterByCategory, filterByTag } from "@/lib/posts"
import posts from "virtual:blog-posts"

export function CategoryPage() {
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get("cat") || undefined
  const activeTag = searchParams.get("tag") || undefined

  const categories = useMemo(() => getCategories(posts), [])
  const tags = useMemo(() => getAllTags(posts), [])

  const filteredPosts = useMemo(() => {
    if (activeTag) return filterByTag(posts, activeTag)
    if (activeCategory) return filterByCategory(posts, activeCategory)
    return posts
  }, [activeCategory, activeTag])

  const pageTitle = activeTag
    ? `标签: ${activeTag}`
    : activeCategory
    ? `分类: ${activeCategory}`
    : "全部文章"

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {pageTitle}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              共 {filteredPosts.length} 篇文章
            </p>
          </div>
        </div>
        <CategoryList categories={categories} activeCategory={activeCategory} />
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <PostList posts={filteredPosts} />
        </div>
        <div className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-20">
            <Sidebar
              categories={categories}
              tags={tags}
              recentPosts={posts}
              currentCategory={activeCategory}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
