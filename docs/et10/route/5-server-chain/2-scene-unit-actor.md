---
title: 5.2 Scene / Unit / Actor
---

# 5.2 Scene / Unit / Actor

> **一句话**：`Scene` 是进程里的运行单元，`Unit` 是场景中的实体（**本工程已换成 `yiuiunit`**），`Actor` 是「带地址的 Entity」——三者合起来回答了「数据存在哪、消息发给谁」。

**关键词**：Scene · SceneType · Unit · yiuiunit · Actor · Actor Location · EUnitType

**目标**：说清玩家数据挂在哪个对象上，以及一条消息凭什么能找到正确的目标。

## Scene：进程里的运行单元

`Scene` 是 ET 里「一个运行着的服务器单位」的载体。一个进程可以承载多个 `Scene`，用 `SceneType` 区分类型（Realm / Gate / Map / Router / ServiceDiscovery …）。

| 概念 | 含义 |
|---|---|
| `Scene` | 数据的挂载根，一个独立的运行环境 |
| `SceneType` | 这个 Scene 是什么角色 |
| `Fiber`（纤程） | 单线程调度单位，一个进程里有多个 |

回忆 [2.1](../2-et-model/1-everything-is-entity) 的树状结构：顶部是 `Game.Scene`，各模块的数据挂在它下面。`Scene` 就是那棵树的根，而一个进程里可以有多棵。

## Unit：场景实体 ⚠️ 本工程已替换

**这是本工程与官方 ET10 差异最大的地方之一。**

| 官方 ET10 | 本工程 |
|---|---|
| `cn.etetet.unit` | **`cn.etetet.yiuiunit`** |
| `UnitType`（标志枚举） | `EUnitType`（**普通枚举，值不同**，如 Monster `2` → `3`，不能强转） |
| `ChangePosition` / `ChangeRotation` 事件 | `Event_Unit_ChangePosition` / `Event_Unit_ChangeRotation` |
| `AddChildWithId<Unit, int>` | `AddChildWithId<Unit, IUnitConfig>` |

替换后引入的能力：

| 能力 | 说明 |
|---|---|
| 接口驱动的 `IUnitConfig` | 配置通过接口取，不再是具体的配置类型 |
| `NumericData` / `UnitData` 多态 | 数据按类型多态组织 |
| Invoke 模式配置获取 | 配置获取走 Invoke，可拦截、可替换 |
| 对象池优化 | 减少分配 |

**读 `Book/` 里 Unit 相关内容时记住这一点**：概念（Unit 是场景实体、挂 Numeric、有位置旋转）没变，类型名和事件名全变了。取舍记录见 `docs/YIUIET10裁剪记录.md`。

## Actor：带地址的 Entity

Actor 模型解决的是「**这个 Entity 在哪台服务器上**」。

| 概念 | 说明 |
|---|---|
| Actor | 一个 Entity + 它的位置信息 |
| Actor 消息 | 按 Actor 地址投递的消息，不需要知道具体是哪台服务器 |
| Actor Location | 记录「某个 Actor 现在在哪」的全局路由表 |

好处是调用方**只认 Actor 身份**，不关心它在哪：玩家从 Map A 换到 Map B，发给他的消息不用改调用方代码。

## Actor Location 的两条硬规则

| 规则 | 说明 |
|---|---|
| 路由状态**持久化到 DB** | 所以修改持久化结构必须**先设计迁移方案**（`actorlocation/AGENTS.md` 明确要求） |
| **锁必须用 token 闭环** | 调用方用 `LockWithToken` 拿 token，解锁时把 token 一起传回；**不要新增无 token 的解锁路径** |

第二条的原因：无 token 解锁会出现「A 加锁 → 超时释放 → B 加锁 → A 解锁把 B 的锁解了」。有 token 才能确认「解的是自己加的锁」。

> 顺带一个工程事实：Actor Location 的路由状态要写 DB，但**本工程默认关闭数据库也能登录进图**——关闭时持久化被跳过，服务仍然可用。见 `docs/YIUIET10说明.md`。

## 三者怎么配合

```
Scene（在哪个进程 / 什么角色）
   └── Unit（场景里的一个实体，如玩家、NPC）
          └── Actor（给它一个全局身份，让消息能找到它）
                 └── Actor Location（记录它现在在哪）
```

## 真源

| 文件 | 内容 |
|---|---|
| `Book/5.4Actor模型.md` | Actor 介绍、ET 的 Actor、Actor 消息处理 |
| `Book/5.5Actor Location-ZH.md` | Actor Location 机制与消息处理 |
| `Packages/cn.etetet.actorlocation/AGENTS.md` | 路由、锁 token 闭环、持久化迁移要求 |
| `docs/YIUIET10裁剪记录.md` | `unit` → `yiuiunit` 的完整取舍记录（**权威**） |
| `Packages/cn.etetet.yiuiunit/README.md` | yiuiunit 的能力说明 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| Scene 与 SceneType | `Packages/cn.etetet.netinner/Scripts/Model/Share/SceneType.cs` |
| Unit 实现（替换后） | `Packages/cn.etetet.yiuiunit/Scripts/` |
| Unit 配置与 Luban | `Packages/cn.etetet.yiuiunit/Luban/` |
| Actor 路由与锁 | `Packages/cn.etetet.actorlocation/Scripts/` |
| Unit 组装（玩法层） | `Packages/cn.etetet.mapplay/Scripts/` 下的 `UnitFactory` / `UnitHelper` |

## 读完能回答

- `Scene` 和 `Unit` 分别是什么？谁包含谁？
- 本工程为什么把 `unit` 换成 `yiuiunit`？换掉之后哪些写法不兼容了？
- Actor 模型解决的核心问题是什么？
- Actor Location 的锁为什么要带 token？

## 下一步

→ [5.3 地图与切换](./3-map-and-transfer)
