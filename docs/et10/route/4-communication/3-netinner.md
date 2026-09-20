---
title: 4.3 内网消息 NetInner
---

# 4.3 内网消息 NetInner

> **一句话**：`NetInner` 负责**服务端内部**的消息——进程之间的转发、以及进程内纤程之间的通信；对外的客户端连接由外层网络组件负责，两者分开挂载。

**关键词**：NetInner · NetOuter · 纤程 · Fiber · MessageSender · SceneType · 内网外网分离

**目标**：理解「一个服务端进程为什么需要两种网络组件」，以及消息在服务端内部怎么找到目标。

## 两种网络组件

| 组件 | 处理 | 挂在谁身上 |
|---|---|---|
| `NetInnerComponent` | **内网**连接：服务端进程之间、纤程之间 | 所有服务端 |
| `NetOuterComponent` | **外网**连接：与客户端通信 | 只有直接面向客户端的服务器（如 Gate） |

不是每个服务器都要两种。这是组件可插拔的直接体现：

| 服务器 | 挂什么 | 为什么 |
|---|---|---|
| LoginServer / Gate | 内网 + 外网 | 要接客户端，也要和内部通信 |
| Battle / Map | 只有内网 | 外网消息由 Gate 转发进来，自己不直接对客户端 |

## 为什么必须有「内网」这一层

服务端不是一个大进程，而是**多个进程 + 多个纤程**。角色之间存在大量互相调用：

- Realm 要把玩家指派给某个 Gate；
- Gate 要把消息转给玩家所在的 Map；
- 任何进程都可能需要问 ServiceDiscovery「某个服务在哪」；
- 进程内部，不同纤程之间也要通信。

这些都不能走客户端那条外网通道。所以有一条独立的内网消息链路，特点是：

| 特点 | 意义 |
|---|---|
| 不带外网的安全开销 | 内部互信，不需要走 Router 那套 |
| 支持纤程寻址 | 消息可以精确投递到某个进程内的某个纤程 |
| 与 Scene 类型绑定 | 按 `SceneType` 决定这条消息由谁处理 |

## 核心构成

| 文件 / 类型 | 作用 |
|---|---|
| `MessageSender` | 内网消息的发送器 |
| `ProcessOuterSender` | 进程内对外发送的中转 |
| `A2NetInner_Message` / `A2NetInner_Request` | 纤程之间传递的消息与请求载体 |
| `FiberInit_NetInner` | 内网纤程的初始化 |
| `ConstFiberId` | 预定义的纤程 Id |
| `SceneType` | 场景 / 服务器类型 |
| `PackageType` | 包类型标识 |

`A2...` 这个前缀是 ET 的命名习惯：**`A2B_X` 表示「从 A 到 B 的消息 X」**。看到 `A2NetInner_Message` 就知道它是「发给内网模块的消息」。

## 消息在服务端内部的流向

```
客户端消息
   ↓
Gate（外网组件收到）
   ↓  按玩家所在位置决定目标
内网组件（NetInner）
   ↓  转发到目标进程 / 纤程
Map 进程处理
   ↓
需要回包时沿原路返回
```

「按玩家位置决定目标」这一步依赖 Actor Location 机制，见 [5.2 Scene / Unit / Actor](../5-server-chain/2-scene-unit-actor)。

## 真源

| 文件 | 内容 |
|---|---|
| `Book/4.1组件式设计.md` | LoginServer / BattleServer 挂载不同网络组件的原始说明 |
| `Book/8.2ET Package目录.md` | `netinner`「内网消息模块」的定位 |
| `Packages/cn.etetet.harness/skills/et-code/SKILL.md` | 消息与 Handler 的编写规范 |
| `AGENTS.md`（工程根） | 客户端与服务端的运行时边界 |

> `netinner` 包当前**没有 `AGENTS.md`**，所以这一节的部分结论来自代码事实与官方教程，不是包内约定。看代码时以实际实现为准。

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 内网消息处理器 | `Packages/cn.etetet.netinner/Scripts/Hotfix/Server/A2NetInner_MessageHandler.cs` |
| 内网请求处理器 | `Packages/cn.etetet.netinner/Scripts/Hotfix/Server/A2NetInner_RequestHandler.cs` |
| 消息发送器 | `Packages/cn.etetet.netinner/Scripts/Hotfix/Server/MessageSenderSystem.cs` |
| 纤程初始化 | `Packages/cn.etetet.netinner/Scripts/Hotfix/Server/FiberInit_NetInner.cs` |
| 纤程与场景类型定义 | `Packages/cn.etetet.netinner/Scripts/Model/Share/` |
| 客户端侧网络纤程 | `Packages/cn.etetet.login/Scripts/Hotfix/Client/NetClient/` |

## 读完能回答

- `NetInner` 和 `NetOuter` 分别处理什么？为什么有的服务器只需要前者？
- 为什么服务端内部通信不能复用客户端那条通道？
- `A2NetInner_Message` 这个名字表达的是什么？
- 客户端登录时走的网络组件和 Gate 转发消息用的组件是同一个吗？

## 下一步

→ [4.4 Router 与 ServiceDiscovery](./4-router-and-service-discovery)
