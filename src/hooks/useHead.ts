import { useEffect } from "react"

interface HeadOptions {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
  jsonLd?: Record<string, any>
}

export function useHead(options: HeadOptions) {
  useEffect(() => {
    const { title, description, ogTitle, ogDescription, ogImage, ogType, canonicalUrl, jsonLd } = options

    // Title
    if (title) {
      document.title = `${title} | BinaryBard`
    }

    const setMeta = (property: string, content: string, isName = false) => {
      const attr = isName ? "name" : "property"
      let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, property)
        document.head.appendChild(el)
      }
      el.setAttribute("content", content)
    }

    if (description) setMeta("description", description, true)
    if (ogTitle) setMeta("og:title", ogTitle)
    if (ogDescription) setMeta("og:description", ogDescription)
    if (ogImage) setMeta("og:image", ogImage)
    if (ogType) setMeta("og:type", ogType)

    // Canonical
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement("link")
        link.setAttribute("rel", "canonical")
        document.head.appendChild(link)
      }
      link.setAttribute("href", canonicalUrl)
    }

    // JSON-LD
    if (jsonLd) {
      let script = document.querySelector('script[data-seo="json-ld"]') as HTMLScriptElement | null
      if (!script) {
        script = document.createElement("script")
        script.setAttribute("type", "application/ld+json")
        script.setAttribute("data-seo", "json-ld")
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    }

    return () => {
      // Reset to defaults on unmount
      document.title = "BinaryBard Blog"
      const jsonLdScript = document.querySelector('script[data-seo="json-ld"]')
      if (jsonLdScript) jsonLdScript.remove()
    }
  }, [
    options.title,
    options.description,
    options.ogTitle,
    options.ogDescription,
    options.ogImage,
    options.ogType,
    options.canonicalUrl,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(options.jsonLd),
  ])
}
