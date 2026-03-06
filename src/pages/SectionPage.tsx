import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { ScrollText, Clapperboard, Hammer } from "lucide-react"
import { PostList } from "../components/blog/PostList"
import { CategoryList } from "../components/blog/CategoryList"
import { Sidebar } from "../components/layout/Sidebar"
import { AnimatedPage } from "../components/common/AnimatedPage"
import { getCategories, getAllTags, filterByCategory, filterByTag, filterBySection, sortWithPinned } from "../lib/posts"
import { sections, siteConfig } from "../config/site"
import { useHead } from "../hooks/useHead"
import type { Section } from "../types/blog"
import posts from "virtual:blog-posts"

const sectionIcons: Record<string, React.ReactNode> = {
  ScrollText: <ScrollText className="w-5 h-5" />,
  Clapperboard: <Clapperboard className="w-5 h-5" />,
  Hammer: <Hammer className="w-5 h-5" />,
}

const sectionColorMap: Record<string, { text: string; bg: string; border: string }> = {
  "anime-sky": { text: "text-anime-sky", bg: "bg-anime-sky/10", border: "border-anime-sky/20" },
  "anime-lavender": { text: "text-anime-lavender", bg: "bg-anime-lavender/10", border: "border-anime-lavender/20" },
  "anime-gold": { text: "text-anime-gold", bg: "bg-anime-gold/10", border: "border-anime-gold/20" },
}

interface SectionPageProps {
  sectionKey: Section
}

export function SectionPage({ sectionKey }: SectionPageProps) {
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get("cat") || undefined
  const activeTag = searchParams.get("tag") || undefined

  const sectionConfig = sections.find((s) => s.key === sectionKey)!
  const colors = sectionColorMap[sectionConfig.color]

  useHead({
    title: sectionConfig.title,
    description: sectionConfig.description,
    ogTitle: `${sectionConfig.title} | BinaryBard`,
    ogDescription: sectionConfig.description,
    ogType: "website",
    canonicalUrl: `${siteConfig.url}${sectionConfig.path}`,
  })

  const sectionPosts = useMemo(() => filterBySection(posts, sectionKey), [sectionKey])
  const categories = useMemo(() => getCategories(sectionPosts), [sectionPosts])
  const tags = useMemo(() => getAllTags(sectionPosts), [sectionPosts])

  const filteredPosts = useMemo(() => {
    let result = sectionPosts
    if (activeTag) result = filterByTag(result, activeTag)
    else if (activeCategory) result = filterByCategory(result, activeCategory)
    return sortWithPinned(result)
  }, [sectionPosts, activeCategory, activeTag])

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text}`}>
              {sectionIcons[sectionConfig.icon]}
            </div>
            <div>
              <h1 className={`text-2xl font-bold font-heading ${colors.text}`}>
                {sectionConfig.title}
              </h1>
              <p className="text-xs text-muted-foreground tracking-wider">
                {sectionConfig.subtitle} · 共 {sectionPosts.length} 篇文章
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {sectionConfig.description}
          </p>
          {categories.length > 1 && (
            <CategoryList
              categories={categories}
              activeCategory={activeCategory}
              basePath={sectionConfig.path}
            />
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <PostList posts={filteredPosts} />
          </div>
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <Sidebar
                categories={categories}
                tags={tags}
                recentPosts={sectionPosts}
                currentCategory={activeCategory}
                basePath={sectionConfig.path}
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}
