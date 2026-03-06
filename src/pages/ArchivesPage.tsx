import { useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { AnimatedPage } from "../components/common/AnimatedPage"
import { ScrollReveal } from "../components/common/ScrollReveal"
import { groupByYear } from "../lib/posts"
import { formatDate } from "../lib/utils"
import { useHead } from "../hooks/useHead"
import posts from "virtual:blog-posts"

export function ArchivesPage() {
  useHead({
    title: "归档",
    description: "按时间线浏览 BinaryBard 的所有文章",
  })
  const grouped = useMemo(() => groupByYear(posts), [])
  const years = Array.from(grouped.keys())

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-anime-gold to-anime-sky rounded-full" />
            <div>
              <h1 className="text-3xl font-black text-foreground font-heading">
                文章归档
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                共 {posts.length} 篇文章，按时间线排列
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gradient-to-b from-anime-gold/30 via-anime-gold/10 to-transparent hidden sm:block" />

          {years.map((year) => {
            const yearPosts = grouped.get(year) || []
            return (
              <div key={year} className="mb-12">
                {/* Year heading */}
                <ScrollReveal>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-black text-anime-gold font-heading w-[72px] text-right">
                      {year}
                    </span>
                    <div className="hidden sm:block w-3 h-3 rounded-full bg-anime-gold border-2 border-background shadow-glow-gold relative z-10" />
                    <div className="h-px flex-1 bg-gradient-to-r from-anime-gold/20 to-transparent" />
                  </div>
                </ScrollReveal>

                {/* Posts */}
                <div className="space-y-3 sm:pl-[88px]">
                  {yearPosts.map((post, idx) => (
                    <ScrollReveal key={post.slug} delay={idx * 0.05}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link
                          to={`/posts/${post.slug}`}
                          className="group flex items-start gap-4 p-4 rounded-xl glass-panel hover:border-anime-gold/30 transition-all duration-300 cursor-pointer"
                        >
                          {/* Date node */}
                          <div className="flex-shrink-0 relative">
                            <div className="hidden sm:block absolute -left-[52px] top-3 w-2 h-2 rounded-full bg-border group-hover:bg-anime-gold transition-colors" />
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 text-anime-gold/50" />
                              {formatDate(post.date)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-foreground group-hover:text-anime-gold transition-colors line-clamp-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {post.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="text-xs border-anime-sky/20 text-anime-sky bg-anime-sky/5"
                              >
                                {post.category}
                              </Badge>
                              {post.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs border-border text-muted-foreground"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AnimatedPage>
  )
}
