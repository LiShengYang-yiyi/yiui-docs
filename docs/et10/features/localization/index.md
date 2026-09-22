---
title: 多语言
---

# 多语言

> 多语言包把 I2 Localization 的整体源码收进 ET 分层，并接上 YIUI 的资源加载：一份多语言源表经 Luban 生成检查表与强类型 Key 代码，运行时按语言加载拆分后的 CSV。

**关键词**：yiuilocalizationpro · I2LocalizeMgr · I2LocalizeHelper.GetTranslation · I2Terms · I2Localize · LocalizeTarget · LocalizeAll

## 1 定位与边界

管四件事：

- 取词：按 Key 取当前语言的文本
- 切语言：换语言后刷新全场景文本、字体、图集
- 资源本地化：不同语言用不同字体、不同 Sprite
- 源表到代码：xlsx → Luban 检查表 → 按语言拆分的 CSV → 强类型 Key 常量

不管两件事：

- 界面结构 —— 多语言只换文字与资源，不动布局
- 文本排版 —— 长文本换行、RTL 这些由 `Text` / `TMP` 组件自己负责

包内命名空间统一是 `I2.Loc`，运行时核心是 `LocalizationManager`（对应 I2 Localization 2.8.20）。工程里**没有**使用 Unity 官方的 `UnityEngine.Localization`，两者互不相干。

强依赖 YIUI。管理器与资源加载都建在 YIUI 单例与 `YIUIInvoke` 上，不能脱离 YIUI 单独使用。

## 2 三条取词入口

| 入口 | 形态 | 用在哪 |
|---|---|---|
| `I2LocalizeHelper.GetTranslation(key)` | 静态方法 | 代码里临时取一个词 |
| `I2Terms.Xxx` | `const string` 常量 | 传给上面的方法当 Key |
| `I2Localize.Xxx` | 静态属性，直接返回翻译结果 | 最省事，编译期就能查错 |
| `Text` 组件上挂 `Localize` | 组件 | 预制体上标好，界面刷不刷不用写代码 |

`I2Terms` 与 `I2Localize` 都是生成物，Key 写错编译不过——这是它们比裸字符串唯一多出来的价值。

## 3 缺 Key 时的行为

取不到翻译由 `LanguageSourceData.OnMissingTranslation` 决定，五个选项：

| 取值 | 结果 |
|---|---|
| `Fallback` | 先找同语系的，再找任一可用语言（默认） |
| `ShowTerm` | 直接返回 Key 本身 |
| `ShowWarning` | 返回 `<!-Missing Translation [term]-!>` 并打警告 |
| `Empty` | 返回空串 |

翻译值写成 `---` 表示**故意留空**，不算缺失。

## 4 切语言之后发生什么

`I2LocalizeMgr.Inst.SetLanguage(...)` 一次调用，做三件事：

1. 改 `LocalizationManager.CurrentLanguage`，写入本地存档 `I2 Language`
2. 触发 `LocalizeAll` → **下一帧**遍历全场景 `Localize` 组件，逐个刷新文本 / 字体 / Sprite
3. 发出 `EventView_ChangeLanguage` 动态事件，业务侧可以订阅

第 2 步刻意延后一帧：同一帧里连续切两次语言只刷一次。

新语言未加载时传 `load = true`，会异步拉 `I2_{Language}` 资源、导入 CSV、刷新、再释放这个 TextAsset。语言数据用完即弃，不常驻内存。

## 5 哪些语言必须提前加载

运行时语言数据来自 `Assets/GameRes/I2Localization/I2_{Language}.csv`，进游戏时**只加载默认语言**。默认语言之外的，要在进游戏前或切语言时按需加载——`SetLanguage(name, true)` 会顺带加载，但会多等一次资源加载。

默认语言没配会直接初始化失败，日志是「必须设置默认语言」。

## 真源

- **单例管理器、语言加载与切换**<br>`Packages/cn.etetet.yiuilocalizationpro/Runtime/I2LocalizeMgr.cs`
- **ET 侧取词入口**<br>`Packages/cn.etetet.yiuilocalizationpro/Scripts/Model/Share/I2LocalizeHelper.cs`
- **取词与缺 Key 判定**<br>`Packages/cn.etetet.yiuilocalizationpro/Runtime/Manager/LocalizationManager_Translation.cs`
- **术语表数据主体**<br>`Packages/cn.etetet.yiuilocalizationpro/Runtime/LanguageSource/LanguageSourceData.cs`
- **工程侧多语言开关**<br>`Packages/cn.etetet.yiuilocalizationpro/Runtime/YIUI/YIUIConstAsset_I2.cs`

## 源码落点

- **界面自动刷新的组件**<br>`Runtime/Localize.cs` · `Runtime/Targets/`
- **YIUI 数据绑定多语言组件**<br>`Runtime/YIUI/I2/`
- **资源加载与缓存**<br>`Runtime/Utils/ResourceManager.cs`
- **场景上的挂载预制体**<br>`Runtime/I2LocalizationSourceManager.prefab`
- **编辑器工具入口**<br>`Editor/Toolbar/YIUILocalizationExcelToolBar.cs`

## 下一步

→ [取词与切语言](./usage)
