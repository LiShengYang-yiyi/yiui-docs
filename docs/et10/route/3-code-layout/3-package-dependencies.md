---
title: 3.3 包依赖：单向 · 显式 · 无环
---

# 3.3 包依赖：单向 · 显式 · 无环

> **一句话**：包之间调用别人的类型或方法，必须在调用方 `package.json` 的 `dependencies` 里**显式声明**；分析器会在编译期校验方向，未声明报 `ET0102` / `ET0105`，成环报错。

**关键词**：包依赖 · 单向依赖 · 循环依赖 · ET0102 · ET0105 · Module analyzer · package.json

**目标**：跨包调用时知道要改哪个文件；遇到循环依赖知道往哪个方向拆。

## 三个要求

| 要求 | 含义 | 违反的后果 |
|---|---|---|
| **真实** | 只写源码里**直接引用**的包 | 写多了会把间接依赖递归展开，依赖图失去意义 |
| **显式** | 不靠传递依赖「蹭」到别人的类型 | 分析器报 `ET0102` / `ET0105` |
| **单向 · 无环** | A 依赖 B，B 就不能依赖 A | 成环后编译与热更都会出问题 |

## 声明在哪

```json
// Packages/<调用方包>/package.json
{
  "dependencies": {
    "cn.etetet.core": "1.0.0",
    "cn.etetet.yiuiframework": "3.1.4"
  }
}
```

版本号参考**被依赖包自己** `package.json` 里的 `version` 字段。

## 编译期的两个错误码

| 错误码 | 含义 |
|---|---|
| `ET0102` | 包调用了未声明依赖包的**方法** |
| `ET0105` | 包访问了未声明依赖包的**类型** |

**这类错误不是代码写错，是依赖没声明**——要改的是 `package.json`，不是 `.cs` 文件。完整排查步骤见 [1.3 日志与排障](../1-run-it/3-logs-and-troubleshooting) 与 `docs/ET分析器修复建议.md`。

## 一个真实的分层案例

工程里的地图相关包是一条清晰的单向链，可以直接当范本记：

```
transfer      传送业务
   ↓
mapplay       地图玩法层（Unit 组装、地图内玩法编排）
   ↓
map           地图基础（广播、基础组件、基础配置）
   ↓
move          移动（依赖 map，map 不反向依赖 move）
```

各自 `AGENTS.md` 里写死的约束：

| 包 | 约束 |
|---|---|
| `map` | 不能反向依赖 `move`；不依赖 `mapplay` / `spell` / `item` / `quest` |
| `move` | 直接依赖只有 `core` / `login` / `map` / `numeric` / `proto` / `recast` / `unit` |
| `mapplay` | 不直接依赖 `transfer`；传送业务需要玩法组装时由 `transfer` 依赖本包 |
| `transfer` | 可以依赖 `mapplay`；Gate 的 `C2G_EnterMapHandler` **不在本包**，属于 `login` |

这套约束的用意是：**高层可以依赖低层，低层永远不知道高层的存在**。这样删掉一个玩法包，编译期就会立刻暴露出所有该断的引用，而不是运行时崩。

## 遇到循环依赖怎么办

| 手法 | 适用情况 |
|---|---|
| 把共有部分下沉到更低的包 | 两边都需要的类型/逻辑 |
| 用消息 / 事件解耦 | 只需要「通知」，不需要直接调用 |
| 重新审视是否真的是两向依赖 | 多数循环是临时凑合出来的 |

不要用「新建一个包专门放公共部分」来绕过——它会继续吸依赖，最后变成谁都依赖、谁都不敢改的巨型包。

> ⚠️ **本工程的一个已知事实**：`package.json` 的 `dependencies` 对部分 ET 包**不完整**（真实依赖写在 `.asmdef` / `.asmref` 里）。所以**依赖图不能只读 `package.json`**，涉及依赖方向判断时要一起看程序集引用。

## 真源

| 文件 | 内容 |
|---|---|
| `docs/ET分析器修复建议.md` | `ET0105` 的成因、修复与快速排查 |
| `Packages/cn.etetet.harness/skills/et-code/SKILL.md` | 包依赖、程序集、Module analyzer 的处理入口 |
| `Packages/cn.etetet.harness/skills/et-code/references/et-code-rules.md` | 包落点、ECS 边界、组件契约、analyzer 细节 |
| `Packages/cn.etetet.{map,move,mapplay,transfer}/AGENTS.md` | 真实依赖约束（最好的范本） |
| `Packages/cn.etetet.sourcegenerator/AGENTS.md` | 分析器与诊断规则的维护位置 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 某包的依赖声明 | `Packages/<包>/package.json` |
| 分析器诊断定义 | `Packages/cn.etetet.sourcegenerator/Config/DiagnosticIds.cs` |
| 分析器规则 | `Packages/cn.etetet.sourcegenerator/Config/DiagnosticRules.cs` |
| 主包与编译包列表 | `MainPackage.txt`（自动生成） |

## 读完能回答

- 跨包调用别人的类型，编译报 `ET0105`，改哪个文件？
- `dependencies` 里为什么要写「直接依赖」而不是「把它需要的一起写上」？
- `map` 和 `move` 谁依赖谁？为什么不能反过来？
- 判断依赖方向时，只读 `package.json` 够不够？

## 下一步

→ [3.4 新增一个功能的完整落点](./4-where-to-put-new-code)
