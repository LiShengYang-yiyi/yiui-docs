---
title: 3.1 五层分层
---

# 3.1 五层分层

> **一句话**：包按 `Core / Model / Hotfix / ModelView / HotfixView` 分层——**定义只能在 `Model`，逻辑只能在 `Hotfix`**；`*View` 是客户端表现层。

**关键词**：五层分层 · Core · Model · Hotfix · ModelView · HotfixView · 热更 · 客户端边界

**目标**：拿到一段新代码，能立刻判断它属于哪一层。

## 五个层

| 层 | 放什么 | 服务端也有？ |
|---|---|---|
| `Core` | 框架基础能力：实体系统、网络、进程、纤程 | 是 |
| `Model` | `Entity` / `Component` 的**定义**（纯数据） | 是 |
| `Hotfix` | `System` / `Handler` 的**逻辑** | 是 |
| `ModelView` | 客户端表现层的数据定义 | 否 |
| `HotfixView` | 客户端表现层的逻辑 | 否 |

`View` 两层的存在理由：客户端有一部分数据与逻辑只服务于表现（挂点、特效、界面状态），把它们和服务端共享的 `Model` / `Hotfix` 分开，服务端就不会被拖进无关的依赖。

> 各层的具体职责边界以 `AGENTS.md`（工程根）的「ET 分层与客户端边界」一节为准，上面这张表是它的索引。

## 目录 → 程序集

目录名决定代码进哪个程序集，`<模式>` 取 `Client` / `Server` / `ClientServer`：

| 包内目录 | 程序集 |
|---|---|
| `Scripts/Model/<模式>/` | `ET.Model` |
| `Scripts/ModelView/<模式>/` | `ET.ModelView` |
| `Scripts/Hotfix/<模式>/` | `ET.Hotfix` |
| `Scripts/HotfixView/<模式>/` | `ET.HotfixView` |
| `Scripts/Editor/` | `ET.Editor` |

这份映射的完整生成规则见 [3.2](./2-package-and-assembly) 与 `docs/F6编译流程说明.md`。

## 为什么必须拆开：热更新

热更只替换 `Model` / `Hotfix` / `ModelView` / `HotfixView` 这几个程序集编出来的 DLL。`Core` 在包体里，动不了。

推论：

| 推论 | 说明 |
|---|---|
| 逻辑和定义放同层 → 改逻辑要动定义层 | 热更会牵出更重的改动 |
| 业务代码不能进 `Core` | 进去就永远热更不了 |
| 服务端代码单独在 `DotNet~` | 目标框架 `net10.0`，与 Unity 侧分离 |

## 客户端边界：几条硬规则

ET 是前后端一体仓库，但**运行时分离**。客户端能拿到的数据和调用是有限制的，常见越界写法：

| 禁止 | 原因 |
|---|---|
| `YIUI Panel/View` 里 `new` 请求消息、直接 `Call` / `Send`、等回包 | UI 只负责表现与交互 |
| UI 自己维护业务数据副本 | 会和真实数据源漂移 |
| 业务扩展方法挂到 `Scene` / `Unit` 等通用基类上 | 污染通用类型，所有人被迫依赖你的业务 |

正确做法：客户端专属业务由**明确的客户端业务组件**承接，统一负责缓存、请求节流、协议对接，对外只提供业务 API；UI 只读数据或调 API。

> 这条边界在 [6.1 YIUI 是什么](./../6-yiui-ui/1-what-is-yiui) 会再展开一次——它是 UI 层最容易踩的坑。

## 真源

| 文件 | 内容 |
|---|---|
| `AGENTS.md`（工程根）→「ET 分层与客户端边界」 | 五层职责、Model/Hotfix 划分、UI 边界、组件契约（**权威**） |
| `AGENTS.md`（工程根）→「生成文件与构建入口」 | 生成物禁令、编译入口 |
| `Packages/cn.etetet.core/AGENTS.md` | Core 包的目录职责 |
| `docs/F6编译流程说明.md` | 目录 → 程序集的生成规则与 CodeMode |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 分层规则被违反时的报错 | 编译输出中的 `ET01xx` 分析器诊断 |
| 各层真实写法示例 | `Packages/cn.etetet.core/Scripts/{Model,Hotfix}/` |
| 服务端独立代码 | `Packages/cn.etetet.core/DotNet~/` |

## 读完能回答

- 一个 `Entity` 的定义、一个 `System` 的实现，分别放哪？
- 为什么业务代码不能放进 `Core`？
- `Model` 和 `ModelView` 的界限是什么？
- UI 里为什么不能直接 `Call` 协议？

## 下一步

→ [3.2 Package 与程序集](./2-package-and-assembly)
