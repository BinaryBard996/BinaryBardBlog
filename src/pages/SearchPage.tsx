import { useEffect, useState, useCallback } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, FileText, ArrowRight } from "lucide-react"
import { AnimatedPage } from "../components/common/AnimatedPage"
import { loadSearchIndex, search, highlightText } from "../lib/search"
import type { SearchResult } from "../types/blog"

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isReady, setIsReady] = useState(false)

  const initSearch = useCallback(async () => {
    await loadSearchIndex()
    setIsReady(true)
  }, [])

  useEffect(() => {
    initSearch()
  }, [initSearch])

  useEffect(() => {
    if (!isReady) return
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      setResults(search(query))
      setSearchParams(query ? { q: query } : {})
    }, 200)
    return () => clearTimeout(timer)
  }, [query, isReady, setSearchParams])

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 font-heading">
            搜索文章
          </h1>
          <p className="text-sm text-muted-foreground">
            输入关键词搜索文章标题、内容和标签
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-anime-gold/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索..."
            className="w-full pl-10 h-12 text-base rounded-xl glass-panel text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-anime-gold/40 transition-colors bg-transparent"
            autoFocus
          />
        </div>

        {!isReady && (
          <p className="text-center text-xs text-anime-gold py-8 tracking-wider animate-pulse">
            加载搜索索引...
          </p>
        )}

        {isReady && query && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              未找到与 "<span className="text-anime-gold font-medium">{query}</span>" 相关的文章
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-4 tracking-wider">
              共找到 {results.length} 条结果
            </p>
            {results.map((result, idx) => (
              <motion.div
                key={result.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/posts/${result.slug}`}
                  className="group flex items-start gap-3 p-4 rounded-xl glass-panel hover:border-anime-gold/30 transition-all duration-300 cursor-pointer"
                >
                  <FileText className="w-5 h-5 text-anime-gold/60 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-base font-bold text-foreground group-hover:text-anime-gold transition-colors"
                      dangerouslySetInnerHTML={{ __html: highlightText(result.title, query) }}
                    />
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs tracking-wider text-anime-sky bg-anime-sky/10 border border-anime-sky/20 rounded-full mt-1">
                      {result.category}
                    </span>
                    {result.matches.length > 0 && (
                      <p
                        className="text-sm text-muted-foreground mt-2 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(result.matches[0], query),
                        }}
                      />
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
