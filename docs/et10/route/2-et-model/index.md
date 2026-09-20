---
title: 阶段 2 · ET 世界观
---

# 阶段 2 · ET 世界观

> **一句话**：这一阶段换掉脑子里的 Unity 心智——ET 里没有 `GameObject`、没有 `MonoBehaviour`、没有多线程业务代码。

工程已经跑起来了，接下来要解决的是「**看得懂但不理解**」：为什么代码长成这样、为什么组件没有方法、为什么服务端和客户端共用一套类。

这四个小节是后面所有内容的解释基础。跳过它们直接看代码，会一直有「这不符合我熟悉的写法」的别扭感。

## ⚠️ 读 Book 之前先知道这一条

`Book/` 是**官方历史教程**，思路依然准确，但部分 API 写法已经过时。当前工程的真实写法以下面两处为准：

| 优先级 | 真源 |
|---|---|
| 1（最高） | 工程代码本身 + `Packages/<包>/AGENTS.md` |
| 2 | 工程根 `AGENTS.md`（分层、编译门禁、UI 边界） |
| 3 | `Book/`（概念讲解，写法需对照当前代码） |

几个已知的写法差异，读到时不要困惑：

| Book 里的旧写法 | 当前工程 |
|---|---|
| `[ObjectEvent]` + `IAwake` / `IUpdate` | `AwakeSystem<T>` / `UpdateSystem<T>` 等 System 类 |
| `ETVoid` | `ETTask` |
| `Game.Scene.AddComponent<T>()` | 组件挂载按包的既定边界走，见阶段 3 |
| `ComponentFactory.Create<T>()` | 优先用组件生命周期（`Awake`）闭环初始化 |

## 这个阶段的四个小节

| 小节 | 解决什么 |
|---|---|
| [2.1 一切皆实体](./1-everything-is-entity) | 为什么没有 GameObject，为什么数据是一棵树 |
| [2.2 组件式设计](./2-component-based-design) | 为什么放弃继承，改成「数据 + 逻辑」分离 |
| [2.3 单线程异步](./3-single-thread-async) | 为什么异步不需要多线程，`await` 到底做了什么 |
| [2.4 事件机制](./4-event-system) | 十类事件各自在什么时机抛出 |

## 前置

[阶段 1 · 跑起来](../1-run-it/)——先见过运行时现象，再来解释它。

## 做完之后你应该能回答

- ET 里一个「玩家」是怎么组织的？`GameObject + MonoBehaviour` 对应什么？
- 为什么 ET 把方法从类里拿出来放到 `System` 里？
- `await` 会不会开新线程？
- 组件被对象池复用后，怎么判断它已经被释放了？

## 下一步

→ [2.1 一切皆实体](./1-everything-is-entity)
