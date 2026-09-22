---
title: 7.1 编译门禁与 F6 流程
---

# 7.1 编译门禁与 F6 流程

> **一句话**：改任何 `.cs` 文件后**必须立即**跑编译门禁脚本，失败就修，直到零错误；Unity 内的热更程序集则走 F6，而 F6 的输入是 `MainPackage.txt`。

**关键词**：强制编译门禁 · compile-unity-flow · F6 · Compile Finish · 零错误

**目标**：知道改动代码后的标准动作是什么，以及两道编译各自管什么。

## 两道编译，各管一段

| 编译 | 命令 / 入口 | 管什么 |
|---|---|---|
| 服务端 + 分析器 | `dotnet build ET.sln` | 服务端代码、包依赖与分层校验 |
| 热更程序集 | **F6**（Unity 菜单 `ET/Scripts/Compile`） | `Model` / `ModelView` / `Hotfix` / `HotfixView` → DLL |
| 强制门禁 | `compile-unity-flow.ps1` | Unity 侧编译验证（**改代码后必跑**） |

三者的关系：`dotnet build` 是完整编译与静态校验；F6 产出运行时热更 DLL；门禁脚本是**改代码后的固定动作**。

## 强制编译门禁

> **每次修改任何 `.cs` 文件后，必须立即执行编译验证。**

```powershell
powershell -ExecutionPolicy Bypass -Command "& '<工程根>\Packages\cn.etetet.yiuimcp\Config\compile-unity-flow.ps1' -Force 0"
```

| 规则 | 说明 |
|---|---|
| 参数 | `-Force 0`（默认）；确有需要才用 `-Force 1` |
| 执行方式 | **直接执行**，不要先读脚本内容 |
| 脚本本身 | 未经明确要求不得修改 |
| 失败处理 | **任何情况下都不能忽略**，必须先修复 |
| 循环 | 失败 → 修 → 再跑，直到零错误 |

会触发门禁的改动包括但不限于：新建 / 修改 / 删除 / 重命名 `.cs`、改命名空间、增删改方法属性字段。

为什么这么严：Unity 侧的编译错误与 `dotnet build` 的错误集**不完全重合**。只跑 `dotnet build` 通过、Unity 里红一片，是常见情况。

## F6 做了什么

```
按 F6
 ├─ 1. AssetDatabase.Refresh(ForceUpdate)      强制刷新，保证文件时间准确
 ├─ 2. 运行 ET.CodeMode.dll                     重生成 AssemblyReference.asmref
 │     读 MainPackage.txt → 删掉所有包里旧的 asmref → 按 CodeMode 重新生成
 ├─ 3. CompileDlls()                            编译玩家脚本
 │     失败则中止，不执行后续步骤
 └─ 4. CopyHotUpdateDlls()                      复制 DLL 到加载目录
       清空 CodeDir → 5 个 DLL + PDB 复制为 .bytes → Refresh
       输出 "Compile Finish!"
```

| 观察点 | 含义 |
|---|---|
| 看到 `Compile Finish!` | 全流程完成 |
| 第 3 步失败 | **不会**执行第 4 步——DLL 没更新，Play 的还是旧代码 |
| 第 2 步生成的 asmref | 需要 Unity 一次导入才生效（见下） |

## F6 的已知时序问题

**现象**：asmref 文件存在且内容正确，但 F6 仍然报 `CS0246` 找不到类型。

**原因**：CodeMode 在 Unity 外部用 `dotnet` 进程运行，生成的文件需要 Unity **一次 Refresh**（导入并生成 `.meta`）才被识别。

**处理**：执行一次 `Assets/Refresh`，等 Unity 导入完成再按 F6。

这条和 [3.2](../3-code-layout/2-package-and-assembly) 的 asmref 机制是同一件事的两面。

## 门禁之外的三条纪律

| 纪律 | 原因 |
|---|---|
| 不用 IDE 私有方案编译 | 会带上 `UnityEditor` 引用，运行时出问题 |
| 不手改 `MainPackage.txt` | 由主包 `package.json` 推导，手改会丢 |
| 不手写 `AssemblyReference.asmref` | 每次 F6 先删后建，手写的会被覆盖 |

## 真源

- **门禁的权威定义与执行要求**<br>`AGENTS.md`（工程根）→「C# 修改后的强制编译门禁」
- **门禁规则说明与触发时机清单**<br>`Packages/cn.etetet.yiuimcp/Docs/Flows/强制编译规则.md`
- **F6 完整流程、asmref 规则、6 个高频问题**<br>`docs/F6编译流程说明.md`
- **编译与导出的统一入口**<br>`Packages/cn.etetet.harness/skills/et-build/SKILL.md`
- **门禁脚本本体**<br>`Packages/cn.etetet.yiuimcp/Config/compile-unity-flow.ps1`

## 源码落点

- **F6 入口编排**<br>`Packages/cn.etetet.loader/Scripts/Editor/Share/AssemblyTool.cs`
- **CodeMode 与 asmref 生成**<br>`Packages/com.etetet.init/DotNet~/CodeModeChangeHelper.cs`
- **主包 → MainPackage.txt**<br>`Packages/com.etetet.init/Editor/MainPackageSelector.cs`
- **编译包清单**<br>`MainPackage.txt`

## 读完能回答

- 改完一个 `.cs` 文件后，下一步必须做什么？
- `dotnet build ET.sln` 和 F6 分别管什么？
- F6 报 `CS0246` 时第一件事查什么？
- 为什么 `MainPackage.txt` 和 asmref 都不能手改？

## 下一步

→ [7.2 MCP 让 AI 操作 Unity](./2-mcp-unity)
