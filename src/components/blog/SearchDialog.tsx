import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X, FileText, ArrowRight } from "lucide-react"
import { useSearch } from "@/hooks/useSearch"
import { highlightText } from "@/lib/search"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const { query, setQuery, results, initIndex, isLoading } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      initIndex()
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
    }
  }, [isOpen, initIndex, setQuery])

  const handleSelect = (slug: string) => {
    navigate(`/posts/${slug}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative max-w-xl mx-auto mt-[15vh] px-4 animate-scale-in">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章标题、内容、标签..."
              className="flex-1 py-4 bg-transparent border-0 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm"
            />
            <div className="flex items-center gap-2">
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs rounded border border-slate-200 dark:border-slate-700">
                ESC
              </kbd>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {isLoading && (
              <div className="p-8 text-center text-sm text-slate-500">
                正在加载搜索索引...
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">
                  未找到包含 "<span className="text-brand-500 font-medium">{query}</span>" 的文章
                </p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <ul className="py-2">
                {results.map((result) => (
                  <li key={result.slug}>
                    <button
                      onClick={() => handleSelect(result.slug)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(result.title, query),
                          }}
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {result.category}
                          {result.matches.length > 0 && (
                            <span
                              className="ml-2"
                              dangerouslySetInnerHTML={{
                                __html: highlightText(
                                  result.matches[0].slice(0, 80),
                                  query
                                ),
                              }}
                            />
                          )}
                        </p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600 mt-1 flex-shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!isLoading && !query && (
              <div className="p-8 text-center text-sm text-slate-400">
                输入关键词开始搜索
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <span>
              <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 mr-1">↵</kbd>
              打开
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 mr-1">Ctrl</kbd>
              +
              <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 mx-1">K</kbd>
              搜索
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
