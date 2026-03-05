export interface SiteConfig {
  title: string
  description: string
  author: string
  url: string
  github: string
  email: string
  avatar?: string
  motto?: string
}

export interface NavLink {
  label: string
  path: string
}

export interface SocialLink {
  icon: string
  href: string
  label: string
}

export interface Skill {
  name: string
  category: string
  level: number
}

export interface Project {
  title: string
  description: string
  tags: string[]
  link?: string
  github?: string
  cover?: string
}

export interface TimelineEvent {
  year: string
  title: string
  description: string
}

export const siteConfig: SiteConfig = {
  title: "BinaryBard",
  description: "游戏开发者的技术博客，专注 Unreal Engine 与软件工程",
  author: "BinaryBard",
  url: "https://binary-bard-blog-8fvf1sg82895f0b-1404499502.tcloudbaseapp.com",
  github: "https://github.com/BinaryBard996",
  email: "hello@binarybard.dev",
  avatar: "/images/hero-banner.jpg",
  motto: "用代码构建虚拟世界",
}

export const navLinks: NavLink[] = [
  { path: "/", label: "首页" },
  { path: "/archives", label: "归档" },
  { path: "/about", label: "关于" },
]

export const socialLinks: SocialLink[] = [
  { icon: "Github", href: "https://github.com/BinaryBard996", label: "GitHub" },
  { icon: "Mail", href: "mailto:hello@binarybard.dev", label: "Email" },
  { icon: "Rss", href: "/rss.xml", label: "RSS" },
]

export const skills: Skill[] = [
  { name: "Unreal Engine", category: "游戏引擎", level: 90 },
  { name: "C++", category: "编程语言", level: 85 },
  { name: "Blueprint", category: "游戏引擎", level: 88 },
  { name: "GAS", category: "游戏框架", level: 92 },
  { name: "TypeScript", category: "编程语言", level: 75 },
  { name: "React", category: "前端框架", level: 70 },
  { name: "Python", category: "编程语言", level: 65 },
  { name: "Shader / HLSL", category: "图形渲染", level: 60 },
  { name: "Git", category: "开发工具", level: 80 },
  { name: "Perforce", category: "开发工具", level: 70 },
]

export const projects: Project[] = [
  {
    title: "AbilityEditorHelper",
    description: "基于 Schema 驱动的 UE GAS 配置自动化工具，让策划用 Excel 配置 GameplayEffect 和 GameplayAbility",
    tags: ["UE", "GAS", "C++", "工具链"],
    github: "https://github.com/BinaryBard996",
    cover: "/images/ability-editor-helper/cover.jpg",
  },
  {
    title: "TurnBasedSample",
    description: "改造 GAS 插件支持回合制游戏，用自定义 Timer 管理器替代实时计时器",
    tags: ["UE", "GAS", "C++", "回合制"],
    github: "https://github.com/BinaryBard996/TurnBasedSample",
    cover: "/images/turn-based-gas-cover.png",
  },
]

export const timeline: TimelineEvent[] = [
  { year: "2026", title: "技术博客启航", description: "开始撰写 Unreal Engine 技术博客，分享 GAS 框架深度实践" },
  { year: "2025", title: "深入 GAS 框架", description: "专注研究 Gameplay Ability System，开发自动化配置工具和回合制改造方案" },
  { year: "2024", title: "踏入游戏开发", description: "正式使用 Unreal Engine 进行游戏开发，学习 C++ 和 Blueprint" },
  { year: "2023", title: "编程启蒙", description: "开始学习编程，接触 Python 和 Web 开发技术" },
]
