# Fiber 类详细文档

## 概述

`Fiber` 是 ET 框架的执行单元。每个 Fiber 有自己的执行线程、实体系统、消息邮箱和根 Scene。Fiber 用于实现多线程并行处理和纤程调度。

## 命名空间

```csharp
namespace ET
```

## 类定义

```csharp
public class Fiber: IScheduler
```

## 核心属性

### 标识

```csharp
public int Id { get; }           // Fiber ID
public int Zone { get; }         // 区服 ID
public string Name { get; }      // Fiber 名称
public bool IsDisposed { get; }  // 是否已销毁
```

### 调度类型

```csharp
public SchedulerType SchedulerType { get; }
public int ParentFiberId { get; }  // 父 Fiber ID
```

### 组件

```csharp
public EntitySystem EntitySystem { get; }           // 实体系统
public Mailboxes Mailboxes { get; }                 // 消息邮箱
public ThreadSynchronizationContext ThreadSynchronizationContext { get; }  // 线程同步上下文
public ILog Log { get; }                           // 日志
public Scene Root { get; }                         // 根场景
```

## 核心方法

### 1. 创建子 Fiber (CreateFiber)

**用途**: 在当前 Fiber 下创建子 Fiber

```csharp
// 创建并返回 Fiber
async ETTask<Fiber> CreateFiber(long rootId, int zone, int sceneType, string name)

// 创建并返回 Fiber (带 ID)
async ETTask<Fiber> CreateFiberWithId(int fiberId, long rootId, int zone, int sceneType, string name)

// 创建 (返回 Fiber ID)
async ETTask<int> CreateFiber(SchedulerType schedulerType, long rootId, int zone, int sceneType, string name)

// 创建 (带 ID)
async ETTask<int> CreateFiberWithId(int fiberId, SchedulerType schedulerType, long rootId, int zone, int sceneType, string name)
```

**参数说明**:
- `fiberId`: 指定 Fiber ID
- `rootId`: 根实体 ID
- `zone`: 区服 ID
- `sceneType`: 场景类型 (SceneType enum)
- `name`: Fiber 名称
- `schedulerType`: 调度类型

**AI 调用示例**:
```csharp
// 创建子 Fiber
var battleFiber = await scene.Fiber.CreateFiber(
    scene.Id,
    scene.Zone,
    SceneType.Battle,
    "Battle"
);

// 创建战斗场景
var battleScene = battleFiber.Root;

// 带 ID 创建
var fiberId = await scene.Fiber.CreateFiberWithId(
    10001,
    scene.Id,
    scene.Zone,
    SceneType.Battle,
    "Battle"
);
```

### 2. 移除 Fiber (RemoveFiber)

**用途**: 移除指定的子 Fiber

```csharp
// 移除单个 Fiber
async ETTask RemoveFiber(int fiberId)

// 移除所有子 Fiber
async ETTask RemoveFibers()
```

**AI 调用示例**:
```csharp
// 移除单个 Fiber
await scene.Fiber.RemoveFiber(battleFiberId);

// 移除所有子 Fiber
await scene.Fiber.RemoveFibers();
```

### 3. 获取子 Fiber (GetFiber)

**用途**: 获取子 Fiber

```csharp
// 按 ID 获取
Fiber GetFiber(int id)

// 按名称获取
Fiber GetFiber(string name)
```

**AI 调用示例**:
```csharp
// 获取子 Fiber
var battleFiber = scene.Fiber.GetFiber("Battle");

// 按 ID 获取
var fiber = scene.Fiber.GetFiber(10001);
```

### 4. 等待帧结束 (WaitFrameFinish)

**用途**: 等待当前帧执行完成

```csharp
async ETTask WaitFrameFinish()
```

**AI 调用示例**:
```csharp
// 等待下一帧
await scene.Fiber.WaitFrameFinish();

// 等待多帧
for (int i = 0; i < 5; i++)
{
    await scene.Fiber.WaitFrameFinish();
}
```

### 5. 添加到调度器

**用途**: 将 Fiber 添加到调度队列

```csharp
public void AddToScheduler(Fiber fiber)
```

## SchedulerType 枚举

```csharp
public enum SchedulerType
{
    Parent,      // 在父 Fiber 线程调度
    ThreadPool,  // 在线程序列池调度
}
```

## Fiber 创建示例

### 1. 创建战斗 Fiber

```csharp
// 在游戏主 Fiber 下创建战斗 Fiber
public async ETTask<Scene> CreateBattleScene(Scene scene, long battleId)
{
    // 创建战斗 Fiber
    var battleFiber = await scene.Fiber.CreateFiber(
        battleId,
        scene.Zone,
        SceneType.Battle,
        "Battle"
    );
    
    // 获取根场景
    var battleScene = battleFiber.Root;
    
    // 初始化战斗场景
    battleScene.AddComponent<BattleComponent>();
    battleScene.AddComponent<UnitComponent>();
    
    return battleScene;
}
```

### 2. 创建并行任务 Fiber

```csharp
// 创建在线程序列池调度的 Fiber
public async ETTask CreateAsyncTask(Scene scene)
{
    var taskFiberId = await scene.Fiber.CreateFiber(
        SchedulerType.ThreadPool,
        scene.Id,
        scene.Zone,
        SceneType.Async,
        "AsyncTask"
    );
    
    // 在新 Fiber 中执行任务
    var taskFiber = scene.Fiber.GetFiber(taskFiberId);
    taskFiber.Root.AddComponent<AsyncTaskComponent>();
}
```

### 3. 等待 Fiber 完成

```csharp
// 等待战斗结束
public async ETTask WaitBattleFinish(Scene scene, int battleFiberId)
{
    var battleFiber = scene.Fiber.GetFiber(battleFiberId);
    while (!battleFiber.IsDisposed)
    {
        await battleFiber.Root.Fiber.WaitFrameFinish();
    }
}
```

## Fiber 调度流程

```
主 Fiber Update
    │
    ├── 发布 UpdateEvent
    │
    ├── 处理消息队列
    │
    ├── 更新子 Fiber (Parent 调度类型)
    │       │
    │       └── 子 Fiber Update
    │               │
    │               ├── 发布 UpdateEvent
    │               │
    │               └── 更新子子 Fiber
    │
    └── 主 Fiber LateUpdate
            │
            ├── 发布 LateUpdateEvent
            │
            └── 处理帧结束任务
```

## 注意事项

1. **线程安全**: 每个 Fiber 有独立的线程上下文
2. **Parent 调度**: SchedulerType.Parent 的子 Fiber 与父 Fiber 在同一线程
3. **ThreadPool 调度**: SchedulerType.ThreadPool 的 Fiber 在线程池执行
4. **资源清理**: 销毁 Fiber 会同时销毁其所有子 Fiber
5. **消息传递**: 不同 Fiber 间的消息通过 Mailboxes 处理
