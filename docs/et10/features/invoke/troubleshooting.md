---
title: 排查
---

# 排查

> 调用系统的坑集中在四点：**两条通道互不相通**、**Safety 有两种含义**、**异常被吞**、**类型必须逐位精确匹配**。

**关键词**：Invoke error3 · 类型不一致 · Safety 语义 · 异常吞没 · 单例 Handler · UniqueId

## 1 先分清是哪条通道

两条通道的键不同，注册表也不同，**互相看不见**。

| 现象 | 大概率是 |
|---|---|
| 抛 `Invoke error3` / `Invoke error6` | 通道 A，缺实现 |
| 日志 `未找到YIYUIInvoke实现请检查` | 通道 B，缺实现 |
| 日志 `找到YIYUIInvoke实现请 但类型不一致` | 通道 B，泛型签名不匹配 |

判据：**抛异常 = 通道 A，打日志 = 通道 B。**

## 2 日志与异常对照表

| 文案 | 含义 | 处理 |
|---|---|---|
| `Invoke error3, not AInvokeHandler` | 通道 A 无返回值版没找到实现 | 确认 Handler 标了 `[Invoke]` 且参数类型一致 |
| `Invoke error6, not AInvokeHandler` | 通道 A 有返回值版没找到实现 | 同上 |
| `未找到YIYUIInvoke实现请检查` | 通道 B 缺实现 | 补实现或改用 Safety 变体 |
| `找到YIYUIInvoke实现请 但类型不一致` | 实现存在但泛型签名不匹配 | 逐位核对泛型参数 |
| `类型 ... 不是 IYIYUIInvokeBaseHandler 的实现` | 注册期类型不合格 | 让类实现对应接口 |
| `重复添加YIYUIInvoke请检查` | 同一标识注册了两次 | 只保留先注册的那个，删掉重复实现 |
| `action type duplicate` | core 层同一「参数类型 + 标识」注册两次 | **启动期直接抛异常**，必须删重复 |
| `self is null or disposed` | 调用时宿主已失效 | 检查宿主生命周期 |

## 3 Safety 有两种意思

| 名字 | 兜什么 | 兜不住什么 |
|---|---|---|
| `YIYUIInvokeEntity*Safety*` | 宿主为 null 或已销毁 | **缺实现照样抛异常** |
| `YIYUIInvokeSystem` 的 `SafetyInvoke*` | 缺实现（先探测再调用） | 宿主失效由另一套判断 |

混用会得到完全不同的兜底范围。想要「宿主没了跳过、实现没了也跳过」，得**先探测再调用**：

```csharp
if (EventSystem.Instance.CheckInvokeEntity<YIYUIInvokeEntity_Xxx>(...))
{
    // 再调
}
```

## 4 异常不会回到调用方

通道 B 的全部调用重载把调用体包在 `try/catch` 里，出错只打一条日志，**不向调用方抛出**。

后果：在 `YIYUIInvokeSystem.Instance.Invoke(...)` 外面写 `try/catch` 抓不到实现内部的异常。排查实现里的问题时，靠的是那一条 `YIYUIInvoke执行错误请检查` 日志。

## 5 类型必须逐位精确匹配

通道 B 里，标识命中之后还要比泛型签名：

- 参数是 `int`、`long` 写错 → 只得到一条「类型不一致」日志，然后静默返回
- 无返回值版与有返回值版是两套接口 → 用错版本身也匹配不上

通道 A 同理：参数结构体类型和 `long` 标识都要对上。**同一个参数结构体配不同标识，是不同的调用**。

## 6 参数结构体放错层

参数结构体必须在**调用方能引用到的最低层**。放热更层里，Runtime 侧编译不过。

框架的这类结构体成对出现：`Runtime/Event/` 一份，热更侧同名族一份。两边同名同结构，**删改时容易只动一半**，排查「类型不一致」时先看这两处是不是不同步。

## 7 文件名与类名不一致

真实用例里存在文件名与类名不同的情况，例如 `YIYUIInvokeLoadAudioClipHandler.cs` 里的类叫 `YIYUIInvokeLoadAudioClipAsyncHandler`。

按文件名检索类会踩空。**按类名或按 `[Invoke]` 特性检索。**

## 8 Handler 是共享单例

`Awake()` 里构造 Handler 实例，并且直接往实例上写标识属性。含义：

| 后果 | 说明 |
|---|---|
| 一个实现只有一个实例 | 不随调用次数增长 |
| 不能存 per-Entity 状态 | 多个调用共享同一份字段 |
| 必须有无参构造 | 反射 `Activator.CreateInstance` 创建 |

需要在调用间保留状态，把状态挂到传入的 `Entity` 上，不要放在 Handler 字段里。

## 9 监听侧的两个注意点

**注意一：注册期不合格只打日志。** 类型没实现 `IYIYUIInvokeBaseHandler` 时，注册循环会跳过它，不报错。

**注意二：运行时添加监听的插入逻辑有缺陷。** `AddListenerInvoker` 的插入循环只在「已有元素优先级大于新优先级」时插入；列表为空、或已有元素优先级全都小于等于新值时，**一次都不会插入**，只在字典里留下一个空列表。用它之前先自己确认列表状态。

## 10 编译期约束

调用标识常量类上标了唯一性校验，源生成器会跨分部类检查整型常量：

| 情况 | 结果 |
|---|---|
| 同一标识类里常量值重复 | **编译报错** |
| 越界 | **编译报错** |

所以标识常量不能随便加，必须保证类内唯一。

## 11 条件编译会屏蔽文件

包内部分文件整体包在条件编译里，在当前工程的分支下**不产生任何类型**：

| 文件 | 说明 |
|---|---|
| `EventSystem_Try_Invoke.cs` | 仅在另一个分支生效 |
| `EventSystem_Invoke_Entity.cs` 的备用分支 | 定义了 `Invoke error1` ~ `error6` 中的一部分文案 |

搜报错文案时，看到的分支未必是当前实际编译的那个。定位报错请以实际编译产物里的文案为准。

## 12 建议的排查动作

| 动作 | 目的 |
|---|---|
| 先确认是通道 A 还是通道 B | 两条通道的排查路径完全不同 |
| 打印参数结构体的完整类型名 | 确认标识与类型这一对是否正确 |
| 用 `CheckInvoke*` 先探测 | 区分「没注册」和「注册了但调用错」 |
| 看启动期日志 | 重复注册类问题只在启动时暴露 |

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/EventSystem/EventSystem_Invoke_Entity.cs` | 通道 A 的异常分支 |
| `Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/System/YIYUIInvokeSystem.cs` | 通道 B 的日志分支 |
| `Packages/cn.etetet.yiuiinvoke/Scripts/Core/Share/System/YIYUIListenerInvokeSystem.cs` | 监听注册与插入逻辑 |
| `Packages/cn.etetet.core/Scripts/Core/Share/World/EventSystem/EventSystem.cs` | core 侧注册与重复检测 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 全部日志与异常文案 | 在包内搜 `Log.Error` / `throw new Exception` |
| Safety 扩展的判空 | `Scripts/Core/Share/EventSystem/EventSystem_Invoke_Entity_Safety_Extend.cs` |
| 探测接口 | `Scripts/Core/Share/EventSystem/EventSystem_Check_Invoke_Entity.cs` |
| 唯一性分析器 | `Packages/cn.etetet.sourcegenerator/DotNet~/ET.SourceGenerator/Analyzer/UniqueIdAnalyzer.cs` |

## 下一步

→ [条件系统](../condition/)
