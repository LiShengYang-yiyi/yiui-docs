---
title: 0.2 工程目录与构建入口
---

# 0.2 工程目录与构建入口

> **一句话**：工程根分四块——Unity 资源、ET 包、工程脚本、编译产物；**业务代码只写在 `Packages/` 里**，且每个包的代码按目录自动归入固定的程序集。

**关键词**：工程目录 · Packages · 程序集 · asmdef · asmref · CodeMode · MainPackage.txt · 生成物禁令

## 工程根都有什么

| 目录 / 文件 | 作用 | 什么时候看它 |
|---|---|---|
| `Assets/` | Unity 资源与场景。`GameRes/` 是游戏资源根（含 `YIUI/`、`YIUIBT/` 等业务资源） | 改资源、找预制体 |
| **`Packages/`** | **全部 ET 包，业务代码的唯一落点** | 主要工作区 |
| `Scripts/` | 工程脚本：初始化、测试、导出、发布 | 执行工程级操作 |
| `Bin/` | 服务端编译产物（`ET.App.dll`、`ET.Proto2CS.dll` 等） | 排障、手动起服 |
| `Logs/` | 运行日志 | 排障第一站 |
| `Bundles/` | YooAsset 打包产物 | 打包时 |
| `Book/` | ET 官方教程（中英对照） | 读概念 |
| `docs/` | 本工程自己的说明：现状、裁剪记录、编译流程 | 了解工程取舍 |
| `MainPackage.txt` | F6 编译包含哪些包（**自动生成，禁止手改**） | 排查「类型找不到」 |
| `generated/`、`output/`、`prompt` 类目录 | 本地辅助产物，与运行无关 | 一般不用管 |

一句话记忆：**要改代码，只看 `Packages/`；要改资源，看 `Assets/`；要出问题，看 `Logs/`。**

## 包里面长什么样

每个 ET 包的 `Scripts/` 下，目录名直接决定代码归入哪个程序集：

| 包内目录 | 归入程序集 | 放什么 |
|---|---|---|
| `Scripts/Model/<模式>/` | `ET.Model` | Entity / Component 的**定义** |
| `Scripts/ModelView/<模式>/` | `ET.ModelView` | 客户端表现层的 Entity / Component 定义 |
| `Scripts/Hotfix/<模式>/` | `ET.Hotfix` | System / Handler 的**逻辑** |
| `Scripts/HotfixView/<模式>/` | `ET.HotfixView` | 客户端表现层逻辑 |
| `Scripts/Editor/` | `ET.Editor` | 编辑器工具 |

`<模式>` 指 `Client` / `Server` / `ClientServer`——决定这段代码编译进客户端还是服务端。

> **定义放 Model，逻辑放 Hotfix。** 这是后面阶段 3 的核心，现在只要记住这个映射关系。

除了 `Scripts/`，包内还有三类常见目录：

| 目录 | 内容 |
|---|---|
| `Proto/` | 该包的 `.proto` 协议定义（**按包分布**，不在工程根） |
| `Luban/` | 该包的配置表定义 |
| `AGENTS.md` | 该包的 AI 说明：边界、约定、注意事项 |

## 四个构建入口

| 入口 | 什么时候用 | 产物 |
|---|---|---|
| `dotnet build ET.sln` | 编译服务端、跑分析器校验 | `Bin/*.dll` |
| **F6**（Unity 菜单 `ET/Scripts/Compile`） | 编译热更程序集，进 Play 前 | 热更 DLL 及其 `.bytes` |
| Unity Play | 跑客户端 | — |
| `pwsh ./Scripts/Publish.ps1` | 出包 | 发布产物 |

### F6 做了什么

```
按 F6
 ├─ 1. 强制刷新资源库
 ├─ 2. 重生成 AssemblyReference.asmref
 │     读 MainPackage.txt → 删掉所有包里的旧 asmref → 按 CodeMode 重新生成
 ├─ 3. 编译玩家脚本为 DLL（失败即中止）
 └─ 4. 复制 DLL 到加载目录 → 输出 "Compile Finish!"
```

**`MainPackage.txt` 是 F6 的输入**：只有列在里面的包才会生成 `asmref`、才会被编译。一个包不在列表里，它的类型在别的包里就是「找不到」——这是 `CS0246` 报错最常见的根因。

## CodeMode

`CodeMode` 决定当前编译哪一侧的代码，取值三种：

| 模式 | 含义 |
|---|---|
| `Client` | 只编译客户端目录 |
| `Server` | 只编译服务端目录 |
| `ClientServer` | 两侧都编译（默认） |

配置位置：`Packages/com.etetet.init/Resources/GlobalConfig.asset`。

> 本地起服务器 + 客户端连它时，客户端那份 `GlobalConfig` 要保持 `Client` 模式。

## 禁止手动修改的文件

这些文件都是工具生成的。**改了会在下一次生成时被覆盖，而且往往不报错，只是行为变得难以解释。**

| 文件 | 谁生成的 | 正确做法 |
|---|---|---|
| `*_C_*.cs` / `*_S_*.cs` | proto2cs | 改 `.proto` 后重新导出 |
| `*Config.cs` / `*ConfigCategory.cs` / `ConfigGen/` | Luban | 改 Excel 后重新导出 |
| `MainPackage.txt` | `MainPackageSelector` | 改主包 `package.json` 后重新生成 |
| `.meta` / `.csproj` | Unity 编辑器 | 让编辑器刷新 |
| `AssemblyReference.asmref` | F6 的 CodeMode 流程 | 别手写；把包加进编译列表即可 |

## 怎么把一个包加进编译

不要手改 `MainPackage.txt`，按顺序来：

1. 在**主包**的 `package.json` 的 `dependencies` 里加这个包；
2. 重新生成 `MainPackage.txt`（选中 `GlobalConfig.asset` → Inspector 里点 **Set Main Package**）；
3. 按 F6。

原因：`MainPackage.txt` 由主包的 `package.json` **直接依赖**推导，不保留手工修改；而且它**不递归**收集传递依赖。

## 真源

| 文件 | 内容 |
|---|---|
| `docs/F6编译流程说明.md` | F6 完整流程、CodeMode、常见问题（本工程实测整理） |
| `Book/8.2ET Package目录.md` | 官方包清单与一句话描述 |
| `Book/8.1ET Package制作指南.md` | 怎么做一个新包 |
| `Packages/cn.etetet.harness/skills/et-build/SKILL.md` | 构建 / 导出 / 起服入口 |
| `AGENTS.md`（工程根） | 分层边界、生成文件禁令 |
| `Packages/<包>/AGENTS.md` | 单个包的边界说明 |

## 读完能回答

- 新增业务代码应该放哪？定义和逻辑分别放哪？
- `Packages/<某个包>/Scripts/ModelView/Client/` 的代码属于哪个程序集？
- `MainPackage.txt` 为什么不能手改？它从哪里推导出来？
- F6 编译报「找不到类型」时，第一件事查什么？
- 哪些文件禁止手动编辑？

## 下一步

阶段 0 到此结束。→ [阶段 1 · 跑起来](../1-run-it/)——亲手启动服务器、登录、进入地图。
