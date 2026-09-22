---
title: 怎么写
---

# 怎么写

> 一次调用涉及三样东西：参数结构体、标识、实现。三样放在哪、怎么连起来，就是全部内容。

**关键词**：参数 struct · Invoke 标识 · AInvokeEntityHandler · 调用 · 监听

## 1 通道 A：三件套

**第一步：定义参数结构体**

放在调用方能引用到的最低层。框架把这类结构体统一放在框架包的 `Runtime/Event/` 下，热更侧有同名族目录。

```csharp
public struct YIYUIInvokeEntity_LoadTexture2D
{
    public string ResName;
}
```

**第二步：写实现**

实现放热更层，标 `[Invoke]`，标识用约定值（同步 1000 / 异步 2000）：

```csharp
[Invoke(EYIYUIInvokeType.Async)]
public class YIYUIInvokeLoadTexture2DAsyncHandler
    : AInvokeEntityHandler<YIYUIInvokeEntity_LoadTexture2D, ETTask<Texture2D>>
{
    public override async ETTask<Texture2D> Handle(Entity entity, YIYUIInvokeEntity_LoadTexture2D args)
    {
        // ...
    }
}
```

无返回值时用 `AInvokeEntityHandler<A>`，标识用同步值。

**第三步：调用**

```csharp
var tex = await EventSystem.Instance
    .YIYUIInvokeEntityAsyncSafety<YIYUIInvokeEntity_LoadTexture2D, ETTask<Texture2D>>(
        entity, new YIYUIInvokeEntity_LoadTexture2D { ResName = resName });
```

## 2 通道 A 的方法家族

| 方法 | 语义 |
|---|---|
| `InvokeEntity<A>` / `InvokeEntity<A,T>` | 带 `long` 标识，不传时约定为 0 |
| `YIYUIInvokeEntity<A>` / `<A,T>` | 同上，语义更明确的写法 |
| `YIYUIInvokeEntitySync<A>` / `<A,T>` | 标识固定用同步值 |
| `YIYUIInvokeEntityAsync<A>` / `<A,T>` | 标识固定用异步值 |
| `YIYUIInvokeEntitySafety<A>` / `<A,T>` | 宿主为空或已销毁时直接返回 |
| `YIYUIInvokeEntitySyncSafety<A>` / `<A,T>` | 上面两者的组合 |
| `YIYUIInvokeEntityAsyncSafety<A>` / `<A,T>` | 上面两者的组合 |
| `CheckInvokeEntity<A>` / `<A,T>` | 探测有没有实现，只返回 bool |

真实签名：

```csharp
public static void InvokeEntity<A>(this EventSystem self, Entity entity, long type, A args) where A : struct
public static T    InvokeEntity<A, T>(this EventSystem self, Entity entity, long type, A args) where A : struct
public static void InvokeEntity<A>(this EventSystem self, Entity entity, A args) where A : struct
public static T    InvokeEntity<A, T>(this EventSystem self, Entity entity, A args) where A : struct
```

**返回值怎么拿**：把它写成泛型参数 `T`。同步实现直接返回 `R`，异步实现返回 `ETTask<R>` 并 `await`。

## 3 Safety 到底兜什么

`YIYUIInvokeEntity*Safety*` 的第一行是判空：

```csharp
if (self == null || entity == null || entity.IsDisposed) return;
```

它兜的只有这三件事。**「找不到实现」不在其中** —— 那种情况照样会抛 `Invoke error3` / `Invoke error6`。

判据：**Safety 兜宿主，不兜实现。**

## 4 通道 B：字符串标识的调用

**实现**由源生成器根据特性生成，手写侧只需要在方法上标特性：

```csharp
[YIYUIInvoke(GMTypeItemComponent.OnEventClickInvoke)]
private static void OnEventClickInvoke(this GMTypeItemComponent self)
{
    // ...
}
```

**调用**用生成出来的常量当标识：

```csharp
YIYUIInvokeSystem.Instance.Invoke(trigger, OnEventInvokeType);
```

带参数的形态（真实用例里的写法）：

```csharp
YIYUIInvokeSystem.Instance?.Invoke(handler, invokeName, self.InstanceId, result, errorTips);
```

对应的实现必须是 `IYIYUIInvokeHandler<int, bool, string>` —— **参数类型要逐位精确匹配**，`int` 写成 `long` 只会得到一条「类型不一致」的日志。

有返回值 / 异步：用 `InvokeReturn` 与 `InvokeTask`。缺实现的场景用 `SafetyInvoke*` 变体。

## 5 监听

监听的声明方式与调用对称：

| 特性 | 标在哪 |
|---|---|
| `YIYUIListenerInvokeAttribute` | 类或方法（走源生成器） |
| `YIYUIListenerInvokeSystemAttribute` | 类（走反射注册） |

`priority` 的语义：

| 值 | 位置 |
|---|---|
| 小于 0 | 主实现**之前** |
| 大于等于 0 | 主实现**之后** |

同组内按数值升序执行。

执行顺序固定为：before 监听逐个 → 主实现 → after 监听逐个。用 `Return` 并传入结果列表时，这三段的结果会被依次收进列表。

## 6 工程内真实用例

**yiuiaudio** —— 三件套齐全的范例：

| 角色 | 位置 |
|---|---|
| 参数结构体 | `Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioEvent.cs` |
| 实现 | `Packages/cn.etetet.yiuiaudio/Scripts/HotfixView/Client/YIYUIInvokeLoadAudioClipHandler.cs` |
| 调用 | `Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioClipLoader.cs` |

**yiuiyooassets** —— 同一个参数结构体配多份实现，同步与异步混用：

| 角色 | 位置 |
|---|---|
| 实现（异步） | `Packages/cn.etetet.yiuiyooassets/Scripts/HotfixView/Client/Event/YIYUIInvokeLoadHandler.cs` |
| 实现（同步释放） | `Packages/cn.etetet.yiuiyooassets/Scripts/HotfixView/Client/Event/YIYUIInvokeReleaseHandler.cs` |
| 调用方 | `Packages/cn.etetet.yiuiframework/Runtime/Core/YIUIBind/Extend/Data/Image/` |

**yiuicondition** —— 通道 B 的真实调用方：`Scripts/Hotfix/Share/Condition/Core/ConditionMgrSystem_Info.cs`。

## 7 选型

| 需求 | 用哪条通道 |
|---|---|
| Runtime 层发起、热更层实现 | 通道 A |
| 需要在调用里带实体上下文 | 通道 A |
| 需要调用前后的监听切片 | 通道 B |
| 只想探测有没有实现 | `CheckInvoke*` |
| 实现可能不存在、希望静默 | 通道 B 的 `Safety*`，或先 `CheckInvokeEntity` |

## 真源

- **通道 A 的真实签名与异常文案**<br>`Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/EventSystem/EventSystem_Invoke_Entity.cs`
- **`YIYUIInvokeEntity*` 系列**<br>`Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/EventSystem/EventSystem_Invoke_Entity_Extend.cs`
- **通道 B 的调用顺序（before → 主 → after）**<br>`Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/System/YIYUIInvokeSystem_Void.cs`
- **框架预置的参数结构体**<br>`Packages/cn.etetet.yiuiframework/Runtime/Event/YIYUIInvokeEvent.cs`

## 源码落点

- **Handler 抽象层**<br>`Scripts/Core/Share/Handler/`
- **单元类与注册**<br>`Scripts/Core/Share/System/YIYUIInvokeSystem.cs`
- **监听注册与排序**<br>`Scripts/Core/Share/System/YIYUIListenerInvokeSystem.cs`
- **调用标识约定**<br>`Scripts/Core/Share/EventSystem/EYIYUIInvokeType.cs`
- **事件回调里的调用点**<br>`Packages/cn.etetet.yiuiframework/Runtime/Core/YIUIBind/Code/Event/Code/Genericity/EventHandle/`

## 下一步

→ [排查](./troubleshooting)
