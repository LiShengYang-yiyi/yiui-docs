---
title: 1.1 编译并启动服务端
---

# 1.1 编译并启动服务端

> **一句话**：编译走 `dotnet build ET.sln`，起服走 `dotnet ./Bin/ET.App.dll --Console=1`；**必须在工程根目录启动**，并且要有管理员权限。

**关键词**：编译 · 启动服务器 · ET.App · 管理员权限 · 启动目录 · Logs

**目标**：服务端在自己机器上跑起来，Console 有输出、`Logs/` 有日志。

## 编译

```bash
dotnet build ET.sln
```

- 这是**服务端编译的唯一入口**。不要单独编译某个包，也不要用 IDE 私有方案编译。
- 分析器校验（包依赖、分层）也在这一步跑，所以这一步通过 = 静态规则也过了。

## 启动服务器

两种方式，选一种：

| 方式 | 怎么做 |
|---|---|
| Unity 菜单（推荐） | `ET → Loader → Server Tools → Start Server (Single Process)` |
| 命令行 | 在**工程根目录**执行 `dotnet ./Bin/ET.App.dll --Console=1` |

四条硬约束，任一条不满足都起不来：

| # | 约束 | 不满足的表现 |
|---|---|---|
| 1 | 工作目录 = **工程根**，不是 `Bin/` | 找不到配置与资源，启动即失败 |
| 2 | **管理员权限**（Unity Hub / Rider 都要） | HTTP 监听失败，客户端连不上 |
| 3 | 先清空 `Logs/` 再启动 | 旧日志混在里面，排查时被误导 |
| 4 | 用 Rider 启动时改运行目录（去掉结尾的 `Bin`） | 同第 1 条 |

## 客户端要配合的设置

客户端通过 `CodeMode` 决定编译哪一侧的代码：

| 模式 | 用途 |
|---|---|
| `Client` | 客户端连本地服务器时用这个 |
| `Server` | 只跑服务端 |
| `ClientServer` | 两侧一起编译（默认） |

配置位置：`Packages/com.etetet.init/Resources/GlobalConfig.asset`。

> **本地起服 + 客户端连接**的常见配置是：服务端进程用 `ClientServer` 或 `Server`，客户端那份保持 `Client`。两侧都用 `ClientServer` 时会出现「同一份代码跑两遍」的困惑。

## 起服自检

启动后按顺序确认：

- [ ] Console 窗口有输出，没有卡在启动阶段
- [ ] `Logs/` 目录生成日志文件，且没有 `Error` 级记录
- [ ] 服务端进程没有立刻退出

三项都过，就进下一节，用客户端连它。

## 真源

| 文件 | 内容 |
|---|---|
| `cn.etetet.harness/skills/et-build/SKILL.md` | 编译 / 导出 / 起服 / 发布的入口与前置条件 |
| `cn.etetet.harness/skills/et-build/references/et-build-commands.md` | 命令细节、前置条件、常见排查 |
| `docs/F6编译流程说明.md` | CodeMode 与编译流程（本工程实测整理） |
| `Book/1.1运行指南.md` | 官方运行步骤（含独立启动服务器的原始说明） |
| `AGENTS.md`（工程根） | 「强制编译门禁」「生成文件与构建入口」 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 服务端可执行产物 | `Bin/ET.App.dll` |
| 客户端 / 服务端模式配置 | `Packages/com.etetet.init/Resources/GlobalConfig.asset` |
| F6 编译入口编排 | `Packages/cn.etetet.loader/Scripts/Editor/Share/AssemblyTool.cs` |

## 读完能回答

- 服务端编译的入口是什么？为什么不能在 `Bin/` 目录启动？
- 为什么要用管理员权限启动？
- `CodeMode` 三种模式分别什么时候用？
- 起服失败时，第一步去看哪里？

## 下一步

→ [1.2 登录 → 进地图](./2-login-to-map)
