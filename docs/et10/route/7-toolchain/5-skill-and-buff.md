---
title: 7.5 技能与 Buff
---

# 7.5 技能与 Buff

> **一句话**：技能与 Buff 归 `cn.etetet.yiuiskill` 一个包，单向依赖 `yiuibt` 做 Action 扩展；Buff 的五套索引与五种叠加规则是这个包的核心契约。

**关键词**：yiuiskill · Buff · 技能 · 叠加规则 · 索引 · yiuibt 扩展 · Event_YIUIBTFrame

**目标**：知道技能系统的基础层边界在哪，以及 Buff 的哪些语义是「不能改」的。

## 包的定位

| 承载 | 说明 |
|---|---|
| 技能与 Buff 的业务基础 | 组件、生命周期、配置消费 |
| 配置消费 | 技能与 Buff 的配置表读取 |
| YIUIBT 技能 Action 扩展 | 技能行为作为行为树的 Action |

## 五条固定边界

| 边界 | 含义 |
|---|---|
| **Buff 属于本包，不拆成独立包** | 技能与 Buff 的生命周期互相依赖，拆开会产生循环 |
| 数值以 `yiuinumeric` / `yiuinumericconfig` 为**唯一事实源** | 禁止复制旧 Numeric 表或数值常量（见 [5.5](../5-server-chain/5-config-and-numeric)） |
| 本包**单向依赖** `yiuibt` | 核心禁止反向引用技能、Buff、Unit、Box2D |
| 基础层必须能**独立编译运行** | 在没有**任何**技能 Action 的情况下也要能跑，禁止占位 Action 或默认成功 |
| 旧实现不得迁入 | `yiuibehave`、`BehaveComponent`、`IFrame`、Slate、旧生成代码与旧 Editor 一律不进 |

第 4 条是这套设计的关键：**基础层不假设上层存在**。有人没写任何技能 Action，就必须能在编译期发现，而不是运行时静默返回成功。

## Buff 的核心契约

### 五套索引

`BuffComponent` 同时维护五套索引：

| 索引 | 用途 |
|---|---|
| `InstanceId` | 实例身份 |
| `BuffId` | 按具体 Buff 查 |
| `BaseBuffId` | 按基础 Buff 查（含派生） |
| `Group` | 按组查（互斥组） |
| `RemoveType` | 按移除类型批量移除 |

客户端展示索引只在 `UNITY` 域维护——服务端不需要的索引不占内存。

**约束**：查询、层数汇总、创建者筛选、批量移除统一消费**索引快照**；遍历期间不得直接修改索引内部列表（会破坏遍历）。

### 五种叠加规则

| 规则 | 语义 |
|---|---|
| `Time` | 按时间叠加 / 刷新 |
| `Layer` | 按层数叠加 |
| `TimeLayer` | 时间与层数同时参与 |
| `Replace` | 替换 |
| `ReplaceLayer` | 替换并保留层数 |

加上互斥逻辑：`AllOnly`、`SelfOnly`、按 ID / 组互斥。

这些语义**保持旧功能语义不变**——迁移过去的功能不能因为重构而改变行为。

### 生命周期与效果

| 阶段 | 要求 |
|---|---|
| `Start` / `Execute` / `End` / `Remove` / `Over` | 每个都要**幂等** |
| 单个效果异常 | **只终止当前效果链**，不影响其他 Buff |
| `BaseSource` | 传入 `AddBuff` 后由 Buff 生命周期接管；成功、替换、移除、全失败路径都必须**恰好释放一次** |
| `BuffModNumericChange` | 只回滚**实际施加值一次** |
| Owner 销毁 | 只能用已缓存的 `EntityRef<Unit>`，不得遍历已释放的父实体 |

## 帧推进

技能与 Buff 的帧推进统一消费 `Event_YIUIBTFrame`：

| 规则 | 说明 |
|---|---|
| `BuffChild` 实现 `IYIUIBTFrame` | 只消费**同一 Scene** 的帧事件 |
| 不恢复旧 `IFrame` / `BehaveFrameComponent` | 旧帧机制已废弃 |
| 冷却保留旧 30 FPS 语义 | 通过 `SkillFrameHelper`，当前帧只读 `YIUIBTFrameDriverComponent.CurrentFrame` |

## 未定义的旧节点

`FiltrateBuff`、`TargetSelect`、`CreateUnitNull` 三个旧节点**保留稳定 ActionId、Schema 和 Handler**，但当前只返回带错误码的 Failure——不创建 Buff、不选 Target、不创建占位 Unit。

这是「明确未定义」而非「忘了实现」：**占位成功比明确失败危险得多**。

## 验证入口

```powershell
pwsh ./Scripts/Run-Test.ps1 -Name "SkillPackageFoundation"      # 基础层
pwsh ./Scripts/Run-Test.ps1 -Name "SkillLifecycle"              # 技能生命周期
pwsh ./Scripts/Run-Test.ps1 -Name "BuffIndexStacking"           # 索引与叠加
pwsh ./Scripts/Run-Test.ps1 -Name "BuffLifecycleEffects"        # 生命周期与效果
pwsh ./Scripts/Run-Test.ps1 -Name "SkillBuffNoActionIntegration" # 无 Action 集成
```

## 真源

- **固定边界、验证入口、Buff 契约、技能生命周期（权威）**<br>`Packages/cn.etetet.yiuiskill/AGENTS.md`
- **包能力与用法**<br>`Packages/cn.etetet.yiuiskill/README.md`
- **战斗示例包的边界说明**<br>`Packages/cn.etetet.yiuibattledemo/AGENTS.md`
- **行为树核心边界（技能是其扩展）**<br>`Packages/cn.etetet.yiuibt/AGENTS.md`
- **旧技能系统的取舍记录**<br>`docs/YIUIET10裁剪记录.md`

## 源码落点

- **技能与 Buff 实现**<br>`Packages/cn.etetet.yiuiskill/Scripts/`
- **技能 / Buff 配置**<br>`Packages/cn.etetet.yiuiskill/Luban/`
- **战斗示例**<br>`Packages/cn.etetet.yiuibattledemo/`
- **技能 Action 扩展**<br>`Packages/cn.etetet.yiuiskill/`（依赖 `yiuibt` 的 Action 声明）

## 读完能回答

- 技能与 Buff 为什么不拆成两个包？
- Buff 的五套索引分别在什么场合用？
- 为什么基础层必须在「没有任何技能 Action」时也能编译运行？
- 单个 Buff 效果出错时，为什么只终止当前效果链？

## 下一步

→ [7.6 测试闭环](./6-test-loop)
