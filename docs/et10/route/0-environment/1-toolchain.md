---
title: 0.1 环境与工具链
---

# 0.1 环境与工具链

> **一句话**：需要 Rider 2024.3+ / .NET 8 / Unity 2022.3.62f3 / PowerShell 7，加一条常开的网络代理；编译只有一个入口——`dotnet build ET.sln`。

**关键词**：环境准备 · Rider · .NET 8 · Unity 版本 · 代理 · 初始化 · 编译入口 · 管理员权限

这一节只解决一件事：**让工程在你机器上编译通过**。装什么、怎么初始化、编译命令是什么、出错先看哪儿。

## 要装什么

| 项 | 要求 | 说明 |
|---|---|---|
| IDE | Rider 2024.3 或更新 | 工程按 Rider 配置。官方教程明确不建议用 Visual Studio 起步 |
| .NET SDK | .NET 8 | 服务端与工具链的编译目标。Windows 用 Visual Studio 安装器装，macOS 用 homebrew |
| Unity | **2022.3.62f3** | 工程锁定版本。换版本会遇到各种导入报错 |
| Unity 模块 | IL2CPP | 缺这个，Unity 打开工程就会报错 |
| PowerShell | PowerShell 7，命令名 `pwsh` | `Scripts/` 下所有工程脚本都依赖它。Windows 自带的 5.1 不够用 |
| 网络 | 全程可用代理 | Unity 包与 NuGet 包都从境外源拉取，不挂代理会大量下载失败 |

> 工程里有多个 `.csproj`，但**不要用 IDE 单独编译**——服务端编译的入口只有一个（见下）。

## 初始化步骤

1. **克隆一份全新工程**。不要复用已有工作区，也不要直接在别人的工程上改。
2. 在工程根目录执行：
   ```bash
   pwsh ./Scripts/Initialize-Project.ps1
   ```
   这个脚本会补依赖、生成 `MainPackage.txt`、构建工具链，是后续所有命令的前提。
3. 启动 Unity Hub，用 **Open** 打开工程根目录。
4. 打开后配置编辑器：`Edit → Preferences → External Tools`
   - `External Script Editor` 选 Rider
   - `Generate .csproj files for` 勾选**前两项**
5. `Assets → Open C# Project`，会打开 `ET.sln`（工程改过 Rider 插件，走这条路才会自动关联）。
6. 编译：
   ```bash
   dotnet build ET.sln
   ```

## 编译与运行入口

| 要做什么 | 用什么 |
|---|---|
| 编译整个工程（**唯一入口**） | `dotnet build ET.sln` |
| 初始化工程 | `pwsh ./Scripts/Initialize-Project.ps1` |
| 跑测试 | `pwsh ./Scripts/Run-Test.ps1`（指定用 `-Name "..."`） |
| 跑 Unity 测试 | `pwsh ./Scripts/Run-UnityTest.ps1 -Name "..."` |
| 编译热更程序集 | Unity 内按 **F6**（菜单 `ET/Scripts/Compile`） |
| 导出协议 | `dotnet ./Bin/ET.Proto2CS.dll` |
| 启动服务器 | `dotnet ./Bin/ET.App.dll --Console=1` |
| 发布 | `pwsh -ExecutionPolicy Bypass -File ./Scripts/Publish.ps1` |

> **服务器必须在工程根目录启动，不能在 `Bin/` 目录里启动。** 在 `Bin/` 下启动会因为运行目录不对而找不到资源。

## 三个必须知道的硬规则

### 1. 服务端要管理员权限

服务端会监听 HTTP 端口。Windows 上必须**以管理员身份启动 Unity Hub / Rider**，否则服务端起不来。

另外要先清掉自己加过的 urlacl：

```bash
netsh http delete urlacl ...
```

### 2. 改完 `.cs` 必须过编译门禁

每次修改任何 `.cs` 文件后，必须立即执行编译流程，**失败就修，直到零错误才能继续**：

```powershell
powershell -ExecutionPolicy Bypass -Command "& '<工程根>/Packages/cn.etetet.yiuimcp/Config/compile-unity-flow.ps1' -Force 0"
```

- 默认 `Force=0`，确有需要才用 `Force=1`。
- 编译失败任何情况下都不能忽略。

### 3. Model / Hotfix 不能用 IDE 编译

`Model`、`Hotfix`、`ModelView`、`HotfixView` 这几个热更程序集，必须走项目规定的 Unity / ET 编译入口（F6）。

原因：IDE 编译出来的产物会带上 `UnityEditor` 引用，跑起来会出问题。

## 常见错误对照

| 现象 | 原因 |
|---|---|
| 各种莫名其妙的导入 / 编译报错 | 工程路径含中文。路径必须全英文 |
| NuGet 包、Unity 包下载不下来 | 没开代理 |
| 服务端启动失败、客户端连不上报 10037 | 不是管理员权限启动 |
| Unity 打开工程即报错 | 没装 IL2CPP 模块 |
| 编译不过 | 没装 .NET 8，或 Rider / VS 版本太旧、缺组件 |
| 打包报缺少 `StreamingAsset` | 手动在 `Assets/` 下建一个 `StreamingAssets` 目录 |

排障顺序：**先看 `Logs/` 目录有没有 Error 日志**，再回头看环境。

## 真源

- **环境、初始化、打包、热重载全流程（中文）**<br>`Book/1.1运行指南.md`
- **同上，英文版**<br>`Book/1.1Running Guide.md`
- **强制编译门禁、唯一编译入口、包路由**<br>`AGENTS.md`（工程根）
- **编译 / 导出 / 起服 / 发布的命令与前置条件**<br>`Packages/cn.etetet.harness/skills/et-build/SKILL.md`
- **全部 PowerShell 工程脚本**<br>`Scripts/`
- **本工程的目标、验收标准与默认假设**<br>`docs/YIUIET10说明.md`

## 读完能回答

- 这个工程锁定哪个 Unity 版本？为什么不能随便换？
- 为什么服务端必须用管理员权限启动？
- 服务端编译的唯一入口是什么？为什么不能用 IDE 编译 Model / Hotfix？
- 改完一个 `.cs` 之后，下一步必须做什么？

## 下一步

→ [0.2 工程目录与构建入口](./2-project-layout)
