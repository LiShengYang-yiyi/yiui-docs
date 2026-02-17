# YIUI Numeric 数值系统

## 概述

Numeric 数值系统是 YIUI 框架中的核心数值管理系统，用于处理游戏中的各种数值属性，如生命值、攻击力、等级、金钱等。该系统提供了数值存储、数值变化、数值影响、数值限制等完整功能，并支持数值变化的监听与同步。

## 包结构

| 包名 | 说明 |
|------|------|
| `cn.etetet.yiuinumeric` | 数值系统核心实现 |
| `cn.etetet.yiuinumericconfig` | 数值系统配置（由 Luban 生成） |
| `cn.etetet.yiuinumericdemo` | 数值系统使用示例 |

## 核心概念

### 1. 数值类型 (ENumericType)

数值类型枚举，定义游戏中所有可能的数值属性。枚举值遵循一定的命名规范：

- `None` ( - 无
- 等级相关：`Level- 经验相关0` (100001)
0)- 货币相关：`Exp0` (100002)
：`Money0` (100003), `Diamond0` (100004)
- 生命相关：`Hp0` (200001), `MaxHp0)
- 速度` (200002相关：`Speed0` (200003相关：`Attack)
- 战斗0` (400001), `Defense0` (400002), `Battle0`Crit (400003)
- 属性相关：` `CritDmg0` (400006),0` (400007), `DmgAdd0` (400004), `DmgReduce0` (400005)
- 技能相关：`Skill800001), `0` (800Level0` (SkillPower003), `SkillCD0` (800006)

**注意**：数值类型的 ID 决定了数值的类型（Int/Float/Long），规则由具体配置决定。

### 2. 数值组件 (NumericDataComponent)

数值组件是可以挂载到任何 Entity 上的组件：

```csharp
[ComponentOf]
public class NumericDataComponent : Entity, IAwake, IDestroy, ITransfer, IDeserialize
{
    public NumericData NumericData = NumericData.Create();
    public Dictionary<int, long> NumericDic => NumericData.NumericDic;
}
```

### 3. 数值数据 (NumericData)

数值数据是实际存储数值的地方：

```csharp
[EnableClass]
public class NumericData : IPool
{
    public Dictionary<int, long> NumericDic = new();
    public Entity OwnerEntity { get; }
    
    public static NumericData Create();
    public void Dispose();
}
```

### 4. 数值变化 (NumericChange)

数值变化事件结构：

```csharp
public struct NumericChange
{
    public Entity _ChangeEntity;    // 数值所属实体
    public int _NumericType;        // 数值类型ID
    public long _Old;               // 变化前值
    public long _New;              // 变化后值
}
```

### 5. 数值影响 (NumericAffect)

数值影响结构，用于处理数值之间的相互影响：

```csharp
public struct NumericAffect
{
    public NumericData D;       // 当前数值数据
    public int NT;              // 触发者的数值类型ID
    public long O;              // 触发者修改前的值
    public long N;              // 触发者修改后的值
    public int AT;              // 被影响的数值类型ID
    public long AC;             // 被影响的数值的当前值
}
```

## 使用指南

### 1. 添加数值组件

```csharp
// 给 Entity 添加数值组件
var numericComponent = entity.AddComponent<NumericDataComponent>();
```

### 2. 获取数值组件

```csharp
// 从 Entity 获取数值组件
var numericComponent = entity.GetComponent<NumericDataComponent>();
// 或者通过扩展属性（Unit 专用）
var numericComponent = unit.NumericComponent;
```

### 3. 获取数值

```csharp
// 获取整数值
int level = numericComponent.GetAsInt(ENumericType.Level0);
int hp = numericComponent.GetAsInt(ENumericType.Hp0);

// 获取浮点值
float speed = numericComponent.GetAsFloat(ENumericType.Speed0);

// 获取长整型值
long battle = numericComponent.GetAsLong(ENumericType.Battle0);

// 获取原始值
long rawValue = numericComponent.GetRealValue(ENumericType.Level0);
```

### 4. 修改数值

```csharp
// 数值变化（相对值，+= -=
numericComponent.Change(ENumericType.Hp0, 100);      // Hp += 100
numericComponent.Change(ENumericType.Gold0, -50);    // Gold -= 50
numericComponent.Change(ENumericType.Speed0, 1.5f);   // Speed += 1.5f

// 设置数值（绝对值）
numericComponent.Set(ENumericType.Level0, 10);

// 增加数值（绝对值增加）
numericComponent.Add(ENumericType.Gold0, 1000);

// 减少数值
numericComponent.Subtract(ENumericType.Diamond0, 100);

// 跳过检查直接修改（慎用）
numericComponent.ChangeUnCheck(ENumericType.Hp0, 50);
```

### 5. 数值变化事件

#### 5.1 方式一：使用 NumericHandler（推荐）

```csharp
// 定义数值变化处理器
[NumericHandler(SceneType.Client, ENumericType.Hp0)]
public class HpChangeHandler : NumericHandlerSystem<Unit>
{
    protected override async ETTask Run(Unit self, NumericChange data)
    {
        int oldHp = data._Old;
        int newHp = data._New;
        Log.Info($"HP变化: {oldHp} -> {newHp}");
        
        // 更新UI显示
        // 播放特效
        // 等...
        
        await ETTask.CompletedTask;
    }
}
```

**NumericHandler 特性参数**：
- `SceneType` - 监听场景类型（None/All/特定场景）
- `ENumericType` - 监听的具体数值类型

#### 5.2 方式二：使用 Dynamic Handler

```csharp
// 动态数值处理器，不需要预先定义
[NumericHandlerDynamic(SceneType.Client)]
public class DynamicNumericHandler : NumericHandlerDynamicSystem
{
    protected override async ETTask Run(Entity entity, NumericChange data)
    {
        Log.Info($"数值变化: {data._NumericType} {data._Old} -> {data._New}");
        await ETTask.CompletedTask;
    }
}
```

### 6. 数值限制

系统支持配置数值的变化限制：

```csharp
// 数值限制配置
// 最小值限制
// 最大值限制
// 范围限制
// 公式限制
```

### 7. 数值公式

系统支持通过公式计算数值：

```csharp
// 计算最终属性值
var finalValue = NumericFormulaHelper.CalcNumeric(ENumericType.MaxHp0, baseValue, equipBonus, buffBonus);
```

### 8. 数值拷贝

```csharp
// 拷贝数值数据（用于快照或其他用途）
var snapshot = NumericData.Create();
numericComponent.CopyTo(snapshot);

// 从快照恢复
snapshot.CopyTo(numericComponent);
```

## 扩展方法

系统为 Unit 提供了便捷的扩展：

```csharp
public partial class Unit
{
    // 直接通过 Unit 访问数值组件
    public NumericDataComponent NumericComponent { get; }
}
```

使用示例：
```csharp
unit.NumericComponent.GetAsInt(ENumericType.Level0);
unit.NumericComponent.Change(ENumericType.Hp0, 100);
```

## 数值通知类型 (ENumericNoticeType)

| 类型 | 说明 |
|------|------|
| None | 无 |
| Notify | 通知 |
| Broadcast | 广播 |
| 等... |

## 数值标签 (ENumericTag)

| 标签 | 说明 |
|------|------|
| Base | 基础值 |
| Add | 增加值 |
| Pct | 百分比 |
| Final | 最终值 |
| 等... |

## 数值定义类型 (ENumericDefinitionType)

| 类型 | 说明 |
|------|------|
| Int | 整型 |
| Float | 浮点型 |
| Long | 长整型 |

## GM 命令支持

系统提供了 GM 命令用于调试：

```csharp
// 数值修改 GM 命令
 NumericGMChange
```

## 示例代码

### 示例1：基础数值操作

```csharp
public class PlayerComponentSystem
{
    public void InitPlayerNumeric(Player player)
    {
        var numeric = player.AddComponent<NumericDataComponent>();
        
        // 初始化基础数值
        numeric.Set(ENumericType.Level0, 1);
        numeric.Set(ENumericType.Exp0, 0);
        numeric.Set(ENumericType.Hp0, 1000);
        numeric.Set(ENumericType.MaxHp0, 1000);
        numeric.Set(ENumericType.Attack0, 100);
    }
    
    public void LevelUp(Player player, int addLevel)
    {
        var numeric = player.GetComponent<NumericDataComponent>();
        int currentLevel = numeric.GetAsInt(ENumericType.Level0);
        numeric.Change(ENumericType.Level0, addLevel);
        
        // 升级时提升最大HP
        numeric.Change(ENumericType.MaxHp0, addLevel * 100);
        
        // 恢复满血
        int maxHp = numeric.GetAsInt(ENumericType.MaxHp0);
        numeric.Set(ENumericType.Hp0, maxHp);
    }
}
```

### 示例2：数值变化监听

```csharp
// 监听HP变化
[NumericHandler(SceneType.Client, ENumericType.Hp0)]
public class HpChangeHandler : NumericHandlerSystem<Unit>
{
    protected override async ETTask Run(Unit self, NumericChange data)
    {
        int oldHp = data.GetOldAsInt();
        int newHp = data.GetAsInt();
        
        // 更新血条UI
        var uiComponent = self.GetComponent<UnitUIComponent>();
        uiComponent?.UpdateHpBar(newHp, self.GetComponent<NumericDataComponent>().GetAsInt(ENumericType.MaxHp0));
        
        // 死亡判断
        if (newHp <= 0)
        {
            await self.Kill();
        }
        
        await ETTask.CompletedTask;
    }
}

// 监听等级变化
[NumericHandler(SceneType.Client, ENumericType.Level0)]
public class LevelChangeHandler : NumericHandlerSystem<Unit>
{
    protected override async ETTask Run(Unit self, NumericChange data)
    {
        int newLevel = data.GetAsInt();
        
        // 显示升级特效
        EffectHelper.PlayLevelUpEffect(self);
        
        // 升级奖励
        await RewardHelper.GiveLevelUpReward(self, newLevel);
        
        await ETTask.CompletedTask;
    }
}
```

### 示例3：战斗数值计算

```csharp
public class DamageCalculator
{
    public long CalculateDamage(Unit attacker, Unit target)
    {
        var attackerNumeric = attacker.GetComponent<NumericDataComponent>();
        var targetNumeric = target.GetComponent<NumericDataComponent>();
        
        // 获取基础攻击和防御
        long attack = attackerNumeric.GetAsLong(ENumericType.Attack0);
        long defense = targetNumeric.GetAsLong(ENumericType.Defense0);
        
        // 计算伤害
        long baseDamage = attack - defense;
        if (baseDamage < 1) baseDamage = 1;
        
        // 暴击计算
        float critRate = attackerNumeric.GetAsFloat(ENumericType.Crit0) / 10000f;
        bool isCrit = RandomHelper.RandomFloat() < critRate;
        if (isCrit)
        {
            float critDmg = attackerNumeric.GetAsFloat(ENumericType.CritDmg0) / 10000f;
            baseDamage = (long)(baseDamage * (1 + critDmg));
        }
        
        return baseDamage;
    }
}
```

### 示例4：数值快照

```csharp
public class BattleSnapshotHelper
{
    // 创建战斗快照
    public NumericData CreateBattleSnapshot(Unit unit)
    {
        var numericComponent = unit.GetComponent<NumericDataComponent>();
        var snapshot = NumericData.Create();
        numericComponent.CopyTo(snapshot);
        return snapshot;
    }
    
    // 恢复战斗快照
    public void RestoreBattleSnapshot(Unit unit, NumericData snapshot)
    {
        var numericComponent = unit.GetComponent<NumericDataComponent>();
        snapshot.CopyTo(numericComponent);
        snapshot.Dispose();
    }
}
```

## 注意事项

1. **数值类型一致性**：一旦定义，数值类型不要随意修改 ID
2. **Handler 泛型约束**：`NumericHandlerSystem<T>` 中的 T 必须继承自 Entity
3. **异步操作**：Handler 是异步的，注意 async/await 的使用
4. **性能考虑**：高频数值变化（如移动速度）使用 `ChangeNoEvent` 减少事件分发
5. **对象池**：`NumericData` 使用对象池管理，创建后使用完需要调用 `Dispose()`
6. **数值安全**：使用 `ChangeUnCheck` 时需确保值不会越界

## 配置说明

数值相关配置通过 Luban 配置表管理：

| 配置表 | 说明 |
|--------|------|
| NumericConfigData | 数值配置 |
| NumericFormulaConfig | 数值公式配置 |
| NumericValueLimitConfig | 数值限制配置 |
| NumericValueAffectConfig | 数值影响配置 |
| NumericLocalizationConfig | 数值本地化配置 |
