import { Github, Mail, Rss, Heart } from "lucide-react"
import { siteConfig, navLinks, socialLinks } from "../../config/site"

export function Footer() {
  const iconMap: Record<string, React.ReactNode> = {
    Github: <Github className="w-4 h-4" />,
    Mail: <Mail className="w-4 h-4" />,
    Rss: <Rss className="w-4 h-4" />,
  }

  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-anime-gold to-anime-gold-dark flex items-center justify-center text-anime-dark font-bold text-xs shadow-glow-gold">BB</div>
              <span className="text-lg font-bold bg-gradient-to-r from-anime-gold to-anime-sky bg-clip-text text-transparent font-cute">{siteConfig.title}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{siteConfig.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-anime-gold tracking-wider">导航</h3>
            <ul className="space-y-2">
              {[...navLinks, { label: "RSS 订阅", path: "/rss.xml" }].map((link) => (
                <li key={link.label}>
                  <a href={link.path} className="text-sm text-muted-foreground hover:text-anime-gold transition-colors">
                    <span className="text-anime-gold/40 mr-2">◆</span>{link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-anime-gold tracking-wider">联系</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 rounded-lg glass-panel flex items-center justify-center text-muted-foreground hover:text-anime-gold transition-all cursor-pointer" title={s.label}>
                  {iconMap[s.icon] || <span>{s.icon}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} {siteConfig.title}. All rights reserved.</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">Built with <Heart className="w-3 h-3 text-anime-crimson fill-anime-crimson" /> React & Vite</p>
        </div>
      </div>
    </footer>
  )
}
