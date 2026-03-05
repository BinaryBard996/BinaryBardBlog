import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { SearchDialog } from "../blog/SearchDialog"

export function Layout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === "Escape") setIsSearchOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearchOpen={() => setIsSearchOpen(true)} />
      <main className="flex-1 pt-16">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
