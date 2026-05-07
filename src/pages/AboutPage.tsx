import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Github, Mail, Globe, Gamepad2, Server, Wrench, Sparkles, MessageCircle, BookOpen } from "lucide-react"
import { Button } from "../components/ui/button"
import { AnimatedPage } from "../components/common/AnimatedPage"
import { ScrollReveal } from "../components/common/ScrollReveal"
import { siteConfig, socialLinks, skills, projects, timeline } from "../config/site"
import { useHead } from "../hooks/useHead"

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">{name}</span>
        <span className="text-anime-gold text-xs">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-anime-gold to-anime-sky"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay }}
        />
      </div>
    </div>
  )
}

const categoryIcons: Record<string, typeof Gamepad2> = {
  "游戏引擎": Gamepad2,
  "编程语言": Server,
  "游戏框架": Sparkles,
  "前端框架": Globe,
  "图形渲染": Sparkles,
  "开发工具": Wrench,
}

export function AboutPage() {
  useHead({
    title: "关于",
    description: "游戏开发者 BinaryBard 的个人简介 — 专注 Unreal Engine 与 GAS 框架",
  })
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Profile */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16">
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-anime-gold/20 to-anime-lavender/20 border-[3px] border-anime-gold/40 flex items-center justify-center text-anime-gold text-3xl font-bold shadow-glow-gold">
                BB
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-anime-emerald border-2 border-background rounded-full flex items-center justify-center">
                <span className="text-[8px] text-background font-bold">ON</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-black text-foreground mb-2 font-heading">
                {siteConfig.author}
              </h1>
              <p className="text-lg text-anime-gold font-medium mb-3">
                Game Developer & Tool Creator
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-xl mb-4">
                一名热爱游戏开发的创作者。专注于 Unreal Engine 开发与工具链建设，
                致力于用自动化工具提升团队开发效率。喜欢用代码构建有趣的世界。
              </p>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                {socialLinks.map(({ icon, href, label }) => {
                  const iconMap: Record<string, typeof Github> = {
                    Github, Mail, Globe, Zhihu: BookOpen,
                  }
                  const IconComp = iconMap[icon] || Globe
                  return (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-anime-gold hover:border-anime-gold/30 transition-all cursor-pointer"
                      title={label}
                    >
                      <IconComp className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Contact & About Me */}
        <section className="mb-16">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-gradient-to-b from-anime-emerald to-anime-sky rounded-full" />
              <h2 className="text-2xl font-bold text-foreground font-heading">关于我</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  你好！我是 BinaryBard，一名游戏开发者和工具创作者。我热衷于使用 Unreal Engine 构建游戏体验，
                  并且喜欢研究 Gameplay Ability System（GAS）框架来打造灵活强大的游戏系统。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  工作之余，我会将开发中的经验与思考整理成文章分享出来，希望能帮助到同样在游戏开发道路上探索的朋友们。
                  如果你对我的文章或项目有任何想法，欢迎通过以下方式联系我！
                </p>
              </div>
              <div className="border-t border-border pt-5">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">联系方式</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://www.zhihu.com/people/gao-gui-chun-he-zi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border hover:border-anime-gold/30 hover:bg-secondary/50 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-[#0066FF]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-anime-gold transition-colors">知乎</p>
                      <p className="text-xs text-muted-foreground">@gao-gui-chun-he-zi</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="w-9 h-9 rounded-lg bg-anime-sky/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-anime-sky" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">QQ</p>
                      <p className="text-xs text-muted-foreground">1194336281</p>
                    </div>
                  </div>
                  <a
                    href="mailto:1194336281@qq.com"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border hover:border-anime-gold/30 hover:bg-secondary/50 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-anime-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-anime-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-anime-gold transition-colors">邮箱</p>
                      <p className="text-xs text-muted-foreground">1194336281@qq.com</p>
                    </div>
                  </a>
                  <a
                    href="https://github.com/BinaryBard996"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border hover:border-anime-gold/30 hover:bg-secondary/50 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <Github className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-anime-gold transition-colors">GitHub</p>
                      <p className="text-xs text-muted-foreground">@BinaryBard996</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-gradient-to-b from-anime-gold to-anime-gold-dark rounded-full" />
              <h2 className="text-2xl font-bold text-foreground font-heading">技能</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(skillsByCategory).map(([category, catSkills], catIdx) => {
              const Icon = categoryIcons[category] || Sparkles
              return (
                <ScrollReveal key={category} delay={catIdx * 0.1}>
                  <div className="glass-panel rounded-xl p-5 hover:border-anime-gold/30 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className="w-5 h-5 text-anime-gold" />
                      <h3 className="font-bold text-foreground">{category}</h3>
                    </div>
                    <div className="space-y-3">
                      {catSkills.map((skill, idx) => (
                        <SkillBar
                          key={skill.name}
                          name={skill.name}
                          level={skill.level}
                          delay={catIdx * 0.1 + idx * 0.05}
                        />
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-16">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-gradient-to-b from-anime-sky to-anime-lavender rounded-full" />
              <h2 className="text-2xl font-bold text-foreground font-heading">项目作品</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <ScrollReveal key={project.title} delay={idx * 0.1}>
                <div className="glass-panel rounded-xl overflow-hidden hover:-translate-y-1 hover:border-anime-gold/30 transition-all duration-300 group">
                  {project.cover && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={`${import.meta.env.BASE_URL}${project.cover.replace(/^\//, "")}`}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-anime-gold transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs text-muted-foreground bg-secondary/80 border border-border rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-muted-foreground hover:text-anime-gold hover:border-anime-gold/30 cursor-pointer gap-1.5"
                        >
                          <Github className="w-3.5 h-3.5" />
                          查看源码
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-gradient-to-b from-anime-lavender to-anime-gold rounded-full" />
              <h2 className="text-2xl font-bold text-foreground font-heading">成长历程</h2>
            </div>
          </ScrollReveal>
          <div className="space-y-0">
            {timeline.map((item, index) => (
              <ScrollReveal key={item.year + item.title} delay={index * 0.1}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-anime-gold text-xs font-bold flex-shrink-0">
                      {item.year.slice(2)}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-anime-gold/20 to-transparent my-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-xs text-anime-gold tracking-wider font-medium">
                      {item.year}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </AnimatedPage>
  )
}
