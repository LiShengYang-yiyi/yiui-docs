# Battle 战斗系统

## 概述

战斗系统功能组提供了完整的游戏战斗相关功能，包括技能系统、Buff 系统、任务系统、装备系统、成就系统等。

## 包结构

| 包名 | 说明 |
|------|------|
| `cn.etetet.spell` | 技能系统 |
| `cn.etetet.yiuiskill` | YIUI 技能扩展 |
| `cn.etetet.quest` | 任务系统 |
| `cn.etetet.unit` | 单位系统 |
| `cn.etetet.equipment` | 装备系统 |
| `cn.etetet.achievement` | 成就系统 |

---

## 1. cn.etetet.spell - 技能系统

### 核心组件

#### SpellComponent

**位置**: `cn.etetet.spell/Scripts/Model/Share/SpellComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public class SpellComponent: Entity, IAwake, ITransfer
{
    [BsonIgnore]
    public EntityRef<Buff> Current { get; set; }  // 当前正在施放的技能
    
    public long CDTime { get; set; }              // 冷却时间
    
    // 技能冷却字典 (SkillId -> CD结束时间戳)
    public Dictionary<int, long> SpellCD { get; set; }
    
    // 技能修改值 (SkillId -> (ModType -> Value))
    public Dictionary<int, Dictionary<int, int>> SpellMods { get; set; }
}
```

**使用方式**:
```csharp
var spellComponent = unit.GetComponent<SpellComponent>();

// 检查技能是否在冷却中
bool isOnCooldown = spellComponent.SpellCD.TryGetValue(skillId, out long cdEndTime) 
    && TimeHelper.Now < cdEndTime;

// 获取技能冷却剩余时间
long GetRemainingCooldown(int skillId)
{
    if (spellComponent.SpellCD.TryGetValue(skillId, out long cdEndTime))
    {
        return Math.Max(0, cdEndTime - TimeHelper.Now);
    }
    return 0;
}
```

### 技能修改类型 (SpellModType)

| 枚举值 | 说明 |
|--------|------|
| `SPELLMOD_DAMAGE` | 伤害修改 |
| `SPELLMOD_DURATION` | 持续时间 |
| `SPELLMOD_THREAT` | 仇恨值 |
| `SPELLMOD_RANGE` | 施法范围 |
| `SPELLMOD_RADIUS` | 效果半径 |
| `SPELLMOD_CASTING_TIME` | 施法时间 |
| `SPELLMOD_COOLDOWN` | 冷却时间 |
| `SPELLMOD_COST` | 消耗 |
| `SPELLMOD_CRITICAL_CHANCE` | 暴击率 |
| `SPELLMOD_CRIT_DAMAGE_BONUS` | 暴击伤害 |
| `SPELLMOD_IGNORE_ARMOR` | 忽略护甲 |
| `SPELLMOD_GLOBAL_COOLDOWN` | 全局冷却 |

### Buff 系统

#### BuffComponent

**位置**: `cn.etetet.yiuiskill/Scripts/Model/Share/Buff/Component/BuffComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public partial class BuffComponent : Entity, IAwake, IDestroy
{
    public Unit OwnerUnit { get; }  // 所属单位
    
    // Buff 按实例ID索引
    public Dictionary<long, EntityRef<BuffChild>> m_BuffsByInstanceId;
    
    // Buff 按配置ID索引 (可叠加)
    public DictionaryList<int, EntityRef<BuffChild>> m_BuffsById;
    
    // Buff 按基础ID索引
    public DictionaryList<int, EntityRef<BuffChild>> m_BuffsByBaseId;
    
    // Buff 按组索引
    public DictionaryList<EBuffGroup, EntityRef<BuffChild>> m_BuffsByGroup;
    
    // Buff 按移除类型索引
    public DictionaryList<EBuffRemoveType, EntityRef<BuffChild>> m_BuffsByRemove;
}
```

**Buff 查询方法**:

```csharp
var buffComponent = unit.GetComponent<BuffComponent>();

// 获取所有 Buff
var allBuffs = buffComponent.m_BuffsByInstanceId.Values;

// 获取指定 ID 的 Buff
if (buffComponent.m_BuffsById.TryGetValue(buffId, out var buffs))
{
    foreach (var buff in buffs)
    {
        // 处理 Buff
    }
}

// 获取指定组的 Buff
if (buffComponent.m_BuffsByGroup.TryGetValue(EBuffGroup.Debuff, out var debuffs))
{
    // 处理Debuff
}
```

#### Buff 数据结构

```csharp
// Buff 数据
public class BuffData
{
    public long CasterId;        // 施法者 ID
    public int BuffId;          // Buff 配置 ID
    public int BuffBaseId;      // Buff 基础 ID
    public int StackCount;      // 叠加层数
    public long CreateTime;     // 创建时间
    public long ExpireTime;     // 过期时间 (-1 表示永久)
}

// Buff 参数
public class BuffParam
{
    // Buff 参数字典
}
```

### Buff 类型枚举

#### EBuffType (Buff 类型)

| 枚举值 | 说明 |
|--------|------|
| `None` | 无 |
| `Beneficial` | 增益 |
| `Harmful` | 减益 (Debuff) |
| `Neutral` | 中性 |

#### EBuffAddType (Buff 添加方式)

| 枚举值 | 说明 |
|--------|------|
| `None` | 无 |
| `Stack` | 叠加 |
| `Refresh` | 刷新 |
| `NoStack` | 不可叠加 |

#### EBuffRemoveType (Buff 移除方式)

| 枚举值 | 说明 |
|--------|------|
| `None` | 无 |
| `Expired` | 过期移除 |
| `Cancel` | 手动取消 |
| `Death` | 死亡移除 |
| `CombatEnd` | 战斗结束移除 |

#### EBuffGroup (Buff 分组)

| 枚举值 | 说明 |
|--------|------|
| `None` | 无 |
| `Magic` | 魔法 |
| `Curse` | 诅咒 |
| `Disease` | 疾病 |
| `Poison` | 毒药 |
| `Buff` | 增益 |

### 目标选择器 (Target Selector)

#### 服务端目标选择器

**位置**: `cn.etetet.spell/Scripts/Model/Share/Root/`

| 类名 | 功能 |
|------|------|
| `TargetSelector` | 目标选择器基类 |
| `TargetSelectorCaster` | 选择施法者自身 |
| `TargetSelectorCasterCircle` | 施法者周围圆形区域 |
| `TargetSelectorCircle` | 圆形区域选择 |
| `TargetSelectorRectangle` | 矩形区域选择 |
| `TargetSelectorSector` | 扇形区域选择 |
| `TargetSelectorSingle` | 单目标选择 |
| `TargetSelectorPosition` | 位置选择 |
| `TargetSelectorSingleFromRootSingle` | 从根节点选择单个目标 |

#### 客户端目标选择器

**位置**: `cn.etetet.spell/Scripts/HotfixView/Client/TargetSelect/`

| 类名 | 功能 |
|------|------|
| `TargetSelectorCaster` | 施法者自身 |
| `TargetSelectorCasterCircle` | 施法者周围圆形 |
| `TargetSelectorCircle` | 圆形选择 |
| `TargetSelectorPosition` | 位置选择 |
| `TargetSelectorSingle` | 单目标选择 |

### 效果节点 (Effect Node)

#### 服务端效果

| 类名 | 功能 |
|------|------|
| `EffectServerBuffAdd` | 服务端添加 Buff |
| `EffectServerBuffHitted` | 服务端 Buff 命中 |
| `EffectServerBuffRemove` | 服务端移除 Buff |
| `EffectServerBuffTick` | 服务端 Buff 周期触发 |
| `CostNode` | 消耗节点 |

#### 客户端效果

| 类名 | 功能 |
|------|------|
| `EffectClientBuffAdd` | 客户端添加 Buff 显示 |
| `EffectClientBuffHitted` | 客户端 Buff 命中表现 |
| `EffectClientBuffRemove` | 客户端移除 Buff 显示 |

### 技能/Buff 配置

使用 Luban 配置表管理：

| 配置表 | 说明 |
|--------|------|
| `SkillConfig` | 技能配置 |
| `BuffConfig` | Buff 配置 |
| `BuffEffectConfig` | Buff 效果配置 |
| `BaseBuffConfig` | 基础 Buff 配置 |
| `FormulaConfig` | 公式配置 |

---

## 2. cn.etetet.yiuiskill - YIUI 技能扩展

### 核心组件

#### SkillComponent

**位置**: `cn.etetet.yiuiskill/Scripts/Model/Share/Common/SkillComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public class SkillComponent : Entity, IAwake, IDestroy
{
    public Unit Owner { get; }
    
    // 按优先级排序的技能列表
    public List<EntityRef<SkillInfoChild>> m_SkillInfoChildList;
}
```

#### TargetsComponent

目标选择组件：

```csharp
[ComponentOf(typeof(Unit))]
public class TargetsComponent : Entity, IAwake
{
    // 管理技能目标选择
}
```

#### ThreatComponent

仇恨值组件：

```csharp
[ComponentOf(typeof(Unit))]
public class ThreatComponent : Entity, IAwake
{
    // 仇恨值管理
    // key = UnitId, value = 仇恨值
    public Dictionary<long, long> ThreatList;
}
```

### 技能系统特性

#### 技能信息子项 (SkillInfoChild)

```csharp
public class SkillInfoChild
{
    public int SkillId;           // 技能ID
    public int SkillLevel;        // 技能等级
    public int Priority;          // 优先级
}
```

#### 技能错误码 (SkillErrorCode)

| 枚举值 | 说明 |
|--------|------|
| `Success` | 成功 |
| `NotFound` | 技能不存在 |
| `NotReady` | 技能未就绪 |
| `InCooldown` | 冷却中 |
| `OutOfRange` | 超出范围 |
| `NotEnoughResource` | 资源不足 |
| `InvalidTarget` | 无效目标 |
| `Casting` | 正在施放 |
| `Interrupted` | 被中断 |

### 公式系统

使用 `FormulaConfig` 配置技能公式：

```csharp
// 公式计算
public class FormulaHelper
{
    // 根据公式ID和参数计算结果
    public static long Calculate(int formulaId, Dictionary<string, long> param);
}
```

### 状态检查

#### UnitStateType (单位状态类型)

| 枚举值 | 说明 |
|--------|------|
| `None` | 无状态 |
| `Silenced` | 沉默 |
| `Stunned` | 眩晕 |
| `Feared` | 恐惧 |
| `Polymorphed` | 变形 |
| `Rooted` | 定身 |
| `InCombat` | 战斗中 |

### YIUI 行为树节点

**位置**: `cn.etetet.yiuiskill/Editor/YIUIBehave/Skill/NPBehave/Nodes/`

#### 客户端节点

| 节点类 | 功能 |
|--------|------|
| `NP_ClientPlayAnimation` | 播放动画 |
| `NP_ClientPlayAudio` | 播放音效 |
| `NP_ClientCreateEffect` | 创建特效 |
| `NP_ClientCreateUnit` | 创建单位 |
| `NP_ClientMoveTo` | 移动到 |
| `NP_ClientFaceTo` | 转向 |

#### Buff 节点

| 节点类 | 功能 |
|--------|------|
| `NP_BuffAdd` | 添加 Buff |
| `NP_BuffRemove` | 移除 Buff |

#### 条件节点

| 节点类 | 功能 |
|--------|------|
| `NP_HaveBuff` | 是否有 Buff |
| `NP_CheckNumeric` | 检查数值 |
| `NP_CheckTarget` | 检查目标 |

#### 目标节点

| 节点类 | 功能 |
|--------|------|
| `NP_GetCaster` | 获取施法者 |
| `NP_GetTarget` | 获取目标 |
| `NP_GetTargets` | 获取多个目标 |

### 事件系统

| 事件类 | 说明 |
|--------|------|
| `Event_Skill` | 技能事件 |
| `Event_Buff` | Buff 事件 |
| `Event_BuffEffect` | Buff 效果事件 |
| `Event_SkillView` | 技能表现事件 |

---

## 3. cn.etetet.quest - 任务系统

### 核心组件

#### QuestComponent (服务端)

**位置**: `cn.etetet.quest/Scripts/Model/Server/QuestComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public class QuestComponent: Entity, IAwake, IDestroy
{
    // 已完成的任务ID集合
    public HashSet<int> FinishedQuests;
    
    // 任务目标映射 (类型 -> 目标列表)
    public MultiMapSet<QuestObjectiveType, EntityRef<QuestObjective>> QuestObjectives;
}
```

**使用方式**:
```csharp
var questComponent = unit.GetComponent<QuestComponent>();

// 检查任务是否已完成
bool isFinished = questComponent.FinishedQuests.Contains(questId);

// 获取任务目标
var objectives = questComponent.QuestObjectives[objectiveType];
```

#### QuestComponent (客户端)

**位置**: `cn.etetet.quest/Scripts/Model/Client/QuestComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public class QuestComponent: Entity, IAwake, IDestroy
{
    // 客户端任务数据管理
}
```

### 任务数据结构

#### Quest

```csharp
public class Quest
{
    public int QuestId;           // 任务ID
    public QuestStatus Status;    // 任务状态
}
```

#### QuestObjective

```csharp
public class QuestObjective
{
    public int ObjectiveId;       // 目标ID
    public int TargetId;         // 目标ID
    public int TargetNum;        // 目标数量
    public int CurrentNum;       // 当前完成数量
}
```

#### QuestEvent

```csharp
public class QuestEvent
{
    public QuestEventType EventType;  // 事件类型
    public int EventParam;            // 事件参数
}
```

### 任务状态 (QuestStatus)

| 枚举值 | 说明 |
|--------|------|
| `None` | 无 |
| `Accepted` | 已接受 |
| `Completed` | 已完成 |
| `Failed` | 失败 |
| `Canceled` | 已取消 |

### 任务事件类型 (QuestEventType)

| 枚举值 | 说明 |
|--------|------|
| `None` | 无 |
| `KillMonster` | 击杀怪物 |
| `CollectItem` | 收集物品 |
| `TalkToNPC` | 与NPC对话 |
| `ReachPosition` | 到达位置 |
| `UseItem` | 使用物品 |

### 消息处理

| 消息类 | 功能 |
|--------|------|
| `C2M_AcceptQuest` | 接受任务 |
| `C2M_SubmitQuest` | 提交任务 |
| `C2M_QueryAvailableQuests` | 查询可接任务 |
| `M2C_SyncQuestData` | 同步任务数据 |
| `M2C_UpdateQuest` | 更新任务状态 |
| `M2C_UpdateQuestObjective` | 更新任务目标进度 |

---

## 4. cn.etetet.equipment - 装备系统

### 核心组件

#### EquipmentComponent (服务端)

**位置**: `cn.etetet.equipment/Scripts/Model/Server/EquipmentComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public class EquipmentComponent: Entity, IAwake, IDestroy
{
    // 装备槽位字典 (槽位类型 -> 装备Item)
    public Dictionary<EquipmentSlotType, EntityRef<Item>> EquippedItems;
}
```

**使用方式**:
```csharp
var equipComponent = unit.GetComponent<EquipmentComponent>();

// 获取指定槽位的装备
if (equipComponent.EquippedItems.TryGetValue(EquipmentSlotType.Head, out var item))
{
    var equipment = item;
}

// 遍历所有已穿戴装备
foreach (var kvp in equipComponent.EquippedItems)
{
    var slot = kvp.Key;
    var item = kvp.Value;
}
```

#### EquipmentComponent (客户端)

**位置**: `cn.etetet.equipment/Scripts/Model/Client/EquipmentComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public class EquipmentComponent: Entity, IAwake, IDestroy
{
    // 客户端装备显示管理
}
```

### 装备槽位类型 (EquipmentSlotType)

| 枚举值 | 说明 |
|--------|------|
| `Head` | 头部 |
| `Neck` | 颈部 |
| `Shoulder` | 肩膀 |
| `Back` | 背部 |
| `Chest` | 胸部 |
| `Wrist` | 手腕 |
| `Hands` | 手套 |
| `Waist` | 腰部 |
| `Legs` | 腿部 |
| `Feet` | 脚部 |
| `Finger1` | 手指1 |
| `Finger2` | 手指2 |
| `Trinket1` | 饰品1 |
| `Trinket2` | 饰品2 |
| `MainHand` | 主手武器 |
| `OffHand` | 副手武器 |

### 装备操作

```csharp
// 穿戴装备
EquipmentHelper.Equip(unit, item, slotType);

// 卸下装备
EquipmentHelper.UnEquip(unit, slotType);

// 检查是否可以穿戴
bool CanEquip(Unit unit, Item item, EquipmentSlotType slotType);
```

---

## 5. cn.etetet.achievement - 成就系统

### 核心组件

#### AchievementComponent

**位置**: `cn.etetet.achievement/Scripts/Model/Server/AchievementComponent.cs`

```csharp
[ComponentOf(typeof(Unit))]
public class AchievementComponent: Entity, IAwake, IDestroy, IScene
{
    // 已完成的成就ID集合
    public HashSet<int> CompletedAchievements;
    
    // 已领取奖励的成就ID集合
    public HashSet<int> ClaimedAchievements;
    
    // 进行中的成就 (成就ID -> 成就实体)
    public Dictionary<int, EntityRef<Achievement>> ActiveAchievements;
    
    // 成就进度 (成就ID -> 当前进度)
    public Dictionary<int, int> AchievementProgress;
    
    // 成就类型映射 (类型 -> 成就ID列表)
    public MultiMapSet<AchievementType, int> TypeMapping;
    
    // 总成就点数
    public int TotalPoints;
    
    // 已获得成就点数
    public int EarnedPoints;
    
    // 最近完成的成就列表 (最多10个)
    public List<int> RecentAchievements;
}
```

**使用方式**:
```csharp
var achComponent = unit.GetComponent<AchievementComponent>();

// 检查成就是否完成
bool isCompleted = achComponent.CompletedAchievements.Contains(achievementId);

// 获取成就进度
if (achComponent.AchievementProgress.TryGetValue(achievementId, out int progress))
{
    // 处理进度
}

// 检查奖励是否已领取
bool isClaimed = achComponent.ClaimedAchievements.Contains(achievementId);
```

### 成就数据结构

#### Achievement

```csharp
public class Achievement
{
    public int Id;               // 成就ID
    public int Category;         // 分类ID
    public int Points;           // 成就点数
    public AchievementType Type; // 成就类型
}
```

#### AchievementProgress

```csharp
public class AchievementProgress
{
    public int AchievementId;    // 成就ID
    public int Progress;        // 当前进度
    public int Target;           // 目标进度
    public long CompleteTime;   // 完成时间
}
```

### 成就状态 (AchievementStatus)

| 枚举值 | 说明 |
|--------|------|
| `None` | 无 |
| `InProgress` | 进行中 |
| `Completed` | 已完成 |
| `Claimed` | 已领取奖励 |

### 成就类型 (AchievementType)

| 枚举值 | 说明 |
|--------|------|
| `None` | 无 |
| `Collect` | 收集 |
| `Combat` | 战斗 |
| `Explore` | 探索 |
| `Social` | 社交 |
| `Quest` | 任务 |
| `Skill` | 技能 |

### 成就事件处理

**位置**: `cn.etetet.achievement/Scripts/Hotfix/Server/AchievementEventHandlers.cs`

系统自动监听各种事件来更新成就进度：

```csharp
// 成就进度更新系统
public class AchievementProgressSystem
{
    // 处理各种事件，更新成就进度
}
```

### 消息处理

| 消息类 | 功能 |
|--------|------|
| `C2M_GetAchievements` | 获取成就列表 |
| `C2M_GetAchievementDetail` | 获取成就详情 |
| `C2M_GetAchievementStats` | 获取成就统计 |
| `C2M_GetAchievementCategories` | 获取成就分类 |
| `C2M_ClaimAchievement` | 领取成就奖励 |

---

## 6. cn.etetet.unit - 单位系统

单位系统是游戏的核心实体系统，提供游戏中的所有实体（玩家、NPC、怪物等）的基类实现。

### 单位类型

| 类型 | 说明 |
|------|------|
| `Player` | 玩家 |
| `Monster` | 怪物 |
| `NPC` | 非玩家角色 |
| `Pet` | 宠物 |
| `Summon` | 召唤物 |

### 单位属性

游戏单位通常包含以下组件：

| 组件 | 功能 |
|------|------|
| `NumericComponent` | 数值属性（生命值、攻击力等） |
| `MoveComponent` | 移动控制 |
| `SpellComponent` | 技能管理 |
| `BuffComponent` | Buff 管理 |
| `AIComponent` | AI 控制 |
| `EquipmentComponent` | 装备管理 |
| `QuestComponent` | 任务管理 |
| `AchievementComponent` | 成就管理 |

---

## 使用指南

### 技能施放流程

```csharp
// 1. 检查技能是否可以施放
var spellComponent = unit.GetComponent<SpellComponent>();
var skillComponent = unit.GetComponent<SkillComponent>();

// 2. 选择目标
var targets = TargetSelector.SelectTargets(unit, skillId);

// 3. 发送施放请求
var request = new C2M_SpellCastRequest
{
    SpellId = skillId,
    TargetId = targetId,
    Position = targetPosition
};

await session.Call(request);
```

### Buff 管理

```csharp
var buffComponent = unit.GetComponent<BuffComponent>();

// 添加 Buff
BuffHelper.AddBuff(unit, caster, buffId, level);

// 移除 Buff
BuffHelper.RemoveBuff(unit, buffId);

// 查询 Buff
var hasBuff = buffComponent.m_BuffsById.ContainsKey(buffId);
```

### 战斗数值计算

```csharp
// 伤害计算
var damage = DamageHelper.CalculateDamage(caster, target, spellId);

// 治疗计算
var heal = DamageHelper.CalculateHeal(caster, target, spellId);
```

---

## 注意事项

1. **服务端权威**: 所有战斗逻辑以服务端为准，客户端仅做表现和预测
2. **数值同步**: 使用 NumericComponent 进行属性同步
3. **Buff 叠加规则**: 注意 EBuffAddType 的叠加策略
4. **冷却管理**: SpellComponent 统一管理技能冷却
5. **仇恨系统**: ThreatComponent 管理仇恨列表

---

## 相关包依赖

```
cn.etetet.spell
    └── cn.etetet.yiuiskill (依赖)
    └── cn.etetet.numeric (依赖)
    
cn.etetet.yiuiskill
    └── cn.etetet.spell (依赖)
    └── cn.etetet.behaviortree (依赖)
    └── cn.etetet.btnode (依赖)
    
cn.etetet.quest
    └── cn.etetet.spell (依赖)
    
cn.etetet.equipment
    └── cn.etetet.item (依赖)
    
cn.etetet.achievement
    └── cn.etetet.quest (可选依赖)
```
