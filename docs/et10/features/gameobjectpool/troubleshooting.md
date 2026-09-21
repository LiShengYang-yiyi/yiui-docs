---
title: 排查
---

# 排查

> 对象池的坑集中在三个地方：**返回值不等于状态**、**配置只读一次**、**时基与场景是全局的**。

**关键词**：Put 返回值 · 配置热更 · 时基重置 · 场景清池 · 失活父级 · 并发上限

## 1 日志对照表

| 日志关键词 | 含义 | 处理 |
|---|---|---|
| `回收对象为空，无法回收` | `Put` 传了 null | 调用方判空 |
| `不在 ... 缓存池中，无法回收` | 传了不属于该池的对象，**已被直接销毁** | 确认资源名与池一致 |
| `没有加载到这个资源` | 实例化失败，`Get` 返回 null | 查资源名与加载层 |
| `最大缓存数量为 ... 但是没有设置新的资源` | 配了上限却没配替代资源 | 补 `MaxCacheCountNewResName`，或把上限置 0 |
| `缓存池中存在空对象，请检查` | 有人把池管理的对象销毁了 | 改成走 `Put` |

## 2 三个高频误判

**误判一：`Put` 返回 `true` 就以为对象还在**

游戏退出流程里 `Put` 直接返回 `true` 但**不做任何事**。判据：`Put` 的返回值只说明「这次调用被接受」，不说明对象状态。

**误判二：`MaxCacheCount` 是缓存数量**

它管的是「同时借出去的上限」。缓存保留量由 `MinCacheCount` 决定 —— 名字反了，改配置时最容易配错的就是这一对。

**误判三：配置改了就该生效**

池只在**第一次实例化对象时**读一次配置，之后设一个标记就不再重读。运行期热更了配置表，已经建好的池不会跟着变。

需要生效：清掉池重建（场景切换可以触发），或者重启。

## 3 时基是全局的

单例自己提供时间基准，三个后果：

| 后果 | 说明 |
|---|---|
| 所有池共用一个时间轴 | 某个池的超时判断会影响整体节奏 |
| 退出播放会重置 | 退出再进，时间归零，已有超时状态失效 |
| 面板不可见时仍走时 | 超时与可见性无关 |

所以 `Timeout` 调得比较激进时，会出现「切出去再回来，借出去的对象被自动收走了」。需要跨这种场景的对象，`Timeout` 要配 0。

## 4 场景切换必然清池

场景加载完成后会做「清空 + 重建」。含义：

- 池里所有实例都会没
- 跨场景持有的引用全部失效
- 靠池对象维持状态的逻辑会断

需要在场景切换后继续存在的对象，不要放进这个池。

## 5 归还后的父节点是失活的

所有归还的实例都挂在专属于池的根节点下，那个节点是失活状态。因此：

- 归还后对象自身不会触发 `OnEnable` / `OnDisable` 那套依赖
- 自己在 `OnDisable` 里写逻辑的对象，进池后行为会变
- 直接复用实例前不要假设它「看起来还是活的」

## 6 组件式的连续归还

`YIUIGameObjectPoolTrigger` 的两个时机不一致：

| 时机 | 行为 |
|---|---|
| `OnDisable` | 延时一帧再还 |
| `OnDestroy` | 立刻还 |

同一个对象如果既被禁用又被销毁，可能触发两次归还。第二次因为归属记录已经清掉，会走「不在池中」的分支。

## 7 依赖外部注册的部分

有三处依赖框架的 Handler 与加载层：

- 取配置
- 实例化
- 释放通知

任何一处没注册好，表现都是**静默回落**而不是报错：

| 缺什么 | 表现 |
|---|---|
| 配置 Handler | 取不到表数据，回落用预制体组件上的配置 |
| 实例化通道 | 取对象失败，返回 null |
| 释放通道 | 对象被销毁时加载层不知道，可能重复释放 |

排查「池没反应」时，先确认这几个 Handler 都随程序集加载了。

## 8 默认配置是占位数据

配置表默认只有一条名为「测试资源名称」的占位数据。真实资源名查不到时：

- 第一顺位查表 → 落空
- 第二顺位查预制体组件 → 没挂也落空
- 结果是全套默认值

判定方式：看对象上有没有挂配置组件。**没配置的池会按「全部不限」运行**，表现为永久缓存、永不超时。

## 9 建议的排查动作

| 动作 | 目的 |
|---|---|
| 打印 `GetSettings(resName)` 的结果 | 一次看清这个资源用的是哪套配置 |
| 打印 `Get` 返回的对象是否为空 | 区分「资源问题」和「池问题」 |
| 在 `Put` 前后打日志 | 确认有没有重复归还 |
| 检查对象上有没有 `YIUIGameObjectPoolInfo` | 判断是否走了回落路径 |

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuigameobjectpool/Runtime/GameObjectPool/YIUIAutoRecycleAsyncObjectPool.cs` | 全部校验分支与超时判定 |
| `Packages/cn.etetet.yiuigameobjectpool/Runtime/GameObjectPool/YIUIGameObjectPool.cs` | 单例级时基与场景清池 |
| `Packages/cn.etetet.yiuigameobjectpool/Runtime/GameObjectPool/YIUIGameObjectPoolTrigger.cs` | 组件式取放的时机 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 全部 Error 文案 | 在包内搜 `Log.Error` / `Debug.LogError` |
| 配置读取与回落 | `Runtime/GameObjectPool/YIUIGameObjectPool.cs` 的 `GetSettings` 与 `GetAutoRecycleAsyncObjectPool` |
| 归还的拒绝分支 | `Runtime/GameObjectPool/YIUIAutoRecycleAsyncObjectPool.cs` 的 `Put` |
| 配置查询 Handler | `Scripts/HotfixView/Client/YIUIInvokeGetGameObjectPoolSettingsHandler.cs` |

## 下一步

→ [调用系统](../invoke/)
