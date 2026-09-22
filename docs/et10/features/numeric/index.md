---
title: 数值系统
---

# 数值系统

> 属性值的统一容器：基础值 + 成长项经公式算出最终值，带上下限钳制、数值间影响、变化通知。全部用万分位定点数存储。

**关键词**：yiuinumeric · NumericData · NumericDataComponent · ENumericType · NumericHandler · FloatRate · 定点数

## 1 定位与边界

管一件事：**一个属性的值从哪来、怎么变、变了通知谁。**

| 层 | 职责 |
|---|---|
| 数据层 | `NumericData` —— 可脱离实体的纯数据体，支持快照与对象池 |
| 组件层 | `NumericDataComponent` —— 挂在实体上，一个实体只能挂一个 |
| 配置层 | 类型定义、上下限、影响关系、公式、显示名 |

它不管的事：数值该不该变（业务判断）、什么时候显示（UI 侧）。

## 2 ⭐ 与官方 ET 的命名差异

这套数值系统改过名，**类型名与官方版本不通用**：

| 官方 ET 名称 | 本工程名称 |
|---|---|
| `NumericComponent` | `NumericDataComponent` |
| `NumericType` | `ENumericType` |
| `NumericWatcher` | `NumericHandler` |
| `NumericWatcherAttribute` | `NumericHandlerAttribute` |

工程里还留有旧命名的痕迹（个别文件名仍叫 Watcher、注释里还有旧类型名），但**代码里的类型名以上表为准**。

另外本工程新增了两套机制：脱离实体的纯数据体，和定向动态监听。

## 3 一个数值的七个位置

每个可成长的属性在枚举里不是一个值，而是**一组**：

| 位 | 含义 |
|---|---|
| 基础值 | 属性的原始值 |
| 加成 1~3 | Add / 百分比 / 终值加成三类成长项 |
| 结果 | 由公式算出的最终值 |

枚举编码规则：

- 最终值 id = 基础 id × 10
- 成长项 id = 基础 id × 10 + 序号
- 基础 id 落在固定区间内，且按业务分块

所以**改值和读值用的是不同的 id**，混用会被校验拦下。

## 4 定点数：为什么乘 10000

所有值统一以 64 位整数存储，写入时乘 10000，读取时除 10000。

| 常量 | 值 | 用途 |
|---|---|---|
| 浮点倍率 | 10000 | 浮点值的定点换算 |
| 整数倍率 | 10000 | 百分比系数的基准，`+10000` 表示 ×1.0 |

好处：避免浮点累积误差。

代价与边界：

- **有效精度 1e-4** —— 小于万分之一的增量会被截断为 0
- 整数加法**不做溢出检查**，越界会静默回绕
- 百分比乘法在公式层实现：`(倍率 + 百分比) / 倍率`

## 5 与 UI 的接合

**没有通用的数值绑定组件。**

刷新界面有两条路：

| 方式 | 做法 |
|---|---|
| 订阅变化 | 写监听器，值变时自己刷新对应控件 |
| 主动取值 | 取值后走本地化格式化再塞给控件 |

显示格式化有两种模式：走 YIUI 时用统一的数字缩写规则，否则用内置的 K/M/B 缩写。

## 6 编辑器侧

数值系统自带一套编辑器工具：

| 工具 | 作用 |
|---|---|
| 数值类型创建窗口 | 按引导生成新的数值类型定义 |
| 数值绘制器 | 在 Inspector 里展示数值并提供 GM 入口 |
| 数值 GM 窗口 | 运行时改值，走事件派发 |

创建窗口会对 id 范围、重复、别名做校验后才写出。

## 真源

- **倍率与范围常量**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Core/NumericConst.cs`
- **数据体**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Core/NumericData.cs`
- **组件定义**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Core/NumericDataComponent.cs`
- **数值类型枚举**<br>`Packages/cn.etetet.yiuinumericconfig/CodeMode/Model/ClientServer/LubanGen/Config/ENumericType.cs`

## 源码落点

- **改值主流程**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericDataExtend.cs`
- **校验规则**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericCheck.cs`
- **对外 API 门面**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/System/`
- **单例直取属性**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Core/Unit_Numeric_Extend.cs`
- **显示与本地化**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Localization/NumericLocalization.cs`
- **配置包**<br>`Packages/cn.etetet.yiuinumericconfig/`

## 下一步

→ [读值与改值](./usage)
