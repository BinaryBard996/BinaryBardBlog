---
title: "AbilityEditorHelper：基于 Schema 驱动的 UE GAS 配置自动化工具"
description: "一个基于 Schema 驱动的 Unreal Engine GAS 配置自动化插件。让策划能够使用熟悉的 Excel 表格来配置 GameplayEffect 和 GameplayAbility，通过完整的自动化工作流实现从 Excel 到 UE 资产的全流程。"
date: "2026-03-04"
category: "Unreal Engine"
tags: ["UE", "GAS", "GameplayEffect", "插件开发", "自动化工具", "Excel"]
cover: "/images/ability-editor-helper/cover.jpg"
---

## 一、引言

如今，大多数 UE 项目都采用了 Gameplay Ability System（GAS）这个强大（但也很"复杂"）的插件。以 GameplayEffect（GE）为例，一个中等规模的项目往往需要配置**成百上千个**效果——治疗、伤害、Buff、Debuff、控制效果……

每个 GE 都需要配置：持续时间，堆叠策略，多个属性修改器，Tags等一堆东西。更别说 GameplayAbility（GA）等等，它们同样需要配置大量的参数。

目前GE的主流配置方法有这么几种：

1. 直接使用GE，在GE的蓝图资产里进行配置
2. 通过DT进行配置，在编辑器环境下，通过DT的数据去创建和修改GE的参数
3. 通过Excel进行配置，导表工具生成对应的Json数据文件，运行时通过SetByCaller，AddAssetTags等手段，通过Spec去动态赋值。

但是以上方式或多或少存在下面的一系列问题：

1. 需要在编辑器中逐个创建 GE 和 GA 蓝图资产，为每个资产手动配置十几个乃至几十个参数。没办法批量的进行修改，维护起来也很麻烦。
2. DT，GE等蓝图资产，很难进行团队协作。
3. EffectSpec所能支持的功能又较为有限，有很多的GameplayEffectComponent是不支持动态赋值的，往往导表方案还是离不开在蓝图里配置GE。

基于上述的痛点，我设计的一个解决方案是，策划在 Excel 里配置 GE，然后通过导表工具，将 Excel 数据转为 Json，然后导入到 DT 里，再依据 DT 去创建和更新 GE。

基于上述的痛点，我希望开发一个自动化的插件 **AbilityEditorHelper**，能跑通上述的逻辑。支持 GAS 里资产可以方便的在 Excel 里配置，然后导入到编辑器里，自动的去创建和更新GE等数据。如果靠我个人来完成这个插件，可能会需要很久甚至于放弃了，因为我对python和UE资产管理相关的代码不是很熟悉，平时工作又十分地繁忙，下班往往都十点十一点了。

如今AI飞速发展，这给程序员这个行业带来了极大的威胁和痛苦，目前上网去找技术文章和问bug相比于问AI毫无优势，StackOverFlow流量的飞速下滑就是例证，这对于我们这种写技术文章的人来说，也是非常的利空。我们写的文章相比于AI有什么优势呢？而我们的贡献又成为了AI的养料变成了打向自己的子弹，多么的讽刺。因此我很长时间都没有动力去写技术文章和教程了。

所幸AI另一面也是一个极为强大的工具，如果无法战胜它，那就索性躺平并享受吧。在AI大人的帮助下，我才得以快速学习和开发我完全不熟悉的领域，并在极短的时间内就完成了这个插件。AbilityEditorHelper插件几乎所有的代码都是 claude AI 写的，我负责告诉他如何迭代和进行优化。下面是插件的代码链接，感兴趣的可以自己去下载并体验，不过使用之前需要对unreal python安装相关的依赖库。

[github-card:BinaryBard996/AbilityHelperSample](https://github.com/BinaryBard996/AbilityHelperSample)

## 二、AbilityEditorHelper 插件概述

**AbilityEditorHelper** 是一个基于 Schema（数据说明） 驱动的 Unreal Engine GAS 配置自动化工具。它的核心理念很简单：**让策划能够使用他们最熟悉的 Excel 表格来配置 GameplayEffect 和 GameplayAbility。**

这个插件提供了一套完整的自动化工作流：

1. 配置项目环境
2. 通过反射，从 C++ 结构体自动生成 JSON结构的Schema文件，作为结构体的说明书
3. 基于 Schema 自动生成Excel 模板
4. 在 Excel 中填写数据
5. 将 Excel 导出为 JSON 格式的数据文件
6. 自动导入 JSON 数据文件到编辑器下的DataTable
7. 依据DataTable去创建和更新GameplayEffect

```
┌─────────────────────────────────────────────────────────────────┐
│                     AbilityEditorHelper 工作流                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  C++ 结构体定义   │  程序员维护
│FGameplayEffectConfig│
└────────┬─────────┘
         │
         │ ① 通过 UE 反射系统
         ↓
┌──────────────────┐
│   JSON Schema    │  自动生成
│*.schema.json 文件 │
└────────┬─────────┘
         │
         │ ② Python 读取 Schema
         ↓
┌──────────────────┐
│   Excel 模板      │  自动生成（带下拉列表和提示）
│*.xlsx 文件        │
└────────┬─────────┘
         │
         │ ③ 策划填写配置
         ↓
┌──────────────────┐
│  填写完的 Excel   │  配置数据
│*.xlsx 文件        │
└────────┬─────────┘
         │
         │ ④ Python 基于 Schema 解析
         ↓
┌──────────────────┐
│    JSON 数据      │  标准格式
│*.json 文件        │
└────────┬─────────┘
         │
         │ ⑤ C++ 反序列化并创建资产
         ↓
┌──────────────────┐
│  UE GE/GA 资产   │  最终产物
│*.uasset 文件      │
└──────────────────┘
```

## 三、快速开始

项目中所有需要配置的数据，都在 Editor Settings -> Ability Editor Helper Settings 下，之后不额外进行说明。

### 配置项目环境

项目依赖于 unreal python，如何配置 python 环境可参考相关文档，依赖 python openpyxl 库，需要自行安装。

### 导出 UE 结构体的 Schema 文件

这里的结构体 Schema 文件可以理解为 UE 结构体的说明书，它的作用是作为编辑器和编辑器外数据沟通转化的说明书。你们可以在 `Plugins/AbilityEditorHelper/Content/Python/Schema` 目录下查看示例项目导出的 Schema 文件。

Schema 文件记录了结构体的所有属性信息，包括：属性名、属性类型、默认值、元数据标记（如 ExcelHint、ExcelDropDown 等）。Python 脚本正是依据这些信息来自动生成 Excel 模板和解析 Excel 数据的。

在 Ability Editor Helper Settings 中可以配置需要导出 Schema 的结构体列表：

![Settings 中配置需要导出 Schema 的结构体列表](/images/ability-editor-helper/image1.png)

同时需要配置 Schema 文件的导出路径：

![Schema Path 导出路径配置](/images/ability-editor-helper/image2.png)

当你在编辑器中点击 "Export Schema" 按钮时，插件会通过 UE 反射系统遍历指定结构体的所有 UPROPERTY，将属性信息序列化为 JSON 格式的 Schema 文件。执行函数后，就可以看到在指定文件夹下导出的结果了：

![Schema 文件夹下导出的 .schema.json 文件](/images/ability-editor-helper/image3.png)

Schema 的 JSON 结构大致如下：

```json
{
    "structName": "FGameplayEffectConfig",
    "properties": [
        {
            "name": "EffectName",
            "type": "FName",
            "defaultValue": "None",
            "metadata": {
                "ExcelHint": "效果名称，作为GE资产的名字"
            }
        }
    ]
}
```

### 基于 Schema 自动生成 Excel 模板

有了 Schema 文件后，下一步是自动生成 Excel 模板。插件提供了蓝图节点来完成这个工作：

![Generate Excel Template from Schema 蓝图节点](/images/ability-editor-helper/image4.png)

生成 Excel 模板时，Python 脚本会：

- 读取 Schema 文件
- 为每个属性创建对应的 Excel 列
- 根据 `ExcelHint` 元数据生成列标题的注释提示
- 根据 `ExcelDropDown` 元数据生成下拉列表
- 根据 `ExcelSheet` 元数据将属性分组到不同的工作表
- 根据 `ExcelHideColumn` 元数据隐藏不需要策划关注的列

### 策划在 Excel 里填写数据

生成的 Excel 模板对策划非常友好：

- 每列都有清晰的中文提示（来自 ExcelHint）
- 枚举类型的属性会自动生成下拉列表（来自 ExcelDropDown）
- 复杂的内部属性会被自动隐藏（来自 ExcelHideColumn）
- 不同类型的数据会被分组到不同的 Sheet（来自 ExcelSheet）

策划只需要像填写普通 Excel 表格一样，按照模板的格式填入数据即可。

![策划在 Excel 中填写的数据](/images/ability-editor-helper/image5.png)

枚举类型的属性会自动生成下拉列表，策划可以直接选择：

![Excel 下拉列表选择 DurationPolicy](/images/ability-editor-helper/image6.png)

### 导表到 DataTable

Excel 填写完成后，通过 Python 脚本将 Excel 数据转换为 JSON 格式。这个转换过程同样基于 Schema 文件，确保数据格式与 UE 结构体完全匹配。

![Export Excel to Json Using Schema 蓝图节点](/images/ability-editor-helper/image7.png)

然后，C++ 代码会读取 JSON 文件，反序列化为对应的结构体数据，并导入到 DataTable 中。

![Import DataTable From JSON File 蓝图节点](/images/ability-editor-helper/image8.png)

导入完成后，可以在 DataTable 中看到从 Excel 导入的数据：

![DataTable 中导入的数据](/images/ability-editor-helper/image9.png)

### 依据 DT 去创建和更新 GameplayEffect

这是整个工作流的最后一步，也是最关键的一步。首先需要在 Settings 中配置 GE 的创建参数，包括 GameplayEffect 的基类、资产保存路径以及数据源 DataTable：

![Settings 中配置 GE Class、Path 和 Import DataTable](/images/ability-editor-helper/image11.png)

配置完成后，点击 "Create Or Update GameplayEffects From Settings" 按钮即可一键创建和更新 GE 资产：

![Create Or Update GameplayEffects From Settings 按钮](/images/ability-editor-helper/image10.png)

插件会遍历 DataTable 中的每一行数据：

- 如果对应的 GE 资产不存在，则自动创建
- 如果已存在，则根据数据更新 GE 的属性
- 包括设置持续时间策略、堆叠策略、修改器、Tags 等所有可配置项

创建完成后，可以在 Content Browser 中看到生成的 GE 资产：

![Content Browser 中创建的 GE 资产](/images/ability-editor-helper/image12.png)

打开 GE 资产，可以看到所有属性都已经根据 Excel 中的配置正确设置了：

![GE 详细面板展示完整配置](/images/ability-editor-helper/image13.png)

### UI 操作界面

除了通过蓝图节点调用各功能外，插件还提供了一个集成的编辑器 Widget，可以在 Window 菜单中找到：

![Window 菜单中的 Ability Editor Helper Widget](/images/ability-editor-helper/image14.png)

打开后可以看到完整的操作界面，集成了所有常用功能的快捷按钮：

![Ability Editor Helper Widget 操作界面](/images/ability-editor-helper/image15.png)

## 四、功能说明

### ExcelHint

`ExcelHint` 是一个 UPROPERTY 元数据标记，用于在生成的 Excel 模板中为对应的列添加注释提示。

```cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Basic",
    meta = (ExcelHint = "效果名称，将作为GE资产的命名"))
FName EffectName;
```

当 Schema 导出时，`ExcelHint` 的值会被记录。Python 生成 Excel 模板时，会将这个提示信息作为列标题单元格的批注（Comment），方便策划理解每个字段的含义。

### ExcelSheet

`ExcelSheet` 元数据用于将属性分组到 Excel 的不同工作表中。默认情况下，所有属性都在一个 Sheet 中，但当配置项很多时，可以使用 `ExcelSheet` 将相关属性归类到独立的子表中。

```cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Modifiers",
    meta = (ExcelSheet = "Modifiers"))
TArray<FGameplayModifierInfo> Modifiers;
```

### ExcelDropDown

`ExcelDropDown` 元数据用于为枚举类型的属性在 Excel 中生成下拉列表。这可以让策划直接从预定义的选项中选择，避免手动输入导致的错误。

```cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Basic",
    meta = (ExcelDropDown = "Instant,HasDuration,Infinite"))
EGameplayEffectDurationType DurationPolicy;
```

### ExcelHideColumn

`ExcelHideColumn` 用于在生成的 Excel 模板中隐藏某些列。有些属性是内部使用的，不需要策划关注，就可以使用这个标记来隐藏。

### FGameplayEffectConfig 的派生结构体

如果项目需要为 GE 添加额外的自定义数据（如自定义的 GameplayEffectComponent），可以通过继承 `FGameplayEffectConfig` 来创建派生结构体。

```cpp
/**
 * FGameplayEffectConfig 的派生结构体示例
 * 用于测试方案三的扩展机制
 * 新增字段将通过 OnPostProcessGameplayEffect 委托应用到 GE
 *
 * 使用 ExcelSheet 元数据将扩展字段放入单独的子表，不影响基类的主表结构
 */
USTRUCT(BlueprintType)
struct ABILITYHELPERSAMPLE_API FGameplayEffectSampleConfig : public FGameplayEffectConfig
{
    GENERATED_BODY()

    /** 测试用整数属性，将写入 TestGameplayEffectComponent */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "SampleExtension",
       meta = (ExcelHint = "测试整数值", ExcelSheet = "SampleExtension"))
    int32 TestIntValue = 0;

    /** 测试用布尔属性，将写入 TestGameplayEffectComponent */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "SampleExtension",
       meta = (ExcelHint = "测试布尔值", ExcelSheet = "SampleExtension"))
    bool bTestBoolValue = false;
};
```

然后需要对导入的数据进行额外的处理，插件代码在创建和更新GE时都会通过委托进行广播，因此，可以在项目代码里监听这个委托，然后依据数据对GE进行处理。

```cpp
// 获取 AbilityEditorHelperSubsystem 并绑定委托
if (GEditor)
{
    if (UAbilityEditorHelperSubsystem* HelperSubsystem = GEditor->GetEditorSubsystem<UAbilityEditorHelperSubsystem>())
    {
       // 绑定 GE 委托
       PostProcessGEDelegateHandle = HelperSubsystem->OnPostProcessGameplayEffect.AddUObject(
          this, &UAbilityHelperSampleSubsystem::HandlePostProcessGameplayEffect);
       UE_LOG(LogTemp, Log, TEXT("[AbilityHelperSample] 已绑定 OnPostProcessGameplayEffect 委托"));
    }
}
```

项目扩展数据处理示例代码：

```cpp
void UAbilityHelperSampleSubsystem::HandlePostProcessGameplayEffect(const FTableRowBase* Config, UGameplayEffect* GE)
{
    if (!Config || !GE)
    {
       return;
    }

    // 尝试转换为派生类型
    // 注意：这里使用 static_cast，因为 FTableRowBase 没有虚函数表
    // 实际项目中可以通过检查 DataTable 的 RowStruct 来确认类型
    const FGameplayEffectSampleConfig* SampleConfig = static_cast<const FGameplayEffectSampleConfig*>(Config);

    // 检查是否有扩展数据需要处理
    // 这里通过检查默认值来判断是否需要创建 Component
    bool bHasExtensionData = (SampleConfig->TestIntValue != 0) || SampleConfig->bTestBoolValue;

    if (bHasExtensionData)
    {
       // 创建或获取 TestGameplayEffectComponent
       UTestGameplayEffectComponent& TestComp = GE->FindOrAddComponent<UTestGameplayEffectComponent>();

       // 应用扩展字段
       TestComp.TestIntProperty = SampleConfig->TestIntValue;
       TestComp.bTestBoolProperty = SampleConfig->bTestBoolValue;

       UE_LOG(LogTemp, Log, TEXT("[AbilityHelperSample] 已应用扩展字段到 GE: %s (TestInt=%d, TestBool=%s)"),
          *GE->GetName(),
          SampleConfig->TestIntValue,
          SampleConfig->bTestBoolValue ? TEXT("true") : TEXT("false"));
    }
    else
    {
       // 如果没有扩展数据，移除 Component（如果存在）
       RemoveGEComponent<UTestGameplayEffectComponent>(GE);
    }
}
```

在创建的GE里，可以看到项目自己的 TestGameplayEffectComponent 被成功的添加进了GE，并正确的写入了数据。

使用派生结构体时，Excel 会自动生成对应的子表（Sheet）：

![Excel 中的 Sheet 标签页：GameplayEffectSampleConfig 和 SampleExtension](/images/ability-editor-helper/image16.png)

在 SampleExtension 子表中填写扩展数据：

![SampleExtension 子表中的扩展数据](/images/ability-editor-helper/image17.png)

导入后可以在 GE 中看到 TestGameplayEffectComponent 已被正确创建，扩展字段的数据也已写入：

![GE 中 TestGameplayEffectComponent 的扩展数据](/images/ability-editor-helper/image18.png)

## 五、一些功能的原理解析

### 在导入数据时，如何判断资产是否被修改

依据DT创建和更新UE资产时，我们需要对资产 Mark Dirty 并保存，那么如何判断一个GE或者GA是否被修改了呢？

一种很容易可以想到的简单方法是，在 `CreateOrImportGameplayEffect` 函数内部，对所有数据在写入前进行比较，如果变化了，则设置 `bDirty` 为 `true`。但这个方法需要对每个数据都进行比较，新增数据也需要额外的代码进行处理，怎么想都不是一种好方法。

这里提供一种我个人想到的思路。利用UE序列化的函数，去判断资产是否发生修改。函数如下，它利用了UE对Object序列化的支持，可以将GE的数据序列化为字节数组。如果GE内的数据未发生改变，那么序列化的结果肯定是一致的。

```cpp
/**
 * 将 UObject 及其所有子对象序列化为字节数组，用于变更检测
 * 适用于 GE、GA CDO 等需要比较前后状态的场景
 */
static TArray<uint8> SerializeObjectState(UObject* Obj)
{
    TArray<uint8> Bytes;
    FGEStateWriter Ar(Bytes);
    Obj->Serialize(Ar);

    // 同时序列化所有子对象（GE Components 等），以捕获组件属性变更
    TArray<UObject*> SubObjects;
    GetObjectsWithOuter(Obj, SubObjects, false);
    SubObjects.Sort([](const UObject& A, const UObject& B)
    {
        return A.GetName() < B.GetName();
    });
    for (UObject* SubObj : SubObjects)
    {
        SubObj->Serialize(Ar);
    }

    return Bytes;
}
```

将数据写入前的序列化结果，和写入后的进行比较，只对不一致的 MarkDirty 并保存。

![序列化比较的代码实现](/images/ability-editor-helper/image19.png)

### Schema 文件是如何生成的

Schema 的生成利用了 UE 强大的反射系统。核心步骤如下：

1. **获取结构体信息**：通过 `UScriptStruct` 获取目标结构体的类型信息
2. **遍历属性**：使用 `TFieldIterator<FProperty>` 遍历结构体的所有 UPROPERTY
3. **提取元数据**：从每个属性的 `MetaData` 中读取 `ExcelHint`、`ExcelDropDown`、`ExcelSheet`、`ExcelHideColumn` 等自定义标记
4. **处理嵌套类型**：对于结构体类型的属性，递归处理子属性；对于数组类型，记录元素类型信息
5. **序列化为 JSON**：将所有收集的属性信息组织为 JSON 格式，输出为 `.schema.json` 文件

这种基于反射的方案最大的优势在于：**当 C++ 结构体发生变化时（增删改属性），只需重新导出 Schema，整个工具链就能自动适配**。无需手动修改 Excel 模板或解析逻辑，大大降低了维护成本。

### 关于 Protected 属性的访问

在开发插件过程中，遇到了一个比较棘手的问题：GAS 中的一些关键属性（如 `AbilityTags`）被声明为 `protected`，外部代码无法直接访问。

![Protected 属性 AbilityTags 的代码（UE_DEPRECATED_FORGAME）](/images/ability-editor-helper/image20.png)

UE 使用 `UE_DEPRECATED_FORGAME` 宏来限制这些属性的访问，目的是引导开发者通过官方推荐的方式（如 `AbilityTagsReplicationPolicy` 等）来操作这些数据。但在编辑器工具的场景下，我们确实需要直接修改这些属性。对此可以通过反射系统绕过访问限制，使用 `FProperty` 直接读写属性的内存地址来实现。

## 六、结语

以上就是 AbilityEditorHelper 插件的完整介绍。这个插件的诞生完全得益于 AI 的辅助——从 Python 脚本到 C++ 反射代码，几乎所有的实现都是在 Claude AI 的帮助下完成的。作为一个对 Python 和 UE 资产管理并不熟悉的开发者，AI 让我能够在极短的时间内将想法变为现实。

希望这个插件能对使用 GAS 的团队有所帮助。如果你有任何问题或建议，欢迎在 GitHub 上提 Issue。

![结尾](/images/ability-editor-helper/image21.png)
