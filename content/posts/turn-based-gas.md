---
title: "改造 GAS 插件支持回合制游戏"
description: "介绍如何修改 Unreal Engine 的 Gameplay Ability System (GAS) 插件，使其支持回合制游戏。通过自定义 Timer 管理器替代实时计时器，让 GameplayEffect 基于回合数而非世界时间生效。"
date: "2026-03-05"
category: "Unreal Engine"
tags: ["UE", "GAS", "GameplayEffect", "回合制", "插件开发"]
cover: "/images/turn-based-gas-cover.png"
---

## 一、引言

GAS（Gameplay Ability System）是 Unreal Engine 中一个非常强大的技能框架，广泛应用于各类游戏项目。然而，GAS 原生只支持即时制（实时）的游戏模式，对于回合制游戏来说，无法直接使用。

问题的核心在于：GAS 中的冷却、持续伤害、Buff/Debuff 的持续时间等机制，都是通过 GameplayEffect 实现的，而 GameplayEffect 本质上依赖于实时 Timer（计时器）。比如一个冷却 3 秒的技能，就是注册了一个持续时间为 3 秒的 Timer，当 Timer 触发后，将对应的 GameplayEffect 移除。每秒触发一次的周期性效果，则是 Looping 为 true、Period 为 1 秒的 Timer，本质上是一样的。

这意味着，在回合制游戏中，我们需要让这些效果基于**回合数**而非**世界时间**来生效。于是改造的思路就很清晰了：**用自定义的回合制 Timer 管理器替代 GameplayEffect 中使用的实时计时器**。

我之前基于 UE4 实现过一版回合制改造，最近又重新迭代了一下，现在已经支持 UE 5.6 和 5.7 版本。实现代码已经提交到 GitHub，有需要的可以自行下载使用。

[github-card:BinaryBard996/TurnBasedSample](https://github.com/BinaryBard996/TurnBasedSample)

## 二、原理分析

在动手改造之前，我们需要先理解 GAS 中 GameplayEffect 的时间机制。

### GameplayEffect 的 Timer 机制

GameplayEffect 中所有和时间相关的功能，都依赖 UE 的 TimerManager：

- **Duration（持续时间）**：一个 HasDuration 类型的 GE，会注册一个指定时长的 Timer，Timer 到期后移除该 GE
- **Period（周期触发）**：一个带有 Period 的 GE，会注册一个 Looping Timer，按固定间隔重复触发效果
- **Cooldown（冷却）**：技能冷却本质也是一个 HasDuration 的 GE，通过 Timer 控制冷却时长

这些 Timer 都在 `GameplayEffect.cpp` 中通过 `FTimerManager` 进行管理。在实时游戏中，Timer 随世界时间自动 Tick，一切正常运作。但在回合制游戏中，我们不希望这些效果随时间自动推进，而是希望它们在**玩家执行回合操作时**才推进。

### 改造思路

理解了上述机制后，改造方案就很明确了：

1. 创建一个自定义的 **AbilityTimerManager**，用于替代 GAS 中的实时 TimerManager
2. 这个自定义 Timer 管理器基于**回合数（Turn）**而非**世界时间**来驱动
3. 每个 AbilitySystemComponent（ASC）拥有独立的回合计数，因为每个角色有自己的回合节奏
4. 在 GameplayEffect 的源码中，将所有使用 TimerManager 的地方替换为自定义的 AbilityTimerManager

## 三、改造方案详解

### 修改 GAS 插件源码

由于需要修改 GAS 插件的源码，首先需要将 GameplayAbilities 插件复制到工程的 Plugins 文件夹中，这样可以在不影响引擎源码的情况下进行定制。

所有改动的代码都使用 `// TurnBased Support` 和 `// ~TurnBased Support` 注释进行了标记，方便在代码中搜索定位。

### 1. 新增 AbilityTimerManager

AbilityTimerManager 是改造的核心，继承自 `FTimerManager`，提供基于回合数驱动的计时能力。

**AbilityTimerManager.h**

```cpp
#pragma once
#include "TimerManager.h"

class UAbilitySystemComponent;

GAMEPLAYABILITIES_API DECLARE_LOG_CATEGORY_EXTERN(LogAbilitySystemTurnbased, Display, All)

struct FAbilityTimerContainer
{
public:
	int32 Turn = 0;
	TArray<FTimerHandle> TimerHandles;
};

class GAMEPLAYABILITIES_API FAbilityTimerManager: public FTimerManager
{
public:
	FAbilityTimerManager(UGameInstance* InGameInstance): FTimerManager(InGameInstance){ AbilityOwningGameInstance = InGameInstance; }

	void TickTurn(UAbilitySystemComponent* AbilitySystemComponent, int Delta = 1);
	float GetAbilityTimerRemaining(UAbilitySystemComponent* AbilitySystemComponent, FTimerHandle& InHandle);
	float GetAbilityCurrentTurn(UAbilitySystemComponent* AbilitySystemComponent) const;

	bool AbilityTimerExists(UAbilitySystemComponent* AbilitySystemComponent, FTimerHandle Handle) const;
	void SetAbilityTimer(UAbilitySystemComponent* AbilitySystemComponent, FTimerHandle& InOutHandle, FTimerDelegate const& InDelegate, float InRate, bool bInLoop, float InFirstDelay = -1.f);
	void ClearAbilityTimer(UAbilitySystemComponent* AbilitySystemComponent, FTimerHandle& InHandle);
	void SetAbilityTimerForNextTick(FTimerDelegate const& InDelegate);
	void ClearAbilityTimerContainer(UAbilitySystemComponent* AbilitySystemComponent);
	void ClearAllAbilityTimerContainers();

private:
	const FAbilityTimerContainer* GetAbilityTimerContainer(UAbilitySystemComponent* AbilitySystemComponent) const;
	FAbilityTimerContainer& GetAbilityTimerContainer(UAbilitySystemComponent* AbilitySystemComponent);
	void AddAbilityTimer(UAbilitySystemComponent* AbilitySystemComponent, const FTimerHandle& TimerHandle);
	void RemoveAbilityTimer(UAbilitySystemComponent* AbilitySystemComponent, const FTimerHandle& TimerHandle);

private:
	TMap<TWeakObjectPtr<UAbilitySystemComponent>, FAbilityTimerContainer> AbilityTimerContainers;
	UGameInstance* AbilityOwningGameInstance;
};
```

**AbilityTimerManager.cpp**

```cpp
#include "Turnbased/AbilityTimerManager.h"
#include "TimerManager.h"
#include "Engine/GameInstance.h"
#include "AbilitySystemComponent.h"

DEFINE_LOG_CATEGORY(LogAbilitySystemTurnbased)

void FAbilityTimerManager::TickTurn(UAbilitySystemComponent* AbilitySystemComponent, int Delta)
{
	if(!IsValid(AbilitySystemComponent))
	{
		UE_LOG(LogAbilitySystemTurnbased, Display, TEXT("TickTurn-No valid ability system component for ability timer manager!"))
		return;
	}

	FAbilityTimerContainer& AbilityTimerContainer = GetAbilityTimerContainer(AbilitySystemComponent);
	for(int32 Step = 0; Step < Delta; ++Step)
	{
		AbilityTimerContainer.Turn++;
		AbilitySystemComponent->TickTurn(1);

		TArray<FTimerHandle> RemoveTimerHandles;
		for(FTimerHandle& Handle: AbilityTimerContainer.TimerHandles)
		{
			FTimerData* TimerData = FindTimer(Handle);
			if(!TimerData)
			{
				RemoveTimerHandles.Emplace(Handle);
				continue;
			}

			// Expire Time
			if(TimerData->ExpireTime <= AbilityTimerContainer.Turn)
			{
				// Execute Timer
				if(TimerData->TimerDelegate.VariantDelegate.IsType<FTimerDelegate>())
				{
					const FTimerDelegate& FuncDelegate = TimerData->TimerDelegate.VariantDelegate.Get<FTimerDelegate>();
					if (FuncDelegate.IsBound())
					{
						FScopeCycleCounterUObject Context(FuncDelegate.GetUObject());
						FuncDelegate.Execute();
					}
				}

				if(TimerData->bLoop)
				{
					TimerData->ExpireTime = AbilityTimerContainer.Turn + TimerData->Rate;
				}
				else
				{
					RemoveTimerHandles.Emplace(Handle);
				}
			}
		}

		for(FTimerHandle& Handle: RemoveTimerHandles)
		{
			RemoveAbilityTimer(AbilitySystemComponent, Handle);
			ClearTimer(Handle);
		}
	}
}

float FAbilityTimerManager::GetAbilityTimerRemaining(UAbilitySystemComponent* AbilitySystemComponent,
	FTimerHandle& InHandle)
{
	if(!IsValid(AbilitySystemComponent))
	{
		return 0.f;
	}

	FAbilityTimerContainer& AbilityTimerContainer = GetAbilityTimerContainer(AbilitySystemComponent);
	if(AbilityTimerContainer.TimerHandles.Find(InHandle) == INDEX_NONE)
	{
		return 0.f;
	}

	FTimerData* TimerData = FindTimer(InHandle);
	if(!TimerData)
	{
		return 0.f;
	}

	return TimerData->ExpireTime - AbilityTimerContainer.Turn;
}

float FAbilityTimerManager::GetAbilityCurrentTurn(UAbilitySystemComponent* AbilitySystemComponent) const
{
	if(!IsValid(AbilitySystemComponent))
	{
		return 0.f;
	}

	const FAbilityTimerContainer* AbilityTimerContainer = GetAbilityTimerContainer(AbilitySystemComponent);
	if(!AbilityTimerContainer)
	{
		return 0.f;
	}

	return AbilityTimerContainer->Turn;
}

bool FAbilityTimerManager::AbilityTimerExists(UAbilitySystemComponent* AbilitySystemComponent,
                                              FTimerHandle Handle) const
{
	if(!IsValid(AbilitySystemComponent))
	{
		return false;
	}

	const FAbilityTimerContainer* AbilityTimerContainer = GetAbilityTimerContainer(AbilitySystemComponent);
	if(!AbilityTimerContainer)
	{
		return false;
	}

	return AbilityTimerContainer->TimerHandles.Contains(Handle);
}

void FAbilityTimerManager::SetAbilityTimer(UAbilitySystemComponent* AbilitySystemComponent, FTimerHandle& InOutHandle,
                                           FTimerDelegate const& InDelegate, float InRate, bool bInLoop, float InFirstDelay)
{
	if(!IsValid(AbilitySystemComponent))
	{
		return;
	}

	ClearTimer(InOutHandle);

	if(InRate > 0.f)
	{
		InOutHandle = SetTimerForNextTick(InDelegate);
		FTimerData* NewTimerData = FindTimer(InOutHandle);
		NewTimerData->Rate = InRate;
		NewTimerData->bLoop = bInLoop;
		FAbilityTimerContainer& AbilityTimerContainer = GetAbilityTimerContainer(AbilitySystemComponent);
		const float FirstDelay = (InFirstDelay >= 0.f) ? InFirstDelay : InRate;
		NewTimerData->ExpireTime = AbilityTimerContainer.Turn + FirstDelay;

		AddAbilityTimer(AbilitySystemComponent, InOutHandle);
	}
	else
	{
		RemoveAbilityTimer(AbilitySystemComponent, InOutHandle);
	}
}

void FAbilityTimerManager::ClearAbilityTimer(UAbilitySystemComponent* AbilitySystemComponent, FTimerHandle& InHandle)
{
	RemoveAbilityTimer(AbilitySystemComponent, InHandle);
	ClearTimer(InHandle);
}

void FAbilityTimerManager::SetAbilityTimerForNextTick(FTimerDelegate const& InDelegate)
{
	if(AbilityOwningGameInstance)
	{
		if(UWorld* World = AbilityOwningGameInstance->GetWorld())
		{
			World->GetTimerManager().SetTimerForNextTick(InDelegate);
		}
	}
}

void FAbilityTimerManager::ClearAbilityTimerContainer(UAbilitySystemComponent* AbilitySystemComponent)
{
	if(FAbilityTimerContainer* AbilityTimerContainer = AbilityTimerContainers.Find(AbilitySystemComponent))
	{
		for(auto& TimerHandle: AbilityTimerContainer->TimerHandles)
		{
			ClearTimer(TimerHandle);
		}
	}

	AbilityTimerContainers.Remove(AbilitySystemComponent);
}

void FAbilityTimerManager::ClearAllAbilityTimerContainers()
{
	for(auto& AbilityTimerContainer: AbilityTimerContainers)
	{
		if(AbilityTimerContainer.Key.IsValid())
		{
			AbilityTimerContainer.Key.Get()->ResetTurn();
		}

		for(auto& TimerHandle: AbilityTimerContainer.Value.TimerHandles)
		{
			ClearTimer(TimerHandle);
		}
	}

	AbilityTimerContainers.Reset();
}

const FAbilityTimerContainer* FAbilityTimerManager::GetAbilityTimerContainer(
	UAbilitySystemComponent* AbilitySystemComponent) const
{
	return AbilityTimerContainers.Find(AbilitySystemComponent);
}

FAbilityTimerContainer& FAbilityTimerManager::GetAbilityTimerContainer(UAbilitySystemComponent* AbilitySystemComponent)
{
	check(IsValid(AbilitySystemComponent));
	return AbilityTimerContainers.FindOrAdd(AbilitySystemComponent);
}

void FAbilityTimerManager::AddAbilityTimer(UAbilitySystemComponent* AbilitySystemComponent,
                                           const FTimerHandle& TimerHandle)
{
	if(!IsValid(AbilitySystemComponent) || !TimerHandle.IsValid())
	{
		return;
	}

	FAbilityTimerContainer& AbilityTimerContainer = GetAbilityTimerContainer(AbilitySystemComponent);
	AbilityTimerContainer.TimerHandles.Emplace(TimerHandle);
}

void FAbilityTimerManager::RemoveAbilityTimer(UAbilitySystemComponent* AbilitySystemComponent,
	const FTimerHandle& TimerHandle)
{
	if(!IsValid(AbilitySystemComponent))
	{
		return;
	}

	FAbilityTimerContainer& AbilityTimerContainer = GetAbilityTimerContainer(AbilitySystemComponent);
	AbilityTimerContainer.TimerHandles.RemoveSwap(TimerHandle);
}
```

### 2. 修改 AbilitySystemGlobals

在 `AbilitySystemGlobals.h` 中新增 AbilityTimerManager 的全局管理：

```cpp
// TurnBased Ability Timer start
public:
	virtual void FinishDestroy() override;
	FAbilityTimerManager& GetAbilityTimerManager();
	void DestroyAbilityTimerManager();
private:
	FAbilityTimerManager* AbilityTimerManager;
// ~TurnBased Ability Timer start
```

在 `AbilitySystemGlobals.cpp` 中添加实现：

```cpp
// TurnBased Ability Timer start
void UAbilitySystemGlobals::FinishDestroy()
{
	UObject::FinishDestroy();
	DestroyAbilityTimerManager();
}

FAbilityTimerManager& UAbilitySystemGlobals::GetAbilityTimerManager()
{
	if(!AbilityTimerManager)
	{
		UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(GetWorld());
		AbilityTimerManager = new FAbilityTimerManager(GameInstance);
	}
	return *AbilityTimerManager;
}

void UAbilitySystemGlobals::DestroyAbilityTimerManager()
{
	if(AbilityTimerManager)
	{
		delete AbilityTimerManager;
		AbilityTimerManager = nullptr;
	}
}
// ~TurnBased Ability Timer start
```

### 3. 修改 AbilitySystemComponent

在 `AbilitySystemComponent.h` 末尾新增回合制相关属性和接口：

```cpp
// TurnBased Support
public:
	// Component Interface
	virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;
	// ~Component Interface

	UFUNCTION(BlueprintPure, Category=TurnBased)
	bool IsTurnBased() const { return bTurnBased; }

	UFUNCTION(BlueprintCallable)
	void SetTurnBasedEnabled(bool bEnabled = false) { bTurnBased = bEnabled; }

	UFUNCTION(BlueprintPure)
	int32 GetCurrentTurn() const { return CurrentTurn; }

	void TickTurn(int32 Delta = 1);
	void ResetTurn();

protected:
	UPROPERTY(EditAnywhere, Category=TurnBased)
	bool bTurnBased = false;

	UPROPERTY(Replicated)
	int32 CurrentTurn = 0;
// ~TurnBased Support
```

在 `AbilitySystemComponent.cpp` 末尾新增实现：

```cpp
// TurnBased Support
void UAbilitySystemComponent::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
	Super::EndPlay(EndPlayReason);

	UAbilitySystemGlobals::Get().GetAbilityTimerManager().ClearAbilityTimerContainer(this);
}

void UAbilitySystemComponent::TickTurn(int32 Delta)
{
	CurrentTurn += Delta;
}

void UAbilitySystemComponent::ResetTurn()
{
	CurrentTurn = 0;
}
// ~TurnBased Support
```

### 4. 修改 GameplayEffect.cpp

这是改动最多的文件。主要修改三个地方：

**（1）GetTimeRemaining — 计算 GE 剩余时间**

原版使用世界时间计算，回合制模式下改为使用回合数：

```cpp
// TurnBased Support
float FActiveGameplayEffect::GetTimeRemaining(float WorldTime) const
{
	if(Handle.GetOwningAbilitySystemComponent() && Handle.GetOwningAbilitySystemComponent()->IsTurnBased())
	{
		FAbilityTimerManager& AbilityTimerContainer = UAbilitySystemGlobals::Get().GetAbilityTimerManager();
		float CurrentTurn = AbilityTimerContainer.GetAbilityCurrentTurn(Handle.GetOwningAbilitySystemComponent());

		float Duration = GetDuration();
		return (Duration == FGameplayEffectConstants::INFINITE_DURATION ? -1.f : Duration - (CurrentTurn - StartWorldTime));
	}
	else
	{
		float Duration = GetDuration();
		return (Duration == FGameplayEffectConstants::INFINITE_DURATION ? -1.f : Duration - (WorldTime - StartWorldTime));
	}
}
// ~TurnBased Support
```

**（2）Duration Timer 注册 — 控制 GE 持续时间到期**

在 `ApplyGameplayEffectSpec` 中，将 Duration Timer 的注册从实时 `FTimerManager` 替换为 `FAbilityTimerManager`：

```cpp
// Register duration callbacks with the timer manager
if (Owner && bSetDurationTimer)
{
	// TurnBased Support
	const bool bTurnBased = Owner->IsTurnBased();
	// ~TurnBased Support

	FTimerDelegate Delegate = FTimerDelegate::CreateUObject(Owner, &UAbilitySystemComponent::CheckDurationExpired, AppliedActiveGE->Handle);

	// TurnBased Support
	if(!bTurnBased)
	{
		FTimerManager& TimerManager = Owner->GetWorld()->GetTimerManager();
		TimerManager.SetTimer(AppliedActiveGE->DurationHandle, Delegate, FinalDuration, false);
		if (!ensureMsgf(AppliedActiveGE->DurationHandle.IsValid(), TEXT("Invalid Duration Handle after attempting to set duration for GE (%s) @ %.2f"),
			*AppliedActiveGE->GetDebugString(), FinalDuration))
		{
			TimerManager.SetTimerForNextTick(Delegate);
		}
	}
	else
	{
		FAbilityTimerManager& AbilityTimerManager = UAbilitySystemGlobals::Get().GetAbilityTimerManager();
		AbilityTimerManager.SetAbilityTimer(Owner, AppliedActiveGE->DurationHandle, Delegate, FinalDuration, false);
		if (!ensureMsgf(AppliedActiveGE->DurationHandle.IsValid(), TEXT("Invalid Duration Handle after attempting to set duration for GE (%s) @ %.2f"),
			*AppliedActiveGE->GetDebugString(), FinalDuration))
		{
			AbilityTimerManager.SetAbilityTimerForNextTick(Delegate);
		}
	}
	// ~TurnBased Support
}
```

**（3）Period Timer 注册 — 控制 GE 周期性触发**

同样在 `ApplyGameplayEffectSpec` 中，将 Period Timer 替换为回合制版本：

```cpp
// Register period callbacks with the timer manager
if (bSetPeriodTimer && Owner && (AppliedEffectSpec.GetPeriod() > UGameplayEffect::NO_PERIOD))
{
	FTimerDelegate Delegate = FTimerDelegate::CreateUObject(Owner, &UAbilitySystemComponent::ExecutePeriodicEffect, AppliedActiveGE->Handle);

	// TurnBased Support
	if(!Owner->IsTurnBased())
	{
		FTimerManager& TimerManager = Owner->GetWorld()->GetTimerManager();

		if (AppliedEffectSpec.Def->bExecutePeriodicEffectOnApplication)
		{
			TimerManager.SetTimerForNextTick(Delegate);
		}

		TimerManager.SetTimer(AppliedActiveGE->PeriodHandle, Delegate, AppliedEffectSpec.GetPeriod(), true);
	}
	else
	{
		FAbilityTimerManager& AbilityTimerManager = UAbilitySystemGlobals::Get().GetAbilityTimerManager();

		if (AppliedEffectSpec.Def->bExecutePeriodicEffectOnApplication)
		{
			AbilityTimerManager.SetAbilityTimerForNextTick(Delegate);
		}

		AbilityTimerManager.SetAbilityTimer(Owner, AppliedActiveGE->PeriodHandle, Delegate, AppliedEffectSpec.GetPeriod(), true);
	}
	// ~TurnBased Support
}
```

### 5. 修改 AbilitySystemBlueprintLibrary

在 `AbilitySystemBlueprintLibrary.h` 中新增蓝图调用接口：

```cpp
// -------------------------------------------------------------------------------
//		TurnBased
// -------------------------------------------------------------------------------

/** Tick given AbilitySystemComponent's turn */
UFUNCTION(BlueprintCallable, Category = "Ability|TurnBased")
static void TickTurn(UAbilitySystemComponent* AbilitySystemComponent, int32 Delta = 1);
```

在 `AbilitySystemBlueprintLibrary.cpp` 中实现，这是外部调用推进回合的入口：

```cpp
void UAbilitySystemBlueprintLibrary::TickTurn(UAbilitySystemComponent* AbilitySystemComponent, int32 Delta)
{
	FAbilityTimerManager& TimerManager = UAbilitySystemGlobals::Get().GetAbilityTimerManager();
	TimerManager.TickTurn(AbilitySystemComponent, Delta);
}
```

## 四、使用说明

经过最新一轮的迭代，使用方式已经非常简洁。支持 UE 5.6 和 5.7 版本。

### 开启回合制模式

在 AbilitySystemComponent 的默认属性中，将 `bTurnBased` 设置为 `true`，该 ASC 释放的所有 GE 就会基于回合数而非世界时间生效。

```cpp
UPROPERTY(EditAnywhere, Category=TurnBased)
bool bTurnBased = false;
```

### 运行时切换模式

ASC 同时支持回合制和即时制之间的动态切换，调用 `SetTurnBasedEnabled` 接口即可：

```cpp
UFUNCTION(BlueprintCallable)
void SetTurnBasedEnabled(bool bEnabled = false) { bTurnBased = bEnabled; }
```

这在某些混合模式的游戏中非常有用，比如探索阶段使用即时制，战斗阶段切换为回合制。

### Duration 和 Period 的回合语义

开启回合制后，GE 的 Duration 和 Period 的含义从**秒数**变为**回合数**。例如：

- `Duration = 1.0` 表示持续 **1 个回合**
- `Period = 2.0` 表示每 **2 个回合**触发一次

配置方式与即时制完全一致，只是时间单位的语义发生了变化。

### 推进回合

开启回合制后，GE 的持续时间和周期效果不会随世界时间自动推进。需要在角色回合开始时，手动调用 `TickTurn` 函数来推进回合：

```cpp
/* Tick given AbilitySystemComponent's turn */
UFUNCTION(BlueprintCallable, Category = "Ability|TurnBased")
static void TickTurn(UAbilitySystemComponent* AbilitySystemComponent, int32 Delta = 1);
```

例如，角色释放了一个持续 1 回合的 GE，此时角色的 TurnCount 为 1。调用 `TickTurn` 后，TurnCount 变为 2，该 GE 持续时间结束并被移除。

### 查看修改的代码

如果你想了解具体修改了 GAS 插件的哪些部分，可以在代码中搜索注释 **TurnBased Support**，所有与回合制相关的修改都标记了对应的注释，方便查阅和理解。

## 五、结语

以上就是改造 GAS 插件支持回合制游戏的完整方案。核心思路其实很简单——用基于回合数的自定义 Timer 管理器替代 GAS 中的实时 Timer，让 GameplayEffect 的所有时间机制都能基于回合来驱动。

最新版本的改造已经非常易用，只需要设置一个 `bTurnBased` 开关，然后在回合开始时调用 `TickTurn` 即可。支持回合制与即时制之间的动态切换，也保留了 GAS 原有的所有功能特性。

完整的实现代码和示例项目已经开源在 GitHub 上，支持 UE 5.6 和 5.7，采用 MIT 协议，欢迎下载使用。如果有任何问题或建议，欢迎在 GitHub 上提 Issue。

[github-card:BinaryBard996/TurnBasedSample](https://github.com/BinaryBard996/TurnBasedSample)
