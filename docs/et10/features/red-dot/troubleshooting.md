---
title: 红点排查
---

# 红点排查

> 红点链路是多段组成的，任何一段断掉都可能表现成「没看到红点」。排查必须按固定顺序逐层确认，不能靠猜。

**关键词**：红点排查 · 五步链路 · GetRedDotDebugInfo · SetRedDotCount · RedDotStackHelper · UTO

## 1 完整链路

一条红点要真正被看到，至少要经过 5 步：

1. 定义红点 key
2. 配置 key 在红点树中的父子关系
3. UI 节点绑定这个红点 key
4. 业务逻辑正确设置该 key 的值
5. 运行时确认第 4 步到底有没有生效

缺一不可。

核心原则先写死：

- **不能因为「我没看到效果」就直接认定逻辑层没生效**
- 「肉眼没看到」不能推出「逻辑层没执行」

## 2 标准排查顺序

按这个顺序做，不要乱跳：

1. `ERedDotKeyType` 里是否存在正确 key
2. `RedDotKeyAsset` 是否有对应描述
3. `RedDotConfigAsset` 是否正确接入父子链路
4. UI 预制体 / 动态节点是否绑定该 key
5. 先尝试手动设置测试值，观察 UI 是否有变化
6. 第 5 步通过 → 再检查业务逻辑是否正确设置实际 count
7. 第 5 步不通过 → 优先回头查前 3 步与 UI 绑定，不要先怀疑业务逻辑

各步要确认的内容：

| 步 | 确认什么 |
|---|---|
| 1 | 业务代码用的 key 是否真的存在、枚举值和描述是否对应、有没有写错 id 或拿错兄弟节点 key |
| 2 | 描述是否补齐（缺失只影响编辑器和调试显示，不影响运行） |
| 3 | 当前 key 是否有配置、父节点是否配置正确、是否被接入目标红点链路、`SwitchTips` 是否符合预期 |
| 4 | 对应预制体或界面节点是否挂了红点绑定组件、绑的是不是当前这个 key、动态绑定有没有真的执行 `ChangeBind`、绑定节点是不是肉眼观察的那个入口 |
| 5 | 见下节 |

第 1 步错了，后面全都不用看。

第 4 步必须和「逻辑层是否生效」分开判断——这一步缺失时，逻辑层可能已经设置成功、调试面板里也能看到 count，但 UI 上依然什么都没有。

## 3 手动设值：切开两类问题

红点调试能力不只是「查看当前值」，**也可以给某个 key 手动设置值**。

这个能力的作用是把「逻辑赋值问题」和「配置 / 绑定问题」硬切开。

| 手动设值后 | 结论 |
|---|---|
| UI 立刻出现正确变化 | key 本身存在、config 链路基本通、UI 绑定也基本正常 → 此时再去查第 4 步为什么没把值正确设进去 |
| UI 仍然完全看不到变化 | 问题大概率在前 3 步（key 不对 / config 没接进链路 / UI 没绑定或绑错节点）→ **先不要查业务逻辑赋值** |

## 4 MCP 原子操作

红点已接入 2 个 MCP 原子操作，AI 可以直接读取运行时状态，也可以直接手动设置红点数量。

| 工具 | 用途 |
|---|---|
| `GetRedDotDebugInfo` | 读取某个 key 的当前运行时真相 |
| `SetRedDotCount` | 给某个 key 人工注入测试值 |

### GetRedDotDebugInfo 返回的信息

基础模式至少返回：

`key` · `desc` · `exists` · `count` · `realCount` · `tips` · `switchTips` · `parentKeys` · `childKeys` · `parentCount` · `childCount` · `stackCount`

完整模式还会追加 `stacks`，每条包含 `id` · `time` · `os` · `source` · `content`。

关键字段：

| 字段 | 含义 |
|---|---|
| `count` | 当前真正会显示出来的数量 |
| `realCount` | 不受 tips 开关影响的真实数量 |
| `tips` | 当前是否允许显示 |
| `stacks` | 谁改的、改成多少、从哪条调用链改的 |

返回的是 **JSON 字符串**，不是面向人工排版的说明文本——更适合 AI 稳定解析与后续自动化判断。

### SetRedDotCount 的实际意义

不只是「改个值看看」。它在排查里的真正作用是：

1. 验证前 3 步链路是否通
2. 验证这个 key 会不会被后续业务逻辑重新覆盖

AI 排查时可以先绕开第 4 步，直接验证「这个 key 能不能通过红点系统链路传到目标 UI」。如果连手动设值都传不过去，继续盯业务逻辑就是方向错了。

## 5 四种典型判定

| 情况 | 说明与下一步 |
|---|---|
| `SetRedDotCount` 后 UI 立刻亮起且值保持 | 前 3 步大概率没问题，当前也没有业务逻辑立刻把它覆盖掉 |
| 设值后运行时一度变成目标值，随后又被改回去 | 设值本身成功了，前 3 步大概率也是通的，**真正的问题是后续业务逻辑把它重新刷掉了**。优先看 `GetRedDotDebugInfo` 的 `stacks`，确认最后一次覆盖是谁干的 |
| 设值后运行时值根本没有变化 | 优先怀疑 key 不对、节点不可直接设值、或管理器状态不对。**不要先下结论说 UI 没绑定** |
| 运行时值变了，但 UI 没变化 | 优先查前 3 步，尤其查 config 是否接树、UI 是否真的绑定这个 key、当前看的 UI 节点是不是目标节点 |

## 6 排查必须给出的三类结论

| 层 | 结论内容 |
|---|---|
| 配置层 | key 是否存在、config 是否接入 |
| 表现层 | UI 是否绑定、绑定的是不是正确 key |
| 运行时逻辑 | 调试面板里是否能看到该 key、当前 count 是多少、父链路聚合是否正确、手动设值后 UI 是否能正确响应、如果手动设值后又被改回去，最后一次覆盖它的是谁 |

缺少第 3 类，就不能轻易下结论说「逻辑没生效」。

## 7 UTO 链路的边界

红点 MCP 不是直接裸调 Unity MCP 端口，走统一转发：

1. 调用 `invoke-uto-tool.ps1`
2. 启动 `UTO HTTP Server`
3. 由 `UTO` 转发到 Unity MCP
4. Unity MCP 执行红点原子操作并返回结果

**「已经能通过 UTO 调到工具」不等于「Unity 业务逻辑正确」。** UTO 打通只代表工具注册链路是通的、AI 已经能拿到运行时红点真相。后面真正要判断的仍然是：当前 key 的状态到底是什么、是谁最后改了它、是手动测试值生效了还是又被业务逻辑覆盖了。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuireddot/Desc/08-红点排查与验证机制.md` | 五步链路、标准顺序、MCP 判定口径 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 调试面板预制体 | `Packages/cn.etetet.yiuireddot/Assets/GameRes/YIUI/RedDot/Prefabs/RedDotPanel.prefab` |
| 调试数据项 | `Packages/cn.etetet.yiuireddot/Assets/GameRes/YIUI/RedDot/Prefabs/RedDotDataItem.prefab` |
| 红点栈与堆栈信息 | `Packages/cn.etetet.yiuireddot/Runtime/Data/RedDotStack.cs` · `RedDotStackHelper.cs` |
| 值被谁改过 | `Packages/cn.etetet.yiuireddot/Scripts/HotfixView/Client/System/RedDotChangeCacheComponentSystem.cs` |

## 下一步

→ [新增红点](./ai-workflow)
