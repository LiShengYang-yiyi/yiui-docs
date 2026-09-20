---
title: 6.1 YIUI 是什么
---

# 6.1 YIUI 是什么

> **一句话**：YIUI 是建立在 UGUI 之上的**数据驱动 UI 框架**——用 Component / Data / Event 三张表把「数据」与「具体控件」解耦，让 UI 代码只关心数据与回调。

**关键词**：YIUI · CDE · 数据驱动 UI · Component Table · Data Table · Event Table · 一对多

**目标**：理解「数据与 UI 分离」具体解决了什么麻烦，以及三张表各自的位置。

## 先说不这样写会怎样

传统 UGUI 写法的典型形态：

```
拿到 txtName 这个 Text → 调它的 API 改文字
拿到 imgIcon 这个 Image → 调它的 API 换图
拿到 btnOk 这个 Button → 注册 onClick 回调
```

问题不在麻烦，在**耦合**：

| 问题 | 后果 |
|---|---|
| 业务逻辑知道控件类型 | 换控件（Text 换 TMP）要改业务代码 |
| 一个数据要改多处 | 血量变了，头像血条、头顶血条各写一遍 |
| 逻辑与界面绑定 | 界面关闭时逻辑也没了 |

## YIUI 的做法

业务逻辑改成**只操作数据和注册回调**：

```
设置数据 Name = "xxx"        → 绑定了 Name 的文本自动更新
注册事件 OnClickOk = 处理函数 → 按钮点击时自动回调
```

至于 `Name` 最终被哪个控件消费、点击事件从哪个控件抛出，业务代码完全不关心——这就是「数据与 UI 分离」。

分离之后自然获得两个好处：

| 好处 | 说明 |
|---|---|
| **一对多** | 同一份数据可以驱动任意多个控件，业务侧不用改 |
| **可替换** | 控件换实现，业务代码不动 |

## CDE：三张表

| 表 | 全称 | 回答什么 |
|---|---|---|
| **C** | Component Table | 界面里有哪些**控件**？叫什么名字？ |
| **D** | Data Table | 有哪些**数据**？数据变化时该改控件的什么？ |
| **E** | Event Table | 有哪些**事件**？由谁触发、回调是什么？ |

三张表都在**预制体上的一个组件**里维护，配置完由工具生成代码。所以开发者做的事情是：在编辑器里配表 → 生成代码 → 在生成的手写文件里填业务逻辑。

对应的生成产物是四个文件（两个覆盖、两个不覆盖）：

| 文件 | 是否覆盖 | 用途 |
|---|---|---|
| `XxxComponentGen.cs` | 覆盖 | 控件引用与绑定声明 |
| `XxxComponent.cs` | 不覆盖 | 手写扩展代码 |
| `XxxComponentSystemGen.cs` | 覆盖 | 事件方法声明 |
| `XxxComponentSystem.cs` | 不覆盖 | **手写业务逻辑** |

**要写的东西永远只在两个「不覆盖」的文件里**，其余都是产物。

## YIUI 和 ET 的关系

| 层 | 谁 |
|---|---|
| UI 表现层 | YIUI（本阶段） |
| 逻辑与实体 | ET（前面五个阶段） |

YIUI 的 Panel / View 在 ET 眼里就是客户端表现层的实体——它们对应 `ModelView` / `HotfixView` 两层（见 [3.1](../3-code-layout/1-five-layers)）。

## 那条必须记住的边界

> **Panel / View 只负责表现与交互。**

| 禁止 | 原因 |
|---|---|
| UI 里发协议请求 | UI 不该知道协议存在 |
| UI 缓存业务数据 | 会和真实数据源漂移 |
| UI 判断协议错误码 | 统一由协议错误提示工具处理 |

正确分工：**客户端业务组件**负责缓存、请求节流、协议对接，对外提供业务 API；UI 只读数据、调 API。

这条规则的理由很实际：界面可能被关闭、被多个界面复用、被 GM 或调试入口复用——写在 UI 里的能力，这几种情况下都用不了。

## 真源

| 文件 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuiframework/README.md` | YIUI 框架包索引与文档入口 |
| `AGENTS.md`（工程根）→「ET 分层与客户端边界」 | UI 边界的权威规则 |
| ET9 · [`CDE Table`](/et9/cde-table/) | CDE 的设计目的原文（数据与 UI 分离、一对多） |
| ET9 · [`通用接入`](/et9/integration/general) | YIUI 接入的完整流程 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| YIUI 框架本体 | `Packages/cn.etetet.yiuiframework/`（`Scripts/` · `Runtime/` · `Editor/`） |
| 框架入口（空壳） | `Packages/cn.etetet.yiui/` |
| 生成器 | `Packages/cn.etetet.yiuiframework/YIUI.BindSourceGenerator.dll` |
| 界面预制体 | `Packages/<包>/Assets/GameRes/YIUI/` |
| 业务逻辑落点 | `Packages/<包>/Scripts/HotfixView/Client/YIUISystem/` |

## 读完能回答

- CDE 分别是什么？各自放在哪里？
- 「数据与 UI 分离」解决了哪些具体问题？
- 生成的四个文件里，哪些能手改？
- 为什么 UI 里不能直接调用协议？

## 下一步

→ [6.2 Panel / View 生命周期](./2-panel-lifecycle)
