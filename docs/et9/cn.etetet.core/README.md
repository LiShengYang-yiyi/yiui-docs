# cn.etetet.core - ET 核心框架

## 包说明

**name**: cn.etetet.core  
**version**: 1.0.0  
**description**: et框架核心, 实现了纤程，网络，entity等et基础功能  
**dependencies**:
- cn.etetet.sourcegenerator (0.0.5)
- cn.etetet.memorypack (1.10.0)

## 目录结构

```
Scripts/
├── Core/
│   └── Share/
│       ├── Collection/      # 集合数据结构
│       ├── Config/          # 配置加载
│       ├── CoroutineLock/   # 协程锁
│       ├── Entity/          # 实体系统
│       ├── ETCancellationToken/ # 取消令牌
│       ├── ETTask/          # 异步任务
│       ├── Helper/          # 辅助工具
│       ├── Method/          # 方法反射
│       ├── Network/         # 网络层 (KCP)
│       │   └── Kcp/         # KCP 协议实现
│       ├── Object/          # 对象基类
│       ├── Serialize/      # 序列化
│       ├── Timer/          # 定时器
│       └── World/          # 世界管理
│           ├── Code/        # 代码类型
│           ├── EventSystem/# 事件系统
│           ├── Fiber/      # 纤程
│           ├── IdGenerater/# ID生成器
│           ├── Log/        # 日志
│           ├── ObjectPool/# 对象池
│           ├── Options/    # 配置选项
│           └── TimeInfo/   # 时间信息
├── Hotfix/      # 热更层
└── Model/       # 数据层
```

## 核心类详解

### 1. Entity (实体基类)

**文件**: `Entity/Entity.cs`

**用途**: 所有游戏对象的基类，管理实体树和组件

**核心方法**:

```csharp
// 创建子实体
T AddChild<T>(bool isFromPool = false) where T : Entity, IAwake
T AddChild<T, A>(A a, bool isFromPool = false) where T : Entity, IAwake<A>
T AddChild<T, A, B>(A a, B b, bool isFromPool = false) where T : Entity, IAwake<A, B>

// 创建带ID的子实体
T AddChildWithId<T>(long id, bool isFromPool = false)

// 添加组件
Entity AddComponent(Entity component)
K AddComponent<K>(bool isFromPool = false) where K : Entity, IAwake, new()
K AddComponent<K, P1>(P1 p1, bool isFromPool = false) where K : Entity, IAwake<P1>, new()

// 获取组件
K GetComponent<K>() where K : Entity
Entity GetComponent(Type type)

// 获取子实体
K GetChild<K>(long id) where K : Entity

// 移除
bool RemoveChild(long id, bool isDispose = true)
void RemoveComponent<K>(bool isDispose = true)
```

**AI 调用示例**:
```csharp
// 在 Scene 上创建 Unit 实体
var unit = scene.AddChild<Unit>();
unit.AddComponent<UnitBg>();
unit.AddComponent<MoveComponent, Vector3>(targetPosition);

// 获取组件
var moveComp = unit.GetComponent<MoveComponent>();
if (moveComp != null)
{
    // 使用移动组件
}

// 销毁实体
unit.Dispose();
```

### 2. World (世界单例)

**文件**: `World/World.cs`

**用途**: 管理全局单例

**核心方法**:
```csharp
// 添加单例
T AddSingleton<T>() where T : ASingleton, ISingletonAwake, new()
T AddSingleton<T, A>(A a) where T : ASingleton, ISingletonAwake<A>, new()
T AddSingleton<T, A, B>(A a, B b) where T : ASingleton, ISingletonAwake<A, B>, new()
void AddSingleton(ASingleton singleton)

// 移除单例
void RemoveSingleton<T>()
```

### 3. EventSystem (事件系统)

**文件**: `World/EventSystem/EventSystem.cs`

**用途**: 发布/订阅事件，解耦模块

**核心方法**:
```csharp
// 发布事件 (异步)
async ETTask PublishAsync<S, T>(S scene, T a) where S: class, IScene where T : struct

// 发布事件 (同步)
void Publish<S, T>(S scene, T a) where S: class, IScene where T : struct

// 调用 (类似函数调用)
void Invoke<A>(long type, A args) where A: struct
T Invoke<A, T>(long type, A args) where A: struct

// 尝试调用 (不抛异常)
void TryInvoke<A>(long type, A args) where A: struct
T TryInvoke<A, T>(long type, A args) where A: struct
```

**定义事件**:
```csharp
[Event]
public class PlayerLoginEvent : AEvent<Scene, PlayerLogin>
{
    public override async ETTask Handle(Scene scene, PlayerLogin args)
    {
        Log.Info($"Player login: {args.Account}");
    }
}
```

**AI 调用示例**:
```csharp
// 发布事件
await EventSystem.Instance.PublishAsync(scene, new PlayerLogin { Account = "test" });

// 或者
EventSystem.Instance.Publish(scene, new PlayerLogin { Account = "test" });
```

### 4. Fiber (纤程)

**文件**: `World/Fiber/Fiber.cs`

**用途**: 执行单元，管理实体树和调度

**核心方法**:
```csharp
// 创建子 Fiber
async ETTask<Fiber> CreateFiber(long rootId, int zone, int sceneType, string name)
async ETTask<int> CreateFiber(SchedulerType schedulerType, long rootId, int zone, int sceneType, string name)

// 移除 Fiber
async ETTask RemoveFiber(int fiberId)
async ETTask RemoveFibers()

// 获取子 Fiber
Fiber GetFiber(int id)
Fiber GetFiber(string name)

// 等待帧结束
async ETTask WaitFrameFinish()
```

**AI 调用示例**:
```csharp
// 创建子 Fiber
var subFiber = await scene.Fiber.CreateFiber(zone, SceneType.Game, "BattleFiber");

// 在子 Fiber 中创建场景
var battleScene = subFiber.Root;

// 等待下一帧
await scene.Fiber.WaitFrameFinish();
```

### 5. EntitySystem (实体系统)

**文件**: `World/Fiber/EntitySystem.cs`

**用途**: 管理实体的系统注册和执行

**核心方法**:
```csharp
// 注册系统
void RegisterSystem(Entity entity)

// 触发 Awake
void Awake(Entity entity)
void Awake<P1>(Entity entity, P1 p1)
void Awake<P1, P2>(Entity entity, P1 p1, P2 p2)

// 触发 Update
void Update(Entity entity)

// 触发 Destroy
void Destroy(Entity entity)

// 反序列化
void Deserialize(Entity entity)
void Serialize(Entity entity)
```

### 6. KService (KCP 网络服务)

**文件**: `Network/KService.cs`

**用途**: KCP 协议网络服务

**核心方法**:
```csharp
// 创建 Channel
override void Create(long id, IPEndPoint ipEndPoint)

// 移除 Channel
override void Remove(long id, int error = 0)

// 发送消息
override void Send(long channelId, MemoryBuffer memoryBuffer)

// 更新
override void Update()

// 获取 Channel
KChannel Get(long id)
```

**创建服务**:
```csharp
var service = new KService(new KcpTransport(), ServiceType.Outer);
```

### 7. TimerComponent (定时器组件)

**文件**: `Timer/TimerComponent.cs`

**用途**: 管理定时器

**核心方法**:
```csharp
// 添加定时器 (在新版 ET9 中使用 ETTask)
```

**注意**: ET9 中定时器使用 ETTask 方式实现

### 8. Scene (场景)

**文件**: `Entity/Scene.cs`

**用途**: 场景实体，Fiber 的根节点

**核心属性**:
```csharp
public int SceneType { get; }      // 场景类型
public int Zone { get; }           // 区服ID
public string Name { get; }        // 场景名称
public Fiber Fiber { get; }        // 所属 Fiber
```

### 9. ObjectPool (对象池)

**文件**: `World/ObjectPool/ObjectPool.cs`

**用途**: 对象池管理

**核心方法**:
```csharp
// 获取对象
static T Fetch<T>(bool fromPool = false) where T : class

// 回收对象
static void Recycle(object obj)

// 创建对象 (带参数)
static T Fetch<T, A>(A a, bool fromPool = false) where T : class, IRecycle
```

### 10. ETTask (异步任务)

**文件**: `ETTask/ETTask.cs`

**用途**: ET 异步任务框架

**核心方法**:
```csharp
// 创建任务
static ETTask Create(bool cancelable = false)
static ETTask<T> Create<T>(bool cancelable = false)

// 等待
await etTask

// 设置结果
void SetResult()
void SetResult(T value)

// 创建协程
public static async ETTask Coroutine(Func<ETTask> func)
```

### 11. Log (日志)

**文件**: `World/Log/Log.cs`

**用途**: 日志输出

**核心方法**:
```csharp
// 调试信息
Debug.Info(message)
Debug.Warning(message)
Debug.Error(message)

// 带异常的日志
Error(message, exception)
```

### 12. TimeInfo (时间信息)

**文件**: `World/TimeInfo/TimeInfo.cs`

**用途**: 游戏时间管理

**核心属性**:
```csharp
static long InstanceId { get; }           // 时间实例ID
static long ServerNow()                     // 服务器时间 (毫秒)
static long ClientNow()                     // 客户端时间 (毫秒)
static double DeltaTime                     // 帧间隔 (秒)
static double TimeScale { get; set; }      // 时间缩放
```

## 数据结构集合

### Collection 目录

| 类名 | 用途 |
|------|------|
| DoubleMap | 双键映射 |
| HashSetComponent | HashSet 封装 |
| ListComponent | List 封装 |
| MultiDictionary | 多值字典 |
| MultiMap | 多值映射 |
| MultiMapSet | 多值 Set 映射 |
| SortedDictionary | 有序字典 |
| SortedSet | 有序 Set |
| UnOrderMultiMap | 无序多值映射 |
| UnOrderMultiMapSet | 无序多值 Set |

## 配置系统

### ConfigLoader

**文件**: `Config/ConfigLoader.cs`

**用途**: 加载配置表 (被注释，当前版本可能使用其他方式)

## 序列化

### Serialize 目录

| 类名 | 用途 |
|------|------|
| MemoryPackHelper | MemoryPack 序列化 |
| MongoHelper | MongoDB BSON 序列化 |
| MemoryBuffer | 内存缓冲区 |

## 协程锁

### CoroutineLock 目录

| 类名 | 用途 |
|------|------|
| CoroutineLockComponent | 协程锁组件 |
| CoroutineLockComponentSystem | 协程锁系统 |
| CoroutineLockQueue | 协程锁队列 |
| CoroutineLockQueueType | 协程锁队列类型 |

## 使用建议

1. **Entity 使用**: 所有游戏对象都应该是 Entity，通过 Component 扩展功能
2. **事件解耦**: 模块间通信使用 EventSystem，避免直接依赖
3. **Invoke 调用**: 同模块内使用 Invoke，类似函数调用
4. **网络通信**: 使用 KCP 协议，确保可靠传输
5. **对象池**: 频繁创建销毁的对象使用 ObjectPool
