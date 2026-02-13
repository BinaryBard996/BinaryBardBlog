import fs from "fs"
import path from "path"
import matter from "gray-matter"

interface PostData {
  slug: string
  title: string
  description: string
  date: string
  category: string
  url: string
  content: string
}

const SITE_URL = process.env.SITE_URL || "https://binary-bard-blog-8fvf1sg82895f0b-1404499502.tcloudbaseapp.com"
const SITE_TITLE = "BinaryBard Blog"
const SITE_DESCRIPTION = "分享技术见解与编程实践的个人博客"

function loadPosts(): PostData[] {
  const postsDir = path.resolve(process.cwd(), "content/posts")
  if (!fs.existsSync(postsDir)) return []

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"))
  const posts: PostData[] = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8")
    const { data, content } = matter(raw)
    const slug = file.replace(/\.md$/, "")

    posts.push({
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      category: data.category || "未分类",
      url: `${SITE_URL}/posts/${slug}`,
      content: content.slice(0, 500),
    })
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function generateRSS(): string {
  const posts = loadPosts()
  const now = new Date().toUTCString()

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
`

  for (const post of posts) {
    rss += `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.url}</link>
      <guid isPermaLink="true">${post.url}</guid>
      <description><![CDATA[${post.description}]]></description>
      <category>${post.category}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>
`
  }

  rss += `  </channel>
</rss>`

  return rss
}

// Generate RSS
const rssXml = generateRSS()
const distDir = path.resolve(process.cwd(), "dist")
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}
fs.writeFileSync(path.join(distDir, "rss.xml"), rssXml, "utf-8")
console.log("RSS feed generated at dist/rss.xml")

// Also copy to public for dev mode
const publicDir = path.resolve(process.cwd(), "public")
fs.writeFileSync(path.join(publicDir, "rss.xml"), rssXml, "utf-8")
console.log("RSS feed also copied to public/rss.xml")
