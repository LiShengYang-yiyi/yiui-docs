# Network 网络通信

本文档面向 AI 开发人员，介绍 YIUI 项目的网络通信架构。

---

## 概述

YIUI 网络通信系统基于 ET 框架构建，包含以下核心模块：

| 包名 | 功能描述 |
|------|----------|
| `cn.etetet.http` | HTTP 服务器/客户端 |
| `cn.etetet.netinner` | 内部进程通信 |
| `cn.etetet.router` | 路由器（外网入口） |
| `cn.etetet.proto` | 协议定义（Protobuf/MemoryPack） |
| `cn.etetet.servicediscovery` | 服务发现与注册 |

---

## 1. HTTP (`cn.etetet.http`)

### 架构

```
HttpComponent (Scene 组件)
    └── HttpListener (System.Net.HttpListener)
            └── HttpDispatcher (消息分发)
                    └── IHttpHandler (具体处理器)
```

### 核心组件

**HttpComponent**
- 挂载在 Scene 上
- 管理 HttpListener 生命周期
- 启动时绑定指定端口

```csharp
[ComponentOf(typeof(Scene))]
public class HttpComponent: Entity, IAwake<string>, IDestroy
{
    public HttpListener Listener;
}
```

**I HTTP 请求HttpHandler**
-处理接口
- 返回 ETTask，支持异步处理

```csharp
public interface IHttpHandler
{
    ETTask Handle(Scene scene, HttpListenerContext context);
}
```

**HttpHandlerAttribute**
- 标记 Handler 对应的 SceneType 和路由路径

```csharp
[HttpHandlerAttribute(SceneType.Router, "/login")]
public class LoginHandler : IHttpHandler { ... }
```

### 使用场景

- 外部 HTTP API 接口
- Web 管理后台
- 第三方登录验证

---

## 2. 内部网络 (`cn.etetet.netinner`)

### 核心消息类型

```csharp
// 无需响应的消息
[Message(1)]
public class A2NetInner_Message: MessageObject, IMessage, IMessageWrapper
{
    public int FromFiber;
    public ActorId ActorId;
    public IMessage MessageObject;
}

// 需要响应的请求
[Message(2)]
[ResponseType(nameof(A2NetInner_Response))]
public class A2NetInner_Request: MessageObject, IRequest, IMessageWrapper
{
    public int RpcId { get; set; }
    public ActorId ActorId;
    public IRequest MessageObject;
}

// 响应消息
[Message(3)]
public class A2NetInner_Response: MessageObject, IResponse, IMessageWrapper
{
    public int Error { get; set; }
    public string Message { get; set; }
    public int RpcId { get; set; }
    public IResponse MessageObject;
}
```

### MessageSender

- 管理请求-响应回调
- 超时时间: 40秒
- 支持进程内部消息发送

```csharp
[ComponentOf(typeof(Scene))]
public class MessageSender: Entity, IAwake
{
    public const long TIMEOUT_TIME = 40 * 1000;
    public readonly Dictionary<int, MessageSenderStruct> requestCallback = new();
    public ProcessInnerSender ProcessInnerSender;
}
```

### 消息流向

```
Fiber A (Client)
    ↓ A2NetInner_Request
ProcessInnerSender
    ↓ 路由到目标 Fiber
Fiber B (Server)
    ↓ 处理请求
    ↓ 返回 A2NetInner_Response
ProcessInnerSender
    ↓ 回调
Fiber A
```

---

## 3. 路由器 (`cn.etetet.router`)

### 功能

- **外网入口**: 玩家连接的第一入口
- **消息转发**: 将外网消息转发到内网 Map/Gate 等服务
- **KCP/TCP 协议**: 支持可靠UDP和TCP两种传输方式
- **限流保护**: 每秒最多50个包

### 核心组件

**RouterComponent**
- 管理 KCP/TCP 传输层
- 维护 RouterNode 连接信息
- 心跳超时检测

```csharp
[ComponentOf(typeof(Scene))]
public class RouterComponent: Entity, IAwake<IPEndPoint, string>, IDestroy, IUpdate
{
    public IKcpTransport OuterUdp;   // 外网 KCP
    public IKcpTransport OuterTcp;  // 外网 TCP
    public IKcpTransport InnerSocket; // 内网连接
    public Queue<uint> checkTimeout;
}
```

**RouterNode**
- 单个客户端连接的状态
- 内外网连接映射
- 限流计数器

```csharp
[ChildOf(typeof(RouterComponent))]
public class RouterNode: Entity, IDestroy, IAwake
{
    public string InnerAddress;
    public IPEndPoint InnerIpEndPoint;
    public IPEndPoint OuterIpEndPoint;
    public uint OuterConn;  // 外网连接ID
    public uint InnerConn;   // 内网连接ID
    public int LimitCountPerSecond;  // 限流
}
```

---

## 4. 协议 (`cn.etetet.proto`)

### 协议体系

```
CodeMode/
├── Model/
│   ├── Client/        # 客户端专用协议
│   ├── Server/       # 服务器专用协议
│   └── ClientServer/ # 客户端服务器共用协议
```

### 协议格式

基于 **MemoryPack** 序列化，特性:

```csharp
[MemoryPackable]
[Message(Opcode.C2R_Login)]
[ResponseType(nameof(R2C_Login))]
public partial class C2R_Login : MessageObject, ISessionRequest
{
    [MemoryPackOrder(0)]
    public int RpcId { get; set; }
    
    [MemoryPackOrder(1)]
    public string Account { get; set; }
    
    [MemoryPackOrder(2)]
    public string Password { get; set; }
}
```

### 协议类型

| 接口 | 说明 | 使用场景 |
|------|------|----------|
| `IRequest` / `ISessionRequest` | 需要响应的请求 | 登录、查询 |
| `IResponse` / `ISessionResponse` | 响应消息 | 登录结果 |
| `IMessage` | 无需响应的消息 | 移动、心跳 |
| `IMessageWrapper` | 内部包装消息 | 内部通信 |

### 登录流程协议

```
1. C2R_Login (客户端 → Router)
2. R2C_Login (Router → 客户端) - 返回 Gate 地址和 Key
3. C2G_LoginGate (客户端 → Gate)
4. G2C_LoginGate (Gate → 客户端) - 返回 PlayerId
5. C2G_EnterMap (客户端 → Gate)
6. G2C_EnterMap (Gate → 客户端) - 进入游戏
```

### 常用协议包

| 包名 | 协议号段 | 说明 |
|------|----------|------|
| Login | 10000-10999 | 登录相关 |
| Map | 11000-11999 | 地图相关 |
| Spell | 10200-10299 | 技能相关 |
| Quest | 10400-10499 | 任务相关 |
| Item | 10800-10899 | 物品相关 |
| WOW | 10700-10799 | 世界对象 |

---

## 5. 服务发现 (`cn.etetet.servicediscovery`)

### 架构

```
ServiceDiscovery (Fiber)
    ├── Services: Dictionary<string, ServiceInfo>
    │       └── ServiceInfo: 服务实例
    ├── ServicesIndexs: 索引加速查询
    └── Subscribers: 订阅者管理
```

### 核心组件

**ServiceDiscovery**
- 服务注册中心
- 维护所有服务实例信息
- 支持服务变更通知

```csharp
[ComponentOf(typeof(Scene))]
public class ServiceDiscovery : Entity, IAwake, IDestroy, IUpdate
{
    // 索引字段: SceneType, Zone
    public readonly string[] Indexs = { ServiceMetaKey.SceneType, ServiceMetaKey.Zone };
    
    // 所有注册的服务
    public Dictionary<string, EntityRef<ServiceInfo>> Services = new();
    
    // 索引加速
    public Dictionary<string, MultiMapSet<string, string>> ServicesIndexs = new();
    
    // 订阅者
    public MultiDictionary<string, string, StringKV> Subscribers = new();
    
    public long HeartbeatTimeout = 30 * 1000;  // 心跳超时
}
```

**ServiceInfo**
- 单个服务实例

```csharp
[ChildOf]
public class ServiceInfo : Entity, IAwake<string, ActorId>, IDestroy
{
    public string SceneName;      // 服务唯一名称
    public ActorId ActorId;       // Actor 地址
    public StringKV Metadata;     // 元数据
    public long RegisterTime;
    public long LastHeartbeatTime;
}
```

**ServiceDiscoveryProxy**
- 客户端代理，用于发现服务
- 注册本服务到服务中心
- 订阅服务变更通知

### 服务类型

| 服务名 | SceneType | 说明 |
|--------|-----------|------|
| Location | Location | 位置服务 |
| MapManager | MapManager | 地图管理器 |
| Map | Map | 地图实例 |
| Gate | Gate | 网关服务 |

### 使用方式

```csharp
// 注册服务
ServiceDiscoveryProxy sdp = root.AddComponent<ServiceDiscoveryProxy>();
await sdp.RegisterToServiceDiscovery();

// 订阅服务变更
await sdp.SubscribeServiceChange("Map", 
    new StringKV { { ServiceMetaKey.SceneType, "Map" } });

// 查询服务
ActorId mapActorId = await sdp.GetService("Map", filter);
```

---

## 网络架构图

```
                    ┌─────────────────────────────────────────┐
                    │            External Network             │
                    │            (Router Component)           │
                    │   KCP/TCP Port ─────── HTTP Port        │
                    └──────────────┬──────────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────────┐
                    │           Inner Network                 │
                    │        (NetInner Messages)              │
                    └───────┬──────────┬──────────┬───────────┘
                            │          │          │
                ┌───────────▼──┐ ┌─────▼────┐ ┌──▼──────────┐
                │   Location   │ │MapManager│ │    Gate     │
                │   Service    │ │ Service  │ │  Service    │
                └──────────────┘ └──────────┘ └──────┬──────┘
                                                   │
                                    ┌──────────────▼──────────┐
                                    │       Map Services       │
                                    │  (Multiple Map Fibers)   │
                                    └──────────────────────────┘
```

---

## 扩展开发指南

### 添加新的 HTTP 接口

1. 创建 Handler 类，实现 `IHttpHandler`
2. 使用 `HttpHandlerAttribute` 标记路径
3. 在对应 Scene 初始化时注册

```csharp
[HttpHandlerAttribute(SceneType.Router, "/api/xxx")]
public class MyHttpHandler : IHttpHandler
{
    public async ETTask Handle(Scene scene, HttpListenerContext context)
    {
        // 处理请求
        await Task.CompletedTask;
    }
}
```

### 添加新协议

1. 在 `cn.etetet.proto` 包中添加协议类
2. 在 Opcode 类中添加协议号
3. 创建对应的 Handler

### 添加新服务

1. 创建新的 SceneType
2. 实现 ServiceDiscovery 注册逻辑
3. 客户端使用 ServiceDiscoveryProxy 访问
