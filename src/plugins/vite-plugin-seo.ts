import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Plugin } from "vite"

const SITE_URL =
  process.env.SITE_URL ||
  "https://binary-bard-blog-8fvf1sg82895f0b-1404499502.tcloudbaseapp.com"

interface PostFrontmatter {
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  cover?: string
  section: string
}

function loadPostsFrontmatter(): PostFrontmatter[] {
  const postsDir = path.resolve(process.cwd(), "content/posts")
  if (!fs.existsSync(postsDir)) return []

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"))
  const posts: PostFrontmatter[] = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8")
    const { data } = matter(raw)
    const slug = file.replace(/\.md$/, "")

    posts.push({
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
      category: data.category || "未分类",
      tags: data.tags || [],
      cover: data.cover || undefined,
      section: data.section || "arcane",
    })
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function generateSitemap(posts: PostFrontmatter[]): string {
  const now = new Date().toISOString()

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/arcane", priority: "0.8", changefreq: "weekly" },
    { loc: "/journal", priority: "0.8", changefreq: "weekly" },
    { loc: "/forge", priority: "0.8", changefreq: "weekly" },
    { loc: "/archives", priority: "0.6", changefreq: "weekly" },
    { loc: "/categories", priority: "0.6", changefreq: "weekly" },
    { loc: "/about", priority: "0.5", changefreq: "monthly" },
  ]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
  }

  for (const post of posts) {
    xml += `  <url>
    <loc>${SITE_URL}/posts/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`
  }

  xml += `</urlset>`
  return xml
}

function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}

function generatePostHtml(
  post: PostFrontmatter,
  templateHtml: string
): string {
  const postUrl = `${SITE_URL}/posts/${post.slug}`
  const coverUrl = post.cover ? `${SITE_URL}${post.cover}` : ""

  const metaTags = `
    <title>${escapeHtml(post.title)} | BinaryBard</title>
    <meta name="description" content="${escapeHtml(post.description)}" />
    <link rel="canonical" href="${postUrl}" />
    <meta property="og:title" content="${escapeHtml(post.title)}" />
    <meta property="og:description" content="${escapeHtml(post.description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />${
      coverUrl
        ? `
    <meta property="og:image" content="${coverUrl}" />`
        : ""
    }
    <meta property="og:site_name" content="BinaryBard" />
    <meta property="article:published_time" content="${post.date}" />
    <meta property="article:author" content="BinaryBard" />${
      post.tags.length > 0
        ? post.tags
            .map(
              (tag) =>
                `
    <meta property="article:tag" content="${escapeHtml(tag)}" />`
            )
            .join("")
        : ""
    }
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(post.title)}" />
    <meta name="twitter:description" content="${escapeHtml(post.description)}" />${
      coverUrl
        ? `
    <meta name="twitter:image" content="${coverUrl}" />`
        : ""
    }
    <script type="application/ld+json">
    ${JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: {
          "@type": "Person",
          name: "BinaryBard",
        },
        publisher: {
          "@type": "Organization",
          name: "BinaryBard",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
        ...(coverUrl ? { image: coverUrl } : {}),
        keywords: post.tags.join(", "),
      },
      null,
      6
    )}
    </script>`

  // Replace <title> and insert meta before </head>
  let html = templateHtml
  html = html.replace(/<title>.*?<\/title>/, "")
  html = html.replace(
    /<meta name="description"[^>]*\/>/,
    ""
  )
  html = html.replace(
    /<meta property="og:title"[^>]*\/>/,
    ""
  )
  html = html.replace(
    /<meta property="og:description"[^>]*\/>/,
    ""
  )
  html = html.replace(
    /<meta property="og:type"[^>]*\/>/,
    ""
  )
  html = html.replace("</head>", `${metaTags}\n  </head>`)

  return html
}

function generatePageHtml(
  title: string,
  description: string,
  urlPath: string,
  templateHtml: string
): string {
  const fullUrl = `${SITE_URL}${urlPath}`
  const metaTags = `
    <title>${escapeHtml(title)} | BinaryBard</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${fullUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:site_name" content="BinaryBard" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />`

  let html = templateHtml
  html = html.replace(/<title>.*?<\/title>/, "")
  html = html.replace(/<meta name="description"[^>]*\/>/, "")
  html = html.replace(/<meta property="og:title"[^>]*\/>/, "")
  html = html.replace(/<meta property="og:description"[^>]*\/>/, "")
  html = html.replace(/<meta property="og:type"[^>]*\/>/, "")
  html = html.replace("</head>", `${metaTags}\n  </head>`)

  return html
}

function generateRSS(posts: PostFrontmatter[]): string {
  const now = new Date().toUTCString()
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BinaryBard</title>
    <link>${SITE_URL}</link>
    <description>游戏开发者的技术博客，专注 Unreal Engine 与软件工程</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
`
  for (const post of posts) {
    rss += `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>
`
  }
  rss += `  </channel>
</rss>`
  return rss
}

export function seoPlugin(): Plugin {
  return {
    name: "vite-plugin-seo",
    apply: "build",
    enforce: "post",

    closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist")
      const posts = loadPostsFrontmatter()

      // Read the built index.html as template
      const indexHtmlPath = path.join(distDir, "index.html")
      if (!fs.existsSync(indexHtmlPath)) {
        console.warn("[SEO] dist/index.html not found, skipping SEO generation")
        return
      }
      const templateHtml = fs.readFileSync(indexHtmlPath, "utf-8")

      // 1. Generate sitemap.xml
      const sitemap = generateSitemap(posts)
      fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf-8")
      console.log(`[SEO] Generated sitemap.xml (${posts.length} posts + 7 pages)`)

      // 2. Generate robots.txt
      fs.writeFileSync(
        path.join(distDir, "robots.txt"),
        generateRobotsTxt(),
        "utf-8"
      )
      console.log("[SEO] Generated robots.txt")

      // 3. Generate RSS
      const rss = generateRSS(posts)
      fs.writeFileSync(path.join(distDir, "rss.xml"), rss, "utf-8")
      console.log("[SEO] Generated rss.xml")

      // 4. Generate per-post HTML files
      for (const post of posts) {
        const postDir = path.join(distDir, "posts", post.slug)
        fs.mkdirSync(postDir, { recursive: true })
        const postHtml = generatePostHtml(post, templateHtml)
        fs.writeFileSync(path.join(postDir, "index.html"), postHtml, "utf-8")
      }
      console.log(`[SEO] Generated ${posts.length} post HTML files`)

      // 5. Generate static page HTML files
      const staticPages = [
        {
          path: "arcane",
          title: "技术奥术",
          desc: "探究引擎深处的奥秘，将技术心得炼成可传承的卷轴",
        },
        {
          path: "journal",
          title: "光影手札",
          desc: "游戏、电影、书籍——记录每一次与好故事相遇的余震",
        },
        {
          path: "forge",
          title: "锻造日志",
          desc: "个人项目的开发纪实，从第一行代码到最终成品的全过程",
        },
        {
          path: "archives",
          title: "归档",
          desc: "按时间线浏览所有文章",
        },
        {
          path: "categories",
          title: "分类",
          desc: "按分类和标签浏览文章",
        },
        {
          path: "about",
          title: "关于",
          desc: "游戏开发者 BinaryBard 的个人简介",
        },
        {
          path: "search",
          title: "搜索",
          desc: "搜索 BinaryBard 博客的所有文章",
        },
      ]

      for (const page of staticPages) {
        const pageDir = path.join(distDir, page.path)
        fs.mkdirSync(pageDir, { recursive: true })
        const pageHtml = generatePageHtml(
          page.title,
          page.desc,
          `/${page.path}`,
          templateHtml
        )
        fs.writeFileSync(path.join(pageDir, "index.html"), pageHtml, "utf-8")
      }
      console.log(
        `[SEO] Generated ${staticPages.length} static page HTML files`
      )

      console.log("[SEO] All SEO assets generated successfully!")
    },
  }
}
