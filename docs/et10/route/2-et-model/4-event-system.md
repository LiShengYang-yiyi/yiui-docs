---
title: 2.4 事件机制
---

# 2.4 事件机制

> **一句话**：ET 的逻辑由事件驱动。组件在自己的生命周期节点抛出事件，业务方订阅事件处理逻辑——数据变了，关心它的模块各自响应，互相不知道对方存在。

**关键词**：EventSystem · Awake · Start · Update · Destroy · MessageHandler · 数据驱动逻辑

**目标**：分得清十类事件各自在什么时机抛出，知道新逻辑该挂在哪一类上。

## 为什么需要事件

举个具体场景：服务端发来扣血消息，血条要更新，左上角头像 UI 也要更新。

| 做法 | 后果 |
|---|---|
| 在消息处理函数里**分别**改血值、改头顶血条、改 UI | 消息处理函数同时知道三个模块，耦合 |
| 消息处理函数**只改血值**，血值变化抛事件 | 三个模块各自订阅事件，谁都不用知道谁 |

第二种就是「数据驱动逻辑」。它也是 ET 能保持模块化的原因之一。

## 十类事件

| # | 事件 | 抛出时机 | 典型用途 |
|---|---|---|---|
| 1 | `AwakeSystem` | 组件创建后，**只抛一次**，可带参数 | 初始化组件数据 |
| 2 | `StartSystem` | `Update` 之前抛出 | 需要「别人都初始化好了」才能做的事 |
| 3 | `UpdateSystem` | 每帧 | 帧驱动逻辑 |
| 4 | `DestroySystem` | 组件被 `Dispose` 时 | 清理、反注册 |
| 5 | `ChangeSystem` | 内容改变时，**需要手动触发** | 数据变更后的联动刷新 |
| 6 | `DeserializeSystem` | 反序列化之后 | 从存储恢复后的修正 |
| 7 | `LoadSystem` | 事件系统加载 DLL 时 | 服务端热更新后重注册 Handler |
| 8 | 普通 `Event` | 开发者自己 `Run`，最多带三个参数 | 业务解耦（血值变化、状态变化） |
| 9 | 消息事件 `MessageHandler` | 收到网络消息时 | 协议处理，可声明只由哪类服务器订阅 |
| 10 | 数值事件 | 数值模块专用 | 见 [5.5 数值系统](./../5-server-chain/5-config-and-numeric) |

以上事件**都可以被多次订阅**——一个事件有多个订阅者，是常态而不是特例。

## 怎么选

| 你想做的事 | 用哪个 |
|---|---|
| 组件刚被创建，初始化数据 | `AwakeSystem` |
| 每帧推进 | `UpdateSystem` |
| 组件要销毁了，清理外部注册 | `DestroySystem` |
| 数据改了，通知关心它的人 | 普通 `Event` |
| 收到客户端/服务端消息 | `MessageHandler` |
| 热更后需要重新注册 | `LoadSystem` |

## 和后面章节的关系

- `MessageHandler` 是**网络层入口**，见 [4.2 消息与 Handler](./../4-communication/2-message-and-handler)；
- UI 侧的订阅方式不同（YIUI 有自己的数据与事件表），见 [6.3 数据绑定与事件](./../6-yiui-ui/3-data-binding-and-event)；
- 数值事件是数值组件的一部分，见 [5.5](./../5-server-chain/5-config-and-numeric)。

## 真源

| 文件 | 内容 |
|---|---|
| `Book/3.4事件机制EventSystem.md` | 十类事件的完整列表与代码示例（中文） |
| `Book/3.4EventSystem.md` | 同上，英文版 |
| `AGENTS.md`（工程根） | UI 刷新与解耦的动态消息约定 |

> `Book/3.4` 示例中的写法较旧（如 `Game.EventSystem.Run`），当前工程的事件注册方式以代码为准，语义不变。

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 事件系统实现 | `Packages/cn.etetet.core/Scripts/` |
| `MessageHandler` 实例 | 各包 `Scripts/Hotfix/` 下的 `*Handler.cs` |
| 生命周期 System 实例 | 各包 `Scripts/Hotfix/` 下的 `*System.cs` |

## 读完能回答

- 「数据驱动逻辑」和「在消息处理函数里直接改 UI」差别在哪？
- `Awake` 和 `Start` 的区别是什么？
- 什么时候该用普通 `Event`，什么时候用 `MessageHandler`？
- 为什么 `Destroy` 事件里必须做反注册？

## 下一步

→ [阶段 3 · 代码怎么组织](../3-code-layout/)
