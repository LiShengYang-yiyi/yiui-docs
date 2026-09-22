---
title: 7.3 MCP 拼 UI
---

# 7.3 MCP 拼 UI

> **一句话**：让 AI 拼界面的流程是「需求拆解 → **UI 拆分** → 建模块 / 建预制体 → 定 Data/Event 契约 → 改预制体 → 发布生成代码 → 编译 → 运行时点击验证」，其中 **UI 拆分必须先于 Data/Event 设计**。

**关键词**：AI 拼 UI · UIVision · ModifyUIPrefab · YIUIPublish · UI 拆分 · CDE 化 · 闭环验收

**目标**：知道这个流程为什么这么排，以及每一步用哪个工具。

## 三个核心工具

| 工具 | 做什么 |
|---|---|
| **UIVision** | **读**：把预制体的 UI 结构变成 AI 能理解的数据 |
| **ModifyUIPrefab** | **写**：按结构化指令修改预制体 |
| **YIUIPublish** | **发布**：生成 YIUI 的绑定与事件代码 |

三者构成「读 → 改 → 生成」的闭环。

## UIVision：让 AI「看见」界面

传统做法是让 AI 读 `.prefab` 的 YAML——几百行嵌套，节点关系藏在引用里。UIVision 把这件事变成结构化输出：

| 能力 | 说明 |
|---|---|
| UI 层级树构建 | 还原节点的父子关系 |
| 组件自动识别 | 节点上挂了什么控件 |
| 交互性分析 | 哪些节点是可点的（有没有 Raycaster、有没有交互组件） |
| 智能根节点解析 | 自动判断界面的根在哪 |
| CDE 预制体标记 | 标出哪些节点已参与 CDE 绑定 |
| 索引构建 | 给节点稳定索引，供后续修改定位 |

有了这些，「找按钮」就不再靠猜路径。

## 流程与顺序

```
1. 需求拆解
        ↓
2. ⭐ UI 拆分（必须先做）  Panel / View / Common 各是什么
        ↓
3. 建 UI 模块（CreateYIUIModule）
        ↓
4. 建预制体（CreateYIUIPrefab）
        ↓
5. 设计 Data / Event 契约
        ↓
6. ModifyUIPrefab 写入绑定与事件
        ↓
7. YIUIPublish 生成代码
        ↓
8. 编译（门禁 + F6）
        ↓
9. 运行时验收：点击 + 日志断言
```

**第 2 步为什么不能跳过**：Data/Event 是**按界面单元**设计的。先定界面拆成几块，才谈得上「这块需要哪些数据、有哪些事件」。顺序反了会导致返工——契约定完发现界面结构不支持。

拆分粒度是三类：

| 类型 | 含义 |
|---|---|
| Panel | 一个独立界面 |
| View | 界面内的子页面 |
| Common | 可复用的列表项 / 通用块 |

## 写预制体的方式

`ModifyUIPrefab` 接收的是**结构化操作指令**（OperationsJson）而不是自由文本，好处是：

| 好处 | 说明 |
|---|---|
| 可校验 | 指令能被解析和检查，不合法直接失败 |
| 可重放 | 同一份指令可以重复执行 |
| 不靠人眼 | 不需要 AI「凭感觉」在编辑器里点 |

写绑定和事件时走的是 DataEvent 契约——即把 [6.3](../6-yiui-ui/3-data-binding-and-event) 的三张表用结构化数据表达出来。

## 「拼好了」怎么判断

**不是「面板能打开」，而是「点击命中了预期日志」。**

| 级别 | 判据 |
|---|---|
| ❌ 不算通过 | 预制体改成功、面板能打开 |
| ✅ 才算通过 | 目标节点可点击 + 点击后命中期望的事件日志关键词 |

强制通过条件（全部满足才算过）：

1. 预制体修改、发布、编译全部成功；
2. 面板在超时前打开；
3. 目标节点满足可点击前置条件（EventSystem / GraphicRaycaster / 可交互组件 / 射线命中）；
4. **点击后命中期望的事件日志关键词**。

失败还分三级，便于定位：`F1` 编译失败、`F2` 运行时阻断（面板 / 可点击 / 点击失败）、`F3` 日志断言未命中。

> 一个实用细节：点击路径要用**全路径**（`Panel/ButtonName`）。YIUI / Unity 允许同名节点，工具会自动选第一个匹配——用短名字会点到别的地方。

## 真源

- **方案概述、问题分析、技术架构、工作流**<br>`Packages/cn.etetet.yiuimcp/Docs/AI-UI/AI拼UI技术方案.md`
- **完整流程与「UI 拆分先行」原则**<br>`Packages/cn.etetet.yiuimcp/Docs/AI-UI/AI拼UI完整开发流程.md`
- **UI 结构查询的全部能力与输出模式**<br>`Packages/cn.etetet.yiuimcp/Docs/AI-UI/UIVision功能说明.md`
- **修改预制体的操作指南**<br>`Packages/cn.etetet.yiuimcp/Docs/AI-UI/ModifyUIPrefab-AI使用指南.md`
- **闭环「通过」的定义与失败分级**<br>`Packages/cn.etetet.yiuimcp/Docs/Flows/P0-闭环验收标准.md`
- **从加按钮到「点击命中日志」的端到端实操**<br>`Packages/cn.etetet.yiuimcp/Docs/Flows/LoginTestClick测试指南.md`
- **CDE / Data 化的规范**<br>`Packages/cn.etetet.yiuimcp/Docs/AI-UI/YIUIMCP自动拼UI-Data化规范.md`

## 源码落点

- **UIVision 实现**<br>`Packages/cn.etetet.yiuimcp/Editor/`
- **发布脚本**<br>`Packages/cn.etetet.yiuimcp/Config/yiui-publish-flow-en.ps1`
- **闭环验收脚本**<br>`Packages/cn.etetet.yiuimcp/Config/p0-closed-loop-verify.ps1`
- **生成的界面代码**<br>`Packages/<包>/Scripts/HotfixView/Client/YIUISystem/`

## 读完能回答

- 为什么 UI 拆分必须在设计 Data/Event 之前？
- UIVision 解决了什么问题？
- 「界面拼好了」的判据是什么？
- 为什么点击路径要用全路径？

## 下一步

→ [7.4 行为树 YIUIBT](./4-yiuibt)
