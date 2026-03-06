export type Section = "arcane" | "journal" | "forge"

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  cover?: string
  readingTime: number
  pinned?: boolean
  section: Section
}

export interface BlogPost extends PostMeta {
  content: string
}

export interface TOCItem {
  id: string
  text: string
  level: number
}

export interface SearchResult {
  slug: string
  title: string
  description: string
  category: string
  matches: string[]
}

export interface Category {
  name: string
  count: number
  slug: string
}
