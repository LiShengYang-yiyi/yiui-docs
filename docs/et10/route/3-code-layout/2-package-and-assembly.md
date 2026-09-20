---
title: 3.2 Package 与程序集
---

# 3.2 Package 与程序集

> **一句话**：每个 ET 包就是标准 Unity Package，顶层放一个 `Ignore` asmdef 让它**默认不生效**，再由 F6 流程生成 `AssemblyReference.asmref`，把包内目录按约定汇入 `ET.Model` / `ET.Hotfix` 等程序集。

**关键词**：Package · asmdef · asmref · CodeMode · packagegit.json · DotNet~

**目标**：新建一个包、或在一个已有包里新增目录时，知道要配套哪些文件。

## 包的基本形态

| 项 | 约定 |
|---|---|
| 命名 | `cn.etetet.<包名>` |
| 位置 | 永远在 `Packages/` 下 |
| 本质 | 标准 Unity Package（npm 包格式），通过 GitHub Package 托管 |
| 元信息 | `package.json`（版本、依赖、`description`）+ `packagegit.json`（包 Id、git 依赖） |

## 包内特殊目录

| 目录 | 放什么 | 谁来处理 |
|---|---|---|
| `Scripts/` | `Model` / `ModelView` / `Hotfix` / `HotfixView`，可热更 | F6 生成 asmref 汇入对应程序集 |
| `Runtime/` | AOT 代码，自带 asmdef，独立程序集（命名如 `ET.Core`） | Unity 直接编译 |
| `CodeMode/` | 按 `Server` / `Client` / `ClientServer` 分目录的代码 | F6 按当前 CodeMode 选取 |
| `Proto/` | `.proto` 消息定义 | Proto2CS 导出 |
| `Excel/` | 配置表源文件 | ExcelExporter 导出 |
| `Editor/` | 编辑器代码（命名如 `ET.Core.Editor`） | 无条件汇入 `ET.Editor` |
| `DotNet~/` | 仅 .NET 的工程与代码（`~` 让 Unity 忽略它） | `dotnet build` |

`Scripts/` 与 `CodeMode/` 的区别，`Book/8.1` 说得最清楚：

- `Scripts/` 下用 `Server` / `Client` / `Share` 表示**在哪些端生效**（`Share` = 双端都用）；
- `CodeMode/` 下用 `Server` / `Client` / `ClientServer` 表示**只在对应编辑器模式下参与编译**——`ClientServer` 不等于 `Share`。

## asmdef 与 asmref：包默认不生效

这是 ET 包结构里最容易被忽略、也最关键的一点：

| 文件 | 作用 |
|---|---|
| 包顶层 `Ignore.ET.<Name>.asmdef` | **默认屏蔽**——包下载下来不会立刻生效 |
| 各目录的 `AssemblyReference.asmref` | 把该目录**汇入**某个既有程序集（如 `{"reference": "ET.Model"}`） |

流程是：F6 读 `MainPackage.txt` → **删掉所有包里旧的 asmref** → 按 `CodeMode` 和约定的合法路径**重新生成** asmref → 编译。

推论有三条：

1. **不要手写 asmref**——下一次 F6 会把它删掉；
2. **包不在 `MainPackage.txt` 里就不会生成 asmref**，它的类型在别的包里就是「找不到」，这是 `CS0246` 最常见的根因；
3. `Editor` 目录**所有人都无条件保留**，不受 `MainPackage.txt` 影响。

## 禁止手动修改的东西

| 文件 | 谁生成 |
|---|---|
| `AssemblyReference.asmref` | F6 的 CodeMode 流程 |
| `MainPackage.txt` | `MainPackageSelector`（由主包 `package.json` 推导，**不递归**） |
| `.meta` | Unity 编辑器 |
| `.csproj` | Unity / 编辑器刷新生成 |
| `Ignore.*.asmdef` | 包模板 |

移动 `.cs` 文件时必须**连同 `.meta` 一起移动**，否则 GUID 变化会让引用丢失。

## 真源

| 文件 | 内容 |
|---|---|
| `Book/8.1ET Package制作指南.md` | 包目录规范、asmdef/asmref 机制、付费包制作（**最完整**） |
| `Book/8.2ET Package目录.md` | 官方包清单与一句话描述 |
| `docs/F6编译流程说明.md` | asmref 生成规则、合法路径集合、MainPackage.txt 维护 |
| `Packages/cn.etetet.harness/skills/et-code/SKILL.md` | 文件落点、`.meta` 处理、程序集检查 |
| `Packages/cn.etetet.harness/skills/et-code/references/et-code-rules.md` | 包层级与文件放置细则 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| asmref 生成逻辑 | `Packages/com.etetet.init/DotNet~/CodeModeChangeHelper.cs` |
| 主包 → MainPackage.txt 推导 | `Packages/com.etetet.init/Editor/MainPackageSelector.cs` |
| F6 入口编排 | `Packages/cn.etetet.loader/Scripts/Editor/Share/AssemblyTool.cs` |
| 包元信息样例 | `Packages/cn.etetet.core/packagegit.json` |

## 读完能回答

- 一个包下载下来为什么「默认不生效」？靠什么控制？
- 手写 `AssemblyReference.asmref` 会怎样？
- `Scripts/Client` 和 `CodeMode/Client` 有什么区别？
- 移动一个 `.cs` 文件时还必须做什么？

## 下一步

→ [3.3 包依赖：单向 · 显式 · 无环](./3-package-dependencies)
