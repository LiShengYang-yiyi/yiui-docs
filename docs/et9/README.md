# YIUI ET9 核心框架包文档

本文档为 AI 开发者提供 ET9 框架核心包的详细使用说明。

## 包概览

| 包名 | 说明 | 状态 | 文档 |
|------|------|------|------|
| cn.etetet.yiuifrframework | YIUI 框架主包 | ⚠️ 需要同步 | [详细文档](cn.etetet.yiuifrframework/README.md) |
| cn.etetet.yiui | YIUI 空包（占位符） | ✅ 完整 | [详细文档](cn.etetet.yiui/README.md) |
| cn.etetet.core | ET 核心框架 | ✅ 完整 | [详细文档](cn.etetet.core/README.md) |
| cn.etetet.scripts | ET 脚本基础包 | ✅ 完整 | [详细文档](cn.etetet.scripts/README.md) |

## 依赖关系

```
cn.etetet.yiuifrframework (YIUI主包)
    └── cn.etetet.yiui (YIUI空包)
            └── cn.etetet.core (核心)
                    ├── cn.etetet.sourcegenerator
                    └── cn.etetet.memorypack
                            
cn.etetet.scripts (脚本基础)
    └── 定义 PackageType.Scripts = 42
```

## 核心概念

### 1. Entity (实体)
Entity 是 ET 框架的核心数据单元，所有游戏对象都继承自 Entity。

**创建实体：**
```csharp
// 添加子实体
var unit = scene.AddChild<Unit>();
unit.AddComponent<MoveComponent>();

// 添加组件
entity.AddComponent<HpComponent>();
entity.AddComponent<HpComponent, int>(100); // 带参数
```

**获取组件：**
```csharp
var hp = entity.GetComponent<HpComponent>();
var move = entity.GetComponent<MoveComponent>();
```

**实体树结构：**
- Entity 可以有 Children（子实体）
- Entity 可以有 Components（组件）
- 通过 Parent 获取父实体

### 2. Fiber (纤程)
Fiber 是 ET 的执行单元，每个 Fiber 有自己的：
- 线程同步上下文
- 实体系统
- 消息邮箱
- 根 Scene

**创建 Fiber：**
```csharp
var fiber = await scene.Fiber.CreateFiber(zone, sceneType, "SubFiber");
```

### 3. Component System (组件系统)
组件系统处理实体的生命周期：
- IAwake - 初始化
- IUpdate - 每帧更新
- IDestroy - 销毁

**定义组件：**
```csharp
[ComponentOf(typeof(Unit))]
public class MoveComponent : Entity, IAwake, IUpdate
{
    public void Awake() { }
    public void Update() { }
}
```

### 4. Event System (事件系统)
事件系统用于模块间解耦。

**发布事件：**
```csharp
// 同步发布
EventSystem.Instance.Publish(scene, new SomeEvent());

// 异步发布
await EventSystem.Instance.PublishAsync(scene, new SomeEvent());
```

**订阅事件：**
```csharp
[Event]
public class PlayerLoginEvent : AEvent<Scene, PlayerLogin>
{
    public override async ETTask Handle(Scene scene, PlayerLogin args)
    {
        // 处理事件
    }
}
```

### 5. Invoke System (调用系统)
Invoke 类似于函数调用，用于同模块内的调用。

**定义 Invoke Handler：**
```csharp
[Invoke]
public class MoveInvoker : AInvokeHandler<MoveCmd>
{
    public void Handle(MoveCmd args)
    {
        // 处理调用
    }
}
```

**调用：**
```csharp
EventSystem.Instance.Invoke(new MoveCmd { ... });
```

## 网络层 (KCP)

### KService
KCP 是一种快速可靠协议，用于网络通信。

**创建服务：**
```csharp
var service = new KService(new KcpTransport(), ServiceType.Outer);
```

### 消息处理
```csharp
// 发送消息
channel.Send(memoryBuffer);

// 接收消息
// 在 KChannel 中处理
```

## 详细内容

请参阅各子目录中的详细文档：
- `cn.etetet.core/` - 核心框架详细文档
  - [README](cn.etetet.core/README.md) - 包整体说明
  - [Entity 详细文档](cn.etetet.core/Entity.md) - 实体系统
  - [EventSystem 详细文档](cn.etetet.core/EventSystem.md) - 事件系统
  - [Fiber 详细文档](cn.etetet.core/Fiber.md) - 纤程系统
  - [Network 详细文档](cn.etetet.core/Network.md) - KCP 网络层
  - [ETTask 详细文档](cn.etetet.core/ETTask.md) - 异步任务
  - [Scene 详细文档](cn.etetet.core/Scene.md) - 场景类
  - [CLASS_INDEX](cn.etetet.core/CLASS_INDEX.md) - 类索引
- `cn.etetet.yiui/` - YIUI 空包说明
- `cn.etetet.scripts/` - 脚本基础包说明
- `cn.etetet.yiuifrframework/` - YIUI 主包说明
