# YIUI Condition 条件系统

## 概述

Condition 条件系统是 YIUI 框架中的条件检查与监听系统，用于处理游戏中的各种条件判断需求，如任务条件、物品条件、等级条件等。该系统支持配置的静态条件和运行时动态条件，并提供条件变化时的监听通知机制。

## 包结构

| 包名 | 说明 |
|------|------|
| `cn.etetet.yiuicondition` | 条件系统核心实现 |
| `cn.etetet.yiuiconditionconfig` | 条件系统配置（由 Luban 生成） |
| `cn.etetet.yiuiconditiondemo` | 条件系统使用示例 |

## 核心概念

### 1. 条件配置 (IConditionConfig)

条件配置定义了一个条件的基本属性：

```csharp
public interface IConditionConfig
{
    int Id { get; }                    // 条件ID (EConditionId)
    EConditionType ConditionType { get; } // 条件类型
    bool Listener { get; }             // 是否可监听
    ECompareType CompareType { get; }  // 比较类型
    bool DynamicCondition { get; }     // 是否动态条件
    IConditionCheckValue CheckValue { get; } // 检查值
    string Tips { get; }               // 提示信息
}
```

### 2. 条件检查值 (IConditionCheckValue)

条件检查值接口，用于传递条件检查所需的参数数据。

### 3. 条件管理器 (ConditionMgr)

条件管理器是 Condition 系统的核心组件，每个 Scene 都有一个独立的 ConditionMgr：

```csharp
[ComponentOf(typeof(Scene))]
public class ConditionMgr : Entity, IAwake, IDestroy
{
    // 触发队列
    public readonly Queue<Func<ETTask>> m_ConditionQueueFunc = new();
    // 所有条件监听器
    public readonly Dictionary<long, ConditionListenerInfo> m_AllConditionListenerInfos = new();
    // 分类后的条件监听器
    public readonly Dictionary<EConditionType, Dictionary<long, ConditionListenerInfo>> m_ClassifyConditionListenerInfos = new();
}
```

### 4. 条件类型 (EConditionType)

条件类型枚举，定义条件的具体类型，如：
- `Demo` - 测试用
- `Demo2` - 测试用2

### 5. 比较类型 (ECompareType)

比较类型枚举，定义条件的比较方式。

### 6. 操作类型 (EOperatorType)

操作类型枚举，定义条件的操作方式。

## 条件系统接口

### ICondition 接口

```csharp
public interface ICondition : ISystemType { }

public interface IConditionA : ICondition
{
    ETTask<(bool result, string errorTips)> Check(Scene scene, IConditionConfig conditionConfig, IConditionCheckValue checkValue);
}

public interface IConditionB<in B> : ICondition where B : struct
{
    ETTask<(bool result, string errorTips)> Check(Scene scene, IConditionConfig conditionConfig, IConditionCheckValue checkValue, B args);
}
```

### 条件系统基类

```csharp
// 无参条件检查系统
public abstract class ConditionSystem<A> : SystemObject, IConditionSystem<A> where A : IConditionCheckValue
{
    protected abstract ETTask<(bool result, string errorTips)> Check(Scene scene, IConditionConfig conditionConfig, A checkValue);
}

// 带参条件检查系统
public abstract class ConditionSystem<A, B> : SystemObject, IConditionSystem<A, B> where A : IConditionCheckValue where B : struct
{
    protected abstract ETTask<(bool result, string errorTips)> Check(Scene scene, IConditionConfig conditionConfig, A checkValue, B args);
}
```

## 使用指南

### 1. 获取 ConditionMgr

```csharp
// 在 Scene 中获取 ConditionMgr
var conditionMgr = scene.GetComponent<ConditionMgr>();
// 或者通过扩展方法
var conditionMgr = scene.YIUICondition();
```

### 2. 添加条件监听

#### 2.1 通过条件ID添加监听

```csharp
// 添加单条件监听
long listenerId = 0;
bool success = conditionMgr.AddCheckConditionListener(
    ref listenerId,           // 监听器ID（输出）
    handlerEntity,             // 监听者实体
    "OnConditionResult",       // 回调方法名
    EConditionId.Demo2,        // 条件ID
    checkValue,               // 检查值（可选）
    immediatelyTrigger: true  // 是否立即触发一次
);

// 移除监听
conditionMgr.RemoveCheckConditionListener(ref listenerId);
```

#### 2.2 通过条件配置添加监听

```csharp
var conditionCfg = ConditionConfigCategory.Instance.GetOrDefault(conditionId);
conditionMgr.AddCheckConditionListener(ref listenerId, handler, invokeName, conditionCfg, checkValue);
```

#### 2.3 通过条件组添加监听

```csharp
// 添加条件组监听（组内所有条件都满足才通过）
conditionMgr.AddCheckConditionGroupListener(
    ref listenerId,
    handler,
    "OnConditionResult",
    EConditionGroupId.SomeGroup,
    immediatelyTrigger: true
);
```

### 3. 触发条件监听

当条件发生变化时，需要手动触发监听：

```csharp
// 触发指定类型的条件监听
conditionMgr.TriggerListener(EConditionType.Demo);

// 带参数触发
conditionMgr.TriggerListener(EConditionType.Demo, someArgs);
```

### 4. 条件检查回调

```csharp
// 回调方法签名
[YIUIInvoke]
private void OnConditionResult(long instanceId, bool result, string errorTips)
{
    if (result)
    {
        Log.Info("条件满足！");
    }
    else
    {
        Log.Warning($"条件不满足: {errorTips}");
    }
}
```

### 5. 带参数的条件监听

对于需要额外参数的条件检查：

```csharp
// 添加带参数的条件监听
conditionMgr.AddCheckConditionListener<SomeArgs>(
    ref listenerId,
    handler,
    "OnConditionResult",
    conditionId,
    checkValue
);

// 触发时传入参数
conditionMgr.TriggerListener(EConditionType.Demo, new SomeArgs());
```

## 配置说明

条件配置通过 Luban 配置表管理，主要配置项：

| 字段 | 说明 |
|------|------|
| Id | 条件ID |
| ConditionType | 条件类型 |
| Listener | 是否可监听 |
| CompareType | 比较类型 |
| DynamicCondition | 是否动态条件 |
| CheckValue | 检查值 |
| Tips | 提示信息 |

## 条件组配置

条件组用于组合多个条件：

| 字段 | 说明 |
|------|------|
| Id | 组ID |
| UseGroup | 是否使用嵌套组 |
| CheckList | 条件列表 |
| CheckGroups | 子组列表 |

## 示例代码

### 示例1：单条件监听

```csharp
[FriendOf(typeof(ConditionDemo1Component))]
[EntitySystemOf(typeof(ConditionDemo1Component))]
public static partial class ConditionDemo1ComponentSystem
{
    [EntitySystem]
    private static void Awake(this ConditionDemo1Component self)
    {
        // 监听配置中的 Demo2 条件
        self.YIUICondition().AddCheckConditionListener(
            ref self.m_ListenerId,
            self,
            nameof(ConditionDemo1Component.OnConditionResult),
            EConditionId.Demo2
        );
    }

    [YIUIInvoke]
    private static void OnConditionResult(this ConditionDemo1Component self, long instanceId, bool result, string errorTips)
    {
        Log.Error($"条件判断: 结果:{result}  失败原因:{errorTips}");
    }

    [EntitySystem]
    private static void Destroy(this ConditionDemo1Component self)
    {
        // 移除监听
        self.YIUICondition()?.RemoveCheckConditionListener(ref self.m_ListenerId);
    }
}
```

### 示例2：手动触发条件

```csharp
// 定时触发条件检查
self.m_TimerId = self.Root().GetComponent<TimerComponent>()
    .NewRepeatedTimer(2000, () => {
        self.YIUICondition().TriggerListener(EConditionType.Demo);
    });
```

### 示例3：条件组监听

```csharp
// 监听条件组（组内所有条件都满足才算通过）
conditionMgr.AddCheckConditionGroupListener(
    ref listenerId,
    handler,
    "OnGroupConditionResult",
    EConditionGroupId.QuestAcceptCondition,
    immediatelyTrigger: true
);
```

## 注意事项

1. **监听器清理**：当监听者实体被销毁时，必须调用 `RemoveCheckConditionListener` 移除监听
2. **立即触发**：默认情况下添加监听时会立即执行一次条件检查
3. **线程安全**：条件检查是异步的，需要注意线程安全
4. **场景隔离**：每个 Scene 有独立的 ConditionMgr，跨场景需要分别处理
5. **条件类型一致性**：条件组内的所有条件必须使用相同的检查系统类型

## 事件类型

系统定义了一些常用的事件类型用于条件传递：

```csharp
// 单位事件
public readonly struct ConditionEvent_Unit
{
    public Unit Unit { get; }
}

// 实体事件
public readonly struct ConditionEvent_Entity
{
    public Entity Entity { get; }
}
```
