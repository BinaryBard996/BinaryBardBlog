import { Github, Mail, Twitter, Globe, Code2, Server, Wrench, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/types/blog"

const skills = [
  {
    category: "前端技术",
    icon: Code2,
    items: ["React", "TypeScript", "Next.js", "Vue.js", "Tailwind CSS", "Vite"],
  },
  {
    category: "后端技术",
    icon: Server,
    items: ["Node.js", "Rust", "PostgreSQL", "Redis", "GraphQL", "REST API"],
  },
  {
    category: "工具生态",
    icon: Wrench,
    items: ["Git", "Docker", "Linux", "CI/CD", "Nginx", "Webpack"],
  },
  {
    category: "兴趣方向",
    icon: Sparkles,
    items: ["开源贡献", "性能优化", "架构设计", "技术写作", "Rust 系统编程", "WebAssembly"],
  },
]

const timeline = [
  { year: "2026", title: "BinaryBard 博客上线", desc: "搭建个人技术博客，开启系统化技术分享之旅" },
  { year: "2025", title: "深入 Rust 领域", desc: "探索系统编程语言 Rust，在性能关键场景中实践应用" },
  { year: "2024", title: "全栈工程化实践", desc: "构建完整的 DevOps 流水线，推动团队工程化水平提升" },
  { year: "2023", title: "React 生态深耕", desc: "系统学习 React 生态，参与多个大型项目架构设计" },
]

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16">
        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-brand-500/20 flex-shrink-0">
          BB
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            {siteConfig.author}
          </h1>
          <p className="text-lg text-brand-600 dark:text-brand-400 font-medium mb-3">
            Full Stack Developer &amp; Open Source Enthusiast
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mb-4">
            一名热爱技术的全栈开发者。相信代码的力量可以改变世界，致力于用优雅的解决方案应对复杂的工程挑战。
            在工作之余，我喜欢阅读技术书籍、参与开源项目、撰写技术博客，与全球的开发者交流学习。
          </p>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            {[
              { icon: Github, href: siteConfig.github, label: "GitHub" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
              { icon: Globe, href: siteConfig.url, label: "Website" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-all cursor-pointer"
                title={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          技术栈
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((group) => (
            <Card key={group.category} className="border-slate-200/70 dark:border-slate-800 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <group.icon className="w-5 h-5 text-brand-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {group.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          成长历程
        </h2>
        <div className="space-y-0">
          {timeline.map((item, index) => (
            <div key={item.year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 text-sm font-bold flex-shrink-0">
                  {item.year.slice(2)}
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-2" />
                )}
              </div>
              <div className="pb-8">
                <span className="text-xs text-brand-500 font-medium">{item.year}</span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
