import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, FileText, ArrowRight } from "lucide-react"
import { useSearch } from "../../hooks/useSearch"
import { highlightText } from "../../lib/search"

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const handleSelect = (slug: string) => {
    navigate(`/posts/${slug}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative max-w-xl mx-auto mt-[15vh] px-4"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass-panel rounded-xl shadow-2xl shadow-black/30 overflow-hidden">
              <div className="diamond-corner" />

              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search className="w-5 h-5 text-anime-gold flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索文章标题、内容、标签..."
                  className="flex-1 py-4 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
                <div className="flex items-center gap-2">
                  <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-secondary text-muted-foreground text-xs border border-border rounded">
                    ESC
                  </kbd>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-secondary rounded text-muted-foreground transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[50vh] overflow-y-auto">
                {isLoading && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    <span className="text-anime-gold animate-pulse">加载搜索索引...</span>
                  </div>
                )}

                {!isLoading && query && results.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      未找到包含 "<span className="text-anime-gold font-medium">{query}</span>" 的文章
                    </p>
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <ul className="py-2">
                    {results.map((result, idx) => (
                      <motion.li
                        key={result.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <button
                          onClick={() => handleSelect(result.slug)}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-anime-gold/60 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium text-foreground truncate"
                              dangerouslySetInnerHTML={{
                                __html: highlightText(result.title, query),
                              }}
                            />
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
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
                          <ArrowRight className="w-3 h-3 text-muted-foreground mt-1 flex-shrink-0" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {!isLoading && !query && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    输入关键词开始搜索
                  </div>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  <kbd className="px-1 py-0.5 bg-secondary border border-border rounded mr-1 text-[10px]">Enter</kbd>
                  打开
                </span>
                <span>
                  <kbd className="px-1 py-0.5 bg-secondary border border-border rounded mr-1 text-[10px]">Ctrl</kbd>
                  +
                  <kbd className="px-1 py-0.5 bg-secondary border border-border rounded mx-1 text-[10px]">K</kbd>
                  搜索
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
