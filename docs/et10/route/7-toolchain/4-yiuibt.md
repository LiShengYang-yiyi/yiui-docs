---
title: 7.4 行为树 YIUIBT
---

# 7.4 行为树 YIUIBT

> **一句话**：YIUIBT 是**面向 AI 的行为树基类**——文本 BTDSL 是唯一事实源，由自然语言生成、经发现/lint/编译/运行/回归的完整闭环；可视化只能查看与编辑，**永远不是生成或运行的前置依赖**。

**关键词**：YIUIBT · BTDSL · TreeType · RuntimeMode · 文本行为树 · 0GC · 核心与扩展

**目标**：理解这套行为树与传统可视化行为树设计思路的区别，以及它的边界在哪。

## 设计目标

传统行为树工具的形态是：打开可视化编辑器 → 拖节点连线 → 保存成资源 → 运行时加载。

YIUIBT 的形态是：

```
自然语言描述
      ↓  AI 生成
文本行为树（BTDSL）
      ↓  发现 / lint / 编译 / 运行 / 回归 / 修正
可运行的树
```

**可视化被排除了必需路径**——它只能用来查看、编辑和观察，不参与生成、编译或运行。这条设计决定了整套系统可以被 AI 无人值守地驱动：文本可 diff、可检索、可校验，可视化不行。

## 唯一事实源：BTDSL

| 规则 | 说明 |
|---|---|
| 文本 BTDSL 是**唯一**行为事实源 | Descriptor、Manifest、AI、lint、编译、Runtime、编辑器**消费同一份 Schema** |
| 禁止第二套节点定义 | 不允许出现「编辑器一套、运行时一套」 |
| 禁止按目录或文件名推断 | 树的身份来自显式声明，不来自路径 |

## TreeType 与 RuntimeMode

这两个概念是正交的，容易混：

| 概念 | 含义 |
|---|---|
| `TreeType` | 这棵树属于哪个业务域（由扩展包声明，核心不维护清单） |
| `RuntimeMode` | 这棵树跑在哪一侧 |

`RuntimeMode` 的取值是 **`C` / `S` / `CS` 三个独立运行位**——`CS` **不包含** `C` 和 `S`，它自己是第三位。

三条约束：

| 约束 | 说明 |
|---|---|
| 图的 `AllowedModes` 必填 | 不能省 |
| 每节点的 `NodeModes` 非空 | 且必须是 `AllowedModes` 与能力 `SupportedModes` 的**子集** |
| 编译按模式投影 | 一份 `.btdsl` 按节点实际模式投影，**每个投影都要重新完整校验**；任一投影失败则整组失败 |

不允许「提升子节点」「自动接线」或「默认结果」——这些都会让失败被掩盖。

## 核心与扩展的边界

| 侧 | 内容 |
|---|---|
| 核心 `cn.etetet.yiuibt` | 通用文本格式、Schema、Compiler、Reader、RuntimeGraph、Runner、黑板、事件、Action 契约、通用调试接口。帧驱动，可挂任意 Entity，**不绑定 Unit / 技能 / 业务** |
| 扩展包 | 技能、Box2D、新手引导、Demo——**可删除的独立包**，真实、显式、单向依赖核心 |

三条硬约束：

1. 扩展包**只能增加 Action**，不能增加专用控制流；
2. 核心**禁止反向引用**扩展；
3. 删掉扩展包后，它的声明、注册、资源、测试、编辑器入口必须**一起消失**——上层因此编译不过，是正确结果。

## 资源与产物

| 项 | 位置 |
|---|---|
| 资源根 | `Assets/GameRes/YIUIBT/` |
| 一级目录 | **不参与** TreeType / 树名 / 产物名 |
| 源文件基名 | 即树名，只作外围资源身份 |
| 产物 | `Assets/GameRes/YIUIBT/Generated/{Client,ClientServer,Server}`，由 YIUIBT 整组更新 |

## 性能与调试

| 目标 | 说明 |
|---|---|
| 热路径 **0GC** | 稳定 Tick 的硬目标：用不可变共享数据、连续数组、强类型参数和 NodeIndex；禁止每帧恢复文本、解析字符串或复制整图 |
| 冷路径允许分配 | Catalog、反射、解析、Manifest、lint、compile 属于冷路径，但必须**确定、失败原子、记录基线** |
| 不用固定毫秒数做门禁 | 跨机器的时间不可比 |
| 调试可选挂载 | 实际实例可挂独立的 `YIUIBTDebugComponent`，用预分配结构体 RingBuffer；组件不存在时不保存调试状态 |

调试组件的一个重要性质：**它的存在与否不影响 Runtime 结果**。观察通道损坏时只禁用该会话，不改变运行行为。

## 当前明确不做的

按总纲 `OPT-006` ~ `OPT-009`，以下能力**只能达到触发条件后独立立项**，不在当前范围：

Profile、黑板历史、Inclusive/Self 统计、异步等待、暂停/单步/断点、安全热重载、`Off/Trace/Profile/Debug` 模式层、全局实例列表。

这条「明确不做」的清单同样是设计的一部分——**没有它，边界会随着每次需求慢慢膨胀**。

## 真源

| 文件 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuibt/AGENTS.md` | 观察边界、回归入口、通用控制节点契约 |
| `Packages/cn.etetet.yiuibt/README.md` | 包能力与用法 |
| `AGENTS.md`（工程根）→「YIUIBT 常驻边界」 | 设计总纲索引（核心/扩展、Schema、运行域） |
| `docs/YIUIBT/YIUIBT新技能系统AI开发总纲.md` | AI 开发总纲 |
| `docs/YIUIBT/YIUIBT扩展包与TreeType节点隔离设计.md` | TreeType 与节点隔离 |
| `docs/YIUIBT/YIUIBT运行域与资源管理设计.md` | 运行域与资源 |
| `docs/YIUIBT/YIUIBT运行时观察调试与性能分析设计.md` | 观察与性能 |
| `docs/YIUIBT/YIUIBT按需调试组件最小实现设计.md` | 调试组件 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 行为树核心 | `Packages/cn.etetet.yiuibt/Scripts/` |
| 行为树配置 | `Packages/cn.etetet.yiuibt/Config/` |
| BT 资源源文件 | `Assets/GameRes/YIUIBT/` |
| 编译产物 | `Assets/GameRes/YIUIBT/Generated/{Client,ClientServer,Server}/` |
| 示例扩展 | `Packages/cn.etetet.yiuibtdemo/` |

## 读完能回答

- YIUIBT 为什么刻意让可视化「不是必需路径」？
- 什么是 BTDSL？它为什么能当唯一事实源？
- `TreeType` 和 `RuntimeMode` 的区别是什么？`CS` 包含 `C` 和 `S` 吗？
- 删掉一个扩展包为什么会编译不过？这是问题还是预期？

## 下一步

→ [7.5 技能与 Buff](./5-skill-and-buff)
