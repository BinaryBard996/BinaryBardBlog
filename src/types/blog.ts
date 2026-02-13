export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  cover?: string
  readingTime: number
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

export interface SiteConfig {
  title: string
  description: string
  author: string
  url: string
  github: string
  email: string
}

export const siteConfig: SiteConfig = {
  title: "BinaryBard",
  description: "分享技术见解与编程实践的个人博客",
  author: "BinaryBard",
  url: "https://binary-bard-blog-8fvf1sg82895f0b-1404499502.tcloudbaseapp.com",
  github: "https://github.com/BinaryBard996",
  email: "hello@binarybard.dev",
}
