---
title: 5.3 地图与切换
---

# 5.3 地图与切换

> **一句话**：地图相关能力分三层包——`map`（基础）→ `mapplay`（玩法）→ `transfer`（传送业务），依赖单向；**切场景事件归 `transfer`，玩家进图请求归 `login`**。

**关键词**：map · mapplay · transfer · 地图切换 · 切场景事件 · Unit 组装

**目标**：说清地图是怎么被创建出来的、玩家怎么从一个地图到另一个地图，以及这三层包各自不该做什么。

## 三层包的分工

| 层 | 包 | 职责 | 明确**不**做的 |
|---|---|---|---|
| 基础 | `cn.etetet.map` | 地图消息广播、地图基础组件、基础配置、通用地图能力 | 不依赖 `mapplay` / `spell` / `item` / `quest` |
| 玩法 | `cn.etetet.mapplay` | 地图场景初始化、客户端地图表现、地图内玩法编排、Unit 组装 | 不直接依赖 `transfer` |
| 业务 | `cn.etetet.transfer` | 地图传送编排、客户端切场景、传送协程锁、传送规则表与协议 | Gate 的进图 Handler 不属于它 |

依赖方向是单向的：

```
transfer ──→ mapplay ──→ map ──→ move
```

`map` 有两条硬约束（`map/AGENTS.md`）：不能反向依赖 `move`，也不能依赖更高层玩法包。这样 `move` 可以安全地依赖 `map` 而不成环。

## 玩家进图：谁负责哪一步

这一步容易搞混，边界写得很明确：

| 步骤 | 归属 |
|---|---|
| 客户端发起进图请求 | `login`（协议 `C2G_EnterMap`） |
| Gate 创建临时 Map 纤程、发送内部进图消息 | `login` |
| 地图内玩法编排、Unit 组装 | `mapplay` |
| 跨地图传送 | `transfer` |
| 客户端切场景的**事件类型与发布点** | `transfer` |
| 切场景的 **UI / 表现订阅** | 上层表现包（如 `statesync`） |

> 这条边界的设计意图：`transfer` 只负责「发布切场景这件事」，具体谁来响应、界面怎么表现由上层决定。删掉一个表现包不会影响传送逻辑。

## 地图是怎么被创建出来的

| 概念 | 说明 |
|---|---|
| Map 纤程 | 一张地图对应一个运行单元 |
| Map 配置 | 地图的静态定义（配置表导出） |
| Unit 组装 | 玩家 / NPC 进入地图时组装实体 |
| `UnitInfo` | 地图内的单位信息，用于客户端表现 |

组装这一步在 `mapplay`：`UnitFactory`、`UnitHelper` 负责按配置把 `Unit` 造出来，并把 `UnitInfo` 之类的地图内信息补齐。

## 切换地图时发生什么

```
玩家请求切换地图
      ↓
transfer 编排：校验规则、加传送协程锁
      ↓
目标 Map 创建 / 就绪
      ↓
Unit 迁移到目标地图
      ↓
transfer 发布「切场景」事件
      ↓
客户端表现包订阅 → 切场景、切 UI
```

两个关键点：

| 点 | 说明 |
|---|---|
| **传送协程锁** | 传送过程中要防重入——玩家连点两次不能传送两次 |
| **事件与表现分离** | 传送只发事件，UI 自己决定怎么响应 |

## 真源

- **map 的边界与禁止依赖**<br>`Packages/cn.etetet.map/AGENTS.md`
- **mapplay 的职责与依赖方向**<br>`Packages/cn.etetet.mapplay/AGENTS.md`
- **transfer 的职责、事件归属、`C2G_EnterMapHandler` 的边界说明**<br>`Packages/cn.etetet.transfer/AGENTS.md`
- **move 与 map 的依赖方向约定**<br>`Packages/cn.etetet.move/AGENTS.md`

## 源码落点

- **地图基础能力**<br>`Packages/cn.etetet.map/Scripts/`
- **地图玩法与 Unit 组装**<br>`Packages/cn.etetet.mapplay/Scripts/`
- **传送编排与协议**<br>`Packages/cn.etetet.transfer/Scripts/` · `Proto/Transfer_C_11300.proto`
- **进图消息处理**<br>`Packages/cn.etetet.login/Scripts/Hotfix/Server/Gate/C2G_EnterMapHandler.cs`
- **切场景的客户端表现**<br>`Packages/cn.etetet.statesync/Scripts/`
- **地图相关协议号段**<br>各包 `Proto/`（`Map_*` `MapPlay_*` `Transfer_*`）

## 读完能回答

- `map` / `mapplay` / `transfer` 各管什么？依赖方向是什么？
- 玩家进图请求由哪个包处理？为什么不在 `transfer`？
- 切场景的事件由谁发布、谁订阅？
- 为什么传送需要协程锁？

## 下一步

→ [5.4 移动 · AOI · 寻路](./4-move-aoi-pathfinding)
