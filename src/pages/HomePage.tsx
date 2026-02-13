import { Github, Twitter, Mail, ArrowDown, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostList } from "@/components/blog/PostList"
import { Sidebar } from "@/components/layout/Sidebar"
import { getCategories, getAllTags } from "@/lib/posts"
import { siteConfig } from "@/types/blog"
import posts from "virtual:blog-posts"

export function HomePage() {
  const categories = getCategories(posts)
  const tags = getAllTags(posts)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-700 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Info */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm">
                <Terminal className="w-3.5 h-3.5" />
                技术探索者 &amp; 代码实践者
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Hi, 我是{" "}
                <span className="bg-gradient-to-r from-brand-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  BinaryBard
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
                热爱开源、热爱技术。这里记录我在软件开发旅途中的思考与实践，涵盖前端工程化、React 生态、TypeScript 高级技巧等领域。
              </p>
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10 gap-2 cursor-pointer">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                </a>
                <a href={`mailto:${siteConfig.email}`}>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 gap-2 cursor-pointer">
                    <Mail className="w-4 h-4" />
                    联系我
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-4 justify-center lg:justify-start pt-2">
                {[
                  { icon: Github, href: siteConfig.github },
                  { icon: Twitter, href: "#" },
                  { icon: Mail, href: `mailto:${siteConfig.email}` },
                ].map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Terminal decoration */}
            <div className="flex-shrink-0 w-full max-w-md hidden lg:block">
              <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 shadow-2xl backdrop-blur-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-slate-500 font-mono">terminal</span>
                </div>
                <div className="p-4 font-mono text-sm space-y-2">
                  <p><span className="text-green-400">$</span> <span className="text-slate-300">whoami</span></p>
                  <p className="text-brand-400">BinaryBard - Full Stack Developer</p>
                  <p><span className="text-green-400">$</span> <span className="text-slate-300">cat skills.txt</span></p>
                  <p className="text-slate-400">React · TypeScript · Node.js · Rust</p>
                  <p className="text-slate-400">Vite · Docker · PostgreSQL · Redis</p>
                  <p><span className="text-green-400">$</span> <span className="text-slate-300">echo $MOTTO</span></p>
                  <p className="text-yellow-400">"代码是写给人看的，顺便能在机器上运行"</p>
                  <p className="text-green-400 animate-pulse">$ _</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center pt-12">
            <ArrowDown className="w-5 h-5 text-slate-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                最新文章
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                共 {posts.length} 篇
              </span>
            </div>
            <PostList posts={posts} />
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <Sidebar
                categories={categories}
                tags={tags}
                recentPosts={posts}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
