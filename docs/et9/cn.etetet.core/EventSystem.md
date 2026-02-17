# EventSystem 类详细文档

## 概述

`EventSystem` 是 ET 框架的事件系统，用于模块间解耦。它支持发布/订阅模式和调用模式。

## 命名空间

```csharp
namespace ET
```

## 类定义

```csharp
[CodeProcess]
public class EventSystem: Singleton<EventSystem>, ISingletonAwake
```

## 核心方法

### 1. 发布事件 (Publish/PublishAsync)

**用途**: 异步发布事件，事件可以被多个订阅者处理

```csharp
// 异步发布
public async ETTask PublishAsync<S, T>(S scene, T a) where S: class, IScene where T : struct

// 同步发布
public void Publish<S, T>(S scene, T a) where S: class, IScene where T : struct
```

**参数说明**:
- `scene`: 场景实例
- `a`: 事件数据（必须是结构体）

**返回值**:
- `PublishAsync`: 返回 ETTask，等待所有订阅者处理完成
- `Publish`: 无返回值

**AI 调用示例**:
```csharp
// 异步发布
await EventSystem.Instance.PublishAsync(scene, new PlayerLoginEvent 
{ 
    Account = "test_user",
    PlayerId = 10001 
});

// 同步发布
EventSystem.Instance.Publish(scene, new PlayerLogoutEvent 
{ 
    PlayerId = 10001 
});
```

### 2. 调用 (Invoke/TryInvoke)

**用途**: 类似函数调用，用于同模块内的调用，必须有处理者

```csharp
// 调用 (无返回值)
public void Invoke<A>(long type, A args) where A: struct
public void Invoke<A>(A args) where A: struct

// 调用 (有返回值)
public T Invoke<A, T>(long type, A args) where A: struct
public T Invoke<A, T>(A args) where A: struct

// 尝试调用 (不抛异常)
public void TryInvoke<A>(long type, A args) where A: struct
public void TryInvoke<A>(A args) where A: struct
public T TryInvoke<A, T>(long type, A args) where A: struct
public T TryInvoke<A, T>(A args) where A: struct
```

**参数说明**:
- `type`: 调用类型标识
- `args`: 调用参数

**AI 调用示例**:
```csharp
// 调用配置加载
var config = EventSystem.Instance.Invoke<ConfigGetPlayerData, PlayerConfig>(
    0, 
    new ConfigGetPlayerData { PlayerId = 10001 }
);

// 尝试调用 (不抛异常)
var result = EventSystem.Instance.TryInvoke<SomeCmd, SomeResult>(
    0, 
    new SomeCmd()
);
```

### 3. 获取调用者 (GetInvoker)

**用途**: 获取指定类型的调用处理器

```csharp
public Invoker GetInvoker<Invoker, A>(long type) where Invoker : class, IInvoke where A: struct
```

### 4. 获取所有调用类型

**用途**: 获取指定参数类型的所有调用类型

```csharp
public List<long> GetAllInvokerTypes<A>() where A : struct
```

## 定义事件

### 基础事件 (AEvent)

```csharp
// 事件定义 (无场景参数)
[Event]
public class PlayerLoginEvent : AEvent<PlayerLogin>
{
    public override async ETTask Handle(PlayerLogin args)
    {
        // 处理事件
        Log.Info($"Player login: {args.Account}");
    }
}

// 事件定义 (有场景参数)
[Event]
public class PlayerLoginEvent : AEvent<Scene, PlayerLogin>
{
    public override async ETTask Handle(Scene scene, PlayerLogin args)
    {
        // 处理事件
        var player = await scene.GetChild<Unit, long>(args.PlayerId);
    }
}
```

### 事件属性

```csharp
[Event(SceneType = SceneType.Main)]
[Event(SceneType = SceneType.Game)]
public class PlayerLoginEvent : AEvent<Scene, PlayerLogin>
{
    // SceneType 指定事件适用的场景类型
}
```

### 事件参数 (必须是结构体)

```csharp
public struct PlayerLogin
{
    public string Account;
    public long PlayerId;
}

public struct PlayerLogout
{
    public long PlayerId;
}

public struct ItemUse
{
    public long PlayerId;
    public long ItemId;
    public int Count;
}
```

## 定义 Invoke Handler

### AInvokeHandler

```csharp
// 无返回值调用
[Invoke]
public class MoveHandler : AInvokeHandler<MoveCmd>
{
    public void Handle(MoveCmd args)
    {
        // 处理调用
    }
}

// 有返回值调用
[Invoke]
public class GetConfigHandler : AInvokeHandler<GetConfigCmd, ConfigData>
{
    public ConfigData Handle(GetConfigCmd args)
    {
        return ConfigData.Instance.Get(args.Id);
    }
}
```

## Invoke vs Publish 区别

| 特性 | Invoke | Publish |
|------|--------|---------|
| 调用方式 | 类似函数调用 | 类似事件广播 |
| 处理者数量 | 单个 | 多个 |
| 返回值 | 可以有 | 无 |
| 异常处理 | 无人处理抛异常 | 无人订阅不抛异常 |
| 使用场景 | 同模块内调用 | 模块间解耦 |

### 使用建议

- **Invoke**: 用于同模块内的调用，如配置加载、TimerComponent 等
- **Publish**: 用于跨模块的事件通知，如任务系统监听道具使用

## 场景类型过滤

事件系统支持按场景类型过滤：

```csharp
[Event(SceneType = SceneType.Game)]
public class BattleEvent : AEvent<Scene, BattleArgs>
{
    // 只在 Game 场景触发
}
```

## 完整示例

### 1. 玩家登录事件

```csharp
// 定义事件参数
public struct OnPlayerLogin
{
    public long PlayerId;
    public string Account;
}

// 定义事件
[Event]
public class PlayerLoginEvent : AEvent<Scene, OnPlayerLogin>
{
    public override async ETTask Handle(Scene scene, OnPlayerLogin args)
    {
        // 创建玩家实体
        var player = scene.AddChild<Unit, int>(args.PlayerId);
        player.AddComponent<HpComponent, int>(1000);
        
        Log.Info($"Player logged in: {args.Account}");
    }
}

// 发布事件
await EventSystem.Instance.PublishAsync(scene, new OnPlayerLogin 
{ 
    PlayerId = 10001,
    Account = "test" 
});
```

### 2. 物品使用事件

```csharp
// 物品使用事件
[Event]
public class ItemUseEvent : AEvent<Scene, OnItemUse>
{
    public override async ETTask Handle(Scene scene, OnItemUse args)
    {
        // 扣除物品
        var bag = scene.GetComponent<BagComponent>();
        bag.RemoveItem(args.ItemId, args.Count);
        
        // 如果是消耗品，触发效果
        var itemConfig = ItemConfig.Instance.Get(args.ItemId);
        if (itemConfig.ItemType == ItemType.Consumable)
        {
            await EventSystem.Instance.PublishAsync(scene, new OnItemEffect 
            { 
                PlayerId = args.PlayerId,
                ItemId = args.ItemId 
            });
        }
    }
}

// 任务系统监听物品使用
[Event]
public class QuestItemUseListener : AEvent<Scene, OnItemUse>
{
    public override async ETTask Handle(Scene scene, OnItemUse args)
    {
        // 检查任务进度
        var questSystem = scene.GetComponent<QuestSystem>();
        questSystem.OnItemUsed(args.PlayerId, args.ItemId);
    }
}
```

## 注意事项

1. **异步处理**: 事件处理是异步的，使用 `await` 等待完成
2. **线程安全**: 事件在发布者的线程执行
3. **异常处理**: PublishAsync 会捕获所有异常并记录日志
4. **类型限制**: 事件参数必须是结构体 (struct)
5. **Invoke 线程**: Invoke 在调用者的线程执行
