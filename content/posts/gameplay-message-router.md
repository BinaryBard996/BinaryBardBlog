---
title: "GameplayMessageRouter介绍和功能扩展"
description: "介绍 Lyra 项目中的 GameplayMessageRouter 插件，一个基于 GameplayTag 的轻量级 Gameplay 消息路由框架。在保留原有能力的基础上，扩展了 Actor 定向消息和 GAS AbilityTask 支持。"
date: "2026-06-05"
category: "Unreal Engine"
tags: ["UE", "Lyra", "GameplayMessageRouter", "GAS", "GameplayTag", "插件开发", "消息路由"]
cover: "/images/gameplay-message-router/image_1.png"
section: "arcane"
---

## 插件说明
`GameplayMessageRouter` 是`Lyra`项目内的一个轻量级 Gameplay 消息路由插件，通过GameplayTag收发消息，消息可以使用任意的结构体进行传输。用来在彼此没有直接引用关系的对象之间传递事件，可以减少不同系统之间的耦合。
它更像是项目中的 Gameplay 事件总线，适合处理角色状态变化、技能阶段通知、伤害命中事件、UI 刷新通知，以及蓝图和 C++ 之间的解耦通信。
## 原插件提供的能力
原始插件的核心是 `UGameplayMessageSubsystem`。它作为 `GameInstanceSubsystem` 存在，负责维护频道和监听者之间的关系。
它主要提供以下能力：
- **基于 GameplayTag 的消息频道**：用标签表达事件语义，例如 `Message.Combat.Hit`、`Message.Ability.Start`。
- **基于结构体的消息内容**：消息 Payload 使用 `USTRUCT`，可以广播任意结构体的数据，广播和监听时会校验结构体类型。
- **精确匹配和父子频道匹配**：监听者既可以只监听完全相同的频道，也可以监听某个父级频道下的所有子事件。
- **C++ 监听和反注册**：注册监听后会返回 `FGameplayMessageListenerHandle`，用于取消监听。
- **蓝图异步监听节点**：蓝图可以监听指定频道，并通过动态 Payload 引脚获取消息内容。
这套机制的价值在于降低系统之间的直接依赖。比如伤害系统只负责广播"发生了命中"，UI、音效、相机或任务系统可以各自监听，不需要伤害系统逐个调用它们。
发送方只需要把一个结构体消息广播到指定 `GameplayTag` 频道，接收方只需要监听同一个频道即可。

![GameplayMessageRouter 消息广播与监听示意](/images/gameplay-message-router/image_1.png)

这个插件基于UE编辑器的反射等机制实现了一些有用的功能，比如BroadcastMessage函数支持输入任意的结构（C++层可以通过模板函数实现这个功能，蓝图层面可以通过重写UHT生成的蓝图函数，从蓝图栈里获取结构体类型和地址来实现这个功能），ListenForGameplayMessages的Payload基于PayloadType自动返回对应的结构体数据。相关的讲解直接搜索GameplayMessageRouter就可以看到对应的文章，我这里就不进行额外的介绍了。
PS. 依据之前的使用经验，如果在Plugin的蓝图里使用这个Task蓝图节点，有可能会出现节点丢失的问题，因为蓝图里它实际上是`UK2Node_AsyncAction`，因此可能会因为Module的加载顺序导致蓝图节点丢失，通过修改GameplayMessageNodes的Module加载时机为PreDefault可有效修复这一问题（大部分情况）。
也可以通过GetPayload函数来获取数据，避免直接在蓝图节点上使用Payload来避免这一问题。

![通过 GetPayload 获取消息内容](/images/gameplay-message-router/image_2.png)

## 扩展
原有的插件用起来已经挺不错了，但是存在以下几个缺点：
1. 消息的广播是全局的，缺少了针对Actor的定向广播。
1. 目前只实现了AsyncAction，对于GAS的适配度不够。
本项目在保留原有消息路由能力的基础上，针对动作战斗和 GAS 技能系统补充了几项扩展。
### 1. Actor 定向消息
原插件更偏向全局频道广播：只要监听了同一个频道，就可能收到消息。
本项目增加了面向指定 Actor 的消息发送和监听能力：
- `BroadcastMessageToActor`
- `RegisterListenerToActor`
- `ListenForGameplayMessagesToActor`
这样可以把消息只发送给某个 Actor 相关的监听者。例如某个角色受到攻击时，可以只向这个角色广播受击消息，而不是让所有监听者都收到后再自行判断目标是否匹配。
这对战斗系统很重要，因为很多事件都和具体角色或目标有关，例如受伤、硬直、锁定、命中反馈、角色 UI 刷新等。

![Actor 定向消息广播的蓝图节点](/images/gameplay-message-router/image_3.png)

### 2. 增加 GAS AbilityTask 支持
项目新增了 `UAbilityTask_ListenForGameplayMessage`，让 `GameplayAbility` 可以在激活期间等待 GameplayMessage。
它支持两种监听方式：
- 监听普通频道消息；
- 监听发给指定 Actor 的定向消息。
这使技能逻辑可以通过标准 `AbilityTask` 流程等待外部事件。例如技能播放攻击动画后，等待一次命中消息，再继续执行后续效果。

![AbilityTask 监听 GameplayMessage 的蓝图节点](/images/gameplay-message-router/image_4.png)


## 项目地址
https://github.com/BinaryBard996/GameplayMessageRouter
