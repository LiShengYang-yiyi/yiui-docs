---
title: 调用系统
---

# 调用系统

> 调用系统给 ET 补了一条「带宿主实体的调用通道」：调用方只依赖一个参数结构体和一个标识，不依赖实现方类型。它比走协议轻，比直接引用解耦。

**关键词**：yiuiinvoke · YIYUIInvokeEntity · AInvokeEntityHandler · YIYUIInvokeSystem · 参数 struct · 调用标识

## 1 定位

三个关键词：

| 词 | 含义 |
|---|---|
| 比协议轻 | 不走消息、不序列化、不过网络，只做一次查表 |
| 比引用解耦 | 调用方 `using` 的只有参数结构体和标识常量 |
| 带宿主实体 | 调用时带一个 `Entity`，实现方能拿到调用发生的上下文 |

调用方在 Runtime 层、实现在热更层，是这套机制的主要使用姿势：**Runtime 层可以发起调用，而实现方整包可以被替换或删掉。**

## 2 两套通道

这个包里其实有两条独立通道，**键、注册表、兜底行为都不一样**。

| 维度 | 通道 A（Entity 调用） | 通道 B（`YIUIInvokeSystem`） |
|---|---|---|
| 键 | 「参数结构体类型 + long 标识」 | 字符串标识 |
| 注册 | 扫描 `[Invoke]` 的 Handler | 扫描 `[YIYIInvokeSystem]` 的 Handler |
| 实现方接口 | `AInvokeEntityHandler<A>` / `<A,T>` | `IYIYIInvokeHandler<...>` / `IYIYIInvokeReturnHandler<...>` |
| 找不到实现 | **抛异常** | 打日志后静默返回 |
| 监听切片 | 无 | 有 before / after |

通道 A 的调用标识就是 `long` 常量，`EYIYUIInvokeType` 里给了两个约定值：同步用 1000、异步用 2000。

通道 B 的调用标识是字符串，**由源码生成器给出常量**，调用方引用那个常量而不是自己拼字符串。

选哪条：

| 场景 | 用 |
|---|---|
| 跨层调用（Runtime → 热更），需要在调用里带实体上下文 | 通道 A |
| 事件回调式调用，需要在调用前后插监听 | 通道 B |

## 3 四个特性

| 特性 | 标在哪 | 谁消费 |
|---|---|---|
| `YIYUIInvokeAttribute` | 类或方法 | 源生成器 |
| `YIYUIInvokeSystemAttribute` | 类 | 运行时反射（`YIYUIInvokeSystem.Awake`） |
| `YIYUIListenerInvokeAttribute` | 类或方法 | 源生成器 |
| `YIYUIListenerInvokeSystemAttribute` | 类 | 运行时反射 |

两个判据：

- 名字带 `System` 的那个走**反射注册**，要求类型实现 `IYIYIInvokeBaseHandler`
- 不带 `System` 的那些走**源生成器**，标识必须是常量

后两条是监听侧：`priority < 0` 排在被调用方法**之前**，`>= 0` 排在**之后**；同组内数值小的先执行。

判据一句话：**`priority` 的符号决定前后，数值决定同组顺序。**

## 4 为什么参数要用结构体

调用标识是「参数结构体类型 + 一个 long/字符串」这一对。含义：

- 同一份参数结构体，配不同的 `long` 标识，就是**不同的调用**
- 不同类型的参数结构体，即使标识相同，也是不同的调用
- 因此「同一个参数类型对应多个实现」是支持的，靠标识区分

代价是：**参数结构体必须放在调用方能引用到的最低层**。放在热更层里，Runtime 侧就 `using` 不到，编译不过。

框架把这类结构体统一放在 `Runtime/Event/` 与热更侧的同名族目录下，成对出现 —— 改的时候容易只改一半，注意两边同名。

## 5 系统分片怎么分工

`YIYUIInvokeSystem` 按「有没有返回值」和「找不到实现怎么办」拆成六块：

| 分片 | 语义 |
|---|---|
| Void | 无返回值 |
| Return | 有返回值 / async |
| Safety_Void | 无返回值，**缺实现就跳过** |
| Safety_Return | 有返回值，缺实现时返回调用方给的默认值 |
| Check_Void | 探测某个调用有没有实现 |
| Check_Return | 探测某个带返回值的调用有没有实现 |

`Return` 的返回值只取**主实现**的结果。如果还传了一个结果列表，会把「before 监听 → 主实现 → after 监听」的全部结果按顺序收进去。

## 6 Handler 抽象层

包内提供了一组 Handler 基类，覆盖 0~5 个参数与有无返回值：

| 基类 | 用途 |
|---|---|
| `YIYIInvokeHandler<T>` 系列 | 无返回值 |
| `YIYIInvokeReturnHandler<T,R>` 系列 | 有返回值 |
| `YIYIInvokeCommonHandler<T,P1..P5,R>` | 只重写两个方法即可覆盖全部重载 |

第三个是「不想写一堆重载」时的省事基类：它把 void 与有返回值两边的重载全部转发到 `InvokeParams` / `InvokeReturnParams` 两个抽象方法上。

## 真源

- **四个特性定义**<br>`Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/Attribute/`
- **`AInvokeEntityHandler` 定义**<br>`Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/EventSystem/IInvokeEntity.cs`
- **通道 B 的注册表**<br>`Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/System/YIYUIInvokeSystem.cs`
- **监听注册与排序**<br>`Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/System/YIYUIListenerInvokeSystem.cs`

## 源码落点

- **通道 A 的调用入口**<br>`Scripts/Core/Share/EventSystem/EventSystem_Invoke_Entity.cs`
- **通道 A 的便捷扩展**<br>`Scripts/Core/Share/EventSystem/EventSystem_Invoke_Entity_Extend.cs`
- **通道 A 的兜底扩展**<br>`Scripts/Core/Share/EventSystem/EventSystem_Invoke_Entity_Safety_Extend.cs`
- **通道 B 的分片**<br>`Scripts/Core/Share/System/YIYUIInvokeSystem_*.cs`
- **调用标识约定**<br>`Scripts/Core/Share/EventSystem/EYIYUIInvokeType.cs`
- **core 侧的注册机制**<br>`Packages/cn.etetet.core/Scripts/Core/Share/World/EventSystem/EventSystem.cs`

## 下一步

→ [怎么写](./usage)
