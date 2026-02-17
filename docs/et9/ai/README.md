# AI 人工智能系统

## 概述

AI 人工智能功能组提供了一套完整的行为树驱动的 AI 框架，支持怪物 AI、宠物 AI、自动战斗等功能。

## 包结构

| 包名 | 说明 |
|------|------|
| `cn.etetet.ai` | 基础 AI 框架 |
| `cn.etetet.yiuiai` | YIUI AI 扩展实现 |
| `cn.etetet.behaviortree` | 行为树核心引擎 |
| `cn.etetet.btnode` | 行为树节点库 |
| `cn.etetet.yiuiautobattle` | 自动战斗系统 |

---

## 1. cn.etetet.ai - 基础 AI 框架

### 核心组件

#### AIComponent

**位置**: `cn.etetet.ai/Scripts/Model/Share/AIComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public class AIComponent: Entity, IAwake<AIRoot>, IAwake<int>, IDestroy
{
    public AIRoot AIRoot { get; set; }      // AI 行为树根节点
    public ETCancellationToken CancellationToken;
    public long Timer;
    public int Current;                      // 当前执行的节点索引
}
```

**挂载位置**: 客户端挂在 ClientScene 上，服务端挂在 Unit 上

**使用方式**:
```csharp
// 获取 AI 组件
var aiComponent = unit.GetComponent<AIComponent>();

// 开启 AI（传入 AI 配置 ID）
aiComponent.Awake(aiConfigId);

// 停止 AI
aiComponent.Destroy();
```

#### AIRoot

**位置**: `cn.etetet.ai/Scripts/Model/Share/AIRoot.cs`

```csharp
public class AIRoot: BTRoot
{
    [BTOutput(typeof(Unit))]
    public string Unit;  // 输出：当前 Unit
}
```

### 预设 AI 行为

| 类名 | 说明 |
|------|------|
| `AI_MonsterReturn` | 怪物返回出生点 |
| `AI_MonsterXunLuo` | 怪物巡逻 |
| `AI_MonsterZhuiJi` | 怪物追击 |
| `AI_PetFollow` | 宠物跟随 |
| `AI_PetIdle` | 宠物待机 |
| `AI_PetReturn` | 宠物返回 |
| `AI_PetZhuiJi` | 宠物追击 |

---

## 2. cn.etetet.behaviortree - 行为树核心引擎

### 节点类型体系

```
BTNode (抽象基类)
├── BTAction     - 动作节点
├── BTCondition  - 条件节点  
├── BTComposite  - 组合节点
├── BTDecorate   - 装饰节点
└── BTRoot       - 根节点
```

### 核心类

#### BTNode

**位置**: `cn.etetet.behaviortree/Scripts/Model/Share/BTNode.cs`

```csharp
[System.Serializable]
public abstract class BTNode : Object
{
    public int Id;                    // 节点唯一ID
    public List<BTNode> Children;     // 子节点列表
    public string Desc;               // 描述信息（编辑器用）
    public UnityEngine.Vector2 Position; // 节点位置（编辑器用）
}
```

#### BTAction (动作节点)

执行具体操作，如移动、攻击、施法等。

```csharp
public abstract class BTAction: BTNode
{
    // 动作节点执行具体行为
}
```

#### BTCondition (条件节点)

判断条件是否满足，返回成功或失败。

```csharp
public abstract class BTCondition: BTNode
{
    // 条件判断节点
}
```

#### BTComposite (组合节点)

组合多个子节点，按策略执行。

```csharp
public abstract class BTComposite: BTNode
{
    // 组合节点，管理多个子节点
}
```

#### BTRoot (根节点)

行为树的根节点，包含整棵树的配置。

```csharp
public abstract class BTRoot: BTNode
{
    public long TreeId = RandomGenerator.RandInt64(); // 树ID
}
```

### 编辑器支持

**位置**: `cn.etetet.behaviortree/Editor/BehaviorTreeEditor/`

提供完整的行为树编辑器功能：

| 类名 | 功能 |
|------|------|
| `BehaviorTreeEditor` | 行为树编辑器主窗口 |
| `BTNodeDrawer` | 节点绘制器 |
| `BTNodeValidator` | 节点验证器 |
| `NodeView` | 节点视图 |
| `TreeView` | 树形视图 |
| `BTClipboard` | 剪贴板操作 |

---

## 3. cn.etetet.btnode - 行为树节点库

### 组合节点 (Composite)

#### BTSelector

选择节点：依次执行子节点，返回第一个成功的子节点结果。

```csharp
public class BTSelector: BTComposite
{
}
```

**使用场景**: 尝试多种行为，任一成功即停止。

#### BTSequence

序列节点：依次执行子节点，所有子节点成功才返回成功。

```csharp
public class BTSequence: BTComposite
{
}
```

**使用场景**: 按顺序执行一系列行为。

### 动作节点 (Action)

#### 伤害相关

| 节点类 | 功能 |
|--------|------|
| `BTDamage` | 造成伤害 |
| `BTCreateSpell` | 创建技能 |

#### Buff 相关

| 节点类 | 功能 |
|--------|------|
| `BTAddBuff` | 添加 Buff |
| `BTAddFakeBulletBuff` | 添加弹道Buff |
| `BTBuffAddExpireTime` | 设置Buff过期时间 |
| `BTBuffAddStack` | 增加Buff层数 |
| `BTRemoveBuff` | 移除Buff |
| `BTCreateBuffUnit` | 创建Buff单位 |
| `BTGetBuffCaster` | 获取Buff施放者 |
| `BTGetBuffOwner` | 获取Buff拥有者 |

#### 移动相关

| 节点类 | 功能 |
|--------|------|
| `BTTurnToPos` | 转向位置 |
| `BTTurnToUnit` | 转向单位 |
| `BTTransfer` | 传送 |

#### 动画相关 (客户端)

| 节点类 | 功能 |
|--------|------|
| `BTAnimatorSetBool` | 设置动画Bool参数 |
| `BTAnimatorSetFloat` | 设置动画Float参数 |
| `BTAnimatorSetInt` | 设置动画Int参数 |
| `BTAnimatorSetTrigger` | 触发动画 |

#### 特效相关 (客户端)

| 节点类 | 功能 |
|--------|------|
| `BTCreateEffect` | 创建特效 |
| `BTCreateEffectOnPos` | 在位置创建特效 |
| `BTCreateBuffEffect` | 创建Buff特效 |
| `BTCreateFakeBullet` | 创建假子弹 |

### 条件节点 (Condition)

| 节点类 | 功能 |
|--------|------|
| `BTBuffRemoveTypeCase` | Buff移除类型判断 |
| `BTTargetInFrontOfCaster` | 目标是否在施法者前方 |

### 目标选择器 (Target Selector)

#### 服务端

| 节点类 | 功能 |
|--------|------|
| `BTTargetSelectorCaster` | 选择施法者自身 |
| `BTTargetSelectorCasterCircle` | 选择施法者周围圆形区域 |
| `BTTargetSelectorCircle` | 选择圆形区域内的目标 |
| `BTTargetSelectorRectangle` | 选择矩形区域内的目标 |
| `BTTargetSelectorPosition` | 选择位置 |
| `BTTargetSelectorSingle` | 选择单个目标 |
| `BTTargetSelectorSingleFromRootSingle` | 从根节点选择单个目标 |

#### 客户端

| 节点类 | 功能 |
|--------|------|
| `TargetSelectorCaster` | 施法者自身 |
| `TargetSelectorCasterCircle` | 施法者周围圆形 |
| `TargetSelectorCircle` | 圆形选择 |
| `TargetSelectorPosition` | 位置选择 |
| `TargetSelectorSingle` | 单目标选择 |

### 事件节点

| 节点类 | 功能 |
|--------|------|
| `BTNumericChange` | 数值变化事件 |
| `BTPhaseAdd` | 添加阶段 |
| `BTPhaseRemove` | 移除阶段 |

---

## 4. cn.etetet.yiuiai - YIUI AI 扩展

### 核心组件

#### AIComponent (YIUI 扩展版)

**位置**: `cn.etetet.yiuiai/Scripts/Model/Share/Component/AIComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public class AIComponent : Entity, IAwake<int>, IAwake<AIConfig>, IDestroy, IDynamicEvent<Event_BehaveHotReload>
{
    public Unit Owner { get; }                  // 所属单位
    public NPBehaveTreeChild BehaveTreeChild { get; }  // 行为树子节点
    public int AIConfigId { get; set; }         // AI 配置 ID
    public AIConfig AIConfig { get; set; }      // AI 配置
    public NP_BaseActionAI CurrentAI { get; }   // 当前执行的 AI
    public long Timer;                           // 定时器
    public string CurrentAIName;                 // 当前 AI 名称
}
```

### 系统架构

#### NPBehave (NP Behavior Tree)

YIUI 使用 NPBehave 作为行为树实现框架：

| 组件 | 说明 |
|------|------|
| `NP_BaseActionAI` | AI 动作基类 |
| `YIUIBehaveModuleAI` | AI 模块编辑器 |
| `NP_BehaveGraphAI` | AI 行为图 |

### 数据类

| 类名 | 功能 |
|------|------|
| `Battle_Event_BehaveData` | 战斗事件行为数据 |
| `Common_Event_BehaveData` | 通用事件行为数据 |
| `Common_ActionData_Behave` | 通用动作数据 |
| `Battle_ActionData_Behave` | 战斗动作数据 |

### SLATE 框架支持

编辑器使用 SLATE 框架构建：

| 类名 | 功能 |
|------|------|
| `ST_ClientGroupAI` | 客户端组 |
| `ST_ClientTrackAI` | 客户端轨道 |
| `ST_CommonGroupAI` | 通用组 |
| `ST_CommonTrackAI` | 通用轨道 |
| `ST_CutSceneAI` | 剧情 AI |

---

## 5. cn.etetet.yiuiautobattle - 自动战斗系统

### 核心组件

#### AutoBattleUnitComponent

**位置**: `cn.etetet.yiuiautobattle/Scripts/Model/Share/Data/AutoBattleUnitComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public partial class AutoBattleUnitComponent : Entity, IAwake
{
    public AutoBattleUnitDataChild AutoBattleUnitData { get; }
}
```

#### AutoBattleDataComponent

管理自动战斗数据：

```csharp
[ComponentOf(typeof(Scene))]
public class AutoBattleDataComponent : Entity, IAwake
{
    // 自动战斗场景数据管理
}
```

### 配置表

| 配置表 | 说明 |
|--------|------|
| `AutoBattleFormat` | 自动战斗阵型配置 |
| `AutoBattleMapConf` | 自动战斗地图配置 |
| `BattlePosUnit` | 战斗位置单位配置 |

### 事件系统

| 事件类 | 触发时机 |
|--------|----------|
| `On_Event_AutoBattle_Enter` | 进入自动战斗 |
| `On_Event_AutoBattle_Exit` | 退出自动战斗 |
| `On_Event_AutoBattle_UnitEnter` | 单位进入战斗 |
| `On_Event_AutoBattle_UnitExit` | 单位退出战斗 |
| `On_Event_UnitNumericChange` | 单位数值变化 |

### GM 命令

位置: `cn.etetet.yiuiautobattle/Scripts/HotfixView/Client/GM/`

```csharp
// 自动战斗 GM 命令
public class GM_Command_AutoBattle
{
    // 支持的 GM 命令
}
```

---

## 使用指南

### 创建自定义 AI 行为

1. **定义 AI 配置**: 在配置表中添加 AI 配置
2. **创建行为树**: 使用编辑器创建行为树
3. **挂载组件**: 给 Unit 挂载 AIComponent

```csharp
// 挂载 AI 组件
var aiComponent = unit.AddComponent<AIComponent>();
aiComponent.Awake(aiConfigId);
```

### 创建自定义行为树节点

1. **继承 BTNode**: 创建新的节点类
2. **实现 Execute 方法**: 编写节点逻辑

```csharp
public class MyCustomAction : BTAction
{
    public string TargetUnit;
    public int DamageValue;
    
    // 节点执行逻辑
    protected override BTNodeResult Execute()
    {
        var target = GetValue<Unit>(TargetUnit);
        if (target != null)
        {
            // 执行伤害逻辑
            return BTNodeResult.Success;
        }
        return BTNodeResult.Failed;
    }
}
```

### 调试行为树

使用编辑器中的调试功能：

1. 打开行为树编辑器
2. 选中要调试的节点
3. 运行游戏，观察节点执行路径

---

## 注意事项

1. **服务端 vs 客户端**: 行为树分为服务端和客户端两部分，服务端负责逻辑判断，客户端负责表现
2. **性能优化**: 避免在行为树中执行耗时操作
3. **状态管理**: 行为树执行过程中注意取消令牌 (CancellationToken) 的使用
4. **热更新**: 支持行为树热重载，使用 `Event_BehaveHotReload` 事件

---

## 相关包依赖

```
cn.etetet.ai
    └── cn.etetet.behaviortree (依赖)
    └── cn.etetet.btnode (依赖)
    
cn.etetet.yiuiai
    └── cn.etetet.ai (依赖)
    └── cn.etetet.behaviortree (依赖)
    └── cn.etetet.btnode (依赖)
    └── cn.etetet.yiuibehave (依赖)
    
cn.etetet.yiuiautobattle
    └── cn.etetet.yiuiai (依赖)
    └── cn.etetet.spell (依赖)
    └── cn.etetet.unit (依赖)
```
