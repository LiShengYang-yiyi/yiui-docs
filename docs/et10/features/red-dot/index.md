---
title: 红点
---

# 红点

> 红点系统是业务结果的**承载与聚合**系统：业务层算出「哪里有内容」，红点系统按固定树结构聚合与显示。

**关键词**：红点 · RedDot · ERedDotKeyType · 红点树 · 父子聚合 · 稳定层级 · SwitchTips

## 1 系统定位

红点系统管：

- 红点 key
- 父子聚合关系
- 当前数量 / 是否显示
- 提示开关（`SwitchTips`）

红点系统不管：

- 业务规则本身（某条任务是否可领取）
- 动态对象的生命周期
- 某个系统「为什么应该亮」

一句话：**红点只消费业务状态，不发明业务状态。**

## 2 三份资源的分工

| 资源 | 路径 | 存什么 |
|---|---|---|
| `ERedDotKeyType` | `Scripts/Model/Share/ERedDotKeyType.cs` | 全部 red dot key 常量 |
| `RedDotKeyAsset` | `Assets/GameRes/RedDot/RedDotKeyAsset.asset` | `key → 描述` |
| `RedDotConfigAsset` | `Assets/GameRes/RedDot/RedDotConfigAsset.asset` | `key → ParentList`、`SwitchTips` |

三者的边界：

- `ERedDotKeyType` 是**运行时 key 的唯一来源**（运行时反射读取）。新增 key 不改这里，就等于运行时没有这个红点。
- `RedDotKeyAsset` 只供编辑器与调试界面显示。不补它，编辑器和调试显示会不完整，但不影响运行。
- `RedDotConfigAsset` 决定「谁挂在谁下面」，不负责「什么时候亮」。

新增 key 时这三处必须同步。

## 3 Key 与 ID 编码规则

红点 key 的 id 不走简单递增，走**分段层级编码**。

| 层级 | 格式 | 示例 |
|---|---|---|
| 根节点 | 固定 `1` | `1` |
| 第二级 | `1` + 3 位 | `1001` 系统A · `1002` 系统B · `1003` 系统C |
| 第三级 | 二级 key + 2 位 | `100101` 系统A_功能1 · `100201` 系统B_功能1 |
| 第四级及以后 | 父 key + 2 位 | `10010201` 系统A_功能2_子项1 |

含义：

- 二级这一层预留 999 个系统
- 每个节点下面默认再预留 99 个直接子节点
- 每一层都按这个规则继续扩

这样做是为了：一眼看出层级归属、每层留足扩展空间、编辑器下拉能按层级自动分段显示。

描述命名规则：

- 二级可以直接写系统名（`系统A`）
- **三级及以后必须带完整父级前缀**（`系统A_功能1`，不是 `功能1`）

不允许：

- 回退到 `11` / `12` / `13` 这种短 ID
- 跨层偷号
- 把两个不同父级下的同义节点混用一个 key
- 写没有父级前缀的三级及以后描述

## 4 红点树：key 声明到哪一层

**key 只能声明到稳定层级，不能声明到动态未知层级。**

| 可以声明固定 key | 不能声明固定 key |
|---|---|
| `主界面` · `任务` · `任务_主线` | 某一条具体任务 |
| `菜单` · `菜单_邮件` | 某一封具体邮件 · 某一条具体公告 |
| `伙伴` · `伙伴_新伙伴` | 某一个具体伙伴实例项 |

不能声明的原因不是「麻烦」，是模型本身错：数量未知、生命周期不稳定、会让红点树变成业务对象的镜像数据库。

红点树里的「叶子节点」指**稳定的、可声明 key 的最末层聚合节点**，与业务里的「最终具体对象」不是一回事。

动态末级对象的红点有两种落地方式：

- 表现层根据该对象自己的业务状态显示（如列表项小红点）
- 运行时动态挂载（见 [红点 UI 绑定](./binding)）

## 5 职责边界

**业务数据层**

监听业务状态变化，计算当前红点数量或是否显示，把结果赋值给固定 key。

**红点系统**

承接 key、维护父子聚合关系、存储当前数量或开关结果、对外提供统一显示结果。

不负责遍历业务数据得出「应该亮几个」。

**表现层（UI）**

读取某个 key 当前是否显示，把红点挂到具体按钮、列表项、入口图标上，在创建具体预制体时表现「这条动态对象是否显示红点」。

不负责重新计算业务红点数量、不在打开界面时临时决定父级数量、不维护业务红点缓存、不倒推修改红点数据层。

以任务系统为例。

**正确链路**：

1. 任务数据层感知任务状态变化
2. 重新计算「当前可领取的主线任务数量」
3. 调用红点赋值给 `任务_主线`
4. `任务` 与 `主界面` 由红点树自动聚合
5. UI 打开时只读取并显示

**错误链路**：打开任务 UI → 遍历当前刷出几个任务 item → 用 UI 当前数据临时算红点 → 顺手把父级也改掉。

错误链路的问题：UI 没开时状态不完整、列表没刷全时结果不可信、数据层与表现层彻底耦死。

## 6 SwitchTips

| 值 | 含义 |
|---|---|
| `true` | 玩家可以手动开关提示 |
| `false` | 不可关闭，永久提示 |

不要乱用 `false`。只有业务上明确要求「这个红点不允许用户关闭」时才这么配。

## 7 新增一条红点的最小改动集

新增 key 时至少同时修改这 3 处，只改其中 1~2 处通常是半残状态：

1. `Scripts/Model/Share/ERedDotKeyType.cs`
2. `Assets/GameRes/RedDot/RedDotKeyAsset.asset`
3. `Assets/GameRes/RedDot/RedDotConfigAsset.asset`

如果改了 `.cs`，必须走 Unity 编译门禁验证，不能用 `dotnet build` 替代。

完整的判断流程见 [新增红点](./ai-workflow)。

## 真源

- **系统目标与资源分工**<br>`Packages/cn.etetet.yiuireddot/Desc/01-红点系统总览.md`
- **编码规则与描述命名规则**<br>`Packages/cn.etetet.yiuireddot/Desc/02-红点Key与ID规则.md`
- **只改配置的边界、叶子与聚合原则**<br>`Packages/cn.etetet.yiuireddot/Desc/04-红点配置边界与落地原则.md`
- **职责划分与任务系统示例**<br>`Packages/cn.etetet.yiuireddot/Desc/05-红点基础规则与职责边界.md`

## 源码落点

- **key 定义（工具生成，勿手改）**<br>`Packages/cn.etetet.yiuireddot/Scripts/Model/Share/ERedDotKeyType.cs`
- **事件定义**<br>`Packages/cn.etetet.yiuireddot/Scripts/Model/Share/RedDotEventType.cs`
- **红点管理器**<br>`Packages/cn.etetet.yiuireddot/Runtime/Mgr/RedDotMgr*.cs`
- **绑定组件**<br>`Packages/cn.etetet.yiuireddot/Runtime/Bind/*.cs`
- **运行时数据与堆栈**<br>`Packages/cn.etetet.yiuireddot/Runtime/Data/*.cs`
- **三个配置资源**<br>`Packages/cn.etetet.yiuireddot/Assets/GameRes/RedDot/*.asset`

## 下一步

→ [红点 UI 绑定](./binding)
