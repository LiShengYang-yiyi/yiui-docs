---
title: 5.4 移动 · AOI · 寻路
---

# 5.4 移动 · AOI · 寻路

> **一句话**：`move` 负责「这个单位在动」，`aoi` 负责「谁该看到它」，`recast` 负责「它该怎么走过去」——三者靠位置变化事件串起来。

**关键词**：move · AOI · 九宫格 · recast · 寻路 · 视野 · Phase

**目标**：说清一次移动在服务端触发了哪些事、谁在什么时候被通知。

## 三个包的分工

| 包 | 职责 |
|---|---|
| `cn.etetet.move` | 移动、停止、转向相关的组件、系统、消息定义，客户端/服务端 Move Handler |
| `cn.etetet.aoi` | 九宫格 AOI：谁在谁的视野里 |
| `cn.etetet.recast` | 3D 寻路库：从 A 到 B 的路径计算 |

`move` 的直接依赖是：`core`、`login`、`map`、`proto`、`recast`、数值包、Unit 包。

> ⚠️ 这两个包在本工程里叫 **`yiuinumeric` / `yiuiunit`**（见 [5.2](./2-scene-unit-actor)）。工程内的依赖清单沿用的是旧名 `numeric` / `unit`，看到旧名直接对应过来即可。

## AOI：谁该看到谁

AOI（Area of Interest）解决的问题是：地图上有几百个玩家，任何一个人的移动都要广播吗？

**不要。** 只广播给「能看到他的人」。九宫格是常用做法：把地图切成格子，只关心自己和相邻格子里的单位。

| 概念 | 说明 |
|---|---|
| `Cell` | 一个格子 |
| `AOIEntity` | 挂在单位上的 AOI 标记 |
| `AOIManagerComponent` | 管理整张地图的格子与单位分布 |
| `AOIHelper` | 进出视野的计算 |
| `PhaseHelper` | Phase（分线 / 分层）相关处理 |

核心机制：单位位置变化时，先算出**它跨到了哪个格子**，再对比新旧格子决定「谁进入了我的视野」「我离开了谁的视野」，只对这些人发通知。

这套设计同时解决两个问题：**广播量**和**安全性**——玩家不会收到视野外单位的数据。

## 寻路：从 A 到 B

`recast` 提供 3D 寻路能力（`Book/8.2` 把它描述为「3d recast 寻路库」）。

流程是：客户端请求移动 → 服务端算路径 → 把路径结果下发给客户端 → 客户端沿线移动、服务端做校验。

工程里的对应文件：

| 文件 | 作用 |
|---|---|
| `move/Scripts/Hotfix/.../M2C_PathfindingResultHandler.cs` | 寻路结果的下发处理 |
| `move/Scripts/Hotfix/.../MoveHelper.cs` | 客户端与服务端共用的移动辅助 |
| `recast/Scripts/Model` · `Scripts/Hotfix` | 寻路模型与逻辑 |
| `recast/Scripts/Editor` | 寻路数据的编辑器工具 |

## 一次移动串起来的样子

```
客户端发起移动
      ↓
服务端算路径（recast）
      ↓
下发寻路结果（M2C_PathfindingResult）
      ↓
单位位置变化 → 抛出位置变化事件
      ↓
AOI 计算进出视野（aoi）
      ↓
只向视野内的单位广播
      ↓
数值变化（如移速）触发的逻辑走 NumericHandler
```

两个值得注意的点：

| 点 | 说明 |
|---|---|
| 位置变化用**事件**而不是直接调用 | 见 [2.4 事件机制](../2-et-model/4-event-system) |
| 移速这类数值变化的监听已改为 `NumericHandler` | 本工程从官方的 `NumericWatcher` 迁移而来，见 [5.5](./5-config-and-numeric) |

## 真源

| 文件 | 内容 |
|---|---|
| `Packages/cn.etetet.move/AGENTS.md` | move 的职责、依赖方向、opcode 兼容要求 |
| `Packages/cn.etetet.recast/AGENTS.md` | recast 的目录约定与开发约束 |
| `Book/5.5Actor Location-ZH.md` | 位置与路由的配合 |
| `docs/YIUIET10裁剪记录.md` | `NumericWatcher` → `NumericHandler` 的迁移记录 |
| `Book/8.2ET Package目录.md` | aoi / recast / move 的官方一句话定位 |

> `aoi` 包当前**没有 `AGENTS.md`**，本节关于 AOI 的说明来自代码结构与官方描述，不是包内约定。

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 移动组件与系统 | `Packages/cn.etetet.move/Scripts/` |
| 移动协议 | `Packages/cn.etetet.move/Proto/Move_C_10300.proto` |
| AOI 格子与计算 | `Packages/cn.etetet.aoi/Scripts/{Model,Hotfix}/Server/` |
| 寻路实现 | `Packages/cn.etetet.recast/Scripts/` |
| AOI 与地图的联动 | `Packages/cn.etetet.map/Scripts/`（位置变化 → 通知 AOI） |

## 读完能回答

- AOI 为什么不用「广播给所有人」？
- 单位位置变化之后，谁来决定通知哪些人？
- 寻路结果是通过哪条消息下发的？
- 移动速度变化是怎么被监视到的？

## 下一步

→ [5.5 配置表与数值系统](./5-config-and-numeric)
