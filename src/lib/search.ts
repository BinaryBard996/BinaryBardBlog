import type { SearchResult } from "@/types/blog"

interface SearchEntry {
  slug: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
}

let searchIndex: SearchEntry[] = []
let isLoaded = false

export async function loadSearchIndex(): Promise<void> {
  if (isLoaded) return
  const mod = await import("virtual:search-index")
  searchIndex = mod.default
  isLoaded = true
}

export function search(query: string, limit: number = 10): SearchResult[] {
  if (!query.trim() || !isLoaded) return []

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const results: { entry: SearchEntry; score: number; matches: string[] }[] = []

  for (const entry of searchIndex) {
    let score = 0
    const matches: string[] = []
    const titleLower = entry.title.toLowerCase()
    const descLower = entry.description.toLowerCase()
    const contentLower = entry.content.toLowerCase()

    for (const term of terms) {
      if (titleLower.includes(term)) {
        score += 10
        matches.push(entry.title)
      }
      if (descLower.includes(term)) {
        score += 5
        matches.push(entry.description)
      }
      if (entry.tags.some((t) => t.toLowerCase().includes(term))) {
        score += 7
      }
      if (entry.category.toLowerCase().includes(term)) {
        score += 3
      }
      if (contentLower.includes(term)) {
        score += 1
        const idx = contentLower.indexOf(term)
        const start = Math.max(0, idx - 40)
        const end = Math.min(entry.content.length, idx + term.length + 40)
        matches.push("..." + entry.content.slice(start, end) + "...")
      }
    }

    if (score > 0) {
      results.push({ entry, score, matches: [...new Set(matches)].slice(0, 2) })
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => ({
      slug: r.entry.slug,
      title: r.entry.title,
      description: r.entry.description,
      category: r.entry.category,
      matches: r.matches,
    }))
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text
  const terms = query.split(/\s+/).filter(Boolean)
  let result = text
  for (const term of terms) {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    result = result.replace(regex, '<mark class="search-highlight">$1</mark>')
  }
  return result
}
