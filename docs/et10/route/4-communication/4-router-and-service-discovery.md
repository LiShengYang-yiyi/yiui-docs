---
title: 4.4 Router 与 ServiceDiscovery
---

# 4.4 Router 与 ServiceDiscovery

> **一句话**：`Router` 解决「客户端该连哪台服务器」，`ServiceDiscovery` 解决「服务端之间怎么互相找到」——一个对外、一个对内，不要混为一谈。

**关键词**：Router · 软路由 · ServiceDiscovery · 服务注册 · 心跳 · 主租约 · 变更通知

**目标**：分得清这两个包各自解决谁的问题，知道客户端登录时为什么要先问 Router。

## 一张对照表

| 维度 | `cn.etetet.router` | `cn.etetet.servicediscovery` |
|---|---|---|
| 谁在用 | **客户端** | **服务端** |
| 解决什么 | 客户端该连哪台服务器 | 服务端之间怎么找到对方 |
| 交互方式 | HTTP 拉路由表 + 软路由转发 | 注册 / 查询 / 心跳 / 变更通知 |
| 防攻击 | ✅ 这是它的主要设计目标之一 | ✗ 不是它的职责 |
| 核心角色 | `RouterComponent` / `RouterNode` | `ServiceDiscoveryAgent` + 主节点 |

`Book/8.2` 对 router 的一句话描述是「ET 的软路由，可以防网络攻击」——**软路由**的意思是它不依赖硬件设备，用软件进程承担流量入口与转发。

## Router：客户端的第一跳

客户端启动后不知道服务器在哪。流程是：

```
客户端启动
   ↓  HTTP 请求 Router
拿到可用服务器地址列表
   ↓
连接目标服务器（如 Gate）
```

几个关键点：

| 点 | 说明 |
|---|---|
| 用 **HTTP** 拉列表 | 客户端连上服务器之前需要一个已知的固定入口 |
| 有 RouterManager | 多 Router 时的管理节点 |
| **软路由转发** | 客户端流量先经过 Router 再到目标服务器，真实服务器地址不直接暴露 |
| 路由节点是动态的 | 服务器上下线会改变可用列表 |

工程里的对应实现：

| 文件 | 作用 |
|---|---|
| `RouterComponent` / `RouterNode` | 路由组件与路由节点 |
| `RouterManagerAddressComponent` | 多 Router 的管理地址 |
| `HttpGetRouterHandler` | 客户端拉取路由表的 HTTP 接口 |
| `Router_C_2000.proto` | 路由协议（号段 2000） |
| 客户端侧 | `Packages/cn.etetet.login/Scripts/Hotfix/Client/NetClient/Router/` |

## ServiceDiscovery：服务端互相找到

服务端内部同样有「谁在哪」的问题。ServiceDiscovery 提供四件事：

| 能力 | 说明 |
|---|---|
| 注册 | 服务启动后登记自己 |
| 注销 | 退出或销毁时移除 |
| 查询 | 「某个类型的服务在哪」 |
| 变更通知 | 服务上下线时通知订阅方 |

结构上分成两层：

```
每个进程内的 ServiceDiscoveryAgent
        ↓ 转发（注册 / 查询 / 订阅 / 心跳）
   服务发现主节点（Master）
        ↓
   持久化与服务状态
```

`ServiceDiscoveryAgent` 是**进程级**的：进程里的任何模块要问服务地址，都通过本进程的 Agent 转发，而不是直连主节点。这样主节点只需要处理有限的连接。

心跳与**主租约**（Master 租约）保证主节点本身也是高可用的——主节点挂了会有新的顶上，而不是整个服务发现失效。

## 两个必须知道的约束

| 约束 | 来源 |
|---|---|
| Actor Location 的**路由状态会持久化到 DB**；改持久化结构必须先设计迁移方案 | `actorlocation/AGENTS.md` |
| 本工程默认**关闭数据库**也能启动、登录、进图 | `docs/YIUIET10说明.md` |

第二条对理解这两个包很关键：**ServiceDiscovery 与 Router 都在本地跑，但默认不依赖 Mongo**。数据库关闭时查询为空、保存跳过，流程仍然走得通——这是本工程「单机/纯净版」的核心取舍。

## 真源

| 文件 | 内容 |
|---|---|
| `Packages/cn.etetet.servicediscovery/AGENTS.md` | 包职责、目录划分（Model / Hotfix 各放什么） |
| `Book/8.2ET Package目录.md` | router 的官方一句话定位 |
| `docs/YIUIET10说明.md` | 无数据库也能启动的取舍与验收标准 |
| `Packages/cn.etetet.harness/skills/et-code/SKILL.md` | 消息与 Handler 的编写规范 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 路由组件与节点 | `Packages/cn.etetet.router/Scripts/Model/Server/` |
| 路由逻辑与 HTTP 接口 | `Packages/cn.etetet.router/Scripts/Hotfix/Server/` |
| 服务发现组件与状态 | `Packages/cn.etetet.servicediscovery/Scripts/Model/Server/` |
| 注册 / 查询 / 心跳实现 | `Packages/cn.etetet.servicediscovery/Scripts/Hotfix/Server/` |
| 客户端拉路由表 | `Packages/cn.etetet.login/Scripts/Hotfix/Client/NetClient/Router/` |
| 服务发现协议 | `Packages/cn.etetet.servicediscovery/Proto/ServiceDiscovery_S_20500.proto` |

## 读完能回答

- 客户端启动时为什么必须先请求 Router，而不能直接连服务器？
- ServiceDiscovery 和 Router 的区别是什么？
- 为什么每个进程都要有一个 `ServiceDiscoveryAgent`，而不是都直连主节点？
- 数据库关闭时，服务发现还能工作吗？

## 下一步

→ [阶段 5 · 懂服务端链路](../5-server-chain/)
