---
title: 取词与切语言
---

# 取词与切语言

> 代码取词走 `I2LocalizeHelper.GetTranslation`，界面取词挂 `Localize` 组件或用 YIUI 的数据绑定组件；切语言一次 `SetLanguage` 覆盖全场景。

**关键词**：GetTranslation · I2Localize · I2Terms · Localize · UIDataBindI2Text · UIDataBindImageI2 · SetLanguage · SecondaryTerm

## 1 代码里取词

推荐用生成的强类型入口：

```csharp
// 方式一：常量 Key + 取词
string text = I2LocalizeHelper.GetTranslation(I2Terms.StartGame);

// 方式二：属性直接就是翻译结果
string text = I2Localize.StartGame;
```

两个都来自 YIUIGen 生成，新增 Key 后重新导出即可出现。**不要**在业务代码里手写字符串 Key —— 少一层编译期检查。

带参数的句子用重载：

```csharp
string text = LocalizationManager.GetTranslation("LevelUp", level, name);
```

支持 1~3 个定点参数和一个 `params object[]` 版本。**翻译为空时直接返回空串，不会去执行 `string.Format`**，也不会抛格式异常。

参数占位符的取法有两种：`string.Format` 风格，或 `LocalizationParamsManager` 提供的参数源。

## 2 界面上取词

三条路，按优先级选：

| 场景 | 用什么 |
|---|---|
| 纯文本，预制体标好就不管 | `Localize` 组件 |
| 文本来自 YIUI 数据绑定 | `UIDataBindI2Text` / `UIDataBindTextI2TMP` |
| 图片按语言换 | `UIDataBindImageI2` |

`Localize` 组件的关键字段：

| 字段 | 含义 |
|---|---|
| `Term` | 主 Key |
| `TermSecondary` | 次 Key；目标是 `Text` 时代表**字体名**，目标是 `Image` 时代表**图集名** |
| `LocalizeOnAwake` | 是否在 Awake 时就刷一次 |

刷新时机：`OnEnable` 会刷一次，全量 `LocalizeAll` 时也会刷。**处于非激活状态的界面不会立刻刷新**，等它被打开时才补上——这是刻意的，不是漏刷。

`UIDataBindI2Text` 要求节点上存在 `Text` 组件，否则报「错误没有 Text 组件」。

## 3 图片按语言切换

翻译结果本身就是**资源名**。取到字符串后按名字找 Sprite：

- `Localize` 组件：走 `Localize.TranslatedObjects` 列表，找不到再查全局 `Assets` 列表
- `UIDataBindImageI2`：把翻译结果当 Sprite 资源名，直接走 YIUI 资源加载

还有一条内联写法：Key 的值写成 `[图集名]图片名`，`Localize.DeserializeTranslation` 会拆开，主翻译用前半段，Secondary 用后半段。

## 4 切换语言

```csharp
// 语言已加载：直接切
I2LocalizeMgr.Inst.SetLanguage("English");

// 语言未加载：顺带加载后再切
I2LocalizeMgr.Inst.SetLanguage("English", load: true);

// 按索引切（索引起点见 GetAllLanguages 顺序）
I2LocalizeMgr.Inst.SetLanguage(1);
```

切换完成后全场景文本会自动刷新，业务侧不必手动遍历。需要额外响应（比如重算文本宽度、重排布局），订阅 `EventView_ChangeLanguage`：

```csharp
[Event(SceneType.Current)]
public class EventView_ChangeLanguage_Handler : IDynamicEvent<EventView_ChangeLanguage>
{
    protected override async ETTask Run(Entity entity, EventView_ChangeLanguage args)
    {
        // 语言已切换，此时读到的都是新语言
        await ETTask.CompletedTask;
    }
}
```

## 5 运行时要不要加载模块

`YIUIConstAsset` 里 `I2UseRuntimeModule` 决定数据从哪来：

| 取值 | 数据来源 | 适用 |
|---|---|---|
| `false` | 编辑器资产 `I2Languages.asset` | 编辑器里直接跑，改完立刻生效 |
| `true` | `I2_{Language}` 资源 | 真机、以及编辑器里模拟真机 |

模拟真机模式下**不能**在 Inspector 上切语言，只能用代码切。

## 6 三条容易踩的边界

1. **数据绑定组件会缓存翻译结果**：`UIDataBindI2Text` / `UIDataBindTextI2TMP` / `UIDataBindImageI2` 按 Key 缓存取到的值，切语言不会自动刷新已经绑定过的内容。界面打开时重新绑一次，或切语言后主动重设数据。
2. **切语言只能切已加载的**：未加载且不传 `load = true` 时直接失败，日志「当前没有这个语言无法切换到此语言」。
3. **重复加载会失败**：已存在的语言再调 `LoadLanguage` 会报「当前语言已存在 请勿重复加载」。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuilocalizationpro/Scripts/HotfixView/Client/YIUIInvokeI2Localization.cs` | 取词 Handler 与切语言事件 |
| `Packages/cn.etetet.yiuilocalizationpro/Runtime/YIUI/I2/UIDataBindTextI2Base.cs` | 文本绑定组件基类 |
| `Packages/cn.etetet.yiuilocalizationpro/Runtime/YIUI/I2/UIDataBindImageI2.cs` | 图片绑定组件 |
| `Packages/cn.etetet.yiuilocalizationpro/Runtime/Targets/LocalizeTarget_TextMeshPro_Label.cs` | 字体切换实现 |
| `Packages/cn.etetet.yiuilocalizationpro/Runtime/Localize.cs` | 界面上的多语言组件 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| ET 侧与 Client 侧两份扩展方法 | `Scripts/Hotfix/Share/I2_Extend.cs` · `Scripts/HotfixView/Client/I2_Extend.cs` |
| 带参数的取词重载 | `Runtime/Manager/LocalizationManager_Format.cs` |
| Sprite 查找与缓存 | `Runtime/LanguageSource/LanguageSourceData_Assets.cs` |
| 语言列表与切换底层 | `Runtime/Manager/LocalizationManager_Language.cs` |

## 下一步

→ [源表与生成链](./config)
