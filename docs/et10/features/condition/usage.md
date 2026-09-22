---
title: 怎么写
---

# 怎么写

> 三组 API：求值、监听、触发。求值立刻要结果，监听等业务喊。

**关键词**：CheckCondition · AddCheckConditionListener · TriggerListener · RemoveCheckConditionListener · ConditionSystem

## 1 先挂上 ConditionMgr

```csharp
root.AddComponent<ConditionMgr>();
```

挂在哪一层由业务决定，常用做法是场景创建完成后挂在根节点上。**没有挂载时，取值方法返回 null**，后面的调用全部落空。

取值：

```csharp
var mgr = self.YIUICondition();        // 当前场景
var rootMgr = self.YIUIRootCondition(); // 根场景
```

## 2 求值

```csharp
var (result, errorTips) = await self.YIUICondition().CheckCondition(conditionData);

var (result, errorTips) =
    await self.YIUICondition().CheckCondition(conditionDataList);
```

真实签名：

```csharp
ETTask<(bool result, string errorTips)> CheckCondition(this ConditionMgr self, IConditionData conditionData)
ETTask<(bool result, string errorTips)> CheckCondition(this ConditionMgr self, IReadOnlyList<IConditionData> conditionDataList)
ETTask<(bool result, string errorTips)> CheckCondition<B>(this ConditionMgr self, IConditionData conditionData, B args) where B : struct
ETTask<(bool result, string errorTips)> CheckCondition<B>(this ConditionMgr self, IReadOnlyList<IConditionData> conditionDataList, B args) where B : struct
```

带 `B` 的重载用于「求值时需要额外上下文」的情况，`B` 必须是 `struct`。

返回元组的第二个值是不满足时的提示，直接来自第一条失败条件的 `Tips`。**只有 `result == false` 时才展示它。**

## 3 监听

```csharp
self.YIUICondition().AddCheckConditionListener(
    ref self.m_ListenerId,
    self,
    $"{nameof(MyComponent)}.{nameof(OnConditionResult)}",
    conditionData);
```

真实签名：

```csharp
bool AddCheckConditionListener(this ConditionMgr self, ref long listenerId, Entity handler, string invokeName, IConditionData conditionData, bool immediatelyTrigger = true)
bool AddCheckConditionListener(this ConditionMgr self, ref long listenerId, Entity handler, string invokeName, IReadOnlyList<IConditionData> conditionDataList, bool immediatelyTrigger = true)
bool AddCheckConditionListener<B>(this ConditionMgr self, ref long listenerId, Entity handler, string invokeName, IConditionData conditionData) where B : struct
bool AddCheckConditionListener<B>(this ConditionMgr self, ref long listenerId, Entity handler, string invokeName, IReadOnlyList<IConditionData> conditionDataList) where B : struct
```

参数含义：

| 参数 | 说明 |
|---|---|
| `listenerId` | 引用传递，登记成功后由系统写入；**移除时要用同一个字段** |
| `handler` | 回调发生在哪个实体上 |
| `invokeName` | 回调方法名，走调用系统派发 |
| `conditionData` | 单个或一组条件 |
| `immediatelyTrigger` | 登记后是否立刻跑一次 |

**回调方法**的形状：在被 `handler` 指向的实体上写一个带 `[YIYUIInvoke]` 的方法，参数为 `(long instanceId, bool result, string errorTips)`。

⚠️ 泛型版**没有** `immediatelyTrigger` 参数，登记后总是立刻触发一次。

移除：

```csharp
self.YIUICondition()?.RemoveCheckConditionListener(ref self.m_ListenerId);
```

业务组件销毁时必须移除。不移除的后果是回调时发现宿主已失效，系统会打日志并自动把该监听摘掉。

## 4 触发

业务状态变化点主动喊：

```csharp
self.YIUICondition().TriggerListener(EConditionType.Demo);
```

真实签名：

```csharp
void TriggerListener(this ConditionMgr self, EConditionType triggerType)
void TriggerListener<B>(this ConditionMgr self, EConditionType triggerType, B args) where B : struct
```

触发做的事：把该系统下的**全部监听**重新求值一遍，结果变化时回调。

判据：**触发是按类型广播，不针对单个监听。**

触发前会先校验两件事，任一不通过就只打日志不触发：

1. 这个条件类型实现了对应场景类型的实现
2. 该条件声明上允许监听

## 5 重入怎么处理

在触发过程中又触发了同一个类型时，系统不递归，而是**入队**：

| 行为 | 说明 |
|---|---|
| 触发中新增监听 | 先进待加集合，触发尾部批量落地 |
| 触发中移除监听 | 先进待移除集合，同上 |
| 触发中再次触发 | 进队列，等本轮结束后处理 |

这样避免了遍历集合时改集合。**同类型触发是靠队列逐轮处理的，不会并行。**

## 6 扩展一个新条件类型

**第一步：实现条件**

```csharp
[Condition(sceneType, EConditionType.Xxx)]
public class XxxCondition : ConditionSystem<XxxCheckValue>
{
    protected override ETTask<(bool result, string errorTips)> Check(
        Scene scene, IConditionData conditionData, XxxCheckValue checkValue)
    {
        // 返回 (是否成立, 不成立时的提示)
        return ETTask.FromResult((true, string.Empty));
    }
}
```

需要额外上下文参数时继承 `ConditionSystem<XxxCheckValue, B>` 并重写带 `B` 的 `Check`。

**第二步（可选）：代码构造条件数据**

不想走配置表时，继承两个抽象类：

| 基类 | 用途 |
|---|---|
| `ConditionCustomData` | 实现 `IConditionData`，`Id` 固定为 `-1`、`Listener` 固定为 `true` |
| `ConditionCustomCheckValue` | 实现判据接口 |

**第三步：配置驱动**

如果走表，在配置包里加 `EConditionType` 取值与 `Condition.yml` 行即可，运行端不用改 —— 生成的检查数据已经实现了运行时契约。

比较方式的定义、判据类型的多态分支，见 [配置与规则](./config)。

## 真源

- **求值 API**<br>`Packages/cn.etetet.yiuicondition/Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Extend.cs`
- **监听与触发 API**<br>`Packages/cn.etetet.yiuicondition/Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Listener_Extend.cs`
- **回调派发与单监听器生命周期**<br>`Packages/cn.etetet.yiuicondition/Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Info.cs`
- **代码构造的基类**<br>`Packages/cn.etetet.yiuicondition/Scripts/Model/Share/Condition/ConfigExtend/ConditionCustomData.cs`

## 源码落点

- **回调是怎么派发的**<br>`ConditionMgrSystem_Info.cs` 的 `Trigger(result, errorTips)`
- **监听校验的前置条件**<br>`ConditionMgrSystem_Listener_Extend.cs` 的 `CheckCanListener`
- **条件实现基类**<br>`Scripts/Model/Share/Condition/Core/ICondition.cs`
- **判据接口**<br>`Scripts/Model/Share/Condition/Data/IConditionCheckValue.cs`
- **条件事件类型定义**<br>`Scripts/Model/Share/Condition/Event/ConditionEventType.cs`

## 下一步

→ [排查](./troubleshooting)
