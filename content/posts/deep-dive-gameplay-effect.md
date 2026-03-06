---
title: "深入理解 GameplayEffect"
description: "深入解析 UE GAS 中 GameplayEffect 的核心实现机制，包括 Duration Effect 的生效流程、属性聚合器（Aggregator）与多 Channel 计算、GE 预测与回滚、堆叠（Stack）原理，以及如何通过 GE Component 扩展自定义功能。"
date: "2026-03-06"
category: "Unreal Engine"
tags: ["UE", "GAS", "GameplayEffect", "Attribute", "预测", "Stack", "GE Component"]
cover: "/images/deep-dive-gameplay-effect-cover.jpg"
section: "arcane"
---

## 前言

本篇文章主要是针对 GE 的一些细节的实现进行深入的解读，需要具备 GAS 的相关基础，并且不可避免地需要看 C++ 代码，但在这篇文章中，我会尽量减少贴代码，用尽量简单的描述来解释清楚相关机制背后的实现原理，有需要的读者可以去看源码，结合着本文可以有更深入的理解，本文很多地方都会相对简述，难免有挂一漏万之处。

在和二次元的动作大佬 Cherry Zhuang 交流后，我也认为一个好的学习方式是从问问题开始的，遇到一个功能，对不了解的地方从一个问题开始，可以解答后，然后继续针对还有疑问的地方提问，回答，直到终点为止，当绝大多数问题得到解答以后，对相关的知识也就能够掌握了。

GE 功能拓展的代码参考已经放到 Github 上，在插件 BinaryCombat 下，可以找到 `BinaryGameplayEffectComp_Attribute`，有兴趣的可以自己去看。

[github-card:BinaryBard996/BinaryCombatSample](https://github.com/BinaryBard996/BinaryCombatSample.git)

本篇文章由四个部分组成：**解析 Duration Effect**，**解析 GE 的预测**，**Stack Effect 的原理**，**扩展 GE 功能**。那么从第一个问题开始：

## 一、解析 Duration Effect

### Duration Effect 是如何生效的？

对 GAS 有一个基础的了解后，我们会知道，GE 分为持续性的和瞬时的，瞬时的比较好理解，修改完角色属性后就不存在了，那么对于会持续存在的 Duration Effect，GAS 里是如何实现它的呢？

首先，在 GAS 系统当中，Effect 本身并不会实例化，我们使用的所有 `GameplayEffect` 都是 CDO，当 `ApplyEffect` 后，实际生成的一个实例，是结构体 `FActiveGameplayEffect`，它会储存在 ASC 的 `ActiveContainer` 中。游戏内所有的 GE 效果都会储存在这里，同时模拟端的 GE 也是通过它进行网络同步的（在默认模式下，只有主控端的 ActiveEffect 会同步）。

对这个流程感兴趣的可以自己去看函数 `UAbilitySystemComponent::ApplyGameplayEffectSpecToSelf`，会调用 `ActiveGameplayEffects.ApplyGameplayEffectSpec(Spec, PredictionKey, bFoundExistingStackableGE)` 生成实例化 GE，具体的过程我就不赘述了，有一个概念就行。

我们已经有了实例化的 GE——ActiveEffect 了，它可以被认为是 Duration Effect 本身，它已经被 Add 进 `ActiveEffectContainer` 中了，但此时它并没有任何实际的效果。很自然地就会需要提问：**Duration Effect 是在什么地方开始生效的？** 这关联了以下两个问题。

### GE 是如何激活并生效的？激活与关闭是如何实现的？

这两个问题是相互关联的，当 `ActiveEffectContainer` 创建 GE 时，会调用函数 `InternalOnActiveGameplayEffectAdded`，在这里激活 GE 让其生效，激活函数实际意思为，**关闭 ActiveGE（InhibitEffect）**，输入为 `true` 关闭 GE，`false` 激活 GE，方便理解我就直接把这里的行为称作激活了 GE。

需要注意的是，这里的 Inhibit 指的是让 GE 激活和关闭，并不会将 GE 移除，它只是让 GE 的效果被关闭了，和 Add 和 Remove 的概念是不一样的。可以理解为 GE 首先生成 `ActiveEffect` 实例，被添加 Add 到 `ActiveEffectContainer` 中，然后通过激活（!Inhibit）GE 产生实际的效果，包括添加 tag，修改属性等。

有了激活，可以联想到，在 GE 里可以通过配置，让 ActiveGE 在某些 tag 下生效，没有这些 tag 的时候无效，这是怎么实现的呢？没错，同样是通过调用 InhibitGE 这个函数。

如果看过我之前解析 GAS 在 5.3 改动的那篇文章，就会知道 GE 在 5.3 之后，功能是通过 `EffectComponent` 去实现的，而 `TargetTagRequirementGameplayEffectComponent` 的作用是，在满足特定 Tag 条件后，会添加移除，或者激活关闭 GE。

它的实现方式为，在 GE 被添加时，监听 ASC 中 tag 变化的消息，当 tag 发生变化时，会触发函数 `UTargetTagRequirementsGameplayEffectComponent::OnTagChanged`，然后判断是否满足 GE 激活的条件，如果不满足，则调用 Inhibit 函数去关闭 GE。

有了这个例子作为参考，我们可以很容易衍生出去，是否可以对 GE 的功能进行扩展，**能不能在特定属性的条件下添加移除 GE，或者激活关闭 GE 呢？**

答案是 YES！YES！我会在文章的最后，实现这个功能扩展。感谢 UE 5.3 的更新，让类似的功能可以比以前更加方便优雅地实现了。

到了这里，我们了解到 GE 在被 Add 到 Container 中后，会被激活（!Inhibit），GE 的效果是在这里生效的，接下来的问题是：

### GE 激活后，会产生哪些效果？

这个问题也是分成两个部分，首先是 GE 在激活后会对哪些属性产生影响，其次是这个影响是通过何种方式实现。GE 生效的函数为 `AddActiveGameplayEffectGrantedTagsAndModifiers`。

在这里只考虑非 Period 的 Duration GE，Period GE 的实现是通过设置一个 Timer，周期性地调用 `ExecutePeriodicEffect` 去生效，可以简单的理解为周期性执行的 Instant GE，篇幅所限，这里就不详细讨论了。

GE 的效果大致有以下几个部分组成：**Attribute**、**Tag**、**Ability**、**Cue**。

#### Attribute

首先从 Attribute 开始，Duration GE 首先影响的自然就是属性，GE 会修改角色的 Attribute 的 Current 值，相信读这篇文章的应该都对 Attribute 的 base 值和 current 值有所了解，两者可以大致理解为基础值，和受到各种 GE 影响后的实际值。

base 值比较好理解，因为修改后和 GE 本身就无关了，但是 current 值是如何实现的呢？这个问题等下会深入的讲解，现在暂时放下不表，我们继续看 GE 还有什么效果。

#### Tag

Tag 的修改比较简单，获取 GE Def 和 Spec 中的 Grant Tags，然后调用 ASC 的 `UpdateTagMap` 对 `CountTagContainer` 进行修改，此时的修改还是纯本地的。

然后通过 ASC 对 Tag 进行网络的属性同步。

这里需要注意的是，在模拟端，默认情况下 ActiveEffect 并不会同步，可以理解为在模拟端，GE 是不存在的，GE 效果是通过服务器上 Tag、Attribute、Cue 等效果的同步，在模拟端产生作用的。

#### Ability

给予 Ability，此功能在此函数里已经被废弃，5.3 以后是通过 GE Component 去给予 Ability 的。

读者可以通过在 GE 中配置 `UAbilitiesGameplayEffectComponent` 让 GE 具有 Give Ability 的功能。

GE 对 Ability 的影响还有一个，可以 block ability，依据 Ability 中配置的 `BlockTags` 条件，停止当前正在激活的技能。

#### Cue

最后一个 GE 的效果是触发 Gameplay Cue，逻辑大致为，遍历配置需要触发的 GameplayCues，然后修改角色的 Tags，让其添加对应的 Cue Tag，然后调用 `InvokeGameplayCueEvent` 让 Cue 在本地生效，最后让 Cue 通过同步在模拟端生效。

从这里可以看出，Cue Tag 虽然添加到 ASC 上，但它实际并没有被网络同步，是一个 Local Tag。

Cue 的实现机制也是比较大的一块内容，如果读者有需要，我可以考虑找时间深入讲解一下。

#### 扩展效果

除了以上这些基础的功能，我们还可以通过 GE Component，让 GE 产生更多的效果，与其它的功能模块进行互动。**假设，我是说假设**，我们要做一个高达游戏（笑），有的高达可以形态变化，在人形和飞机形态进行切换，其它的程序实现并提供了变身的功能模块，它会切换高达的 Mesh、状态机等，并向我们提供了接口。我们应该如何接入他们的功能接口呢？

对于这个需求，我们可以将变身视为一种 Buff 状态，用 GE 进行管理，当角色身上的变身 GE 处于激活状态时，调用变身飞机的接口，当变身 GE 失效后，重新变为人形。实现的方式为派生一个 `UGameplayEffectComponent` 的子类 `UTransformGameplayEffectComponent`，用于管理变身状态。这方面可以参考 `UAbilitiesGameplayEffectComponent`，这个 GE Component 的效果就是在 GE 激活时给予角色技能，GE 关闭后将激活的技能移除，和我们的需求很类似。

然后谈一下实现的思路。首先重写 `OnActiveGameplayEffectAdded` 函数，然后绑定 `OnInhibitionChanged` 的广播，它会在 GE 激活和关闭时触发。

然后在 `OnInhibitionChanged` 中，调用其它程序小伙伴给我们提供的接口，去开启和关闭变身。参考 `AbilityEffectComponent`，则是添加和移除 Ability。

### Attribute 的 current value 是如何实现的？

回到最上面的讨论，我们知道了 GE 在激活后，会影响哪些属性，并且我们可以扩展让他有更多的效果了。那么继续提出新的问题，针对 Attribute 这一块，在知道 GE 在激活时可以影响属性后，这个影响是如何管理的？比如多个 GE 同时影响同一个属性，这个属性的最终的实际值是怎么确定的？比如 GE 被移除后，被它影响的属性又是如何还原为原有状态的？这些问题的第一层回答是，Duration GE 影响的是属性的 current 值，不会影响 base 值，那么我们继续提问：

**Attribute 的 current value 是如何实现的？**

这个问题最简单的回答是，属性的结构体 `FGameplayAttributeData` 中有两个属性，`BaseValue` 和 `CurrentValue`，一个是基础值，一个是受外界影响的值。这也是绝大多数教程解答的，但它却解释不了 GE 对属性的影响是如何被管理的，接下来我会讲述我个人的理解。

首先从头开始捋，Attribute 都具有 Base 值，它可以被理解为一种固有的属性，一旦修改便会永久改变。然后 Current 值可以理解为 Base 值被各种"暂时"效果修饰后的值。这种修饰就是一种 Mod，GAS 中的 Mod 有 **Add**、**Multiply**、**Divide**、**Override** 四种。最终的 current 值就是由多个 Mod 共同影响后决定的。

这里需要注意的是，Multiply 和 Divide 并不是多次相乘或者相除，比如有两个 Multiply 1.2 的效果，实际的乘数不是 1.44，而是 `1 + 0.2 + 0.2 = 1.4`，Divide 也是类似的。

我把这样一次计算 Current 值的过程称为**实际属性计算**，计算顺序如下：

- 如果有 Override 的 Mod，则直接使用 override value 作为输出
- 累计相同符号的 mod，比如多个 add mod：10, 20 会合成为 30，多个 multiply mod：1.2, 1.5 会合成为 1.7
- 对属性的 base 值，**先加，后乘，再除**，最后输出作为结果

接下来看看代码，一个基础的 Mod 如下，包括三个参数：第一个是 Channel（这个我们先暂时不管），第二个是 Mod 符号，第三个为 Mod 数据，这个数据中最核心的是 `EvaluatedMagnitude`，即 Mod 修饰的大小。

ModInfo 则被存储在 `FAggregatorModChannel` 中。先不要管 Channel 的定义，可以把它理解为用于存储某一个属性所有的 Mod。

计算 Current 值的方法就是上图说明的方式，假设 Health 属性 base = 100，additive mod: 20, 30，multiply mod: 1.2, 1.5，divide mod: 1.2, 1.2：

- 如果有 Override Mod，直接返回 Mod 值
- 将不同运算符的 Mod 累加：additive mod sum = 20 + 30 = 50，multiply mod sum = 1 + (1.2 - 1) + (1.5 - 1) = 1.7，divide mod sum = 1 + (1.2 - 1) + (1.2 - 1) = 1.4
- 实际结果：`result = (100 + 50) * 1.7 / 1.4 = 182`

### ModChannel 与多 Channel 计算

上面 ModInfo 和 ModChannel 已经可以实现 base 和 current 值区分的，对于 GE 来说，只需要在激活的时候创建 ModInfo 并添加到属性对应的 ModChannel 中，然后根据 base value 计算出 current value。但这个时候我们再提出一个新的问题：**如果策划希望支持乘区的概念，我们怎么支持呢？** 比如希望对攻击力的增加，一部分受到乘法的影响，另一部分则不会，如何实现？

当前的这个结构毫无疑问，并不能通过一个单一的攻击属性实现这个功能，当然可以通过增加 AttackPercent、AttackExtra 等额外的属性来解决这个问题，甚至我认为这可能是更好的解决方案。但这里我要隆重提到 GAS 里 **Attribute Mod Channel** 的概念，目前我似乎没有看到国内的文章提到过。

没错，GAS 里已经给实际属性计算划分了 Channel，我们可以根据需求将 GE 添加的 Mod 添加到希望对应的 Channel 中，然后按照不同的 Channel 去分别计算，实际 current 的计算就不是上面提到的只进行了一次计算，而是下方的样子：

在多个 Channel 的情况下，会将上一个 Channel 的实际属性计算的最终结果 result，作为下一个 Channel 的实际属性计算的输入，直到所有的 Channel 都计算完毕，最终输出的 result 为属性当前的 current value。

接下来看实际的代码，可以看到结构体 `ModChannelContainer` 中，储存了 Channels 的 Map，当前枚举 `ModEvaluationChannel` 最多支持 10 个 Channel，默认情况下只有 Channel 0 生效，我们如果去修改 GAS 代码，也可以支持更多，但感觉就没有必要了。

查看代码，计算就是按照上图所示，遍历所有的 Channel，将上一个 Channel 的输出作为下一个 Channel 的 base 输入，直到计算出最终的结果作为 current 值。

有了多条 Channel，上述那个"讨厌"的策划的需求就可以得到解决了，需要受到乘法影响的攻击力加值，放到 Channel 0 中，不需要受到乘法影响的攻击力放到 Channel 1 中，那么实际的攻击力为：

```
Attack = ((Attack_Base + Attack_Add_0) * Attack_Multiply_0) + Attack_Add_1
```

Perfect！但是需要注意，默认情况下，GAS 只支持 Channel 0，那么**如何打开多 Channel 的功能呢？** 我也放在文章的末尾进行解答。

### Aggregator 与属性依赖

有了 `ModChannelContainer` 后，我们介绍最后一个结构体——**Aggregator**，`ModChannelContainer` 存储在 Aggregator 中。

读者可能会有一个疑问，明明 `ModChannelContainer` 已经支持计算实际属性值了，只需要在 GE 激活和关闭时，添加和移除 Container 内的 Mod 即可，为什么还要增加一个 Aggregator 呢？

关键在于 GE 修改某个属性，是可以**基于另外的属性**的。比如说，狂战士有一个狂暴 Buff，他的攻击力会根据血量百分比的减少而增加，那么当狂战士的生命值减少时，狂暴 Buff 增加的攻击力也应该发生变化。在 GE 中选择 `MagnitudeCalculationType` 为 `AttributeBased` 后，如果不选择 SnapShot，就可以实现上述的功能。

**GAS 中又是如何实现属性依赖的功能呢？**

首先，在填写 GE 时，如果设置了 Backing Attribute 后，那么程序就可以知道这个 GE 需要依赖哪些 Attribute，比如上面那个例子里，狂暴 Buff 需要依赖的属性是生命值。那么我们只需要把狂暴 Buff 的 Effect Handle 存储在生命属性的 Aggregator 中，在生命值发生变化时，先找到对应的 Effect Handle，找到狂暴 Buff，然后知道这个 Buff 会依据生命值去修改攻击力，接下来就可以依据新的生命值重新更新攻击力加成即可。

我们来看看 Aggregator 中是如何实现的。可以看到 `FAggregator` 中，`ModChannels` 即上面提到的 ChannelContainer，用于计算实际属性值；这里的 `Dependents` 就代表了依赖于此属性的 Active Effects，以上面的例子来说，生命值属性的 Aggregator 中，依赖于生命值的 GE 就包括了狂暴 Buff。

这个依赖会在 `ActiveEffectContainer` 的函数 `ApplyGameplayEffectSpec` 中注册，感兴趣的可以自己去看看，这边就不仔细说了。

有了依赖关系后，假设属性发生变化后，会调用 `BroadcastOnDirty` 去通知依赖于此属性的属性更新。

打开这个函数可以看到，里面最多的代码就是解决**无限循环**的问题，比如攻击力依赖于生命，生命又依赖于攻击力，那么攻击力发生改变后，这个链就会一直持续下去，官方的做法是添加了一个计数器 `BroadcastingDirtyCount`，当它大于 10 的时候会停止更新依赖属性。我个人认为还是从设计层面上避免循环依赖为好，在可能产生循环依赖的地方，使用 SnapShot 快照进行替代。

核心代码就比较简单了，循环所有依赖于此属性的 ActiveEffect，然后通过函数 `OnMagnitudeDependencyChange` 更新属性。大致的方式就是遍历依赖于此属性的 Effect 全部的 Modifiers，然后根据依赖属性新的值重新计算出新的 ModInfos，先移除老的 ModInfos，再把更新后的 Add 到所修改属性的 Aggregator 中去。

这里又会调用 `BroadcastOnDirty` 去更新依赖于更新的属性的属性，无限循环的问题就是在这里产生的。

### Duration Effect 小结

至此，Duration Effect 是如何生效的，应该就可以得到一个相对完整的解答了：

1. 首先会生成一个实例 `ActiveEffect`，并被添加到 `ActiveEffectContainer` 中
2. 然后被激活，在这里会生成 GE 属性效果的一系列 Mod，存储到 GE 所要修改的属性的 Aggregator 中
3. Aggregator 会根据存储的 Channel 里的所有 Mod，重新计算出属性的 current value
4. 更新后的属性值则会通过属性同步，从服务端发送到客户端

当 GE 被移除时，也是类似的流程：首先 ActiveEffect 会被关闭，它所修改的属性的 Aggregator 会根据 ActiveEffect Handle 找到此 GE 生成的所有 Mod，将其从 Aggregator 中移除，然后 Aggregator 会重新计算 current value 并同步到客户端。接着 GE 会被从 `ActiveEffectContainer` 中移除，然后此消息也会通过 FastArrayItem 的属性同步，在客户端将对应的 ActiveEffect 给移除掉。

相信读者读到这里，对 Duration Effect 产生效果的链条就很清晰了。这里只以 Attribute 效果作为研究的对象，其它包括 Cue 其实也有很多的技巧和可研究的地方。

## 二、解析 GE 的预测

### GE 是如何实现预测的？

这一部分我会分析一下 GE 的预测机制，对于详细解释 GAS 中预测的实现机制的文章，市面上已经有很多了，都写得很好，所以我这边就大致讲解一下，并不会仔细地分析源码，想要深入学习的可以去搜一下别人的文章。

GE 的预测实际上很简单，在玩家的主控端可以生成 `PredictionKey`，然后主控端需要释放 GE 时，可以在调用 `ApplyGameplayEffect` 时将有效的 PredictionKey 作为参数输入。

在 `FActiveGameplayEffectsContainer::ApplyGameplayEffectSpec` 函数中，在本地生成了一个预测的 ActiveEffect，将代码拉到函数的最下面，可以看到在主控端，会将函数 `RemoveActiveGameplayEffect_NoReturn` 绑定到 PredictionKey 的 Reject 和 CaughtUp 回调上。回调函数做的事情很简单，就是将预测 GE 给移除掉。

**这意味着无论服务器判定这次 ApplyGameplayEffect 的结果是有效的还是无效的，当 PredictionKey 触发 RPC 回调后，客户端的本地预测 GE 都会被移除，本地预测 GE 只是作为一个临时的数据存在，无论成功或是失败，最后都会被销毁。**

### 服务器端的行为

接下来讲讲服务器上的行为。**首先要明确的是，ApplyGameplayEffect 的函数并没有 RPC，也就是客户端调用并不会让服务器也触发 ApplyGameplayEffect，无论在客户端和服务器上，释放 GE 都是独立的行为**，他们之间的关联只是通过 PredictionKey，服务器会将本地的预测 GE 给移除掉。

那么我们在技能启动的时候，如果调用 ApplyGameplayEffect，服务端和客户端都会触发呀，这是如何做到的呢？很简单，启动技能这个行为是在玩家客户端发起的，`ActivateAbility` 有 RPC 调用会触发 `Server_ActivateAbility`，将客户端生成的 PredictionKey 传给服务器。因此服务器和客户端的 ApplyEffect 行为是在 `ActivateAbility` 函数中彼此独立调用的，他们之间的关联是通过客户端上传的 PredictionKey 来建立的。

对于服务端，在创建 ActiveEffect 后，会走到上面代码的 if 分支，调用 `ActiveEffectContainer` 的 `MarkItemDirty` 函数，通过 FastArray 的属性同步，将 ActiveEffect 的数据从服务器同步到客户端。

具体来说，在 `MarkItemDirty` 后，会触发函数 `FActiveGameplayEffect::PostReplicatedAdd`，这里涉及到虚幻 TArray 快速网络同步的概念。在这里，会将同步到客户端的 ActiveEffect 添加进 `ActiveEffectContainer` 中。

由此可以看出，**本地 GE 预测的回滚和服务端的 GE 同步是两个独立的行为**。

### 测试案例

虽然我的解释已经是极度简化说明的 GE 预测了，但是相信还是会有很多读者觉得不够直观，因此我在这里会通过几个例子来说明 GE 释放的不同情况。为了测试，我会将网络延迟调整到 500ms 以上。

#### 案例 1：正常预测与同步

在本地预测启动技能，在客户端技能 `ActivateAbility` 时，直接给自己 ApplyEffect，效果为本地立刻添加 GE_Test，然后延迟过后，服务器也调用了 `ActivateAbility` → `ApplyEffect`，添加了 GE_Test，接着客户端本地的 GE_Test 会被移除，服务器的 GE_Test 被同步下来。

#### 案例 2：服务端拒绝

在原有的基础上进行如下修改，服务器上此技能不能启动，客户端则可以。那么 GE_Test 会怎么样呢？

实际的情况会是，玩家的客户端成功启动技能添加上了预测的 GE_Test，然后延迟过后，服务端的技能启动失败，没有添加上 GE_Test，然后 PredictionKey 回调后，客户端的预测 GE 被移除。两端都不存在 GE_Test 了。

#### 案例 3：延迟一帧 ApplyEffect

再进行一个小修改，技能延迟之后，我们延迟一帧再 ApplyEffect，此时 GE_Test 是否会被添加到玩家客户端呢？

答案是**不会**，此时玩家的本地客户端将不会生成预测的 GE_Test。实际的情况是，玩家本地预测启动了技能，但是 GE_Test 则不会被预测，服务端判断技能无法启动，然后调用 Client Fail 的函数，将玩家端的技能给 End 掉。

为什么这种情况 GE_Test 不会被预测呢？因为本地的预测都依赖于有效的 PredictionKey，它被包裹在 `ScopeWindow` 中，而 `ScopeWindow` 的有效生命周期是在启动技能的函数闭包内，当函数执行完将会被析构，此后的 PredictionKey 都将会无效。简单理解来说，**新生成的 PredictionKey 只在当前帧生效**。因为没有有效的 PredictionKey，本地无法预测 GE。

> **补充说明：** 我们可以通过在客户端构造 `ScopePredictionWindow` 让 GE 再次可以被预测。

## 三、Stack Effect 的原理

### Stack 是如何实现的？

接下来需要解决的问题是，GE 的堆叠是如何实现的。首先还是回到一切的起点，查看函数 `FActiveGameplayEffectsContainer::ApplyGameplayEffectSpec`，在一开始根据 Spec 找到堆叠 GE 已经存在的 `ExistingStackableGE`，找的方法大致是遍历 Container 中所有的 ActiveGE，条件为：Def 和输入的 Effect 相同，且 `StackingType` 不等于 None，Duration 不等于 Instant 等，找到后将 ActiveEffect 返回。

### Overflow 处理

如果当前 ActiveEffect 的 stack count 等于 def 的 `StackLimitCount`，表示新的 GE 已经无法继续堆叠了，处理 overflow。

**第一种情况**是当 OverFlow 发生后，会 Apply Overflow Effects，这个作用的例子为：当敌方身上的燃烧 Buff 达到五层后，会触发爆炸。

**第二种情况**是 overflow 后移除 effect，即 Buff 叠满后，移除当前的 Buff。

### 更新 StackCount

处理完 overflow 的可能后，开始计算新的堆叠数量。

### 更新 Duration

如果 GE 的 `DurationRefreshPolicy` 为 `NeverRefresh`，设置 `bSetDuration` 为 false。如果 `bSetDuration` 为 true，此参数会在后面重新刷新 GE 的持续时间。

`RestartActiveGameplayEffectDuration` 函数中，会更新 Effect 的 `StartServerWorldTime`、`StartWorldTime`。

注册 Timer，这里会在堆叠 GE 首次创建，或者刷新时调用，时长为 GE 的持续时间。当然这里设置的是 GE 的持续时间，是针对所有的 Duration Effect，而不仅仅是 Stack Effect。

在最后通知 `StackCountChange`，更新 `AggregatorModMagnitudes`，更新 tag，广播 EventSet 里的 `OnStackChanged`。

### DurationExpired

当 Stack Effect 持续时间到后触发 `FActiveGameplayEffectsContainer::CheckDuration`。

依据不同的情况处理 StackEffect，处理的方式分别为：

- **全部移除**
- **移除一个 StackCount 然后刷新持续时间**
- **不移除 StackCount 然后刷新持续时间**

## 四、GE 功能拓展

这个部分介绍一些扩展 GE 功能的方式。

### 基于属性添加移除 GE

在这里实现一个扩展 GE 的功能，通过 GE Component 实现：**当指定属性条件满足后，移除当前 GE**。举个例子，还用之前提到的狂战士 Buff，当角色生命值大于 80% 时，自动移除狂暴 Buff。

实现这个功能后，读者可以很轻松的举一反三，实现根据属性条件激活关闭 GE；或者只有满足指定属性，GE 才能被释放；又或者满足特定属性条件后，释放额外的 GE 等功能。

这里讲解一下思路：

首先创建一个结构体 `AttributeCondition`，里面的数据是：属性、属性条件，还有一个函数，当特定的属性满足条件时，返回 true。这个代码就不贴了，应该比较简单。

然后创建 `GameplayEffectComponent` 的派生类。其中有成员变量 `RemovalAttributeCondition`，作用是说明当特定的属性满足条件后，应将此 Component 的 GE 给移除。

创建函数 `RegisterAttributeListener`，作用是绑定指定属性的 `AttributeChange` 回调。注意还需要一个配套的 `UnregisterAttributeListener` 去解除回调绑定，这里就不贴代码了。

核心代码其实就最后这一句话，监听指定属性的变化，然后触发 `OnAttributeChange` 函数，在这里判断属性条件，决定是否应该将 GE 移除。这里需要将 `DelegateHandle` 的引用返回。

接下来重写函数 `OnActiveGameplayEffectAdded`，此函数会在 GE 实例化并被添加到 `ActiveEffectContainer` 中时调用。

这里要做的是两件事：

1. 调用前面实现的 `RegisterAttributeListener`，监听指定属性的变化，然后将对应的属性和委托存在 `AllBoundEvents` 中
2. 因为 `GameplayEffectComponent` 并没有被实例化，所以里面并不能存储数据，我们需要将数据通过绑定 `OnEffectRemove` 的回调，触发 `OnActiveGameplayEffectRemoved` 函数，并将 `AllBoundEvents` 数据传进去

然后实现函数 `OnAttributeChange`，它的作用是判断监听的属性变化后，是否满足了移除条件，如果满足则移除此 ActiveEffect。

最后实现函数 `OnActiveGameplayEffectRemoved`，它会在 GE 从 `ActiveEffectContainer` 中移除时触发，这里要做的事情就是，将添加的属性回调给移除掉。

大功完成，最终效果如下：当生命值大于等于 80% 时，GE 会被移除。

### 如何应用 CustomChannel

这里介绍如何在项目中启用多个 Channels。

首先打开 `DefaultGame.ini`，在 `AbilitySystemGlobals` 下填写以下配置，最多可以支持 10 个 Channels：

```ini
[/Script/GameplayAbilities.AbilitySystemGlobals]
+ModEvaluationChannelAliases=(Channel0="Default", Channel1="TestChannel")
```

然后打开编辑器，创建一个 GE，在 Modifier 处就可以看到支持选择 Channel 了。

然后测试一下，在默认状态下 `HealthMax = 500`，实现一个 GE 的效果为 Add 100，Multiply 1.2，释放 GE 后：

```
HealthMax = (500 + 100) * 1.2 = 720
```

如果我们额外释放一个 GE，再加上 100 的生命值，那最后实际的生命值为：

```
HealthMax = (500 + 100 + 100) * 1.2 = 840
```

当我们使用新添加的 Channel 1 TestChannel 去添加这 100 的生命值，Channel 0 和 Channel 1 的数值是分别计算的，现在生命值为 820 而不是 840：

- 首先计算 Channel 0：`(500 + 100) * 1.2 = 720`
- 然后 Channel 1 会基于 Channel 0 计算：`HealthMax = 720 + 100 = 820`

如此就实现了一个属性的**乘区**。

不过我个人认为这种做法并不好，至少不应该滥用，会让对 Attribute 的使用变得更加的复杂，也会让准确地获取数值加成麻烦一点，我认为更好的方式是创建多个乘区的属性，而不是直接使用 Channel，至少是不应该滥用，我想这也是官方没有提及这里的原因。

## 结语

OK，本篇文章到这里就结束了，希望能够帮助读到这里的读者。

写下这篇文章后，有些事情大概就已经定好了，即将离开广州了，我会想念这里的猪脚饭、生蚝还有早茶，还有曾经一起工作过的人。毕业投入游戏行业后，虽然只有短短的三年，但也算是经历了很多。从一开始的充满热情，有些天真，到现在意识到很多事情并不能以个人的主观意愿为转移，努力并不一定会有一个好的结果，虽然它是最重要的，但有时候赛道和环境，乃至运气才是通向成功的加速器。

但做游戏毕竟是快乐的，每次功能实现后所能得到的正反馈是极其强烈的，我觉得做游戏本身甚至比玩游戏还有意思。我个人还是始终相信，游戏行业在当下仍然是一条值得去走的路，作为一个内容行业，崎岖艰险但永远充满机会。行业寒冬，所能做的就是努力提高自己，让自己有更强的实力去面对冰雪消融的时刻，相信会有万物复苏的时刻，与大家共勉。
