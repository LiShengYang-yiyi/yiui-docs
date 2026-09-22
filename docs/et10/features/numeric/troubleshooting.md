---
title: 排查
---

# 排查

> 数值问题的最大陷阱是：**大部分校验只在编辑器里生效**。真机上非法 id 不报错，只表现为值不对。

**关键词**：NUMERIC_CHECK_SYMBOLS · 不允许直接修改最终数据 · 静默回绕 · 递归派发 · 监听不触发

## 1 先分清「值不对」还是「通知不到」

| 现象 | 大概率原因 |
|---|---|
| 值算错了 | 读写了错误的 id（最终值 / 成长项混用） |
| 值没变化 | 被上下限钳制，或目标类型是非成长 |
| 值变化但有偏差 | 定点数截断 |
| 值变了但界面没刷新 | 监听器没注册上 |
| 界面刷新两次 | 影响链递归，或多处同时订阅 |

## 2 校验只在编辑器生效

校验代码由编译符号控制，**只在编辑器里开启**：

| 环境 | 非法 id | 读写类型错误 |
|---|---|---|
| 编辑器 | 报错拒绝 | 报错 |
| 构建产物 | 不检查，静默 | 不检查 |

推论：真机上的数值异常不要指望日志，要回到编辑器复现。

## 3 常见报错

| 报错 | 含义 |
|---|---|
| 不允许直接修改最终数据 | 改的是最终值 id，应该改成长项 |
| 只能修改某个范围的值 | 成长项 id 越界 |
| 不合法的ID 个位数必须是… | 成长项序号超限 |
| 是非成长类型 你不应该操作这个数据 | 该数值在检查表里没有配置 |
| 没有数值组件 请检查 | 实体上没挂数值组件 |

第三条的日志文案本身有缺陷 —— 它的插值写法有误，实际会打印布尔值而不是数字，看到 `True` / `False` 属于正常现象。

## 4 定点数陷阱

| 陷阱 | 说明 |
|---|---|
| 精度截断 | 小于万分之一的增量直接消失，表现为「加了但没变」 |
| 静默回绕 | 整数加法越界不回绕保护，极端值会变成反号巨数 |
| 百分比基准 | 系数 `+10000` 表示 ×1.0，配 `+5000` 是 ×1.5 而不是 +5000 |

排查精度问题直接读原始定点值，一眼就能看出是不是被截断。

## 5 上下限

| 症状 | 原因 |
|---|---|
| 值被压在某个数不动 | 上限制约，或重置规则每帧把它拉回 |
| 配了公式型上下限但不生效 | 这类取值运行时未实现，会静默落到默认极值 |
| 改值时直接抛异常 | 最大值与最小值配反了 |

## 6 影响链

三个高频问题：

1. **配了影响关系却抛异常** —— 说明对应的调用实现没有生成。影响关系与实现必须同时存在。
2. **两个数值互相影响** —— 没有环检测，会反复递归。设计上要避免成环。
3. **改一个值触发多轮通知** —— 影响链上每一跳都会派发，订阅方要能接受重复通知。

## 7 监听不触发

按顺序查：

| 检查项 | 说明 |
|---|---|
| 特性上的数值 id | 写错不会报错，只是永远不命中 |
| 泛型实体类型 | 必须是真正挂载数值组件的类型 |
| 组件是否挂上 | 没挂数值组件时任何变化都不存在 |
| 是否用了「不派发事件」的接口 | `ChangeNoEvent` / `SetNoEvent` 不会通知 |

另外有个结构性陷阱：**新生成的数据体没有归属实体，对它的操作不派发事件**。如果先把两份数据相加再改结果，监听器一个都不会响。

## 8 监听里改值

派发是同步发布、异步执行，**监听器里再改值会立刻启动新一轮派发**。

这会造成：

- 同一帧内多次通知
- 监听器之间顺序相关的隐式依赖
- 极端情况下反复触发

需要「改多个值只通知一次」时，用不派发版本逐个改完，再手动触发一次。

## 9 与 UI 交互时的注意点

界面刷新监听通常用「监听全部数值」这种写法。这类监听器**只适合做刷新，不适合做存储或改写**：

- 它会在任何数值变化时被调用，包括它自己的写法引起的连带变化
- 与「监听指定数值」的监听器同时存在时要避免职责冲突

## 真源

- **全部校验与报错文案**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericCheck.cs`
- **改值主流程、钳制、影响递归**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericDataExtend.cs`
- **派发与空归属分支**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericDataExtend_Push.cs`
- **分发字典与全监听分支**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Handler/NumericHandlerComponent.cs`

## 源码落点

- **上下限取值实现**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericDataExtend_Limit.cs`
- **定点换算点**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericDataExtend_Change.cs`
- **变化事件派发**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Event/NumericEventType.cs`
- **动态监听分发**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Handler/NumericHandlerDynamicComponent.cs`
- **分析器诊断项**<br>`Packages/cn.etetet.yiuinumeric/DotNet~/SourceGenerator/Config/NumericDiagnosticDefinition.cs`

## 下一步

→ [Luban 配置底座](../luban/)
