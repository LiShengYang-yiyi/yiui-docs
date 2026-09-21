---
title: 排查
---

# 排查

> 条件系统的失败几乎都是「静默不生效」：校验不过就 return，只留一条日志。排查的关键是**先确认监听到底登记成功了没有**。

**关键词**：不触发 · 静默丢弃 · 一对一 · 场景隔离 · errorTips 丢失 · 旧模板

## 1 前提检查

| 前提 | 检查方式 |
|---|---|
| `ConditionMgr` 挂上了吗 | 取值方法返回 null 就是没挂 |
| 挂在哪个场景 | 登记与触发必须在**同一个实例**上 |
| 条件类型注册了吗 | 类上有没有 `[Condition(...)]` |
| 条件声明允许监听吗 | `ConditionConfig.Listener` 为真 |
| 本次要监听吗 | 运行时输入 `Listener` 为真 |

后两条要**同时**成立。任一为假，登记直接失败。

## 2 日志对照表

| 日志关键词 | 含义 | 处理 |
|---|---|---|
| `这个条件不允许监听` | 运行时输入的 `Listener` 为假 | 检查构造条件数据时的取值 |
| `这个条件没有实现监听通知` | 条件声明上的 `Listener` 为假 | 改配置表 |
| `必须是之前打开过的对象` 类校验失败 | 条件类型没注册或场景类型不匹配 | 检查 `[Condition]` 的场景参数 |
| `因为没有任何监听通知` | 登记失败且关闭了立即触发 | 见第 4 节 |
| `handler为空或者已被销毁` | 业务组件销毁时没移除监听 | 补 `RemoveCheckConditionListener` |
| `这个条件不允许监听` + 类型未注册 | 组合失败 | 分两步分别确认 |
| `执行条件检查异常` | 条件实现内部抛异常 | **异常被吞了**，只能靠这条日志定位 |

## 3 最典型的三种「不触发」

**类型一：触发了但没人回调**

监听根本没登记成功。用 `AddCheckConditionListener` 的**返回值**判断 —— 它返回 bool，`false` 就是没成功。

**类型二：登记了但触发不进去**

`TriggerListener` 在两种情况下只打日志不触发：类型没注册、或条件声明不允许监听。触发端与监听端要检查的是**同一份声明**。

**类型三：都对了但还是不触发**

泛型通道与非泛型通道由「检查系统类型」**精确匹配**。监听时用的是带 `B` 的版本，触发时用的不带 `B`，两者不会命中。

判据：**监听和触发必须走同一套泛型形态。**

## 4 立即触发的那条日志

`AddCheckConditionListener` 的 `immediatelyTrigger` 参数默认是 `true`。

登记失败时的行为分两种：

| `immediatelyTrigger` | 行为 |
|---|---|
| `true` | 以固定的 `instanceId = 0` 回调一次，`result = false` |
| `false` | 只打一条日志：「永远不会变，且关闭了立即触发，所以永远没有被触发过」 |

看到第二条日志的含义很直接：**这个监听永远不会有回调，写法有问题。**

泛型版没有这个参数，登记失败时总是回调一次 `result = false`。

## 5 errorTips 会丢

条件实现内部抛异常时，求值层捕获后**只返回 `(false, "")`** —— 提示文案丢了。

后果：拿到「不成立但没提示」时，不要怀疑配置，去看那一条 `执行条件检查异常` 日志。

另外注意：**最终 `errorTips` 来自第一个失败的条件**。多条件组合下，后面的条件可能压根没被求值（短路），所以看到的提示未必是「全部问题里最相关的那条」。

## 6 一对一约束

`EConditionType` 与判据类型是**一对一**的。含义：

- 同一个条件类型注册两种判据类型 → 第二个被**静默丢弃**，只留日志
- 表现是「某个实现莫名其妙不生效」

改条件实现时，如果换了判据类型，必须确认没有别的实现占着同一个条件类型。

## 7 一个类只能有一种条件类型

`ConditionSystemSingleton` 注册时：

| 情况 | 结果 |
|---|---|
| 同一个类标了多个 `Condition` 特性 | 报错后跳过 |
| 三元组（条件类型、场景类型、检查系统类型）重复 | 报错 |
| 条件类型与判据类型组合重复 | 报错后跳过 |

所以「同一个条件类型、不同场景类型」是允许的，用 `sceneType` 区分；但**一个类不能同时承担两种条件类型**。

## 8 没有环检测

源码里**没有任何条件间循环依赖的检测**。重入只靠一个「正在触发」标记加队列串行化。

含义：在监听回调里再次触发同一类型，会被排进队列逐轮处理，**系统不会阻止你写出无限循环**。回调里主动触发要自己保证收敛。

## 9 场景隔离带来的两个坑

| 坑 | 说明 |
|---|---|
| 取值入口不同实例 | `YIUICondition()` 与 `YIUIRootCondition()` 可能是两个 mgr |
| 场景销毁 | 该场景的监听随场景清掉，业务侧可能仍持有已失效的 `listenerId` |

业务组件销毁时**显式移除**是唯一稳妥做法。系统在回调发现宿主失效时会自动摘监听并打日志，但那是兜底，不是设计意图。

## 10 不要抄包内的旧模板

包内 `.Template/` 目录下的示例是**旧版 API**，其中这些符号在当前源码里已经不存在：

| 旧模板里的符号 | 当前的对应物 |
|---|---|
| `IConditionConfig` | `IConditionData` |
| `ConditionCustomConfig` | `ConditionCustomData` |
| `AddCheckConditionGroupListener(...)` | 传列表的 `AddCheckConditionListener(...)` |
| `Check(Scene, IConditionConfig, T)` | `Check(Scene, IConditionData, T)` |

照着旧模板写会编译不过。以 `Scripts/` 下的源码为准。

## 11 排查动作

| 动作 | 目的 |
|---|---|
| 打印 `AddCheckConditionListener` 的返回值 | 第一步就是确认登记成功没有 |
| 在回调方法首行打日志 | 区分「没回调」和「回调了但业务没处理」 |
| 打印 `listenerId` | 确认非 0，且移除时用的是同一个字段 |
| 单条件先跑通再上多条件 | 把组合规则的问题排除掉 |
| 检查触发与监听的泛型形态是否一致 | 排查「都对了但不触发」 |

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuicondition/Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Listener_Extend.cs` | 登记校验与触发分发 |
| `Packages/cn.etetet.yiuicondition/Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Info.cs` | 回调派发与失败摘除 |
| `Packages/cn.etetet.yiuicondition/Scripts/Model/Share/Condition/Core/ConditionSystemSingleton.cs` | 注册期校验 |
| `Packages/cn.etetet.yiuicondition/Scripts/Model/Share/Condition/Core/ConditionInfo.cs` | 求值异常的处理 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 全部日志文案 | 在包内搜 `Log.Error` |
| 监听的前置校验 | `ConditionMgrSystem_Listener_Extend.cs` 的 `CheckCanListener` |
| 触发入口的分支 | 同文件的 `TriggerListenerEnter` 与 `TriggerListenerByType` |
| 求值异常分支 | `ConditionInfo.cs` 的 `Check` |

## 下一步

→ [返回专题总览](../)
