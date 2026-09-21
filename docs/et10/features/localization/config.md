---
title: 源表与生成链
---

# 源表与生成链

> 多语言只维护一份 xlsx 源表。导出时它被拆成三份产物：Luban 检查表、按语言拆分的运行时 CSV、以及强类型 Key 代码。

**关键词**：I2_AllSource.xlsx · LocalizationCheck.yml · I2Terms · I2Localize · I2Languages.asset · I2DefaultLanguage · I2NullTranslationError

## 1 唯一的手工维护对象

`Packages/cn.etetet.yiuilocalizationpro/Luban/Config/Datas/I2_AllSource.xlsx`

| 列 | 内容 |
|---|---|
| 第 1 列 | `Key` —— 取词用的键 |
| 第 2 列 | `Type` —— 分类，用于生成代码分组 |
| 第 3 列 | `Desc` —— 备注，给写文案的人看 |
| 第 4 列起 | 每种语言一列，表头是语言名 |

**只改这个文件。** 下游的 CSV、YML、生成的 C#、`I2Languages.asset` 都是产物。

## 2 导出产生什么

| 产物 | 路径 | 用途 |
|---|---|---|
| 全量 CSV | `Assets/Editor/I2Localization/I2_AllSource.csv` | 编辑器期查表 |
| 单语言 CSV | `Assets/GameRes/I2Localization/I2_{Language}.csv` | 运行时按语言加载 |
| 检查表 YML | `Luban/Config/Datas/Localization/LocalizationCheck.yml` | Luban 的输入 |
| Key 常量 | `Scripts/Model/Share/YIUIGen/I2Terms/I2Terms.cs` | `I2Terms.Xxx` |
| 取词属性 | `Scripts/ModelView/Client/YIUIGen/I2Localize/I2Localize.cs` | `I2Localize.Xxx` |
| 编辑器资产 | `Assets/Editor/I2Localization/I2Languages.asset` | 编辑器模式下跑 |

生成的 C# **写在 `UIETCreatePackageName` 指定的包里**，不是写在多语言包里。工程当前的取值是 `cn.etetet.yiui`。

## 3 Luban 侧的三张表

| 表 | 内容 |
|---|---|
| `LocalizationCheckConfig` | Key 清单，只有 `key` 一个字段 |
| `I2` | 多语言条目，字段 `Key` 带 `#ref` 指向上面的清单 |
| `LocalizationCheckConfigCategory` | 前者的容器，`Get` 未命中会打 `LubanLog.Error` |

`I2.Key` 的 `#ref` 是硬约束：**Key 必须先在检查表里存在**，否则 Luban 导不出来。这层校验专门用来挡「代码里写了一个表里没有的 Key」。

## 4 导出入口

编辑器菜单 `ET/YIUI Luban/Export Config`。

顺序是固定的一条链：读 xlsx → 校验 → 写 CSV 与 YML → 生成 C# → Luban 导出 → 写回 `I2Languages.asset`。**任意一步校验失败，整次导出直接失败**，日志是「多语言源表生成失败」。

## 5 导出会拒掉的写法

| 写法 | 结果 |
|---|---|
| Key 里带空格 | 报错；工具会顺手删掉空格，仍要求手工改名 |
| Key 重复 | 跳过该行并报错 |
| 整行所有语言都为空 | 报错 |
| 语言列整列为空 | 报错 |
| 表头缺少默认语言或注释语言 | 直接失败 |
| 首行不是定义行 | 直接失败 |
| `I2NullTranslationError=true` 时某语言缺失 | 报错 |

Key 里含 `##` 的行会被整体跳过，用来临时停用一条。

## 6 Key 变成标识符的规则

Key 不总是合法 C# 标识符，生成时会做转换：

| 情况 | 处理 |
|---|---|
| 数字开头 | 前面补 `_` |
| 含非法字符 | 替换成 `_` |
| 撞 C# 关键字 | 前面加 `@` |
| 同分类内重名 | 追加 `_1` / `_2` |
| 名字为空 | 用 `_` |

名字长度超过 50 会被截断。**所以 Key 尽量自己就写成合法标识符**，避免生成后对不上。

## 7 工程侧开关

`Assets/GameRes/YIUI/YIUISettings/YIUIConstAsset.txt` 里的一组：

| 开关 | 作用 |
|---|---|
| `I2DefaultLanguage` | 默认语言，**必填** |
| `I2CodeCommentLanguage` | 生成代码注释取哪种语言 |
| `I2UseRuntimeModule` | 运行时走 CSV 资源还是编辑器资产 |
| `I2NullTranslationError` | 某语言缺失时是否算错误 |
| `I2AutoComplete` | 空值是否用注释语言自动补齐 |
| `I2AutoCompleteFormat` | 自动补齐的格式 |
| `I2CloseSecondaryTranslation` | 关掉字体 / 图集这类二次翻译 |
| `UIETCreatePackageName` | 生成代码写进哪个包 |

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuilocalizationpro/Luban/Config/Base/Defines/Localization.xml` | 三张表的定义 |
| `Packages/cn.etetet.yiuilocalizationpro/DotNet~/LubanExport/LocalizationLubanPreprocessor.cs` | 导出预处理与全部校验 |
| `Packages/cn.etetet.yiuilocalizationpro/Runtime/YIUI/YIUIConstAsset_I2.cs` | 开关的 C# 侧声明 |
| `Packages/cn.etetet.yiuilocalizationpro/Luban/Config/Datas/I2_AllSource.xlsx` | 唯一手工维护的源表 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 生成的 Luban 配置类 | `CodeMode/Model/Client/LubanGen/Config/` |
| 导出的 JSON | `Assets/Editor/Luban/Datas/LocalizationCheck.json` |
| 编辑器工具模块 | `Editor/YIUIAutoTool/UII2Localization/UII2LocalizationModule.cs` |
| 生成代码的结构模板 | `Editor/Localization/LocalizationEditor_Tools_Script.cs` |

## 下一步

→ [排查](./troubleshooting)
