---
title: 导出流程与产物
---

# 导出流程与产物

> 改完表要跑一次导出。入口是编辑器菜单，实际执行的是命令行导出器 + 一组生成脚本。

**关键词**：Export Config · --check-only · LubanGen.ps1 · outputCodeDir · cs-bin · 备份回滚 · LubanExport

## 1 三个入口

| 入口 | 说明 |
|---|---|
| 菜单 `Export Config` | 标准入口，完整导出 |
| 配置工具窗口 | 分「导出」与「仅生成 Conf」两个按钮 |
| YIUI 工具窗口 | 内部仍转调上面那个菜单 |

自动化场景还有一个 MCP 工具，运行时（PlayMode）会被拒绝。

## 2 实际执行的命令

编排器执行的是命令行导出器：

```
dotnet <工具包>/.Tools/ET.YIUI.Luban.Export.dll --project ./ --collection Config --json
```

| 参数 | 作用 |
|---|---|
| `--project` | 工程根 |
| `--collection` | 导出哪个分类 |
| `--json` | 结果以 JSON 输出给编辑器解析 |
| `--check-only` | 只重写导出配置里的定义清单，不做完整导出 |

超时限制 180 秒，超时即失败。

## 3 导出器内部做了什么

按顺序：

1. **扫描**所有包下的分类目录，合并同一分类下的定义
2. 同一分类出现多份导出配置 → 直接报重复并中止
3. **重写**导出配置里的定义文件列表
4. **备份并清空**已有的生成代码目录（默认开启，可关闭）
5. **依次执行**配置同目录下的生成脚本
6. 失败则从备份**回滚**

第 5 步的执行方式是按文件名排序依次用 PowerShell 跑脚本。重试与文件占用问题都在这一步。

## 4 生成脚本做了什么

生成脚本按目标平台分成几份，各自调用 Luban 本体：

| 脚本 | 目标 | 代码输出 |
|---|---|---|
| 第一份 | 客户端 | 客户端生成目录 |
| 第二份 | 服务端 | 服务端生成目录 |
| 第三份 | 双端 | 双端生成目录 |

每份脚本传的参数含义：

| 参数 | 作用 |
|---|---|
| 代码模板目录 | 使用工程自定义模板，不是 Luban 默认模板 |
| 代码目标 | 二进制模式 |
| 数据格式 | 同时产出二进制与 JSON |
| 导出配置 | 指向该分类的配置 |
| 输出目录 | 代码目录、二进制目录、JSON 目录各一个 |

⚠️ **脚本成功的判定是「退出码为 0 且标准错误为空」** —— Luban 往标准错误打任何警告都会判为导出失败并回滚。

## 5 导出后的收尾

1. 保存资源、刷新资源数据库
2. 代码模式变更时重建各目录的程序集引用文件

第 2 步容易被忽略：**改了代码模式（客户端 / 服务端 / 双端）后不重建引用，生成代码不会被编译进对应程序集**。

## 6 产物形态

| 产物 | 位置约定 |
|---|---|
| 生成的代码 | `CodeMode/Model/<模式>/LubanGen/<分类>/` |
| 二进制数据 | `Assets/LubanGen/<分类>/Binary/<模式>/` |
| JSON 数据 | `Assets/LubanGen/<分类>/Json/<模式>/` |

启动配置是独立的一套，脚本与目录都单独一份。

工程里另有若干包自带 `CodeMode/.../LubanGen/` 目录，与当前导出配置指向的输出目录不一致 —— 这些属于 历史产物，**以导出配置指向的目录为准**。

## 7 提交清单

一次表改动应同时提交：

- `Defines/` 下的定义文件
- `Datas/` 下的数据文件
- 导出配置文件
- 生成的代码
- 生成的二进制与 JSON
- 相关 `.meta`

**漏提交生成物 = 别人拉下来代码编译不过或数据不一致。**

## 8 编辑器与真机读取路径不同

| 环境 | 读取方式 |
|---|---|
| 编辑器（客户端） | 直接读磁盘上的生成目录 |
| 真机（客户端） | 按资源名从资源包加载文本资源 |
| 服务端 | 固定读服务端那一份 |

**真机能读到的前提是生成的数据被资源收集器收进去了。** 用编辑器一切正常、打包后读不到表，基本就是这个原因。

## 真源

- **菜单、命令行、超时、结果解析**<br>`Packages/cn.etetet.yiuiluban/Editor/Window/LubanTools_Gen.cs`
- **客户端生成脚本**<br>`Packages/cn.etetet.yiuilubangen/Luban/Config/Base/LubanGen1.ps1`
- **导出编排器源码**<br>`Packages/cn.etetet.yiuiluban/DotNet~/ET.YIUI.Luban.Export/`
- **产物路径常量**<br>`Packages/cn.etetet.yiuiluban/Scripts/Model/Share/Config/LubanHelper.cs`

## 源码落点

- **配置工具窗口**<br>`Packages/cn.etetet.yiuiluban/Editor/Window/LubanToolsWindow.cs`
- **代码模板**<br>`Packages/cn.etetet.yiuiluban/.ToolsGen/Custom/`
- **Luban 版本**<br>`Packages/cn.etetet.yiuiluban/LubanVersions.txt`
- **代码模式变更后的引用重建**<br>`Packages/cn.etetet.yiuiluban/Editor/Window/LubanTools_CodeModeChangeHelper.cs`
- **自动化导出工具**<br>`Packages/cn.etetet.yiuiluban/Editor/YIUIToolbar/YIUIMCPTools_LubanExport.cs`
- **启动配置的生成脚本**<br>`Packages/cn.etetet.yiuistartconfig/Luban/Localhost/Base/`

## 下一步

→ [排查](./troubleshooting)
