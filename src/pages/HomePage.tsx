import { Github, Mail, ArrowDown, Sparkles } from "lucide-react"
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
      {/* Hero Section - Anime Style with Character Art Background */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/BinaryBardBlog/images/hero-banner.jpg)" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-anime-dark/60 via-anime-dark/40 to-anime-dark/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-anime-dark/80 via-transparent to-anime-dark/60" />
        {/* Subtle gold particle effect via radial gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-anime-gold/40 animate-float" />
          <div className="absolute top-[40%] left-[25%] w-1.5 h-1.5 rounded-full bg-anime-gold/30 animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[30%] right-[20%] w-1 h-1 rounded-full bg-anime-sky/40 animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-[30%] left-[40%] w-2 h-2 rounded-full bg-anime-lavender/30 animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-[60%] right-[35%] w-1.5 h-1.5 rounded-full bg-anime-gold/20 animate-float" style={{ animationDelay: "0.5s" }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Info */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-anime-gold/30 bg-anime-gold/5 text-anime-gold text-sm rounded-full backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs tracking-wider font-medium">Game Developer & Creator</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-[#e8e4dc]">Hi, 我是</span>{" "}
                <span className="bg-gradient-to-r from-anime-gold via-anime-gold-light to-anime-sky bg-clip-text text-transparent gold-text">
                  BinaryBard
                </span>
              </h1>
              <p className="text-lg text-[#9b97a0] max-w-lg leading-relaxed">
                热爱游戏开发的创作者。这里记录我在 <span className="text-anime-sky">Unreal Engine</span> 与软件工程旅途中的思考与实践。
              </p>
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-anime-gold to-anime-gold-dark hover:from-anime-gold-light hover:to-anime-gold text-anime-dark shadow-anime-gold gap-2 cursor-pointer font-bold border-0 shimmer-btn rounded-lg">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                </a>
                <a href={`mailto:${siteConfig.email}`}>
                  <Button variant="outline" className="border-anime-gold/30 text-[#e8e4dc] hover:bg-anime-gold/10 hover:border-anime-gold/50 hover:text-anime-gold gap-2 cursor-pointer bg-transparent backdrop-blur-sm rounded-lg">
                    <Mail className="w-4 h-4" />
                    联系我
                  </Button>
                </a>
              </div>
            </div>

            {/* Right: Character Status Card */}
            <div className="flex-shrink-0 w-full max-w-sm hidden lg:block">
              <div className="anime-panel p-6 diamond-corner diagonal-stripe animate-breath-glow">
                {/* Card header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-anime-gold/15">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-anime-gold/20 to-anime-lavender/20 border-2 border-anime-gold/30 flex items-center justify-center">
                    <span className="text-anime-gold font-bold text-lg">B</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#e8e4dc] text-base">BinaryBard</p>
                    <p className="text-xs text-anime-gold">◆ Game Developer</p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6773]">引擎</span>
                    <span className="text-anime-sky font-medium">Unreal Engine 5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6773]">语言</span>
                    <span className="text-anime-gold-light font-medium">C++ · Blueprint · Python</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6773]">方向</span>
                    <span className="text-[#c8c4bc] font-medium">GAS · 工具开发 · 工作流</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-anime-gold/10">
                    <p className="text-anime-gold italic text-center text-xs">"用代码构建有趣的世界"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center pt-16">
            <div className="flex flex-col items-center gap-2 text-[#6b6773]">
              <span className="text-xs tracking-wider">向下滚动</span>
              <ArrowDown className="w-4 h-4 animate-bounce text-anime-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-anime-gold to-anime-gold-dark rounded-full" />
                <h2 className="text-2xl font-bold text-[#e8e4dc] font-serif">
                  最新文章
                </h2>
              </div>
              <span className="text-xs text-anime-gold/60 tracking-wider">
                {posts.length} 篇文章
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
