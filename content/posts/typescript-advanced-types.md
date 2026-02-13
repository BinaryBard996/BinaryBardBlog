---
title: "TypeScript 高级类型技巧：让类型系统为你工作"
description: "探索 TypeScript 高级类型系统的强大功能，包括条件类型、映射类型、模板字面量类型等实用技巧。"
date: "2026-02-08"
category: "前端开发"
tags: ["TypeScript", "类型系统", "前端工程化"]
cover: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop"
---

## 引言

TypeScript 的类型系统是图灵完备的，这意味着你可以在类型层面进行复杂的运算和推导。掌握高级类型技巧，能让你的代码更安全、更具表达力。

## 条件类型

条件类型是 TypeScript 中最强大的特性之一：

```typescript
// 基础条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false

// 实用的条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;    // string
type Num = Flatten<number>;      // number
```

## 映射类型

映射类型可以基于已有类型创建新类型：

```typescript
// 将所有属性变为可选
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// 将所有属性变为只读
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// 实战: 创建表单验证类型
type FormErrors<T> = {
  [K in keyof T]?: string;
};

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

type LoginErrors = FormErrors<LoginForm>;
// { username?: string; password?: string; remember?: string }
```

## 模板字面量类型

TypeScript 4.1 引入的模板字面量类型为字符串操作带来了类型安全：

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">; // "onClick"

// 生成 CSS 属性类型
type CSSProperty = "margin" | "padding";
type Direction = "top" | "right" | "bottom" | "left";
type CSSSpacing = `${CSSProperty}-${Direction}`;
// "margin-top" | "margin-right" | ... | "padding-left"
```

## 递归类型

递归类型可以处理嵌套数据结构：

```typescript
// 深度只读
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

// 深度可选
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>
    : T[K];
};

// JSON 类型
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };
```

## 实用类型工具

### 类型安全的事件处理

```typescript
type EventMap = {
  click: { x: number; y: number };
  keydown: { key: string; code: string };
  resize: { width: number; height: number };
};

function on<K extends keyof EventMap>(
  event: K,
  handler: (payload: EventMap[K]) => void
) {
  // 类型安全的事件注册
}

on("click", ({ x, y }) => console.log(x, y)); // 完全类型安全
```

## 总结

TypeScript 的类型系统是一个强大的工具。合理运用高级类型技巧，不仅能提高代码质量，还能提供更好的开发体验和 IDE 支持。类型即文档，让类型系统为你的代码保驾护航。
