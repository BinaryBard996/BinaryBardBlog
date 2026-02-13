import { useState, useEffect, useRef } from "react"

export function useScrollSpy(ids: string[], offset: number = 100) {
  const [activeId, setActiveId] = useState<string>("")
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: `-${offset}px 0px -80% 0px`,
        threshold: 0,
      }
    )

    for (const el of elements) {
      observer.current.observe(el)
    }

    return () => {
      observer.current?.disconnect()
    }
  }, [ids, offset])

  return activeId
}
