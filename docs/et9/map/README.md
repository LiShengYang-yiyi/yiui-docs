# Map 地图系统

本文档面向 AI 开发人员，介绍 YIUI 项目的地图与导航系统。

---

## 概述

YIUI 地图系统包含以下核心模块：

| 包名 | 功能描述 |
|------|----------|
| `cn.etetet.map` | 地图核心逻辑 |
| `cn.etetet.mapmanager` | 地图管理器 |
| `cn.etetet.recast` | 导航网格 (基于 Recast/Detour) |
| `cn.etetet.actorlocation` | 位置服务 |
| `cn.etetet.aoi` | AOI 区域感知 |

---

## 1. 地图核心 (`cn.etetet.map`)

### 架构

```
Map Fiber
├── UnitComponent        # 场景中的单位管理
├── AOIManagerComponent  # AOI 管理
├── LocationProxyComponent   # 位置代理
├── MessageLocationSenderComponent  # 消息位置发送
└── NavmeshComponent    # 寻路组件
```

### 初始化流程 (FiberInit_Map)

```csharp
[Invoke(SceneType.Map)]
public class FiberInit_Map: AInvokeHandler<FiberInit, ETTask>
{
    public override async ETTask Handle(FiberInit fiberInit)
    {
        Scene root = fiberInit.Fiber.Root;
        
        // 添加基础组件
        root.AddComponent<MailBoxComponent, int>(MailBoxType.UnOrderedMessage);
        root.AddComponent<TimerComponent>();
        root.AddComponent<CoroutineLockComponent>();
        root.AddComponent<ProcessInnerSender>();
        root.AddComponent<MessageSender>();
        
        // 单位组件
        UnitComponent unitComponent = root.AddComponent<UnitComponent>();
        
        // AOI 管理
        root.AddComponent<AOIManagerComponent>();
        root.AddComponent<LocationProxyComponent>();
        root.AddComponent<MessageLocationSenderComponent>();
        
        // 加载寻路数据
        string mapName = root.Name.GetSceneConfigName();
        if (mapName != "GateMap")
        {
            await NavmeshComponent.Instance.Load(mapName);
        }
        
        // 注册到服务发现
        ServiceDiscoveryProxy serviceDiscoveryProxy = root.AddComponent<ServiceDiscoveryProxy>();
        await serviceDiscoveryProxy.RegisterToServiceDiscovery();
        
        // 订阅 Location 和 MapManager 服务
        await serviceDiscoveryProxy.SubscribeServiceChange("Location", ...);
        await serviceDiscoveryProxy.SubscribeServiceChange("MapManager", ...);
    }
}
```

### 核心功能

**单位管理 (UnitComponent)**
- 管理场景内所有 Unit
- 支持 Unit 的创建、销毁、查询

**单位创建**
- 服务端: `UnitFactory.Create(root, configId, unitId)`
- 客户端: `UnitFactory.Create(unitData)`

### 进入地图流程

```
1. C2G_EnterMap (客户端 → Gate)
2. Gate → Location 获取 Player 位置
3. Gate → MapManager 请求分配 Map
4. MapManager → 选定 Map Fiber
5. M2M_UnitTransferRequest (旧Map → 新Map)
6. G2C_EnterMap (Gate → 客户端)
7. C2M_TransferMap (客户端 → 新Map)
8. M2C_CreateMyUnitHandler 创建玩家Unit
```

---

## 2. 地图管理器 (`cn.etetet.mapmanager`)

### 架构

```
MapManagerComponent
├── MapInfos: Dictionary<string, MapInfo>
│       └── MapCopys: 多个地图副本
```

### 核心组件

**MapManagerComponent**

```csharp
[ComponentOf(typeof(Scene))]
public class MapManagerComponent: Entity, IAwake
{
    public Dictionary<string, EntityRef<MapInfo>> MapInfos = new();
}
```

**MapInfo** - 每种地图一个 MapInfo

```csharp
[ChildOf(typeof(MapManagerComponent))]
public class MapInfo: Entity, IAwake<string>
{
    public string MapName;
    // 管理多个 MapCopy (分线/副本)
}
```

**MapCopy** - 地图副本或分线

```csharp
[ChildOf(typeof(MapInfo))]
public class MapCopy: Entity, IAwake<int>, IDestroy
{
    // 已进入的玩家
    public HashSet<long> Players = new();
    
    // 等待进入的玩家
    public Dictionary<long, long> WaitEnterPlayer = new();
    
    // 副本状态
    public MapCopyStatus Status = MapCopyStatus.Running;
    
    // 对应的 FiberId
    public int FiberId;
}

public enum MapCopyStatus
{
    Running = 1,      // 运行中
    WaitFinish = 2,  // 等待结束
    Finished = 3,    // 已结束
    WaitMerge = 4,   // 等待合线
}
```

### 分线管理

- 每个 MapName 可以有多个 MapCopy
- 玩家少的分线可以合并 (MergeLines)
- 支持等待进入队列

---

## 3. 导航网格 (`cn.etetet.recast`)

### 概述

基于 **Recast & Detour** 库的完整寻路系统，包含:

- **Recast**: 导航网格生成
- **Detour**: 寻路查询
- **Detour.Crowd**: 群体移动
- **Detour.Dynamic**: 动态障碍物

### 目录结构

```
Runtime/
├── Core/           # 核心工具类
├── Recast/         # 导航网格生成
├── Detour/         # 寻路查询
├── Detour.Crowd/   # 群体 AI
├── Detour.Dynamic/ # 动态障碍
└── Detour.Extras/  # 额外工具
```

### 核心类

**DtNavMesh** - 导航网格

```csharp
// 导航网格查询
public class DtNavMesh
{
    public DtStatus FindPath(ActorId start, ActorId end, ...);
    public DtStatus FindNearestPoly(float3 center, ...);
    public DtStatus Raycast(start, end, ...);
}
```

**DtNavMeshQuery** - 寻路查询

```csharp
// 创建寻路查询
DtNavMeshQuery query = new DtNavMeshQuery(navMesh);

// 查找路径
query.FindPath(startPos, endPos, filter, ref path);

// 射线检测
query.Raycast(startPos, endPos, filter, ...);
```

**DtCrowd** - 群体移动

```csharp
// 创建群体
DtCrowd crowd = new DtCrowd(maxAgents, agentRadius, navMesh);

// 添加 Agent
int agentIdx = crowd.AddAgent(position, params);

// 设置目标
crowd.SetAgentTarget(agentIdx, targetPos);
```

### 使用方式

```csharp
// 加载地图寻路数据
await NavmeshComponent.Instance.Load(mapName);

// 寻路
float3 start = unit.Position;
float3 end = targetPos;
var path = await NavmeshComponent.Instance.FindPath(start, end);

// 射线检测 (无碰撞检测)
bool hit = await NavmeshComponent.Instance.Raycast(start, end);
```

---

## 4. 位置服务 (`cn.etetet.actorlocation`)

### 架构

```
Location Fiber
└── LocationManagerComponent
        └── LocationOneType (按类型分组)
                ├── locations: Dictionary<unitId, ActorId>
                └── lockInfos: 锁信息
```

### 核心组件

**LocationComponent**

```csharp
[ChildOf(typeof(LocationOneType))]
public class LocationOneType: Entity, IAwake
{
    // unitId -> ActorId 映射
    public readonly Dictionary<long, ActorId> locations = new();
    
    // 锁信息
    public readonly Dictionary<long, EntityRef<LockInfo>> lockInfos = new();
}
```

**LocationManagerComponent**

```csharp
[ComponentOf(typeof(Scene))]
public class LocationManagerComponent: Entity, IAwake
{
    // 管理所有类型的 Location
}
```

### 功能

1. **位置注册**: Unit 创建时注册位置
2. **位置查询**: 通过 unitId 查询所在的 Map Fiber
3. **位置锁定**: 防止跨 Map 操作冲突

### 使用场景

- Gate 收到客户端消息后，通过 Location 找到目标 Map Fiber
- 跨 Fiber 消息发送

```csharp
// 获取 Player 所在的 Map
ActorId mapActorId = await LocationProxyComponent.GetLocation(unitId);
```

---

## 5. AOI 区域感知 (`cn.etetet.aoi`)

### 概念

AOI (Area of Interest) 用于管理单位的视野范围，实现:

- **可见性管理**: 只同步视野内的单位
- **广播优化**: 减少不必要的网络消息
- **位置同步**: 玩家移动时更新视野

### 核心组件

**AOIManagerComponent**

```csharp
[ComponentOf(typeof(Scene))]
public class AOIManagerComponent: Entity, IAwake
{
    public const int CellSize = 50 * 1000;  // 格子大小 (单位坐标)
}
```

**AOIEntity** - 挂载在每个 Unit 上

```csharp
[ComponentOf(typeof(Unit))]
public class AOIEntity: Entity, IAwake, IDestroy
{
    // 相位类型 (影响视野范围)
    public PhaseType Phase = PhaseType.Normal;
    
    // 当前所在的 Cell
    public Cell Cell;
    
    // ============== 我看到的 ==============
    // 视野进入的 Cell
    public HashSet<long> SubEnterCells;
    // 视野离开的 Cell
    public HashSet<long> SubLeaveCells;
    
    // 视野内的单位
    public Dictionary<long, EntityRef<AOIEntity>> SeeUnits;
    // 视野内的玩家
    public Dictionary<long, EntityRef<AOIEntity>> SeePlayers;
    
    // ============== 看见我的 ==============
    // 哪些单位看见了我
    public Dictionary<long, EntityRef<AOIEntity>> BeSeeUnits;
    // 哪些玩家看见了我 (用于广播)
    public Dictionary<long, EntityRef<AOIEntity>> BeSeePlayers;
}
```

### Cell (格子)

```csharp
[ChildOf(typeof(AOIManagerComponent))]
public class Cell: Entity, IAwake<long>
{
    // Cell 唯一标识 (基于坐标计算)
    public long Id;
    
    // 格子内的单位
    public HashSet<EntityRef<AOIEntity>> Units = new();
}
```

### 相位类型

```csharp
public enum PhaseType
{
    Normal = 0,     // 普通相位
    Battle = 1,     // 战斗相位 (视野更大)
    Stealth = 2,    // 潜行相位
    // ...
}
```

### AOI 事件

```csharp
public enum AOIEventType
{
    Enter,      // 进入视野
    Leave,      // 离开视野
    Move,       // 移动
    Numeric,   // 属性变化
    // ...
}
```

### 视野计算

1. **Cell 划分**: 场景按 50*1000 单位划分为格子
2. **相位影响**: 不同相位有不同视野半径
3. **计算流程**:
   - Unit 移动时更新 Cell
   - 检查周围 9 宫格内的 Cell
   - 对比进入/离开的 Unit
   - 触发 AOI 事件

---

## 地图系统流程图

### 玩家进入地图

```
┌─────────┐
│ Client  │
└────┬────┘
     │ C2G_EnterMap
     ▼
┌─────────┐
│  Gate   │ ──→ Location 查询
└────┬────┘
     │ A2MapManager_GetMapRequest
     ▼
┌──────────────┐
│ MapManager   │ ──→ 分配 MapCopy
└──────┬───────┘
       │ MapManager2Map_NotifyPlayerTransfer
       ▼
┌──────────┐     ┌────────────┐
│ Old Map  │ ──→ │ Unit Transfer │
└────┬─────┘     └──────┬─────┘
                        │ M2M_UnitTransferRequest
                        ▼
┌──────────┐     ┌────────────┐
│ New Map  │ ←── │ Create Unit │
└────┬─────┘     └──────────────┘
     │
     │ G2C_EnterMap
     ▼
┌─────────┐
│ Client  │
└─────────┘
```

### 移动同步

```
┌─────────┐
│ Client  │
└────┬────┘
     │ C2M_TransferMap
     ▼
┌──────────┐
│   Map    │ ──→ Unit 位置更新
└────┬─────┘
     │
     │ AOI 事件广播
     ▼
┌──────────┐
│ Gate 1..N│ ──→ 视野内玩家的 Gate
└──────────┘
     │
     ▼
┌─────────┐
│ Clients │
```

---

## 扩展开发指南

### 添加新地图

1. 在配置表添加 MapConfig
2. 导出 NavMesh 数据到 Resources/Recast/
3. 在 SceneType 添加对应类型

### 自定义 AOI 规则

```csharp
// 在 AOIEntitySystem 中修改
public class AOIEntitySystem : EntitySystem<AOIEntity>
{
    public override void Awake(AOIEntity self)
    {
        // 根据 Unit 类型设置不同相位
        Unit unit = self.Unit;
        if (unit.IsPlayer)
        {
            self.Phase = PhaseType.Normal;
        }
        else if (unit.IsMonster)
        {
            self.Phase = PhaseType.Battle;
        }
    }
}
```

### 添加寻路类型

1. 继承 `DtCrowdAgent` 创建自定义 Agent
2. 实现移动逻辑
3. 在 MoveHelper 中调用

---

## 配置相关

### 地图配置

| 配置项 | 说明 |
|--------|------|
| MapName | 地图名称 |
| MapConfigId | 配置ID |
| NavMeshFile | 寻路文件名 |
| PlayerLimit | 人数上限 |
| DefaultPhase | 默认相位 |

### AOI 配置

| 配置项 | 值 |
|--------|-----|
| CellSize | 50000 (50*1000) |
| Normal 视野半径 | 约 2-3 Cell |
| Battle 视野半径 | 约 4-5 Cell |
