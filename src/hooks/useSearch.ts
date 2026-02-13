import { useState, useEffect, useCallback } from "react"
import { loadSearchIndex, search as performSearch } from "@/lib/search"
import type { SearchResult } from "@/types/blog"

export function useSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isIndexLoaded, setIsIndexLoaded] = useState(false)

  const initIndex = useCallback(async () => {
    if (isIndexLoaded) return
    setIsLoading(true)
    await loadSearchIndex()
    setIsIndexLoaded(true)
    setIsLoading(false)
  }, [isIndexLoaded])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(() => {
      const searchResults = performSearch(query)
      setResults(searchResults)
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  return {
    query,
    setQuery,
    results,
    isLoading,
    initIndex,
    isIndexLoaded,
  }
}
