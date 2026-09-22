---
title: 读值与改值
---

# 读值与改值

> 读用 `GetAsXxx`，改用 `Change`（累加）和 `Set`（覆盖）。监听变化写一个 `NumericHandlerSystem` 子类，用特性标日期数值类型。

**关键词**：GetAsFloat · Change · Set · ChangeNoEvent · InitSet · NumericHandlerSystem · NumericHandlerDynamicSystem

## 1 拿到数值组件

```csharp
NumericDataComponent numeric = unit.NumericDataComponent;   // 单位上的快捷属性
float speed = numeric.GetAsFloat(ENumericType.Speed0);
```

组件带「一个实体只能挂一个」的约束。快捷属性取不到时会报错并返回空 —— 说明该实体类型没有数值组件。

## 2 读值

| 方法 | 返回 |
|---|---|
| `GetAsFloat` | 浮点值（已除倍率） |
| `GetAsInt` | 整型值 |
| `GetAsLong` | 长整型值 |
| `GetAsBool` | 布尔值 |
| `GetRealValue` | **原始定点值**，不做除法 |
| `GetObjectValue` | 装箱值 |
| `GetNumericDic` | 整份字典 |

`GetRealValue` 是排查定点数问题时最有用的一把 —— 它给出实际存储的数字，能立刻判断是不是精度截断导致的差异。

## 3 改值

```csharp
numeric.Change(ENumericType.Attack0, 10f);    // 累加
numeric.Set(ENumericType.MaxHp0, 1000f);      // 覆盖
```

| 方法 | 语义 |
|---|---|
| `Change` | 在旧值基础上加，传负数即减 |
| `Set` | 直接覆盖 |
| `ChangeNoEvent` / `SetNoEvent` | 同上但**不派发变化事件** |
| `ChangeUnCheck` / `SetUnCheck` | 跳过类型校验，**非必要不用** |

所有方法都有 `int` 与 `ENumericType` 两套重载，业务侧统一用枚举版本。

**系统里没有独立的乘除接口。** 乘法在公式层用百分比系数表达；要覆盖直接用 `Set`。

## 4 批量与快照

| 方法 | 作用 |
|---|---|
| `InitSet` | 用配置字典初始化一整套值 |
| `InitToServer` | 用服务端下发的数据初始化 |
| `Add` | 两份数据相加，返回**新数据体** |
| `Subtract` | 相减，返回新数据体 |
| `Copy` | 把另一份数据拷进自己 |
| `GetDifference` | 求两份数据的差异字典 |
| `AddChange` | 把另一份的差异应用到自己身上 |

⚠️ **返回的新数据体没有归属实体，不会派发变化事件。** 这是设计如此，不要指望对返回值做 `Change` 会触发监听。

## 5 写监听器

三种写法，按需求选：

### 静态监听

```csharp
[NumericHandler(SceneType.Current, ENumericType.Speed0)]
public class NumericChange_Speed_xxx : NumericHandlerSystem<Unit>
{
    protected override async ETTask Run(Unit self, NumericChange args)
    {
        // args.GetAsFloat() 取新值
        await ETTask.CompletedTask;
    }
}
```

泛型参数是**挂载数值组件的实体类型**，不限于单位 —— 场景、玩家组件都行。

特性第二个参数不传或传 0 表示监听全部数值。

### 定向动态监听

监听器绑到某个具体实体上，用于「这个组件只关心某个单位的值」的场景。写法是继承定向动态基类并实现绑定接口，把绑定实体声明清楚。

支持由源生成器包装成静态扩展方法，此时参数个数、返回类型、泛型一致性都会被分析器强校验。

### 触发时机

**改值即发布，不是帧末统一派发。**

派发是同步发布、异步执行的：调用 `Change` 返回时，监听器可能还没跑完。

每次派发跑两轮：先按具体 id，再按 0（全监听）。

## 6 注册与查找

监听器由单例在初始化时反射扫描特性，构建分发字典：

| 组件 | 键 |
|---|---|
| 静态监听 | 实体类型 → 数值 id → 处理器 |
| 动态监听 | 实体类型 → 绑定类型 → 数值 id → 处理器 |

按照字典查，所以**特性写错实体类型或数值 id，监听器永远不会被调用**，且不会报错。

## 7 变化数据的字段

`NumericChange` 结构体带四样东西：

| 字段 | 含义 |
|---|---|
| 数值类型 | 哪个属性变了 |
| 旧值 / 新值 | 定点值形式 |
| 变化量 | 新旧之差 |
| 变更实体 | 谁改的（引用形式，跨 await 安全） |

同样提供 `GetAsFloat` 系列，按倍率换算。

## 真源

- **读值方法族**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/System/NumericDataComponentSystem_Get.cs`
- **`Change` 实现**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericDataExtend_Change.cs`
- **`Set` 实现**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericDataExtend_Set.cs`
- **特性定义**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Handler/NumericHandlerAttribute.cs`

## 源码落点

- **监听器分发中心**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Handler/NumericHandlerComponent.cs`
- **动态监听基类**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Model/Share/Numeric/Handler/INumericHandlerDynamic.cs`
- **变化事件的订阅者**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Handler/NumericChangeEvent_NotifyHandler.cs`
- **变化数据结构**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericChange.cs`
- **工程内真实样例**<br>`Packages/cn.etetet.mapplay/Scripts/HotfixView/Client/Unit/NumericWatcher_Speed_ChangeMotionSpeed.cs`
- **批量操作**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/System/NumericDataComponentSystem_Add.cs`

## 下一步

→ [配置与规则](./config)
