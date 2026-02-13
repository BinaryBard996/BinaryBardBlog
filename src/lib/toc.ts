import type { TOCItem } from "@/types/blog"

export function extractTOC(markdown: string): TOCItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const items: TOCItem[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "")

    items.push({ id, text, level })
  }

  return items
}
