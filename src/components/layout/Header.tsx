import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, Sun, Moon, Menu, X, Rss } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { useTheme } from "../../hooks/useTheme"
import { siteConfig, navLinks } from "../../config/site"

interface HeaderProps {
  onSearchOpen: () => void
}

export function Header({ onSearchOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-anime-gold to-anime-gold-dark flex items-center justify-center text-anime-dark font-bold text-sm shadow-glow-gold transition-shadow group-hover:shadow-glow-gold-strong">
              BB
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-anime-gold via-anime-gold-light to-anime-sky bg-clip-text text-transparent font-cute">
              {siteConfig.title}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path ? "text-anime-gold" : "text-muted-foreground hover:text-anime-gold-light"
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-anime-gold to-anime-sky rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onSearchOpen} className="text-muted-foreground hover:text-anime-sky hover:bg-anime-sky/10" title="搜索 (Ctrl+K)">
              <Search className="h-4 w-4" />
            </Button>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex">
              <Button variant="ghost" size="icon" className="text-anime-gold hover:text-anime-gold-light hover:bg-anime-gold/10" title="RSS">
                <Rss className="h-4 w-4" />
              </Button>
            </a>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-anime-gold hover:text-anime-gold-light hover:bg-anime-gold/10" title={theme === "dark" ? "亮色模式" : "暗色模式"}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden border-t border-border">
              <nav className="flex flex-col gap-1 py-4">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? "text-anime-gold bg-anime-gold/10" : "text-muted-foreground hover:text-anime-gold-light hover:bg-secondary/50"}`}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
