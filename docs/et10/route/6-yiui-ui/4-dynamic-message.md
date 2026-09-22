---
title: 6.4 动态消息
---

# 6.4 动态消息

> **一句话**：业务层不该「找到某个界面去刷新」——它抛一条语义明确的动态消息，谁关心谁自己订阅，发消息的人不需要知道有哪些界面存在。

**关键词**：DynamicEvent · IDynamicEvent · DynamicEventSystem · 订阅 · 广播 · 场景过滤 · 纤程 · PublishAndDynamicEvent

**目标**：会订阅一条动态消息、会从任意位置发一条动态消息，并知道它和 ET 原生事件的区别在哪。

## 它解决什么问题

UI 要跟着业务数据变，最直接的写法是「业务代码里拿到面板对象，调它的刷新方法」。这条路的代价是：**业务层必须知道有哪些界面存在**。多一个界面就多改一处，界面销毁了还可能调到空对象。

动态消息把方向反过来了：

```
业务数据变化
      ↓  抛出语义明确的动态消息（不认识任何界面）
所有订阅了这条消息的实体自行响应（不认识发消息的人）
```

这一条是工程硬规则，不是风格偏好：**业务层、Handler、业务组件不得查找具体 Panel / View 后直接刷新**，UI 刷新、界面状态、红点、列表和局部重绘**默认走动态消息**。原文见工程根 `AGENTS.md`。

## 和 ET 原生事件的区别

| 维度 | ET 原生事件 `Publish` / `PublishAsync` | 动态消息 `DynamicEvent` |
|---|---|---|
| 送达范围 | 事件系统全局广播 | 发往**同一个纤程**，可再按场景筛 |
| 谁能收到 | 任何注册过该事件的实体 | 实现了 `IDynamicEvent<T>` 的实体 |
| 典型用途 | 逻辑事件（数据变更、状态流转） | **逻辑层 → 表现层** 的刷新通知 |
| 触发方式 | `AEvent<T>` / `EventSystem` | `DynamicEventSystem<T,A>` |

两者不冲突：逻辑侧照常用原生事件，要通知表现层时再发一条动态消息。如果一次操作两条都要发，用 `PublishAndDynamicEvent`（见下）。

## 订阅一条动态消息：写三个类

```csharp
// 1) 消息结构：一个 struct
public struct CoinChanged
{
    public int Value;
}

// 2) 组件声明「我订阅 CoinChanged」
public partial class CoinPanelComponent : Entity, IDynamicEvent<CoinChanged>
{
}

// 3) 系统实现收到之后干什么
[EntitySystem]
public class CoinPanelComponentCoinChangedSystem : DynamicEventSystem<CoinPanelComponent, CoinChanged>
{
    protected override async ETTask DynamicEvent(CoinPanelComponent self, CoinChanged message)
    {
        // 这里刷新自己，不需要问「谁发的」
        await ETTask.CompletedTask;
    }
}
```

两个必须知道的约束：

- ET10 下 `IDynamicEvent<A> : IEvent<A>`，基类 `DynamicEventSystem<T,A> : EventSystem<T,A>`；非 ET10 走的是 `IClassEvent<A>` / `ClassEventSystem<T,A>`（框架源码用 `#if ET10` 分支兼容两套）。
- 基类把 `Event()` / `Handle()` **重写成了抛 `NotImplementedException`**。所以订阅方**只能**通过动态消息通道被触发——用原生 `Publish` 去撞它，会直接抛异常，不会有「静默不生效」这种情况。

## 发送：任意 Entity 都能发

```csharp
await self.DynamicEvent(new CoinChanged { Value = 100 });      // 本纤程内任意场景
await self.DynamicEvent(someEntity, new CoinChanged { ... });  // 与传入实体同场景
await self.DynamicEvent(someScene,  new CoinChanged { ... });  // 指定场景
await self.DynamicEvent(sceneType,  new CoinChanged { ... });  // 指定 SceneType

self.DynamicEvent(new OnGMEventHistoryChanged()).NoContext();   // 不关心完成时机
```

| 入口 | 位置 | 说明 |
|---|---|---|
| `entity.DynamicEvent(...)` | `EntitySystemHelper`（框架扩展） | 最常用，业务代码直接写 |
| `entitySystem.DynamicEvent(...)` | `EntitySystem_Extension` | 拿得到 `EntitySystem` 时用 |
| `entity.Fiber().EntitySystem.DynamicEvent(...)` | 底层 | 前两者的终点 |
| `entity.PublishAndDynamicEvent(...)` | `PublishAndEntitySystemHelper` | **先走原生 `PublishAsync`，再发动态消息** |

发送前的场景过滤条件（`sceneType = 0` 表示**不过滤**，所有场景都收）：内部逐个比 `SceneTypeSingleton.IsSame(sceneType, component.IScene.SceneType)`。

`PublishAndDynamicEvent` 的写法是「一次调用、两路都发」：

```csharp
await self.PublishAndDynamicEvent(new XxxChanged());
// 等价于：
//   await EventSystem.Instance.PublishAsync(scene, message);   ← 原生事件
//   await self.DynamicEvent(0, message);                        ← 动态消息
```

## ⚠️ 订阅是自动注册的，但不是自动摘除

`EntitySystem` 内部维护 `Dictionary<Type, Queue<EntityRef<Entity>>>`。组件挂载时，`RegisterSystem(component)` 按系统的 `ClassType` 把它**入队**；发送时按队列轮转（dequeue → 检查 → **重新 enqueue** → 执行）。

由此有三条推论，都是实际会遇到的问题：

1. **不用手写注册 / 反注册**。组件存在且实现了接口，就一定在队列里。
2. **销毁后不会再收到消息**。轮转时会跳过 `null` 和 `IsDisposed` —— 这是**兜底**，不代表队列被清理了；队列里会留着失效引用。
3. 每次发送先取一次 `count`，本轮的**新增订阅者不会收到这一条**，避免无限循环。

## UI 生命周期事件是「双通道」发的

YIUI 自己的一批事件（`YIUIEventPanelOpenBefore` / `OpenAfter` / `Close` 等）走的是同一个通道，而且发两遍：

```
YIUIEventPanelOpenBefore 事件
        ↓  ① 精准分发：按 UIComponentName 找，只给这个界面注册过的回调
  YIUIEventComponent.Instance.Run(scene, UIComponentName, arg)
        ↓  ② 广播：给所有订阅了这条动态消息的实体
  scene.DynamicEvent(arg)
```

`YIUIEventComponent` 是个单例，在 `Awake` 时扫全部带 `YIUIEventAttribute` 的类型，建一张 `事件类型 × 组件名 → 回调列表` 的索引。所以「只想被某一个界面收到」和「广播给所有关心的人」这两件事可以同时成立。

## 与 ET9 的差异（读 ET9 文档前先知道）

ET9 站上的 [`动态消息`](/et9/features/dynamic-message) 讲的是旧机制，直接照抄会踩空：

| ET9 | ET10 |
|---|---|
| 有 `IYIUIEvent<>` + `YIUIEventSystem.Event(...)`（表现层专用） | **已完全移除**，工程内 0 处出现 |
| 分「纯表现层用 `IYIUIEvent`、逻辑层用 `IDynamicEvent`」 | **不再区分**，统一用 `IDynamicEvent` |
| `YIYEventSystem` 兼做消息发送 | `YIUIEventSystem` 只剩 UI 生命周期（Open / Close / Enable / Disable / PreLoad / Tween …） |

结论：ET9 那句「先有 IYIUIEvent 后有 IDynamicEvent，纯表现层建议用 IYIUIEvent」在 ET10 已经失效。

订阅方照上面三个类自己写即可，`DynamicEventSystem<>` 会自动注册。

## 真源

- **订阅侧接口 `IDynamicEvent<>` 与基类 `DynamicEventSystem<T,A>`**<br>`Packages/cn.etetet.yiuiframework/Scripts/Core/Share/Event/IDynamicEventSystem.cs`
- **发送侧全部重载与场景过滤逻辑**<br>`Packages/cn.etetet.yiuiframework/Scripts/Core/Share/Event/EntitySystem_Dynamic.cs`
- **原生事件 + 动态消息一起发**<br>`Packages/cn.etetet.yiuiframework/Scripts/Core/Share/Event/EntitySystem_PublishAndDynamic.cs`
- **订阅队列的注册（`RegisterSystem`）与轮转（`Publish`）**<br>`Packages/cn.etetet.core/Scripts/Core/Share/World/Fiber/EntitySystem.cs`
- **UI 生命周期事件的「精准分发 + 广播」双通道**<br>`Packages/cn.etetet.yiuiframework/Scripts/HotfixView/Client/System/Event/Open/YIUIEventOpenHandler.cs`
- **按组件名分发的索引**<br>`Packages/cn.etetet.yiuiframework/Scripts/ModelView/Client/Component/Event/YIUIEventComponent.cs`
- **「UI 刷新默认走动态消息」的边界规则**<br>`AGENTS.md`（工程根）

## 源码落点

- **订阅接口与基类**<br>`Packages/cn.etetet.yiuiframework/Scripts/Core/Share/Event/IDynamicEventSystem.cs`
- **发送实现**<br>`Packages/cn.etetet.yiuiframework/Scripts/Core/Share/Event/EntitySystem_Dynamic.cs`
- **订阅队列**<br>`Packages/cn.etetet.core/Scripts/Core/Share/World/Fiber/EntitySystem.cs`
- **框架内实际调用**<br>`Packages/cn.etetet.yiuigm/Scripts/HotfixView/Client/GM/GMHistoryComponentSystem.cs`
- **业务侧实际调用**<br>`Packages/cn.etetet.yiuibattledemo/Scripts/Hotfix/Client/YIUIBattleDemo/BattleDemoClientComponentSystem.cs`

## 读完能回答

- 为什么业务层刷新 UI 要用动态消息，而不是找到 Panel 调它的方法？
- 订阅一条动态消息要写几个类？分别是什么？
- `DynamicEvent` 和 `Publish` 有什么区别？什么时候用 `PublishAndDynamicEvent`？
- 为什么订阅方被 `Publish` 撞上会抛异常，而不是静默不生效？
- 实体销毁后还会收到动态消息吗？队列里会留下什么？
- ET9 的 `IYIUIEvent` 在 ET10 还能用吗？

## 下一步

→ [6.5 常用组件](./5-common-components)
