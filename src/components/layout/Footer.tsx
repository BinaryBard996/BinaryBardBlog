import { Github, Mail, Rss, Heart } from "lucide-react"
import { siteConfig } from "@/types/blog"

export function Footer() {
  return (
    <footer className="border-t border-anime-gold/10 bg-anime-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-anime-gold to-anime-gold-dark flex items-center justify-center text-anime-dark font-bold text-xs shadow-anime-gold">
                BB
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-anime-gold to-anime-sky bg-clip-text text-transparent font-cute">
                {siteConfig.title}
              </span>
            </div>
            <p className="text-sm text-[#6b6773] leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-anime-gold tracking-wider">
              导航
            </h3>
            <ul className="space-y-2">
              {[
                { label: "首页", href: "/" },
                { label: "分类", href: "/categories" },
                { label: "关于", href: "/about" },
                { label: "RSS 订阅", href: "/rss.xml" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#6b6773] hover:text-anime-gold transition-colors"
                  >
                    <span className="text-anime-gold/50 mr-2">◆</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-anime-gold tracking-wider">
              联系
            </h3>
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg anime-panel-light flex items-center justify-center text-[#9b97a0] hover:text-anime-gold hover:border-anime-gold/30 transition-all cursor-pointer"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="w-9 h-9 rounded-lg anime-panel-light flex items-center justify-center text-[#9b97a0] hover:text-anime-sky hover:border-anime-sky/30 transition-all cursor-pointer"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg anime-panel-light flex items-center justify-center text-anime-gold hover:text-anime-gold-light hover:border-anime-gold/30 transition-all cursor-pointer"
                title="RSS"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-anime-gold/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#6b6773]">
            &copy; {new Date().getFullYear()} {siteConfig.title}. All rights reserved.
          </p>
          <p className="text-xs text-[#6b6773] flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-anime-crimson fill-anime-crimson" /> using React & Vite
          </p>
        </div>
      </div>
    </footer>
  )
}
