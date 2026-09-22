---
title: 对象池
---

# 对象池

> 对象池按资源名分桶缓存 GameObject，并内建三种自动回收：显示超时、缓存超时、整桶闲置。它解决的是「同一个小物件被反复实例化」这一类开销。

**关键词**：yiuigameobjectpool · YIUIGameObjectPool · resName 分桶 · 显示超时 · 缓存超时 · 并发上限

## 1 定位与边界

解决什么：

- 同一个资源（红点、特效、飘字挂件这类小物件）频繁创建销毁的问题
- 多个界面同时需要同一个资源时的并发控制
- 用完忘记回收时的兜底清理

不解决什么：

- 界面资源本身的加载与释放（那是加载层的事）
- 列表项的复用（循环列表自带 Item 池，**不走这个池**）

它是 `YIUIMonoSingleton`，全局一个实例，随游戏进程常驻。

## 2 独立可用与 Invoke 依赖的边界

这个包只有三处依赖 ET 的 Invoke 机制，其余全是纯 Unity 逻辑：

| 位置 | 用途 |
|---|---|
| 取配置 | 查 Luban 表里的池参数 |
| 实例化 | 走框架统一的实例化通道 |
| 释放 | 对象被销毁时通知加载层 |

含义：**池的取放销毁逻辑本身可以单独拿来用**，但脱离 ET 的 Handler 注册后，这三处会静默取不到结果 —— 配置回落、实例化拿不到对象、释放通知丢失。

## 3 池的组织方式

单例内部两张表：

| 表 | 键 → 值 |
|---|---|
| 池表 | 资源名 → 该资源的池 |
| 归属表 | GameObject → 资源名 |

每个资源名对应一个独立池，池内部再分三块：

| 块 | 存什么 |
|---|---|
| 使用中 | 已经借出去、还没还的实例 |
| 普通缓存 | 还回来等待复用的实例 |
| 替代缓存 | 并发超上限时，用替代资源创建的实例 |

所有归还的实例挂在一个专门的池根节点下，那个节点是**失活且不显示在层级里**的。

## 4 六个配置字段

配置来自 Luban 表，主键就是资源名。

| 字段 | 含义 | 边界值 |
|---|---|---|
| `Id` | 资源名，也是池的键 | — |
| `Timeout` | 最大显示时间 | `<= 0` 表示永不过期 |
| `MaxCacheCount` | **同时在使用中的最大数量** | `<= 0` 表示不限 |
| `CacheTime` | 缓存保留时间 | `<= 0` 表示永久保留 |
| `MinCacheCount` | 池里最多留几个 | `< 0` 表示不限 |
| `MaxCacheCountNewResName` | 超过并发上限时改用的替代资源 | 为空时会强制取消上限 |

⚠️ `MaxCacheCount` 的名字容易误读：它管的是**并发使用量**，不是缓存数量。真正的缓存保留量由 `MinCacheCount` 管。

`MaxCacheCount` 配了正数、却没配 `MaxCacheCountNewResName` 时，源码会打一条 Error 并把上限强制改成无限 —— 因为「超了就换资源」这条路走不通，只能退回不限制。

## 5 配置的优先级

**配置表优先于预制体。** 每个池第一次实例化对象时读一次配置，顺序是：

1. 按资源名查 Luban 表
2. 查不到再取对象上挂的 `YIUIGameObjectPoolInfo` 组件

所以有两种用法：

| 用法 | 适用 |
|---|---|
| 配在 Luban 表里 | 统一管理，推荐 |
| 挂在预制体上 | 只想让这一个物件自己被池化，不改表 |

两处都配了以表为准。

⚠️ 默认配置表里只有一条占位数据。真实项目必须自己补数据，否则每次都会回落到预制体组件那条路。

## 6 三种自动回收

单例每帧驱动所有子池，池自己判断该不该清理：

| 机制 | 触发条件 | 结果 |
|---|---|---|
| 显示超时 | 使用中且超过 `Timeout` | 自动归还 |
| 缓存超时 | 缓存数超过 `MinCacheCount` 且超过 `CacheTime` | 直接销毁，不入池 |
| 桶闲置 | 池内无使用中、无缓存，且持续闲置超过 60 秒 | 整个池被回收掉 |

显示超时**一帧最多处理一个**，不会一口气清空。

「缓存超时」的处理是销毁而不是保留 —— 超过 `MinCacheCount` 的部分不再回收。

## 7 场景切换会清池

池有一个标记，场景加载完成后触发「清空 + 重建」。含义：

- **不要假设对象能跨场景存活** —— 场景一切，池里所有实例都没了
- 持有池对象引用的业务代码要在场景切换前归还

## 真源

- **单例、池表、取放入口**<br>`Packages/cn.etetet.yiuigameobjectpool/Runtime/GameObjectPool/YIUIGameObjectPool.cs`
- **单资源池与三种回收**<br>`Packages/cn.etetet.yiuigameobjectpool/Runtime/GameObjectPool/YIUIAutoRecycleAsyncObjectPool.cs`
- **挂在预制体上的配置组件**<br>`Packages/cn.etetet.yiuigameobjectpool/Runtime/GameObjectPool/YIUIGameObjectPoolInfo.cs`
- **配置契约**<br>`Packages/cn.etetet.yiuigameobjectpool/Scripts/Core/Share/IYIUIGameObjectPoolSettingsConfig.cs`
- **表结构定义**<br>`Packages/cn.etetet.yiuigameobjectpool/Luban/Config/Base/Defines/GameObjectPool.xml`
- **表数据**<br>`Packages/cn.etetet.yiuigameobjectpool/Luban/Config/Datas/GameObjectPool/GameObjectPoolSettings.yml`

## 源码落点

- **取配置的 Invoke 出口**<br>`Runtime/GameObjectPool/YIUIGameObjectPool.cs` 的 `GetSettings`
- **池的取放与超时判定**<br>`Runtime/GameObjectPool/YIUIAutoRecycleAsyncObjectPool.cs`
- **被销毁时的兜底通知**<br>`Runtime/GameObjectPool/YIUIGameObjectPoolAutoRelease.cs`
- **挂点式的自动取放**<br>`Runtime/GameObjectPool/YIUIGameObjectPoolTrigger.cs`
- **配置查询的 Handler**<br>`Scripts/HotfixView/Client/YIUIInvokeGetGameObjectPoolSettingsHandler.cs`
- **生成的配置类**<br>`CodeMode/Model/*/LubanGen/Config/GameObjectPoolSettingsConfig*.cs`

## 下一步

→ [怎么用](./usage)
