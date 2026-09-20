---
title: 7.6 测试闭环
---

# 7.6 测试闭环

> **一句话**：这个工程的「测试通过」有两层含义——**服务端测试**跑 `Run-Test.ps1`，**UI 闭环验收**要求「点击命中预期日志」；`[Test]` 特性自动发现，每个用例都在全新的服务器环境里跑。

**关键词**：测试 · TDD · Run-Test · Run-UnityTest · ATestHandler · 闭环验收 · 失败分级

**目标**：会跑测试、知道怎么定位失败、理解「通过」的判据为什么这么定。

## 两个测试体系

| 体系 | 入口 | 测什么 |
|---|---|---|
| 服务端测试 | `pwsh ./Scripts/Run-Test.ps1` | 逻辑正确性，基于 `ConsoleMode.Test` |
| Unity 测试 | `pwsh ./Scripts/Run-UnityTest.ps1` | 依赖 Unity 编辑器的部分 |
| UI 闭环验收 | `Config/p0-closed-loop-verify.ps1` | 「界面改完到底能不能点」 |

服务端测试也可以直接跑：

```powershell
"Test --Name=Actorlocation_.*" | dotnet ./Bin/ET.App.dll --SceneName=Test
```

### 测试包的机制

| 组件 | 作用 |
|---|---|
| `[Test]` 特性 | 自动发现，不需要手动注册 |
| `TestDispatcher` | 按**包名**与**用例名**的正则筛选 |
| `ATestHandler` | 测试基类，约定 `Handle(...)` 接口 |
| `FiberInit_TestCase` | 每个用例**都是全新的服务器环境** |

最后一条很重要：**隔离到 Fiber 级别**。上一个用例残留的状态不会影响下一个——这让「单独跑过、批量跑炸」这类问题基本消失。

筛选也是显式的：`Run-Test.ps1 -Name "..."` 支持正则，可以按包跑、按单个用例跑。

## TDD 闭环

工程的测试规范走一个完整循环：

```
需求
  ↓  et-design 出测试方案
测试用例（先写）
  ↓  et-test-write
实现
  ↓  et-code
编译（门禁 + dotnet build）
  ↓  et-build
运行
  ↓  et-test-run
回归
```

三个 skill 分工很明确，**按需加载、不要一次全读**：

| skill | 用在 |
|---|---|
| `et-tdd` | 测试驱动开发 / 修 Bug 的完整闭环 |
| `et-test-write` | 写新用例、改用例、补最小验证清单 |
| `et-test-run` | 执行测试、看日志、分析失败、跑回归 |

## UI 闭环验收

拼 UI 的「通过」定义比一般测试严，因为**面板能打开不代表链路通**：

| 级别 | 判据 |
|---|---|
| ❌ 不算通过 | 预制体改成功、发布成功、编译成功、面板能打开 |
| ✅ 才算通过 | 目标节点**可点击** + 点击后**命中期望的事件日志关键词** |

四个强制条件（全部满足）：

1. 预制体修改、发布、编译全部成功；
2. 面板在超时前打开；
3. 目标节点满足可点击前置条件（EventSystem / GraphicRaycaster / 可交互组件 / 射线命中）；
4. 点击后命中期望的日志关键词。

失败分三级，用于快速定位：

| 级别 | 含义 |
|---|---|
| `F1` | 阻断：编译失败 / 断言工具失败 |
| `F2` | 运行时阻断：面板打开失败 / 可点击断言失败 / 点击失败 |
| `F3` | 验收阻断：日志断言未命中 |

**为什么要加日志断言**：前三级（改、发、编译、打开）都只验证了「没有崩」，只有点击命中日志才证明**事件真的接通了**。

## 两个实用细节

| 细节 | 原因 |
|---|---|
| 点击路径用**全路径**（`Panel/ButtonName`） | YIUI / Unity 允许同名节点，工具自动选第一个匹配 |
| 日志断言用**业务唯一关键词** | 避免误匹配历史日志 |

## 回归入口（示例）

各包都会在自己的 `AGENTS.md` 里写回归测试名。例如 YIUIBT 的：

```powershell
pwsh ./Scripts/Run-Test.ps1 -Name "YIUIBT_ImmediateRestart"
pwsh ./Scripts/Run-Test.ps1 -Name "YIUIBT_WaitUntilStopped"
```

**改完代码先看目标包的 `AGENTS.md` 有没有规定回归入口**——这比自己想该测什么可靠。

## 真源

| 文件 | 内容 |
|---|---|
| `Packages/cn.etetet.test/AGENTS.md` | 测试包机制、核心类、三个测试 skill 的分流 |
| `Packages/cn.etetet.test/skills/et-tdd/SKILL.md` | TDD 完整流程 |
| `Packages/cn.etetet.test/skills/et-test-write/SKILL.md` | 编写测试用例 |
| `Packages/cn.etetet.test/skills/et-test-run/SKILL.md` | 执行与失败分析 |
| `Packages/cn.etetet.harness/skills/et-build/SKILL.md` | 编译与测试入口 |
| `Packages/cn.etetet.yiuimcp/Docs/Flows/P0-闭环验收标准.md` | UI 闭环的强制条件与失败分级 |
| `AGENTS.md`（工程根） | 测试入口与强制编译门禁 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 测试执行入口 | `Scripts/Run-Test.ps1` · `Scripts/Run-UnityTest.ps1` |
| 测试框架 | `Packages/cn.etetet.test/Scripts/` |
| 用例隔离机制 | `Packages/cn.etetet.test/Scripts/` 下的 `FiberInit_TestCase` |
| 实际用例示例 | 各包 `Scripts/Hotfix/Test/` 与 `Scripts/{Model,Hotfix}/Test/` |
| UI 闭环脚本 | `Packages/cn.etetet.yiuimcp/Config/p0-closed-loop-verify.ps1` |

## 读完能回答

- 服务端测试和 Unity 测试分别怎么跑？
- 为什么每个测试用例都在全新的服务器环境里跑？
- UI 改动「通过」的判据是什么？为什么面板能打开不算？
- 失败分级 `F1` / `F2` / `F3` 分别对应什么？
- 改完代码该跑哪些回归？去哪找？

## 下一步

整条路线到此结束。回到 [路线总览](../) 看整体结构，或去「参考」区按包检索。
