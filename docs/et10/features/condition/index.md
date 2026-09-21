---
title: 条件系统
---

# 条件系统

> 条件系统把「是否满足某条件」收敛成一个统一求值入口，并支持按条件类型重算与回调。界面开放、功能解锁、按钮可点与否，都走它。

**关键词**：yiuicondition · IConditionData · ConditionMgr · EConditionType · 求值 · 监听 · TriggerListener

## 1 两个包的分工

| 包 | 职责 |
|---|---|
| `cn.etetet.yiuicondition` | 逻辑：接口、注册表、求值、监听调度 |
| `cn.etetet.yiuiconditionconfig` | 配置：表定义、表数据、生成的枚举与 Bean |

配置包只产出类型与数据，**不含逻辑**；逻辑包通过 partial 扩展把生成的配置接进运行时模型。两个包要配套使用，单独一个都跑不起来。

## 2 三个核心概念

| 概念 | 是什么 |
|---|---|
| `IConditionData` | 运行时输入契约：一个条件的所有信息 |
| `IConditionCheckValue` | 判据载体，**空标记接口**，真正的数据由子类承载 |
| `ConditionMgr` | 执行者，挂在 Scene 上 |

`IConditionData` 的成员：

| 成员 | 含义 |
|---|---|
| `Id` | 条件 id |
| `ConditionType` | 属于哪一类条件 |
| `OperationType` | 与相邻条件的连接方式 |
| `CompareType` | 比较方式 |
| `CheckValue` | 判据本身 |
| `Listener` | 是否允许被监听 |
| `Tips` | 不满足时给出的提示文案 |

关键点：**真正参与判断的是 `CheckValue`，不是 `Id`。** `Id` 只用来反查配置行。

## 3 ConditionMgr 不是自动存在的

`ConditionMgr` 是挂在 Scene 上的组件，**每个 Scene 一个**。业务需要自己决定在哪个场景上创建它：

```csharp
root.AddComponent<ConditionMgr>();
```

取值有两个入口，含义不同：

| 方法 | 取哪个 |
|---|---|
| `YIUICondition(this Entity)` / `(this Scene)` | 当前场景上的 |
| `YIUIRootCondition(this Entity)` / `(this Scene)` | 根场景上的 |

两者可能是**不同的两个实例**。监听注册在哪个实例上，就必须在同一个实例上触发，跨实例不会串。

## 4 求值、监听、触发三件事

| 动作 | 说明 |
|---|---|
| 求值 | 给一个条件或一组条件，得到「成立与否 + 提示」 |
| 监听 | 登记「条件结果变化时回调谁」，可要求立即先跑一次 |
| 触发 | 状态变化点主动喊一声，让该系统下的监听全部重算 |

为什么要有「触发」这一步：条件系统**不主动观察业务数据**。业务数据变了，由业务调 `TriggerListener(EConditionType)` 告诉它。

判据一句话：**条件系统不检测变化，只响应变化通知。**

## 5 求值模型

多条条件时不走括号解析，走**左结合折叠**：

- 每条条件带一个「与上一条的连接方式」
- 逐条求值，按连接方式折叠出最终结果
- 或运算短路：左边成立就不再算右边
- 与运算短路：左边不成立就直接返回左边的提示

因此结果的 `errorTips` 来自**第一个导致失败的那条**，不是汇总。

组合方式由 `EOperatorType` 表达，取值含义见 [配置与规则](./config)。

## 6 注册与实现

条件实现通过特性注册，启动时反射扫描：

```csharp
[Condition(sceneType, EConditionType.Xxx)]
public class XxxHandler : ConditionSystem<XxxCheckValue>
{
    protected override ETTask<(bool result, string errorTips)> Check(
        Scene scene, IConditionData conditionData, XxxCheckValue checkValue)
    {
        // ...
    }
}
```

几个约定：

| 约定 | 说明 |
|---|---|
| `sceneType` | 指定条件在哪些场景类型下生效；查不到时回退到「全部」 |
| `EConditionType` 与检查值类型 | **一对一** |
| 需要额外上下文参数 | 用 `ConditionSystem<A, B>`，`B` 必须是 `struct` |
| 不用配置表、纯代码构造 | 继承 `ConditionCustomData` 与 `ConditionCustomCheckValue` |

`sceneType` 的意义：同一种条件在不同场景类型下可以有不同实现，值类型不同也不会冲突。

## 7 场景隔离

| 行为 | 说明 |
|---|---|
| 监听归属 | 登记在哪个 `ConditionMgr` 上就归哪个 |
| 场景销毁 | 该场景的监听随场景一起清理 |
| 业务组件销毁 | **必须手动移除监听**，否则会在回调时发现宿主已失效 |

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuicondition/Scripts/Model/Share/Condition/Core/ConditionMgr.cs` | 执行者与三个内部表 |
| `Packages/cn.etetet.yiuicondition/Scripts/Model/Share/Condition/Data/IConditionData.cs` | 运行时输入契约 |
| `Packages/cn.etetet.yiuicondition/Scripts/Model/Share/Condition/Core/ConditionSystemSingleton.cs` | 注册中心与查找顺序 |
| `Packages/cn.etetet.yiuicondition/Scripts/Model/Share/Condition/Core/ICondition.cs` | 接口与业务基类 |
| `Packages/cn.etetet.yiuicondition/Scripts/Hotfix/Share/Condition/YIUIConditionHelper.cs` | 取值入口 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 求值实现 | `Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Extend.cs` |
| 监听与触发实现 | `Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Listener_Extend.cs` |
| 单个监听器的生命周期 | `Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Info.cs` |
| 条件事件类型 | `Scripts/Model/Share/Condition/Event/ConditionEventType.cs` |
| 配置扩展层 | `Scripts/Model/Share/Condition/ConfigExtend/` |

## 下一步

→ [配置与规则](./config)
