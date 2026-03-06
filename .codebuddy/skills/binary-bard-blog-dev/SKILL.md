---
name: binary-bard-blog-dev
description: >
  This skill provides comprehensive development guidelines for the BinaryBardBlog personal tech blog project.
  It covers design system specifications (cyberpunk-anime dual-theme), component architecture patterns,
  configuration-driven development, animation system, Markdown rendering conventions, and page layout standards.
  This skill should be used when developing new features, modifying UI components, adding pages, or iterating
  on the BinaryBardBlog project. It encapsulates best practices learned from Mizuki (Material Design 3 blog)
  and leleo-home-page (minimalist personal homepage) reference projects.
---

# BinaryBardBlog Development Skill

## Purpose

Provide authoritative development guidelines for the BinaryBardBlog project — a React + TypeScript + Vite personal tech blog focused on Unreal Engine and game development topics. This skill ensures consistency across all development iterations by codifying design system rules, component patterns, configuration architecture, and animation conventions.

## When to Use

- Adding or modifying any UI component in the blog
- Creating new pages or routes
- Updating the design system (colors, typography, animations)
- Working with the Markdown rendering pipeline
- Modifying the configuration system
- Implementing responsive layouts
- Adding framer-motion animations

## Project Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 with custom `vite-plugin-blog` |
| Styling | Tailwind CSS 3.4 + CSS Variables (dual theme) |
| UI Components | shadcn/ui (Radix primitives) |
| Animation | framer-motion |
| Routing | React Router 6 |
| Markdown | react-markdown + remark-gfm + rehype-highlight + rehype-slug |
| Icons | lucide-react + react-icons |

### Directory Structure

```
src/
├── config/site.ts          # Central configuration (site info, nav, skills, projects)
├── components/
│   ├── layout/             # Layout shell: Layout, Header, Footer, Sidebar
│   ├── blog/               # Blog-specific: PostCard, PostContent, CodeBlock, TOC, etc.
│   ├── common/             # Shared: AnimatedPage, ReadingProgressBar, ImageLightbox, ScrollReveal
│   └── ui/                 # shadcn/ui primitives (badge, button, card, input, separator)
├── pages/                  # Route pages: Home, Post, Category, Archives, Search, About
├── hooks/                  # Custom hooks: useTheme, useScrollSpy, useSearch
├── lib/                    # Utilities: posts, search, toc, utils
├── plugins/                # Vite plugin for blog virtual modules
└── types/                  # TypeScript type definitions
```

### Virtual Module System

The blog uses a custom Vite plugin (`vite-plugin-blog.ts`) that reads `content/posts/*.md` at build time and exposes them as virtual modules:

- `virtual:blog-posts` — Array of post metadata (title, date, category, tags, slug, etc.)
- `virtual:blog-posts-full` — Full post content keyed by slug
- `virtual:search-index` — Pre-built search index

Import these modules directly in components. The plugin handles HMR in development.

### Configuration-Driven Architecture

All site-wide data lives in `src/config/site.ts`. Pages and components read from this config rather than hardcoding values. The config exports:

- `siteConfig` — Site metadata (title, description, author, URL, GitHub, email)
- `navLinks` — Navigation items array
- `socialLinks` — Social media links with icons
- `skills` — Personal skills with category and proficiency level (0-100)
- `projects` — Project showcase items with descriptions, tags, and links

## Design System

### Color Palette

The blog uses a dual-theme system via CSS Variables on `:root` (light) and `.dark` (dark).

**Dark Theme (Primary):**
| Token | Value | Usage |
|---|---|---|
| `anime-gold` | `#D4A44C` | Primary accent, headings, CTAs, progress bars |
| `anime-sky` | `#7EB8DA` | Secondary accent, links, info elements |
| `anime-lavender` | `#9B8EC4` | Tertiary accent, tags, decorative |
| `anime-dark` | `#0B0E1A` | Page background |
| `anime-panel` | `#111528` | Card/panel background |
| `anime-crimson` | `#C45C5C` | Error, danger states |
| `anime-emerald` | `#68B87A` | Success states |

**Light Theme:**
| Token | Value | Usage |
|---|---|---|
| Background | `#F8F6F1` | Warm paper tone |
| Panel | `#FFFFFF` | Card surfaces |
| Text primary | `#1A1A2E` | Headings |
| Text secondary | `#4A4A5A` | Body text |
| Accent | `#D4A44C` | Same gold accent for brand consistency |

### Typography

| Role | Font | Weight |
|---|---|---|
| Body text | Noto Sans SC | 400 |
| Headings | Noto Serif SC | 700-900 |
| Code | JetBrains Mono | 400 |
| Brand/Logo | ZCOOL KuaiLe | 400 |

### Visual Effects

- **Glassmorphism panels**: `backdrop-blur` + semi-transparent background + subtle border
- **Diamond corner decorations**: Rotated 45-degree squares at card corners
- **Breathing glow**: Pulsing `box-shadow` animation on key elements
- **Gradient scrollbar**: Gold-to-purple gradient on custom scrollbar
- **Background radials**: Subtle radial gradients on body (gold/blue/purple hues)

## Animation Conventions

### Page Transitions (framer-motion)

Wrap every page component with `<AnimatedPage>`:

```tsx
import AnimatedPage from "../components/common/AnimatedPage";

export default function MyPage() {
  return (
    <AnimatedPage>
      {/* page content */}
    </AnimatedPage>
  );
}
```

Standard page transition: `opacity: 0→1` + `y: 20→0` with 0.5s duration.

### Component Animations

| Pattern | Implementation |
|---|---|
| Card hover | `translateY(-4px)` + border glow + shadow expansion |
| List stagger | `staggerChildren: 0.1` in parent, each child fades in |
| Scroll reveal | `<ScrollReveal>` wrapper using Intersection Observer |
| Skill progress bars | Spring animation from 0 to target on viewport entry |
| Reading progress | Top 2px bar tracking scroll position |

### Animation Rules

1. Always use `framer-motion` for JS-driven animations (page transitions, stagger, spring)
2. Use Tailwind `transition-*` classes for simple hover/focus states
3. Respect `prefers-reduced-motion` — disable complex animations when set
4. Keep durations under 0.6s for interactions, 0.8s max for page transitions
5. Use `spring` type for physical-feeling animations (progress bars, cards)

## Component Patterns

### Card Component Style

All cards follow the glassmorphism panel pattern:

```tsx
<div className="bg-anime-panel/80 backdrop-blur-sm border border-anime-gold/10
                rounded-xl overflow-hidden hover:-translate-y-1
                transition-all duration-300 hover:border-anime-gold/30
                hover:shadow-lg hover:shadow-anime-gold/5">
  {/* card content */}
</div>
```

### Post Card Requirements

- Horizontal layout: cover image left (fixed width), content right
- Show pinned badge if `post.pinned === true`
- Display: category tag, title, description (2-line clamp), date, reading time
- Hover: card lifts + border glows

### Code Block Requirements

- Language label in top-right corner
- Copy button with success feedback
- Line numbers via CSS `counter-increment`
- Collapse/expand for blocks > 15 lines
- Theme: `atom-one-dark` for dark mode

### Image Handling

- All article images support click-to-enlarge via `<ImageLightbox>`
- Lightbox renders via React Portal to `document.body`
- Close on ESC key, backdrop click, or close button
- Scale + fade transition on open/close

## Page Layout Standards

### Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `lg+` (1024px+) | Two-column: main content + sidebar, Hero split layout, floating TOC |
| `md` (768px) | Single column, sidebar below content, Hero centered |
| `sm` (< 768px) | Full-width stack, hamburger menu, TOC hidden |

### Homepage Structure

1. Full-height Hero with particle canvas background
2. Personal intro (left) + character status card (right)
3. Scroll-down indicator arrow
4. Article list section with sidebar (dual-column)
5. Pinned articles appear first with gold badge

### Post Page Structure

1. Reading progress bar (fixed top, 2px height)
2. Post header panel (category, title, description, meta)
3. Content area: article body (left) + TOC (right, sticky)
4. Related posts section
5. Comments section (Giscus)

### Archives Page Structure

1. Timeline layout: year headings (large gold text) on left
2. Article nodes on right with connecting line
3. Each node: date + title + category badge
4. Scroll-triggered entrance animations

### About Page Structure

1. Profile section: avatar + name + title + bio + social links
2. Skills section: grid of category cards with progress bars
3. Projects showcase: card grid with cover, description, tags, links
4. Timeline: vertical chronological milestones

## Markdown Conventions

### Frontmatter Schema

```yaml
---
title: "Article Title"           # Required
description: "Brief summary"     # Required
date: "YYYY-MM-DD"             # Required
category: "Category Name"       # Required
tags: ["tag1", "tag2"]          # Required, array
cover: "/images/cover.jpg"      # Optional, relative to public/
pinned: true                    # Optional, defaults to false
---
```

### Custom Markdown Extensions

- **GitHub Card**: `[github-card:owner/repo](url)` renders as an interactive GitHub repository card
- **GFM Support**: Tables, strikethrough, task lists via `remark-gfm`
- **Code Highlighting**: Fenced code blocks with language tags, rendered with `highlight.js`
- **Heading IDs**: Auto-generated via `rehype-slug` for TOC anchoring

## Development Rules

1. **Configuration first**: Add new site-wide data to `src/config/site.ts`, not inline
2. **Preserve articles**: Never modify files in `content/posts/` unless explicitly asked
3. **Dual theme**: Every color must work in both light and dark modes — use CSS variables, not hardcoded colors
4. **Component size**: Keep each file under 300 lines; extract sub-components if needed
5. **Animation wrapping**: Use `<AnimatedPage>` for pages, `<ScrollReveal>` for scroll-triggered sections
6. **Import style**: Third-party packages by name, local files by relative path
7. **Error handling**: Use `console.error`, not try-catch blocks
8. **Type safety**: Export all interfaces/types that cross file boundaries
9. **Shadcn/ui**: Use existing shadcn components (Button, Card, Badge, Input, Separator) — do not recreate
10. **Performance**: Lazy-load heavy components; use Intersection Observer for scroll animations; framer-motion tree-shakes automatically

## Importing Articles from Word (.docx) Files

When a user requests to import an article from a `.docx` file into the blog, use the following approach. A `.docx` file is essentially a ZIP archive containing XML files. It can be parsed using Python's standard library (`zipfile` + `xml.etree.ElementTree`) without any third-party dependencies.

### Method Overview

1. **Create a Python extraction script** at `extract_docx.py` in the project root
2. **Run the script** to produce `extracted_content.txt` in the project root
3. **Read the extracted text** and manually compose the final Markdown post with proper frontmatter
4. **Clean up**: delete `extract_docx.py` and `extracted_content.txt` after the article is created

### Extraction Script Template

Place the following script at the project root as `extract_docx.py`. Adjust `docx_path` to the actual `.docx` file location:

```python
#!/usr/bin/env python3
"""Extract text content from a .docx file using only Python standard library."""
import zipfile
import xml.etree.ElementTree as ET
import sys
import os

WNS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

def extract_docx_text(docx_path, output_path):
    ns = {'w': WNS}
    paragraphs = []

    with zipfile.ZipFile(docx_path, 'r') as z:
        # 1. Build style map (style ID -> style name)
        style_map = {}
        if 'word/styles.xml' in z.namelist():
            with z.open('word/styles.xml') as sf:
                for style in ET.parse(sf).getroot().iter(f'{{{WNS}}}style'):
                    sid = style.get(f'{{{WNS}}}styleId', '')
                    sname_el = style.find('w:name', ns)
                    if sname_el is not None:
                        style_map[sid] = sname_el.get(f'{{{WNS}}}val', '')

        # 2. Parse main document
        with z.open('word/document.xml') as f:
            root = ET.parse(f).getroot()

            for para in root.iter(f'{{{WNS}}}p'):
                texts = []
                pPr = para.find('w:pPr', ns)
                style_name = ''
                numId = None
                ilvl = None

                if pPr is not None:
                    pStyle = pPr.find('w:pStyle', ns)
                    if pStyle is not None:
                        sid = pStyle.get(f'{{{WNS}}}val', '')
                        style_name = style_map.get(sid, sid).lower()

                    numPr = pPr.find('w:numPr', ns)
                    if numPr is not None:
                        ilvl_el = numPr.find('w:ilvl', ns)
                        numId_el = numPr.find('w:numId', ns)
                        if ilvl_el is not None:
                            ilvl = int(ilvl_el.get(f'{{{WNS}}}val', '0'))
                        if numId_el is not None:
                            numId = numId_el.get(f'{{{WNS}}}val', '')

                for run in para.iter(f'{{{WNS}}}r'):
                    rPr = run.find('w:rPr', ns)
                    is_bold = is_italic = is_code = False

                    if rPr is not None:
                        b_el = rPr.find('w:b', ns)
                        if b_el is not None:
                            bval = b_el.get(f'{{{WNS}}}val', 'true')
                            is_bold = bval not in ('0', 'false')
                        i_el = rPr.find('w:i', ns)
                        if i_el is not None:
                            ival = i_el.get(f'{{{WNS}}}val', 'true')
                            is_italic = ival not in ('0', 'false')
                        rFonts = rPr.find('w:rFonts', ns)
                        if rFonts is not None:
                            font = rFonts.get(f'{{{WNS}}}ascii', '').lower()
                            is_code = any(f in font for f in ['consolas', 'courier', 'mono', 'source code'])

                    for t in run.iter(f'{{{WNS}}}t'):
                        if t.text:
                            text = t.text
                            if is_code and not is_bold:
                                text = f'`{text}`'
                            elif is_bold and is_italic:
                                text = f'***{text}***'
                            elif is_bold:
                                text = f'**{text}**'
                            elif is_italic:
                                text = f'*{text}*'
                            texts.append(text)

                line = ''.join(texts)

                # Heading detection
                heading_level = 0
                for level in range(1, 7):
                    if f'heading {level}' in style_name or style_name == f'heading{level}':
                        heading_level = level
                        break
                if heading_level == 0 and 'title' in style_name:
                    heading_level = 1

                if heading_level > 0:
                    line = f'{"#" * heading_level} {line}'
                elif numId is not None:
                    indent = '  ' * (ilvl or 0)
                    line = f'{indent}- {line}'

                paragraphs.append(line)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(paragraphs))

    print(f'Extracted {len(paragraphs)} paragraphs to {output_path}')

if __name__ == '__main__':
    docx_path = r'<PATH_TO_DOCX_FILE>'          # e.g. r'D:\File\MyArticle.docx'
    output_path = r'i:\Project\BinaryBardBlog\extracted_content.txt'

    if not os.path.exists(docx_path):
        print(f'ERROR: File not found: {docx_path}')
        sys.exit(1)

    extract_docx_text(docx_path, output_path)
    print('Done!')
```

### How to Execute

Since the `.docx` file is typically outside the project workspace and cannot be read directly by file-reading tools, the script must be executed externally:

1. **Ask the user to run the script** via their system terminal:
   ```bash
   cd i:\Project\BinaryBardBlog
   python extract_docx.py
   ```
2. Once `extracted_content.txt` is generated, read it using `read_file` tool
3. Compose the final Markdown article from the extracted text, adding proper frontmatter and fixing formatting (code blocks, image references, etc.)

### Post-Extraction Workflow

After reading `extracted_content.txt`:

1. **Identify headings**: The script converts Word heading styles to Markdown `#` headings
2. **Fix code blocks**: The script marks inline code with backticks, but multi-line code blocks need manual fencing (````cpp ... `````)
3. **Handle images**: Word images are stored in `word/media/` inside the ZIP. If needed, extract them separately and place in `public/images/<post-slug>/`
4. **Write frontmatter**: Create proper frontmatter following the blog's schema (title, description, date, category, tags, cover, section)
5. **Save as Markdown**: Write the final `.md` file to `content/posts/<slug>.md`
6. **Clean up**: Delete `extract_docx.py` and `extracted_content.txt` from the project root

### Limitations

- **Images**: The script extracts text only. Word-embedded images must be extracted separately from the `word/media/` directory inside the `.docx` ZIP archive
- **Complex tables**: Simple text extraction may not preserve table formatting perfectly; manual adjustment may be needed
- **Code blocks**: Multi-line code blocks in Word (often formatted as monospace paragraphs) will appear as individual paragraphs with inline code markers — they need to be merged into fenced code blocks manually
- **Nested lists**: The script handles basic list nesting via `numPr` properties, but complex numbering schemes may need manual cleanup
