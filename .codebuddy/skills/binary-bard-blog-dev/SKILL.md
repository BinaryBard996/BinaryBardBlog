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
