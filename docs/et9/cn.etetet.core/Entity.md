# Entity 类详细文档

## 概述

`Entity` 是 ET 框架的核心基类，所有游戏对象都继承自此类。它管理实体树结构、组件集合、以及生命周期。

## 命名空间

```csharp
namespace ET
```

## 类定义

```csharp
[MemoryPackable(GenerateType.NoGenerate)]
public abstract partial class Entity: DisposeObject, IPool
```

## 核心属性

### 实例 ID

```csharp
[BsonIgnore]
[MemoryPackIgnore]
public int InstanceId { get; protected set; }
```

每个 Entity 都有唯一的实例 ID，用于区分对象。

### 实体状态

```csharp
[BsonIgnore]
public bool IsFromPool { get; set; }      // 是否来自对象池

[BsonIgnore]
protected bool IsRegister { get; set; }   // 是否已注册到系统

[BsonIgnore]
protected bool IsComponent { get; set; }  // 是否为组件

[BsonIgnore]
protected bool IsNoDeserializeSystem { get; set; }  // 是否跳过反序列化

[BsonIgnore]
public bool IsSerializeWithParent { get; set; }     // 是否与父实体一起序列化

[BsonIgnore]
public bool IsDisposed => this.InstanceId == 0;     // 是否已销毁
```

### 父子关系

```csharp
[AllowEntityMember]
private Entity parent;

[BsonIgnore]
[MemoryPackIgnore]
public Entity Parent { get; protected set; }
```

### 场景引用

```csharp
[BsonIgnore]
protected IScene iScene;

[BsonIgnore]
[MemoryPackIgnore]
public IScene IScene { get; protected set; }
```

### 组件和子实体集合

```csharp
[MemoryPackInclude]
[BsonElement]
[BsonIgnoreIfNull]
protected ChildrenCollection children;

[BsonIgnore]
[MemoryPackIgnore]
public ChildrenCollection Children { get; }

[MemoryPackInclude]
[BsonElement]
[BsonIgnoreIfNull]
protected ComponentsCollection components;

[BsonIgnore]
[MemoryPackIgnore]
public ComponentsCollection Components { get; }
```

## 核心方法

### 1. 添加子实体 (AddChild)

```csharp
// 基本添加
public T AddChild<T>(bool isFromPool = false) where T : Entity, IAwake

// 带参数添加
public T AddChild<T, A>(A a, bool isFromPool = false) where T : Entity, IAwake<A>
public T AddChild<T, A, B>(A a, B b, bool isFromPool = false) where T : Entity, IAwake<A, B>
public T AddChild<T, A, B, C>(A a, B b, C c, bool isFromPool = false) where T : Entity, IAwake<A, B, C>

// 带 ID 添加
public T AddChildWithId<T>(long id, bool isFromPool = false) where T : Entity, IAwake
public T AddChildWithId<T, A>(long id, A a, bool isFromPool = false) where T : Entity, IAwake<A>
public T AddChildWithId<T, A, B>(long id, A a, B b, bool isFromPool = false) where T : Entity, IAwake<A, B>
```

**AI 调用示例**:
```csharp
// 简单创建
var unit = scene.AddChild<Unit>();

// 带参数创建
var unitPos = scene.AddChild<Unit, Vector3>(new Vector3(100, 0, 100));

// 带 ID 创建 (用于反序列化)
var unit2 = scene.AddChildWithId<Unit>(10001);
```

### 2. 添加组件 (AddComponent)

```csharp
// 添加现有组件实例
public Entity AddComponent(Entity component)

// 添加新组件
public Entity AddComponent(Type type, bool isFromPool = false)

// 泛型添加
public K AddComponent<K>(bool isFromPool = false) where K : Entity, IAwake, new()
public K AddComponent<K, P1>(P1 p1, bool isFromPool = false) where K : Entity, IAwake<P1>, new()
public K AddComponent<K, P1, P2>(P1 p1, P2 p2, bool isFromPool = false) where K : Entity, IAwake<P1, P2>, new()
public K AddComponent<K, P1, P2, P3>(P1 p1, P2 p2, P3 p3, bool isFromPool = false) where K : Entity, IAwake<P1, P2, P3>, new()

// 带 ID 添加
public K AddComponentWithId<K>(long id, bool isFromPool = false) where K : Entity, IAwake, new()
public K AddComponentWithId<K, P1>(long id, P1 p1, bool isFromPool = false) where K : Entity, IAwake<P1>, new()
public K AddComponentWithId<K, P1, P2>(long id, P1 p1, P2 p2, bool isFromPool = false) where K : Entity, IAwake<P1, P2>, new()
public K AddComponentWithId<K, P1, P2, P3>(long id, P1 p1, P2 p2, P3 p3, bool isFromPool = false) where K : Entity, IAwake<P1, P2, P3>, new()
```

**AI 调用示例**:
```csharp
// 简单添加组件
entity.AddComponent<HpComponent>();

// 带参数添加
entity.AddComponent<MoveComponent, Vector3>(targetPosition);

// 添加现有组件实例
var hpComponent = new HpComponent { MaxHp = 1000 };
entity.AddComponent(hpComponent);
```

### 3. 获取组件 (GetComponent)

```csharp
// 泛型获取
public K GetComponent<K>() where K : Entity

// 类型获取
public Entity GetComponent(Type type)
```

**AI 调用示例**:
```csharp
var hp = unit.GetComponent<HpComponent>();
var move = unit.GetComponent<MoveComponent>();

// 类型获取
var type = typeof(HpComponent);
var comp = unit.GetComponent(type);
```

### 4. 获取子实体 (GetChild)

```csharp
public K GetChild<K>(long id) where K : Entity
```

**AI 调用示例**:
```csharp
var child = scene.GetChild<Unit>(10001);
```

### 5. 移除组件 (RemoveComponent)

```csharp
public void RemoveComponent<K>(bool isDispose = true) where K : Entity
public void RemoveComponent(Type type, bool isDispose = true)
```

**AI 调用示例**:
```csharp
// 移除并销毁
unit.RemoveComponent<BuffComponent>();

// 移除但不销毁
unit.RemoveComponent<BuffComponent>(false);
```

### 6. 移除子实体 (RemoveChild)

```csharp
public bool RemoveChild(long id, bool isDispose = true)
```

**AI 调用示例**:
```csharp
scene.RemoveChild(10001);
```

### 7. 销毁 (Dispose)

```csharp
public override void Dispose()
```

**AI 调用示例**:
```csharp
unit.Dispose();
```

### 8. 获取父实体 (GetParent)

```csharp
public T GetParent<T>() where T : Entity
```

**AI 调用示例**:
```csharp
var parentUnit = buff.GetParent<Unit>();
```

## 集合方法

### 组件数量

```csharp
public int ComponentsCount()
public int ChildrenCount()
```

## 使用示例

### 创建玩家单位

```csharp
// 在场景中创建玩家
var player = scene.AddChild<Unit, int>(10001); // 玩家ID
player.AddComponent<UnitBg>();
player.AddComponent<HpComponent, int>(1000);   // 1000 血量
player.AddComponent<MoveComponent>();
player.AddComponent<SkillComponent>();

// 设置属性
player.GetComponent<HpComponent>().Hp = 1000;
player.GetComponent<HpComponent>().MaxHp = 1000;

// 移动
player.GetComponent<MoveComponent>().MoveTo(targetPosition);
```

### 创建子弹

```csharp
// 创建子弹
var bullet = scene.AddChild<Bullet, Vector3>(startPosition);
bullet.AddComponent<MoveComponent, Vector3>(direction * speed);
bullet.AddComponent<DamageComponent, long>(targetId); // 目标ID
bullet.AddComponent<LifetimeComponent, float>(3.0f);  // 3秒生命周期
```

### 创建 Buff

```csharp
// 在单位上添加 Buff
var buff = unit.AddChild<SpeedBuff, float>(1.5f); // 1.5倍速度
buff.AddComponent<BuffDurationComponent, float>(5.0f); // 持续5秒
```

## 注意事项

1. **线程安全**: 所有 Entity 操作必须在所属 Fiber 的线程中执行
2. **空检查**: 使用 `IsDisposed` 检查实体是否已销毁
3. **Parent 设置**: 只能在创建时设置 Parent，不能修改为 null
4. **组件唯一性**: 每个 Entity 只能有一个特定类型的组件
5. **序列化**: 使用 `IsSerializeWithParent` 控制是否与父实体一起序列化
