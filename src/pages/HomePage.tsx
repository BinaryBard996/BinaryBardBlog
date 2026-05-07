import { Github, Mail, ArrowDown, Sparkles, ScrollText, Clapperboard, Hammer, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { AnimatedPage } from "../components/common/AnimatedPage"
import { ScrollReveal } from "../components/common/ScrollReveal"
import { PostCard } from "../components/blog/PostCard"
import { sortWithPinned } from "../lib/posts"
import { siteConfig, sections } from "../config/site"
import { useHead } from "../hooks/useHead"
import posts from "virtual:blog-posts"

const sectionIcons: Record<string, React.ReactNode> = {
  ScrollText: <ScrollText className="w-6 h-6" />,
  Clapperboard: <Clapperboard className="w-6 h-6" />,
  Hammer: <Hammer className="w-6 h-6" />,
}

const sectionColorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  "anime-sky": { border: "border-anime-sky/30", bg: "bg-anime-sky/10", text: "text-anime-sky", glow: "group-hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]" },
  "anime-lavender": { border: "border-anime-lavender/30", bg: "bg-anime-lavender/10", text: "text-anime-lavender", glow: "group-hover:shadow-[0_0_20px_rgba(167,139,250,0.15)]" },
  "anime-gold": { border: "border-anime-gold/30", bg: "bg-anime-gold/10", text: "text-anime-gold", glow: "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]" },
}

const particleVariants = {
  animate: (i: number) => ({
    y: [0, -15, 0],
    opacity: [0.3, 0.7, 0.3],
    transition: {
      duration: 3 + i * 0.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
}

export function HomePage() {
  const sortedPosts = sortWithPinned(posts)
  const recentPosts = sortedPosts.slice(0, 3)

  useHead({
    title: "首页",
    description: siteConfig.description,
    ogTitle: siteConfig.title,
    ogDescription: siteConfig.description,
    ogType: "website",
    canonicalUrl: siteConfig.url,
  })

  return (
    <AnimatedPage>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-banner.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { top: "20%", left: "15%", size: "w-2 h-2", color: "bg-anime-gold/40" },
            { top: "40%", left: "25%", size: "w-1.5 h-1.5", color: "bg-anime-gold/30" },
            { top: "30%", left: "80%", size: "w-1 h-1", color: "bg-anime-sky/40" },
            { top: "70%", left: "40%", size: "w-2 h-2", color: "bg-anime-lavender/30" },
            { top: "60%", left: "65%", size: "w-1.5 h-1.5", color: "bg-anime-gold/20" },
          ].map((p, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={particleVariants}
              animate="animate"
              className={`absolute rounded-full ${p.size} ${p.color}`}
              style={{ top: p.top, left: p.left }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Info */}
            <motion.div
              className="flex-1 text-center lg:text-left space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-anime-gold/30 bg-anime-gold/5 text-anime-gold text-sm rounded-full backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs tracking-wider font-medium">Game Developer & Creator</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight font-heading">
                <span className="text-foreground">此处记录着一位名为</span>{" "}
                <span className="bg-gradient-to-r from-anime-gold via-anime-gold-light to-anime-sky bg-clip-text text-transparent">
                  BinaryBard
                </span>
                <span className="text-foreground">的持键小子</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                据说精通{" "}
                <span className="text-anime-sky">虚幻引擎</span>{" "}
                的奥术，擅长将混沌的需求炼成可运行的秩序。曾在蓝图的迷宫中迷路三天，靠一壶咖啡和 printf 活着走了出来。现记录旅途见闻于此。
              </p>
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-anime-gold to-anime-gold-dark hover:from-anime-gold-light hover:to-anime-gold text-background shadow-glow-gold gap-2 cursor-pointer font-bold border-0 shimmer-btn rounded-lg">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                </a>
                <Link to="/about">
                  <Button variant="outline" className="border-anime-gold/30 text-foreground hover:bg-anime-gold/10 hover:border-anime-gold/50 hover:text-anime-gold gap-2 cursor-pointer bg-transparent backdrop-blur-sm rounded-lg">
                    <Mail className="w-4 h-4" />
                    联系我
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Character Status Card */}
            <motion.div
              className="flex-shrink-0 w-full max-w-sm hidden lg:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                <div className="diamond-corner" />
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-anime-gold/20 to-anime-lavender/20 border-2 border-anime-gold/30 flex items-center justify-center">
                    <span className="text-anime-gold font-bold text-lg">B</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-base">BinaryBard</p>
                    <p className="text-xs text-anime-gold">◆ Game Developer</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">引擎</span>
                    <span className="text-anime-sky font-medium">Unreal Engine 5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">语言</span>
                    <span className="text-anime-gold-light font-medium">C++ · Blueprint · Python</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">方向</span>
                    <span className="text-foreground/80 font-medium">GAS · 工具开发 · 工作流</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border">
                    <p className="text-anime-gold italic text-center text-xs">
                      "{siteConfig.motto}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="flex justify-center pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-xs tracking-wider">向下滚动</span>
              <ArrowDown className="w-4 h-4 animate-bounce text-anime-gold" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sections Entrance */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border bg-secondary/30 text-muted-foreground text-sm rounded-full mb-4">
              <span className="text-xs tracking-wider font-medium">三座殿堂，各有所藏</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map((sec, i) => {
              const colors = sectionColorMap[sec.color]
              const sectionPosts = posts.filter((p: any) => p.section === sec.key)
              return (
                <motion.div
                  key={sec.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <Link to={sec.path} className="group block">
                    <div className={`glass-panel p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 ${colors.glow} border ${colors.border} hover:${colors.border}`}>
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4 ${colors.text}`}>
                        {sectionIcons[sec.icon]}
                      </div>
                      <h3 className={`text-xl font-bold ${colors.text} mb-1 font-heading`}>
                        {sec.title}
                      </h3>
                      <p className="text-xs text-muted-foreground tracking-wider mb-3">
                        {sec.subtitle}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {sec.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {sectionPosts.length} 篇文章
                        </span>
                        <span className={`text-xs ${colors.text} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium`}>
                          进入 <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-anime-gold to-anime-gold-dark rounded-full" />
                <h2 className="text-2xl font-bold text-foreground font-heading">
                  最近更新
                </h2>
              </div>
              <span className="text-xs text-anime-gold/60 tracking-wider">
                {posts.length} 篇文章
              </span>
            </div>
            <div className="space-y-4">
              {recentPosts.map((post: any, i: number) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}
    </AnimatedPage>
  )
}
