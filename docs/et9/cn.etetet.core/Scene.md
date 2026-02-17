# Scene 场景类详细文档

## 概述

`Scene` 是 ET 框架中的场景实体，代表一个独立的游戏空间或逻辑区域。每个 Scene 属于一个 Fiber，有自己的组件集合。

## 命名空间

```csharp
namespace ET
```

## 类定义

```csharp
[ChildOf(typeof(Fiber))]
public class Scene: Entity, IScene, IAwake<int, int>, IAwake<int, int, string>
```

## 核心属性

### 标识

```csharp
public long Id { get; protected set; }  // 场景 ID
public int SceneType { get; }          // 场景类型
public int Zone { get; }                // 区服 ID
public string Name { get; }             // 场景名称
```

### 引用

```csharp
public Fiber Fiber { get; }            // 所属 Fiber
```

## 创建场景

### 方式 1: 通过 Entity.AddChild

```csharp
// 创建场景
var scene = fiber.Root.AddChild<Scene, int, int, string>(
    1,                      // 场景 ID
    SceneType.Game,         // 场景类型
    "MainGame"              // 场景名称
);

// 或者
var scene = fiber.Root.AddChild<Scene, int>(SceneType.Game);
```

### 方式 2: 通过 Fiber 创建

```csharp
// 在 Fiber 中创建场景时自动创建
var fiber = await someFiber.CreateFiber(zone, SceneType.Game, "Game");
var scene = fiber.Root;  // Fiber.Root 就是一个 Scene
```

## 使用示例

### 1. 在场景中添加单位

```csharp
public class Scene: Entity, IScene
{
    // 添加单位组件
    public UnitComponent UnitComponent => GetComponent<UnitComponent>();
    
    // 创建单位
    public Unit CreateUnit(long id, int configId)
    {
        var unit = this.AddChild<Unit, int>(configId);
        unit.Id = id;
        return unit;
    }
}

// 使用
var scene = fiber.Root;
var unit = scene.CreateUnit(10001, 1001);
```

### 2. 在场景中添加组件

```csharp
// 添加组件
scene.AddComponent<UnitComponent>();
scene.AddComponent<BagComponent>();
scene.AddComponent<QuestComponent>();

// 获取组件
var unitComponent = scene.GetComponent<UnitComponent>();
```

### 3. 发布场景事件

```csharp
// 发布事件
await EventSystem.Instance.PublishAsync(scene, new SceneLoadedEvent 
{ 
    SceneId = scene.Id 
});
```

### 4. 场景切换

```csharp
public async ETTask SwitchScene(Scene scene, int targetSceneId)
{
    // 保存当前状态
    var playerId = scene.GetComponent<PlayerComponent>().PlayerId;
    
    // 创建新场景
    var newScene = scene.Fiber.CreateFiber(
        targetSceneId,
        scene.Zone,
        SceneType.Game,
        "Game"
    );
    
    // 转移玩家
    var player = await newScene.Root.GetChild<Unit, long>(playerId);
}
```

## SceneType 枚举

```csharp
public enum SceneType
{
    Main = 1,      // 主界面
    Login = 2,    // 登录
    Game = 3,     // 游戏
    Battle = 4,   // 战斗
    Lobby = 5,    // 大厅
    // ... 其他类型
}
```

## IScene 接口

```csharp
public interface IScene
{
    int SceneType { get; }
    int Zone { get; }
    string Name { get; }
    long Id { get; }
    Fiber Fiber { get; }
}
```

## 使用场景

1. **多场景管理**: 不同玩法使用不同场景
2. **热更切换**: 切换场景实现玩法更新
3. **多区服**: 每个区服独立场景
4. **战斗实例**: 每次战斗独立的场景

## 注意事项

1. **场景是 Entity**: Scene 继承自 Entity，具有完整的实体功能
2. **Fiber 绑定**: 每个 Scene 属于一个 Fiber
3. **ID 唯一**: Scene ID 在整个 Fiber 中唯一
4. **类型区分**: 使用 SceneType 区分不同类型场景
