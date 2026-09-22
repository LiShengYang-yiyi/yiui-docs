---
title: 4.2 消息与 Handler
---

# 4.2 消息与 Handler

> **一句话**：协议定义「消息长什么样」，Handler 决定「谁在哪一端的哪类服务器上处理它」——用 `[MessageHandler(...)]` 上的 `AppType` 限定生效范围。

**关键词**：Handler · MessageHandler · AMRpcHandler · Send · Call · AppType · Session

**目标**：新增一个协议处理时，知道写哪种 Handler、放哪个目录、怎么限定它只在某类服务器上生效。

## 两种发法，两种 Handler

| 发送方写法 | 语义 | 对应的 Handler |
|---|---|---|
| `Send(消息)` | 单向，不关心回包 | `MessageHandler<T>` |
| `Call(请求)` → `await 回包` | 请求响应 | `AMRpcHandler<请求, 响应>` |

选哪种只有一个判据：**发送方是否需要拿返回值**。

> 不需要返回值就**不要**用 `Call`。`Call` 会引入一个 `await`，也就引入了「实体可能在等待期间失效」的窗口（见 [2.3](../2-et-model/3-single-thread-async)）。

## 限定 Handler 的生效范围

同一个协议在不同服务器上的处理方式可能不同，用 `AppType` 限定：

```csharp
[MessageHandler(AppType.Gate)]
public class C2G_LoginGateHandler : AMRpcHandler<C2G_LoginGate, G2C_LoginGate>
{
    protected override void Run(Session session, C2G_LoginGate message, ...)
    {
        // 只有 Gate 类型的服务器会注册并执行这个 Handler
    }
}
```

这条机制的意义：**同一份代码编译出的服务端，靠启动类型决定自己是谁**。Gate 只跑 Gate 的 Handler，Map 只跑 Map 的，不需要在代码里写 `if (我是Gate)`。

## Handler 家族

| 类型 | 用于 |
|---|---|
| `MessageHandler<T>` | 普通消息（`Send` 过来） |
| `AMRpcHandler<Req, Resp>` | 请求响应（`Call` 过来） |
| `MessageSessionHandler` | 带 `Session` 的会话类消息 |
| `MessageLocationHandler` | 需要按实体位置路由的消息（配合 Actor Location） |

工程里的真实命名可以直接当范本：

| 文件 | 场合 |
|---|---|
| `A2NetInner_MessageHandler.cs` | 纤程之间的消息 |
| `A2NetInner_RequestHandler.cs` | 纤程之间的请求 |
| `HttpGetRouterHandler.cs` | Router 的 HTTP 接口 |
| `ServiceDiscoveryAgent_HeartbeatHandler.cs` | 服务发现心跳 |
| `Main2NetClient_LoginHandler.cs` | 客户端网络纤程的登录处理 |

命名习惯是 `<来源>_<去向/动作>_<Handler|RequestHandler>`，看名字就能知道消息从哪来往哪去。

## 放哪里

| 场合 | 目录 |
|---|---|
| 客户端收消息 | `Scripts/Hotfix/Client/` |
| 服务端收消息 | `Scripts/Hotfix/Server/` |
| 双端都有 | `Scripts/Hotfix/Share/`（或 `ClientServer`） |

具体到哪个包，按 [3.4](../3-code-layout/4-where-to-put-new-code) 的六步定位。

## 写 Handler 时的几条约定

| 约定 | 原因 |
|---|---|
| Handler 里**不写 `try/catch` 处理协议错误码** | 用统一的协议错误提示工具收口 |
| `HotfixView` 中发请求必须同时处理 `RpcException` 与非成功错误码 | 两类失败路径都要覆盖 |
| UI 不直接写 Handler、不判断 `response.Error` | UI 只接收成功/失败或业务结果 |
| Handler 自己定位业务组件再调用 | 不把业务扩展方法挂到 `Scene` / `Unit` 上 |

## 真源

- **Handler 规范、文件落点、ECS 边界**<br>`Packages/cn.etetet.harness/skills/et-code/SKILL.md`
- **Handler `Run` 规范细则**<br>`Packages/cn.etetet.harness/skills/et-code/references/et-code-rules.md`
- **第 9 类「消息事件」与 `MessageHandler` 示例**<br>`Book/3.4事件机制EventSystem.md`
- **协议错误码的统一处理约定**<br>`AGENTS.md`（工程根）→「服务器协议错误提示」

## 源码落点

- **客户端消息处理**<br>`Packages/cn.etetet.login/Scripts/Hotfix/Client/`
- **服务端消息处理**<br>`Packages/cn.etetet.login/Scripts/Hotfix/Server/{Realm,Gate}/`
- **纤程间消息处理**<br>`Packages/cn.etetet.netinner/Scripts/Hotfix/Server/`
- **消息与 Session 基础设施**<br>`Packages/cn.etetet.core/Scripts/`

## 读完能回答

- `Send` 和 `Call` 分别对应哪种 Handler？
- `[MessageHandler(AppType.Gate)]` 里的 `AppType` 起什么作用？
- Handler 该放哪个目录？
- 为什么 UI 层不该判断 `response.Error`？

## 下一步

→ [4.3 内网消息 NetInner](./3-netinner)
