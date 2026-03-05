import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, Sun, Moon, Menu, X, Rss } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"
import { siteConfig } from "@/types/blog"

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/categories", label: "分类" },
  { href: "/about", label: "关于" },
]

interface HeaderProps {
  onSearchOpen: () => void
}

export function Header({ onSearchOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-anime-gold to-anime-gold-dark flex items-center justify-center text-anime-dark font-bold text-sm shadow-anime-gold transition-shadow group-hover:shadow-anime-gold-strong">
                BB
              </div>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-anime-gold via-anime-gold-light to-anime-sky bg-clip-text text-transparent font-cute">
              {siteConfig.title}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? "text-anime-gold"
                    : "text-[#9b97a0] hover:text-anime-gold-light"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {location.pathname === link.href && (
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-anime-gold to-anime-gold-light rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchOpen}
              className="text-[#9b97a0] hover:text-anime-sky hover:bg-anime-sky/10"
              title="搜索 (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
            </Button>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-anime-gold hover:text-anime-gold-light hover:bg-anime-gold/10"
                title="RSS 订阅"
              >
                <Rss className="h-4 w-4" />
              </Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-anime-gold hover:text-anime-gold-light hover:bg-anime-gold/10"
              title={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#9b97a0]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-anime-gold/10 animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-anime-gold bg-anime-gold/10"
                      : "text-[#9b97a0] hover:text-anime-gold-light hover:bg-anime-panel/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
