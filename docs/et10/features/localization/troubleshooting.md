---
title: 排查
---

# 排查

> 多语言的问题几乎都能归到三类：Key 不存在、语言没加载、绑定缓存没刷新。按这个顺序查，不要一上来怀疑框架。

**关键词**：OnMissingTranslation · GetTranslation 返回空 · 必须设置默认语言 · 没有加载到目标语言资源 · 缓存不刷新

## 1 先定位是哪一类

| 现象 | 大概率是哪类 |
|---|---|
| 界面显示 Key 原文 | Key 不存在，或缺 Key 策略是 `ShowTerm` |
| 界面显示 `<!-Missing Translation [...]-!>` | 缺 Key 策略是 `ShowWarning` |
| 界面空白 | 翻译取到了空串，或整行语言都是空 |
| 日志报「获取失败内容为空」 | 语言数据没加载 |
| 切了语言没反应 | 该界面用的是数据绑定组件（会缓存），或界面当时没激活 |
| 日志报「必须设置默认语言」 | 开关没配 |

## 2 标准排查顺序

1. **看 Key 在不在源表里** —— `I2_AllSource.xlsx` 搜一遍。不在就是没导出。
2. **看导出过没有** —— 生成的 `I2Terms.cs` / `I2Localize.cs` 里有没有这个常量。没有就是没重新导出。
3. **看当前语言加载了没有** —— 日志有没有「没有加载到目标语言资源」。
4. **看这条 Key 在当前语言这一列有没有值** —— 空值和缺失是两回事。
5. **看缺 Key 策略** —— 决定你看到的是空白、Key 原文还是警告串。
6. **看这个界面是不是数据绑定组件渲染的** —— 是的话，切语言后要重新绑数据。

## 3 判定「Key 到底存不存在」

把缺 Key 策略临时改成 `ShowTerm`：显示 Key 原文说明取词链路是通的，只是查不到翻译；显示空串说明链路本身断了。

反过来，改成 `ShowWarning` 最直观 —— 缺哪条 Key，警告里直接写出来。

## 4 常用日志对照

| 日志 | 含义 |
|---|---|
| `多语言Key == null` | 传了空 Key |
| `多语言:{Term},获取失败内容为空` | Key 或语言数据有问题 |
| `[{FinalTerm}],没有找到多语言,请检查预制体设置,{name}` | 预制体上的 `Localize` 组件 Key 有问题 |
| `必须设置默认语言` | 默认语言开关为空，初始化直接失败 |
| `当前没有这个语言无法切换到此语言 {x}` | 切了一个没加载的语言 |
| `当前语言已存在 请勿重复加载 {x}` | 同一个语言加载了两次 |
| `禁止在此模式下 动态加载语言 {x}` | 编辑器非运行模式下调了加载 |
| `没有加载到目标语言资源 {x}` | 语言 CSV 缺失或加载失败 |
| `错误的语言ID 无法设定 请检查 {id}` | `SetLanguage(int)` 索引越界 |

## 5 三个高频误判

**1. 切语言后部分文字没变**

先确认那个节点用的是不是 `UIDataBindI2Text` / `UIDataBindTextI2TMP` / `UIDataBindImageI2`。这三类组件按 Key 缓存翻译，切语言不刷缓存——这是已知行为，不是 bug。解决办法是切语言后重新绑一次数据。

**2. 界面没打开时切语言，打开后还是旧文字**

`Localize` 组件在节点非激活时不会立刻刷新，等 `OnEnable` 时才补刷。若界面是 `ForeverCache` 常驻但被隐藏的，也一样。

**3. 图片没换**

图片的翻译值是**资源名**。资源名对不上就没图。查两步：翻译值是不是当前语言下的正确资源名；资源有没有在 `LocalizedObjects` 或全局 `Assets` 列表里注册。

## 6 字体没跟着换

字体走的是 SecondaryTerm 链：翻译值就是字体名。

排查顺序：

1. 目标节点挂的是不是支持 Secondary 的 `Localize` 目标（`Text` / `TMP`）
2. `I2CloseSecondaryTranslation` 是不是被打开了
3. 有没有这个字体资源

`I2CloseSecondaryTranslation` 一开，`Localize` 会直接跳过二次翻译，表现就是「文字换了、字体没换」。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuilocalizationpro/Runtime/Manager/LocalizationManager_Translation.cs` | 取词与缺 Key 判定 |
| `Packages/cn.etetet.yiuilocalizationpro/Runtime/LanguageSource/LanguageSourceData_Import_CSV.cs` | 语言数据导入 |
| `Packages/cn.etetet.yiuilocalizationpro/Runtime/YIUI/I2/UIDataBindTextI2Base.cs` | 缓存逻辑所在 |
| `Packages/cn.etetet.yiuilocalizationpro/Runtime/I2LocalizeMgr.cs` | 加载与切换的错误日志 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| `Localize` 组件的刷新判定 | `Runtime/Localize.cs` |
| 字体切换细节 | `Runtime/Targets/LocalizeTarget_TextMeshPro_Label.cs` |
| 资产查找与字典构建 | `Runtime/LanguageSource/LanguageSourceData_Assets.cs` |
| 编辑器期的 Key 校验工具 | `Editor/Localization/` |

## 下一步

→ [声音](../audio/)
