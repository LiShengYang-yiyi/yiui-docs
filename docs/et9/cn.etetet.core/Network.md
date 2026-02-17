# KService 网络服务详细文档

## 概述

`KService` 是 ET 框架的 KCP 网络服务实现，提供可靠的网络通信。KCP 是一种快速可靠协议，比 TCP 更适合实时游戏。

## 命名空间

```csharp
namespace ET
```

## 核心类

### KService

```csharp
public sealed class KService: AService
```

### 相关类型

```csharp
// KCP 协议类型
public static class KcpProtocalType
{
    public const byte SYN = 1;          // 连接
    public const byte ACK = 2;          // 连接确认
    public const byte FIN = 3;           // 断开
    public const byte MSG = 4;           // 消息
    public const byte RouterReconnectSYN = 5;  // 路由器重连
    public const byte RouterReconnectACK = 6;  // 路由器重连确认
    public const byte RouterSYN = 7;    // 路由器连接
    public const byte RouterACK = 8;     // 路由器连接确认
}

// 服务类型
public enum ServiceType
{
    Outer,   // 对外服务 (客户端连接)
    Inner,   // 内部服务 (服务端间通信)
}
```

## KService 属性

```csharp
public uint TimeNow { get; }           // 当前时间 (相对于服务创建)
public NetworkProtocol Protocol { get; set; }  // 网络协议
public IKcpTransport Transport { get; } // 传输层
```

## KService 方法

### 1. 创建

```csharp
public KService(IKcpTransport kcpTransport, ServiceType serviceType)
```

**参数说明**:
- `kcpTransport`: 传输层实现
- `serviceType`: 服务类型 (Outer/Inner)

**AI 调用示例**:
```csharp
var service = new KService(new KcpTransport(), ServiceType.Outer);
```

### 2. 创建 Channel

```csharp
public override void Create(long id, IPEndPoint ipEndPoint)
```

**用途**: 创建连接到指定地址的通道

**AI 调用示例**:
```csharp
var ipEndPoint = new IPEndPoint(IPAddress.Parse("127.0.0.1"), 10002);
service.Create(1, ipEndPoint);
```

### 3. 发送消息

```csharp
public override void Send(long channelId, MemoryBuffer memoryBuffer)
```

**用途**: 通过 Channel 发送消息

**AI 调用示例**:
```csharp
// 创建消息缓冲区
using var buffer = MemoryBuffer.Create(MemoryStreamUsage.RPC);

// 写入消息 (需要根据具体协议)
buffer.Write(Opcode);
buffer.Write(message);

service.Send(channelId, buffer);
```

### 4. 移除 Channel

```csharp
public override void Remove(long id, int error = 0)
```

**用途**: 移除指定 Channel

### 5. 更新

```csharp
public override void Update()
```

**用途**: 每帧调用，处理网络事件

### 6. 获取 Channel

```csharp
public KChannel Get(long id)
```

**用途**: 获取指定 ID 的 Channel

### 7. 断开连接

```csharp
public void Disconnect(uint localConn, uint remoteConn, int error, EndPoint address, int times)
```

**用途**: 发送断开连接请求

### 8. 更改地址

```csharp
public override void ChangeAddress(long channelId, IPEndPoint newIPEndPoint)
```

**用途**: 更改 Channel 的目标地址 (用于路由)

## KChannel 类

```csharp
public sealed class KChannel: AChannel
```

### KChannel 属性

```csharp
public uint LocalConn { get; }      // 本地连接 ID
public uint RemoteConn { get; }     // 远程连接 ID
public bool IsConnected { get; }    // 是否已连接
public IPEndPoint RemoteAddress { get; set; }  // 远程地址
public int Error { get; }           // 错误码
```

### KChannel 方法

```csharp
// 发送消息
public void Send(MemoryBuffer memoryBuffer)

// 处理接收数据
public void HandleRecv(byte[] bytes, int index, int length)

// 处理连接
public void HandleConnnect()

// 处理错误
public void OnError(int error)

// 更新
public void Update(uint timeNow)
```

## IKcpTransport 接口

```csharp
public interface IKcpTransport
{
    // 可用数据量
    int Available();
    
    // 接收数据
    int Recv(byte[] buffer, ref IPEndPoint address);
    
    // 发送数据
    int Send(byte[] buffer, int index, int length, IPEndPoint address, ChannelType channelType);
    
    // 更新
    void Update();
    
    // 获取绑定地址
    IPEndPoint GetBindPoint();
    
    // 错误处理
    void OnError(long channelId, int error);
    
    // 销毁
    void Dispose();
}
```

## 使用示例

### 1. 创建 KCP 服务端

```csharp
public class KcpServer
{
    private KService service;
    private long channelId = 1;
    
    public async ETTask Start()
    {
        // 创建传输层
        var transport = new KcpTransport();
        
        // 绑定地址
        transport.Bind(new IPEndPoint(IPAddress.Any, 10002));
        
        // 创建服务
        service = new KService(transport, ServiceType.Outer);
        
        // 设置回调
        service.AcceptCallback = OnAccept;
        service.ErrorCallback = OnError;
        
        // 启动更新
        while (true)
        {
            service.Update();
            await Fiber.WaitFrameFinish();
        }
    }
    
    private void OnAccept(long channelId, IPEndPoint address)
    {
        Log.Info($"Accept channel: {channelId} from {address}");
        
        // 处理新连接
        var channel = service.Get(channelId);
    }
    
    private void OnError(long channelId, int error)
    {
        Log.Error($"Channel error: {channelId}, error: {error}");
    }
}
```

### 2. 创建 KCP 客户端

```csharp
public class KcpClient
{
    private KService service;
    private long channelId;
    
    public async ETTask Connect(string address, int port)
    {
        // 创建传输层
        var transport = new KcpTransport();
        
        // 创建服务
        service = new KService(transport, ServiceType.Outer);
        
        // 创建连接
        service.Create(channelId, new IPEndPoint(IPAddress.Parse(address), port));
        
        // 等待连接
        var channel = service.Get(channelId);
        while (!channel.IsConnected)
        {
            await Fiber.WaitFrameFinish();
        }
        
        Log.Info("Connected!");
    }
    
    public void SendMessage(ushort opcode, object message)
    {
        var channel = service.Get(channelId);
        if (channel == null || !channel.IsConnected)
        {
            return;
        }
        
        // 序列化消息
        using var buffer = MemoryBuffer.Create(MemoryStreamUsage.RPC);
        buffer.Write(opcode);
        ProtoHelper.Serialize(buffer, message);
        
        service.Send(channelId, buffer);
    }
}
```

### 3. 消息处理

```csharp
// 消息分发
public class MessageDispatcherComponent : Component
{
    public override void Awake()
    {
        // 注册消息处理
    }
    
    public void OnRead(KChannel channel, MemoryBuffer buffer)
    {
        // 读取消息头
        var opcode = buffer.Read<ushort>();
        
        // 读取消息体
        var message = ProtoHelper.Deserialize(opcode, buffer);
        
        // 分发处理
        var handler = MessageHandler.GetHandler(opcode);
        handler?.Handle(channel, message);
    }
}
```

## KCP 特性

### 优点

1. **低延迟**: 比 TCP 更低的延迟
2. **可靠性**: 可靠传输，支持超时重传
3. **可配置**: 可配置流控和超时
4. **适合游戏**: 适合实时游戏场景

### 配置参数

KCP 默认参数：
- `nodelay`: 是否启用无延迟模式
- `interval`: 更新间隔 (ms)
- `fastresend`: 快速重传阈值
- `sndwnd`: 发送窗口大小
- `rcvwnd`: 接收窗口大小
- `mtu`: 最大传输单元

## 注意事项

1. **线程安全**: KService 的 Update 必须在单线程中调用
2. **消息序列化**: 需要配合 Proto 代码生成使用
3. **心跳**: 需要实现心跳机制检测连接状态
4. **粘包处理**: KCP 本身处理粘包，但需要消息长度头
5. **资源清理**: 使用完必须调用 Dispose
