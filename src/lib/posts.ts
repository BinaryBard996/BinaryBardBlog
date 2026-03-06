import type { PostMeta, Category, Section } from "../types/blog"

export function getCategories(posts: PostMeta[]): Category[] {
  const map = new Map<string, number>()
  for (const post of posts) {
    map.set(post.category, (map.get(post.category) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    }))
    .sort((a, b) => b.count - a.count)
}

export function getAllTags(posts: PostMeta[]): { name: string; count: number }[] {
  const map = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) || 0) + 1)
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function filterByCategory(posts: PostMeta[], category: string): PostMeta[] {
  if (!category || category === "all") return posts
  return posts.filter((p) => p.category === category)
}

export function filterByTag(posts: PostMeta[], tag: string): PostMeta[] {
  return posts.filter((p) => p.tags.includes(tag))
}

export function getRelatedPosts(
  posts: PostMeta[],
  current: PostMeta,
  limit: number = 3
): PostMeta[] {
  const scored = posts
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      let score = 0
      if (p.category === current.category) score += 3
      for (const tag of p.tags) {
        if (current.tags.includes(tag)) score += 1
      }
      return { post: p, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((s) => s.post)
}

export function paginatePosts(
  posts: PostMeta[],
  page: number,
  perPage: number = 6
): { posts: PostMeta[]; totalPages: number; currentPage: number } {
  const totalPages = Math.ceil(posts.length / perPage)
  const currentPage = Math.max(1, Math.min(page, totalPages))
  const start = (currentPage - 1) * perPage
  return {
    posts: posts.slice(start, start + perPage),
    totalPages,
    currentPage,
  }
}

export function sortWithPinned(posts: PostMeta[]): PostMeta[] {
  return [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function groupByYear(posts: PostMeta[]): Map<string, PostMeta[]> {
  const groups = new Map<string, PostMeta[]>()
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  for (const post of sorted) {
    const year = new Date(post.date).getFullYear().toString()
    const group = groups.get(year) || []
    group.push(post)
    groups.set(year, group)
  }
  return groups
}

export function filterBySection(posts: PostMeta[], section: Section): PostMeta[] {
  return posts.filter((p) => p.section === section)
}
