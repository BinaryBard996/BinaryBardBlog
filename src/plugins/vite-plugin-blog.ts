import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Plugin } from "vite"

interface PostData {
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  cover?: string
  readingTime: number
  content: string
}

function getPostsDir(): string {
  return path.resolve(process.cwd(), "content/posts")
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 300
  const words = content.replace(/[#*`\[\]()]/g, "").length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

function loadAllPosts(): PostData[] {
  const postsDir = getPostsDir()
  if (!fs.existsSync(postsDir)) {
    return []
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"))
  const posts: PostData[] = []

  for (const file of files) {
    const filePath = path.join(postsDir, file)
    const raw = fs.readFileSync(filePath, "utf-8")
    const { data, content } = matter(raw)
    const slug = file.replace(/\.md$/, "")

    posts.push({
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      category: data.category || "未分类",
      tags: data.tags || [],
      cover: data.cover || undefined,
      readingTime: calculateReadingTime(content),
      content,
    })
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return posts
}

const VIRTUAL_POSTS_ID = "virtual:blog-posts"
const VIRTUAL_SEARCH_ID = "virtual:search-index"
const RESOLVED_POSTS_ID = "\0" + VIRTUAL_POSTS_ID
const RESOLVED_SEARCH_ID = "\0" + VIRTUAL_SEARCH_ID
const VIRTUAL_POST_PREFIX = "virtual:blog-post:"

export function blogPlugin(): Plugin {
  let posts: PostData[] = []

  return {
    name: "vite-plugin-blog",
    enforce: "pre",

    buildStart() {
      posts = loadAllPosts()
    },

    resolveId(id: string) {
      if (id === VIRTUAL_POSTS_ID) return RESOLVED_POSTS_ID
      if (id === VIRTUAL_SEARCH_ID) return RESOLVED_SEARCH_ID
      if (id.startsWith(VIRTUAL_POST_PREFIX)) return "\0" + id
      return null
    },

    load(id: string) {
      if (id === RESOLVED_POSTS_ID) {
        const metaList = posts.map(({ content: _, ...meta }) => meta)
        return `export default ${JSON.stringify(metaList)}`
      }

      if (id === RESOLVED_SEARCH_ID) {
        const searchData = posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          content: p.content.slice(0, 500),
          category: p.category,
          tags: p.tags,
        }))
        return `export default ${JSON.stringify(searchData)}`
      }

      if (id.startsWith("\0" + VIRTUAL_POST_PREFIX)) {
        const slug = id.slice(("\0" + VIRTUAL_POST_PREFIX).length)
        const post = posts.find((p) => p.slug === slug)
        if (post) {
          return `export default ${JSON.stringify(post)}`
        }
        return `export default null`
      }

      return null
    },

    configureServer(server) {
      const postsDir = getPostsDir()
      if (fs.existsSync(postsDir)) {
        server.watcher.add(postsDir)
        server.watcher.on("change", (changedPath) => {
          if (changedPath.startsWith(postsDir) && changedPath.endsWith(".md")) {
            posts = loadAllPosts()
            const mod1 = server.moduleGraph.getModuleById(RESOLVED_POSTS_ID)
            const mod2 = server.moduleGraph.getModuleById(RESOLVED_SEARCH_ID)
            if (mod1) server.moduleGraph.invalidateModule(mod1)
            if (mod2) server.moduleGraph.invalidateModule(mod2)
            server.ws.send({ type: "full-reload" })
          }
        })
      }
    },
  }
}
