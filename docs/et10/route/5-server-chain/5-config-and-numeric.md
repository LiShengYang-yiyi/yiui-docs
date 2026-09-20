---
title: 5.5 配置表与数值系统
---

# 5.5 配置表与数值系统

> **一句话**：配置用 Luban 从按包分布的源文件导出成 C#（生成物禁止手改）；数值系统在本工程**已从官方 `numeric` 换成 `yiuinumeric`**——`NumericDataComponent` + `ENumericType`（约 150 项）+ 双代监听。

**关键词**：Luban · ExcelExporter · 配置表 · 数值系统 · NumericDataComponent · ENumericType · FloatRate

**目标**：知道数值从哪来、配置怎么变成代码、数值变化怎么通知到关心的模块。

## 配置表：Luban 导出

| 项 | 说明 |
|---|---|
| 源文件 | 分布在**每个包自己的** `Luban/` 目录（如 `Packages/<包>/Luban/`），不是工程根 |
| 关键文件 | `__tables__.xlsx` · `__beans__.xlsx` · `__enums__.xlsx` · `Defines/` |
| 聚合配置 | 导出时会扫描所有 `Packages/cn.etetet.*/Luban/*` 并刷新聚合的 `luban.conf` |
| 导出命令 | `dotnet ./Bin/ET.ExcelExporter.dll`（**在工程根执行**） |
| 编辑器入口 | Unity 菜单 `ET/Excel/ExcelExporter` |
| 产物 | C# 代码（`cs-code` / `cs-code-data`），**不是** json 或二进制 |

产物落到 `CodeMode/Model/**` 与 `CodeMode/Config/**`，和 [4.1 协议](../4-communication/1-proto-and-export) 一样按模式分目录。

| 禁令 | 原因 |
|---|---|
| 手改 `*Config.cs` / `*ConfigCategory.cs` / `ConfigGen/` | 导出即覆盖 |
| 手改 `Packages/cn.etetet.yiuilubangen/CodeMode/` 下产物 | 同上 |
| 在错误目录执行导出命令 | `LubanGen.ps1` 定位会失败 |

> **改表 ≠ 导出。** 只改 Excel 单元格用 `et-excel`；要生成代码才走 `et-luban`。两件事分开。

## 数值系统 ⚠️ 本工程已替换

| 官方 ET10 | 本工程 |
|---|---|
| `cn.etetet.numeric` | **`cn.etetet.yiuinumeric`** + **`cn.etetet.yiuinumericconfig`** |
| `NumericComponent` | `NumericDataComponent` |
| `NumericType` | `ENumericType`（约 150 项） |
| `NumericWatcher` + `INumericWatcher` | `NumericHandler` + `NumericHandlerSystem<T>` |
| 配置 `NumericTypeConfig` | `NumericValueCheckConfig` 等一组配置 |

**替换后的构成：**

| 部分 | 内容 |
|---|---|
| `yiuinumeric` | 数值核心：`NumericDataComponent`、`NumericData`（对象池）、`NumericHandlerComponent` / `NumericHandlerDynamicComponent`（双代监听分发）、`NumericConst`（`FloatRate = 10000`）、SourceGenerator 自动生成动态处理器 |
| `yiuinumericconfig` | Luban 配置包：`ENumericType` 枚举、`NumericValueCheckConfig`、`NumericValueAffectConfig`、`NumericValueLimitConfig`、`NumericFormulaConfig`、`NumericLocalizationConfig`、多态 `NumericValueLimitData` |

几个要点：

| 点 | 说明 |
|---|---|
| **`FloatRate = 10000`** | 浮点数值用定点表示（乘以 10000），避免浮点误差。读数值时用 `GetAsFloat()` 这类接口，不要自己除 |
| **双代监听分发** | 静态处理器与动态处理器两套，`SourceGenerator` 自动生成动态部分 |
| 配置化程度高 | 数值的上限、影响、公式、本地化都是配置表驱动，不是硬编码 |

### 官方教程里的说法还有用吗

`Book/5.6数值组件设计.md` 讲的是**思路**：普通做法（一个属性一个字段）的问题，以及 ET 采用的 **Key-Value 形式**保存数值属性。

**这个思路在本工程依然成立**——`ENumericType` + 数值字典就是它的延伸。变的是类型名和监听机制（watcher → handler）。

## 数值变化怎么通知出去

```
数值被修改
      ↓
找到该数值的 NumericHandler
      ↓
Handler 执行业务响应
      ↓
需要广播给客户端时，走数值变化广播事件
```

`mapplay` 里的 `NumericChangeEvent_Broadcast`、`NumericChange_Stun_StartOrStopAI` 就是这类 Handler 的真实例子：数值变了，各自做自己该做的事，互不知道对方存在。

## 真源

| 文件 | 内容 |
|---|---|
| `Packages/cn.etetet.harness/skills/et-luban/SKILL.md` | Luban 导出的完整流程与前置条件 |
| `Packages/cn.etetet.harness/skills/et-luban/references/et-luban-export.md` | 导出结果落点与常见失败排查 |
| `Packages/cn.etetet.harness/skills/et-excel/SKILL.md` | 改表的入口（与导出分开） |
| `docs/YIUIET10裁剪记录.md` | `numeric` → `yiuinumeric` 的完整取舍记录（**权威**） |
| `Book/5.6数值组件设计.md` | 数值组件的设计思路（Key-Value 形式） |
| `Packages/cn.etetet.yiuinumeric/README.md` | 数值包能力说明 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 数值核心实现 | `Packages/cn.etetet.yiuinumeric/Scripts/` |
| 数值配置与枚举 | `Packages/cn.etetet.yiuinumericconfig/` |
| Luban 包与导出脚本 | `Packages/cn.etetet.yiuiluban/`（`Luban/` · `Editor/`） |
| Unit 的配置体系 | `Packages/cn.etetet.yiuiunit/Luban/` |
| 数值变化的业务响应 | `Packages/cn.etetet.mapplay/Scripts/` 下的 `NumericChange*` 文件 |

## 读完能回答

- 配置源文件放在哪？导出命令是什么？产物在哪？
- 为什么不能手改 `*Config.cs`？
- 本工程为什么换掉了官方数值包？换成了什么？
- `FloatRate = 10000` 是干什么用的？
- 数值变化是怎么通知到业务模块的？

## 下一步

→ [阶段 6 · YIUI 客户端 UI](../6-yiui-ui/)
