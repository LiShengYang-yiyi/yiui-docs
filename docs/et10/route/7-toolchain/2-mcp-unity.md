---
title: 7.2 MCP 让 AI 操作 Unity
---

# 7.2 MCP 让 AI 操作 Unity

> **一句话**：YIUIMCP 分三块——Editor 侧的**原子工具**、Node.js 的**编排层 UTO**、PowerShell 的**脚本入口**——AI 走编排层，不直接碰 Unity API。

**关键词**：YIUIMCP · UTO · 原子工具 · 编排层 · 域重载 · 脚本优先

**目标**：理解三层各自解决什么问题，以及为什么不能让 AI 直接调 Unity。

## 三块结构

| 层 | 位置 | 职责 |
|---|---|---|
| **Editor / UnityMCP** | `Editor/UnityMCP` | Unity 编辑器内的**原子工具**实现 |
| **UTO** | `UTO` | Node.js 编排层：HTTP 调用、批量执行、**等待 Domain Reload 恢复** |
| **Config** | `Config` | 实际执行的 PowerShell 脚本入口 |

「原子工具」的意思是：每个工具只做一件事，参数尽量少。复杂的流程由编排层组合原子工具完成。

## 为什么要有一层编排

Unity 编辑器有个绕不开的特性：**Domain Reload**——代码重新编译时，编辑器会卸载并重建域，正在执行的调用会被打断。

如果 AI 直接调 Unity：

| 问题 | 后果 |
|---|---|
| 编译触发域重载 | 调用链断掉，AI 不知道要等 |
| Unity API 必须在主线程 | 非主线程调用直接失败 |
| 编辑器状态有前置条件 | Play / Edit 模式行为不同 |

编排层把这些都吸收了：**发起调用 → 等待恢复 → 取结果**，对上只暴露「调用工具、拿返回值」。

## 调用链路与入口

```
AI / CLI
   ↓  脚本优先
Config/*.ps1（PowerShell 入口）
   ↓
UTO（HTTP、批量、等域重载）
   ↓
UnityMCP 原子工具（Editor 内）
```

已有的脚本入口覆盖几类典型流程：

| 场景 | 入口 |
|---|---|
| 单工具调用 | `Config/` 下的单项脚本 |
| 编译闭环 | `compile-unity-flow.ps1` |
| UI 预制体修改 | `ModifyUIPrefab` 相关脚本 |
| YIUI 发布（生成代码） | `yiui-publish-flow-en.ps1` |
| 闭环验收 | `p0-closed-loop-verify.ps1` |

**脚本优先**：日常操作走现成脚本，不要自己拼 HTTP。直接调 HTTP 只在两类场景用——脚本不好覆盖的临时排障、以及需要精确控制调用顺序的编排。

## 扩展一个原子工具

新增工具时放在**能力所属包的 `Editor` 目录**，通过 `asmref` 汇入、用宏和注册特性被发现。

| 约束 | 原因 |
|---|---|
| 不新建无职责的适配包 | 会变成谁都依赖的垃圾层 |
| 不回写 `cn.etetet.yiuimcp` | 核心包不承载业务能力 |
| 统一返回结构 | 编排层要能一致地解析结果 |
| 参数最少、职责单一 | 组合由编排层做 |

## ⚠️ 异步编程的三条禁令

在 Unity 环境里写异步有特殊约束，违反会**卡死**而不是报错：

| 禁止 | 原因 |
|---|---|
| `Task.Delay()` | 会卡死——它不回到 Unity 的主线程循环 |
| `TaskScheduler.FromCurrentSynchronizationContext()` | 与 Unity 的同步上下文冲突 |
| 在非主线程调用 Unity API | Unity API 只在主线程可用 |

需要延迟时用 Unity 侧能驱动的方式（协程 / 编辑器更新回调），不要用 `Task` 系。

## 真源

- **包的整体结构与文档索引**<br>`Packages/cn.etetet.yiuimcp/README.md`
- **文档总索引与推荐阅读顺序**<br>`Packages/cn.etetet.yiuimcp/Docs/README.md`
- **角色划分、调用链路、端口规则、工具面清单**<br>`Packages/cn.etetet.yiuimcp/Docs/Architecture/UTO与UnityMCP协作手册.md`
- **端点、批量调用、推荐用法**<br>`Packages/cn.etetet.yiuimcp/Docs/Architecture/UTO-HTTP调用说明.md`
- **新增工具的核心概念与模板**<br>`Packages/cn.etetet.yiuimcp/Docs/Guides/扩展Unity原子工具.md`
- **异步禁令、推荐模式、审查清单**<br>`Packages/cn.etetet.yiuimcp/Docs/Guides/UnityMCP异步编程指南.md`

## 源码落点

- **原子工具实现**<br>`Packages/cn.etetet.yiuimcp/Editor/UnityMCP/`
- **编排层**<br>`Packages/cn.etetet.yiuimcp/UTO/`
- **执行脚本入口**<br>`Packages/cn.etetet.yiuimcp/Config/*.ps1`
- **YIUI 侧的 MCP 工具**<br>`Packages/<能力包>/Editor/`（按 `[YIUIMCPTools]` 发现）

## 读完能回答

- MCP 三层各负责什么？为什么需要编排层？
- 什么是 Domain Reload？它对调用链有什么影响？
- 日常操作应该走脚本还是直接调 HTTP？
- Unity 侧写异步时哪三种写法会卡死？

## 下一步

→ [7.3 MCP 拼 UI](./3-mcp-ai-ui)
