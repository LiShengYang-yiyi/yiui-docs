---
title: 配置与规则
---

# 配置与规则

> 条件配置分两层：**声明表**说「这是什么条件」，**检查数据**说「引用哪条、怎么和相邻条件连接」。

**关键词**：ConditionConfig · ConditionCheckData · EOperatorType · ECompareType · ConditionCheckValue · 左结合

## 1 三张表

| 表 | 作用 |
|---|---|
| `ConditionConfig` | 条件声明：id、类型、比较方式、判据、提示 |
| `ConditionCheckData` | 检查数据：引用某条声明，并给出连接方式 |
| `ConditionGroupConfig` | 条件组：一组检查数据 |

外部被引用的通常是 `ConditionCheckData`，它通过 `partial` 扩展实现了 `IConditionData`，所以能直接当运行时输入用。

### `ConditionConfig` 字段

| 字段 | 含义 |
|---|---|
| `Id` | 条件 id |
| `ConditionType` | 属于哪一类条件 |
| `Listener` | 这个条件**可以被监听** |
| `CompareType` | 比较方式 |
| `DynamicCondition` | 是否为动态条件 |
| `CheckValue` | 判据（多态） |
| `Tips` | 不满足时的提示 |

⚠️ 要区分两个不同的 `Listener`：条件声明上的表示**该类条件实现了监听通知**，运行时输入里的表示**本次是否要监听**。两处都为真，监听才能登记成功。

### `ConditionCheckData` 字段

| 字段 | 含义 |
|---|---|
| `OperationType` | 与相邻条件的连接方式 |
| `Id` | 引用哪条条件声明 |
| `Id_Ref` | 直接引用（有则优先） |
| `CheckValue` | 本次检查用的判据 |

`CheckValue` 走多态反序列化，按类型码分支。**未注册的类型码会直接抛反序列化异常**，加新判据时表与代码要同步。

## 2 枚举取值

`ECompareType` —— **没有 0 值**：

| 值 | 含义 |
|---|---|
| `1` | 相等 |
| `2` | 不等 |
| `3` | 小于 |
| `4` | 小于等于 |
| `5` | 大于 |
| `6` | 大于等于 |

`EOperatorType`：

| 值 | 含义 |
|---|---|
| `None` | 不连接（用于列表首条） |
| `And` | 与上一条做与 |
| `Or` | 与上一条做或 |
| `GroupAnd` | 并入左侧最近一个局部结果，做与 |
| `GroupOr` | 并入左侧最近一个局部结果，做或 |

`EConditionType` 与 `EConditionId` 是**按业务逐个添加的**，当前表里只有示例取值。新增条件类型就是在枚举里加一行。

## 3 多条件的四条硬规则

| 规则 | 违反后果 |
|---|---|
| 列表**第一条**的连接方式必须是 `None` | 校验不通过，整组失败 |
| 列表**第二条起**不允许 `None` | 校验不通过，整组失败 |
| 列表长度为 1 时，连接方式被忽略 | 无影响 |
| 任一元素不可运行，整组失败 | 返回「不成立」 |

「不可运行」包含三种：元素为 null、`Id` 反查不到条件声明、`CheckValue` 为 null。

## 4 组合是左结合，不是括号解析

求值顺序：

1. 逐条按列表顺序串行求值
2. 每条结果带上自己的连接方式压进结果列表
3. 从左往右折叠出最终结果

`GroupAnd` / `GroupOr` 的作用是**并入左侧最近的那一个局部结果**，而不是表达任意嵌套的括号结构。需要复杂逻辑时，在业务条件实现里自己组合，不要指望配置表表达括号。

短路行为：

| 连接方式 | 短路条件 | 返回的提示 |
|---|---|---|
| `Or` | 左侧已成立 | 空 |
| `And` | 左侧已失败 | **左侧的**提示 |

所以最终 `errorTips` 是第一个导致失败的那条的提示，不是全部提示的拼接。

## 5 条件组表当前未被运行时消费

`ConditionGroupConfig` 的生成代码是完整的，但逻辑包里没有任何地方读取它。

含义：**想要「一组条件」请自己拼 `List<IConditionData>`**，多条件求值与多条件监听都接受列表形态。不要以为配了条件组表就会自动生效。

## 6 配置文件位置

| 内容 | 路径 |
|---|---|
| 表结构与枚举定义 | `Packages/cn.etetet.yiuiconditionconfig/Luban/Config/Base/Defines/Condition.xml` |
| 条件声明数据 | `Packages/cn.etetet.yiuiconditionconfig/Luban/Config/Datas/Condition/Condition.yml` |
| 条件组数据 | `Packages/cn.etetet.yiuiconditionconfig/Luban/Config/Datas/Condition/ConditionGroup.yml` |
| 生成的类型 | `Packages/cn.etetet.yiuiconditionconfig/CodeMode/Model/*/LubanGen/Config/` |

生成产物分 Client / ClientServer / Server 三份，**内容一致**。

## 7 新增一类条件的完整改动集

1. 在 `Condition.xml` 的 `EConditionType` 里加取值
2. 如需新的判据形态，在 `Condition.xml` 里加判据 bean（父类型为 `ConditionCheckValue`）
3. 在 `Condition.yml` 里加条件声明行
4. 写条件实现类（见 [怎么写](./usage)）
5. 重新导出配置

只加配置不加实现，求值时会在「取实现」这一步失败并打日志；只加实现不加配置，则没有数据驱动得了它。

## 真源

- **表与枚举的唯一事实源**<br>`Packages/cn.etetet.yiuiconditionconfig/Luban/Config/Base/Defines/Condition.xml`
- **检查数据如何变成 `IConditionData`**<br>`Packages/cn.etetet.yiuicondition/Scripts/Model/Share/Condition/ConfigExtend/ConditionCheckData_Extend.cs`
- **多条件校验与折叠**<br>`Packages/cn.etetet.yiuicondition/Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Extend.cs`

## 源码落点

- **多条件的校验规则**<br>`ConditionMgrSystem_Extend.cs` 的 `CheckConditionDataListCanRun`
- **折叠算法**<br>同文件的 `CalculateConditionCheckResults`
- **判据多态反序列化**<br>生成的 `ConditionCheckValue.cs`
- **判据类型扩展**<br>`Packages/cn.etetet.yiuiconditionconfig/CodeMode/Model/*/LubanGen/Config/ConditionCheckDemo.cs`

## 下一步

→ [怎么写](./usage)
