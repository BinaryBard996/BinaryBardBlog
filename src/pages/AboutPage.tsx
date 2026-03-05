import { Github, Mail, Twitter, Globe, Gamepad2, Server, Wrench, Sparkles } from "lucide-react"
import { siteConfig } from "@/types/blog"

const skills = [
  {
    category: "游戏引擎",
    icon: Gamepad2,
    color: "text-anime-gold",
    items: ["Unreal Engine 5", "Blueprint", "GAS", "Slate UI", "PCG", "Niagara"],
  },
  {
    category: "编程语言",
    icon: Server,
    color: "text-anime-sky",
    items: ["C++", "Python", "TypeScript", "Rust", "Lua", "HLSL"],
  },
  {
    category: "工具链",
    icon: Wrench,
    color: "text-anime-gold-light",
    items: ["Git", "Perforce", "Docker", "CI/CD", "Houdini", "Excel Automation"],
  },
  {
    category: "兴趣方向",
    icon: Sparkles,
    color: "text-anime-lavender",
    items: ["插件开发", "工作流自动化", "技术美术", "性能优化", "工具设计", "技术写作"],
  },
]

const timeline = [
  { year: "2026", title: "BinaryBard 博客上线", desc: "搭建个人技术博客，开启系统化技术分享之旅", color: "text-anime-gold" },
  { year: "2025", title: "UE GAS 工具链开发", desc: "开发 AbilityEditorHelper 等 Schema 驱动的自动化工具", color: "text-anime-sky" },
  { year: "2024", title: "深入 Unreal Engine", desc: "专注 GAS 框架研究，构建游戏能力系统", color: "text-anime-gold-light" },
  { year: "2023", title: "游戏开发之旅", desc: "系统学习游戏开发，参与多个项目的工具链建设", color: "text-anime-lavender" },
]

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16">
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-anime-gold/20 to-anime-lavender/20 border-3 border-anime-gold/40 flex items-center justify-center text-anime-gold text-3xl font-bold shadow-anime-gold">
            BB
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-anime-emerald border-2 border-anime-dark rounded-full flex items-center justify-center">
            <span className="text-[8px] text-anime-dark font-bold">ON</span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-black text-[#e8e4dc] mb-2 font-serif">
            {siteConfig.author}
          </h1>
          <p className="text-lg text-anime-gold font-medium mb-3 gold-text">
            Game Developer & Tool Creator
          </p>
          <p className="text-[#9b97a0] leading-relaxed max-w-xl mb-4">
            一名热爱游戏开发的创作者。专注于 Unreal Engine 开发与工具链建设，
            致力于用自动化工具提升团队开发效率。喜欢用代码构建有趣的世界。
          </p>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            {[
              { icon: Github, href: siteConfig.github, label: "GitHub", hoverColor: "hover:text-anime-gold hover:border-anime-gold/30" },
              { icon: Twitter, href: "#", label: "Twitter", hoverColor: "hover:text-anime-sky hover:border-anime-sky/30" },
              { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email", hoverColor: "hover:text-anime-gold-light hover:border-anime-gold-light/30" },
              { icon: Globe, href: siteConfig.url, label: "Website", hoverColor: "hover:text-anime-lavender hover:border-anime-lavender/30" },
            ].map(({ icon: Icon, href, label, hoverColor }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-lg anime-panel-light flex items-center justify-center text-[#6b6773] ${hoverColor} transition-all cursor-pointer`}
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-anime-gold to-anime-gold-dark rounded-full" />
          <h2 className="text-2xl font-bold text-[#e8e4dc] font-serif">技术栈</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((group) => (
            <div key={group.category} className="anime-panel p-5 anime-card overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <group.icon className={`w-5 h-5 ${group.color}`} />
                <h3 className="font-bold text-[#e8e4dc]">
                  {group.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="inline-flex items-center px-2.5 py-1 text-xs text-[#9b97a0] rounded-full bg-anime-dark-mid/80 border border-anime-gold/10">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-anime-sky to-anime-lavender rounded-full" />
          <h2 className="text-2xl font-bold text-[#e8e4dc] font-serif">成长历程</h2>
        </div>
        <div className="space-y-0">
          {timeline.map((item, index) => (
            <div key={item.year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-lg anime-panel-light flex items-center justify-center ${item.color} text-xs font-bold flex-shrink-0`}>
                  {item.year.slice(2)}
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-anime-gold/20 to-transparent my-2" />
                )}
              </div>
              <div className="pb-8">
                <span className={`text-xs ${item.color} tracking-wider font-medium`}>{item.year}</span>
                <h3 className="text-base font-bold text-[#e8e4dc] mt-0.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6b6773] mt-1">
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
