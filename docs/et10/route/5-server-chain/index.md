---
title: 阶段 5 · 懂服务端链路
---

# 阶段 5 · 懂服务端链路

> **一句话**：说清一个玩家从「点登录」到「站在地图上」的完整路径——消息经过哪些服务器、数据在哪些实体上、地图是怎么切过去的。

这是整条路线里最长的一段，也是最能把前面所有概念串起来的一段。

跑通链路（[阶段 1](../1-run-it/)）和看懂消息（[阶段 4](../4-communication/)）之后，你已经能解释「消息怎么走」。还差最后一块：**这些消息在服务端遇到了什么**——哪些服务器在处理、玩家数据挂在哪、地图是怎么被创建和切换的。

## ⚠️ 本工程与官方 ET10 的两处核心差异

这两处差异会影响你读官方教程时的判断，**先知道再去读**：

| 官方 ET10 | 本工程 | 影响 |
|---|---|---|
| `cn.etetet.unit` | **`cn.etetet.yiuiunit`** | `UnitType` → `EUnitType`（**值不同，不能强转**）；`ChangePosition` → `Event_Unit_ChangePosition` |
| `cn.etetet.numeric` | **`cn.etetet.yiuinumeric` + `cn.etetet.yiuinumericconfig`** | `NumericComponent` → `NumericDataComponent`；`NumericType` → `ENumericType`；`NumericWatcher` → `NumericHandler` |

所以 `Book/5.4`、`Book/5.5`、`Book/5.6` 里的示例代码**概念仍然有效，类型名已经过时**。取舍记录在 `docs/YIUIET10裁剪记录.md`，是权威来源。

## 这个阶段的五个小节

| 小节 | 解决什么 |
|---|---|
| [5.1 Login → Realm → Gate → Map](./1-login-chain) | 登录链路的完整时序与文件落点 |
| [5.2 Scene / Unit / Actor](./2-scene-unit-actor) | 玩家数据挂在什么上，消息按什么寻址 |
| [5.3 地图与切换](./3-map-and-transfer) | 地图怎么创建、玩家怎么换地图 |
| [5.4 移动 · AOI · 寻路](./4-move-aoi-pathfinding) | 位置怎么同步，谁能看到谁 |
| [5.5 配置表与数值系统](./5-config-and-numeric) | 数值从哪来、配置怎么导出 |

## 前置

[阶段 4 · 会跟服务器说话](../4-communication/)——链路就是由这些消息串起来的。

## 做完之后你应该能回答

- 一个玩家从登录到进图，经过几台服务器？各自做了什么？
- `Realm` 和 `Gate` 的分工是什么？为什么要分开？
- 为什么 `Unit` 被换成了 `yiuiunit`？换掉了什么？
- 玩家移动时，谁决定「谁该看到这个移动」？
- 数值改动是怎么通知到关心的模块的？

## 下一步

→ [5.1 Login → Realm → Gate → Map](./1-login-chain)
