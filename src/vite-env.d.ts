/// <reference types="vite/client" />

declare module "virtual:blog-posts" {
  import type { PostMeta } from "@/types/blog"
  const posts: PostMeta[]
  export default posts
}

declare module "virtual:search-index" {
  interface SearchEntry {
    slug: string
    title: string
    description: string
    content: string
    category: string
    tags: string[]
  }
  const index: SearchEntry[]
  export default index
}

declare module "*.md" {
  const content: string
  export default content
}
