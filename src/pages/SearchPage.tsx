import { useEffect, useState, useCallback } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Search, FileText, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { loadSearchIndex, search, highlightText } from "@/lib/search"
import type { SearchResult } from "@/types/blog"

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          搜索文章
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          输入关键词搜索文章标题、内容和标签
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索..."
          className="pl-10 h-12 text-base bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
          autoFocus
        />
      </div>

      {/* Results */}
      {!isReady && (
        <p className="text-center text-sm text-slate-500 py-8">正在加载搜索引擎...</p>
      )}

      {isReady && query && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            未找到与 "<span className="text-brand-500 font-medium">{query}</span>" 相关的文章
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            找到 {results.length} 篇相关文章
          </p>
          {results.map((result) => (
            <Link
              key={result.slug}
              to={`/posts/${result.slug}`}
              className="group flex items-start gap-3 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all"
            >
              <FileText className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
                  dangerouslySetInnerHTML={{ __html: highlightText(result.title, query) }}
                />
                <Badge variant="secondary" className="text-xs mt-1">
                  {result.category}
                </Badge>
                {result.matches.length > 0 && (
                  <p
                    className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(result.matches[0], query),
                    }}
                  />
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
