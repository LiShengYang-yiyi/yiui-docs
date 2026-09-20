---
title: 5.1 Login → Realm → Gate → Map
---

# 5.1 Login → Realm → Gate → Map

> **一句话**：客户端先找 Router 拿地址、连上 Gate，Gate 校验登录凭据后把玩家放进 Map——四段分工，每段只做一件事。

**关键词**：登录链路 · Realm · Gate · Map · EnterMap · Session · 时序

**目标**：能按顺序说出一条登录消息经过了哪些服务器、每个服务器的职责边界在哪。

## 为什么要有 Realm 和 Gate 两台

| 服务器 | 职责 | 不需要什么 |
|---|---|---|
| **Realm** | 账号认证、分配 Gate、发放登录凭据 | 不维持长连接、不承载玩家 |
| **Gate** | 维持玩家连接、校验凭据、转发消息 | 不处理业务逻辑 |
| **Map** | 承载玩家与地图内逻辑 | 不直接面对客户端连接 |

分开的价值在于**扩容的粒度不同**：Gate 的数量取决于在线连接数，Map 的数量取决于地图和玩家分布，Realm 只需要很少。合在一起就只能整体扩容。

## 客户端侧：一条链路的起点

| 步骤 | 入口 |
|---|---|
| 1. 建立到服务器的连接 | `Scripts/Hotfix/Client/NetClient/`（网络纤程独立存在） |
| 2. 从 Router 拿地址 | `Scripts/Hotfix/Client/NetClient/Router/RouterHelper.cs` |
| 3. 发起登录 | `Scripts/Hotfix/Client/Login/LoginHelper.cs` |
| 4. 进地图 | `Scripts/Hotfix/Client/EnterMapHelper.cs` |

网络部分跑在**独立的纤程**里（`FiberInit_NetClient`），和主逻辑分开：

```
主纤程（Main）  ←→  NetClient 纤程  ←→  Gate
                     Main2NetClient_LoginHandler
```

这条边界很重要：**网络是独立的纤程，所以网络阻塞不会卡住主逻辑**。跨纤程的消息用 `A2NetClient_*` 这类消息传递。

## 服务端侧：三段处理

| 段 | 关键文件 | 做什么 |
|---|---|---|
| Realm | `Hotfix/Server/Realm/C2R_LoginHandler.cs` | 认证、选 Gate、发登录 key |
| Gate | `Hotfix/Server/Gate/C2G_LoginGateHandler.cs` | 用 key 换 Session，绑定玩家与连接 |
| Gate | `Hotfix/Server/Gate/C2G_EnterMapHandler.cs` | 请求进入地图，创建 / 找到对应 Map |
| Gate | `Hotfix/Server/Gate/R2G_GetLoginKeyHandler.cs` | Realm 与 Gate 之间的桥 |
| Gate | `Hotfix/Server/Gate/PlayerComponentSystem.cs` · `PlayerSystem.cs` | 玩家对象在 Gate 上的管理 |

> `C2G_EnterMapHandler` **属于 `login` 包，不在 `transfer` 包**。这条边界在 `transfer/AGENTS.md` 里明确写了：login 只负责创建临时 Map 纤程并发送内部进图消息，传送业务归 transfer。

## 时序（文字版）

```
客户端                 Realm              Gate                Map
  │  ── 登录请求 ──→     │
  │                     │ 认证、选 Gate、发 key
  │  ←─ Gate 地址 + key ─┤
  │  ── 连 Gate + key ─────────────────→ │
  │                     │ 校验 key      │
  │  ←──── 登录成功 ────────────────────┤
  │  ── 进地图请求 ────────────────────→ │
  │                     │              │ ── 创建/找到 Map ──→ │
  │  ←──── 进图结果 ────────────────────┤                     │
  │                                                       玩家进入
```

## 关键角色

| 名称 | 在哪 | 作用 |
|---|---|---|
| `Session` | Gate / 客户端 | 一条连接的会话对象 |
| `Player` | Gate | 玩家在 Gate 上的对象，绑定 `Session` |
| `SessionPlayerComponent` | Gate | Session 与 Player 的关联 |
| `GateSessionKeyComponent` | Gate | 登录 key 的校验 |
| `GateMapComponent` | Gate | Gate 与 Map 的对应关系 |
| `Wait_SceneChangeFinish` | 客户端 | 等待场景切换完成的标记 |

## 排障时的定位思路

链路断在不同位置，表现完全不同：

| 现象 | 断在哪 |
|---|---|
| 连不上服务器、报 `10037` | Router / Gate 之前 |
| 能连上但登录失败 | Realm 的认证，或 key 传递 |
| 登录成功但进不了图 | Gate → Map 这一段 |
| 进图后是黑屏 / 空场景 | 客户端场景切换或资源 |

按「断在哪一段」去查，比从头读代码快得多。

## 真源

| 文件 | 内容 |
|---|---|
| `docs/YIUIET10说明.md` | 登录进图的验收标准与链路保留范围 |
| `Packages/cn.etetet.transfer/AGENTS.md` | `C2G_EnterMapHandler` 的归属与边界说明 |
| `Packages/cn.etetet.login/AGENTS.md` | login 包职责 |
| `Book/1.1运行指南.md` | 独立起服 + 客户端连接的操作顺序 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 客户端登录与进图 | `Packages/cn.etetet.login/Scripts/Hotfix/Client/` |
| 客户端网络纤程 | `Packages/cn.etetet.login/Scripts/Hotfix/Client/NetClient/` |
| 客户端拉路由 | `Packages/cn.etetet.login/Scripts/Hotfix/Client/NetClient/Router/` |
| Realm 处理 | `Packages/cn.etetet.login/Scripts/Hotfix/Server/Realm/` |
| Gate 处理 | `Packages/cn.etetet.login/Scripts/Hotfix/Server/Gate/` |
| 协议定义 | `Packages/cn.etetet.login/Proto/Login_C_10000.proto` · `Login_S_20000.proto` |
| 玩家与 Session 模型 | `Packages/cn.etetet.login/Scripts/Model/{Client,Server}/` |

## 读完能回答

- Realm 和 Gate 为什么要分成两台服务器？
- 客户端网络为什么跑在独立纤程上？
- `C2G_EnterMapHandler` 在哪个包？为什么？
- 登录成功但进不了图，该查哪一段？

## 下一步

→ [5.2 Scene / Unit / Actor](./2-scene-unit-actor)
