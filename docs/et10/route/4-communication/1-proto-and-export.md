---
title: 4.1 Proto 定义与导出
---

# 4.1 Proto 定义与导出

> **一句话**：协议用 `.proto` 定义在**每个包自己的 `Proto/` 目录**里，文件名带 `C` / `S` 与号段；用 Proto2CS 导出成 C#，生成物禁止手改。

**关键词**：Proto · proto2cs · opcode · 号段 · 生成物禁令 · ET.Proto2CS

**目标**：新增一条协议时，知道改哪个文件、导出到哪、什么不能碰。

## 协议放在哪

**不在工程根**，而是在**每个包自己的 `Proto/` 目录**下：

```
Packages/<包>/Proto/<名称>_<C|S>_<号段>.proto
```

工程里的真实例子：

| 文件 | 说明 |
|---|---|
| `cn.etetet.login/Proto/Login_C_10000.proto` | 客户端可见的登录协议 |
| `cn.etetet.login/Proto/Login_S_20000.proto` | 服务端内部协议 |
| `cn.etetet.router/Proto/Router_C_2000.proto` | 路由协议 |
| `cn.etetet.move/Proto/Move_C_10300.proto` | 移动协议 |
| `cn.etetet.transfer/Proto/Transfer_C_11300.proto` | 传送协议 |
| `cn.etetet.servicediscovery/Proto/ServiceDiscovery_S_20500.proto` | 服务发现内部协议 |

三个部分各有用处：

| 部分 | 含义 |
|---|---|
| 名称 | 归属的模块，方便定位 |
| `C` / `S` | `C` = 客户端参与的消息；`S` = 服务端之间/内部的消息 |
| 号段 | opcode 分配区间，全局唯一 |

## 导出的流程

```
写 .proto
   ↓
dotnet ./Bin/ET.Proto2CS.dll
   ↓
生成到 Packages/cn.etetet.proto/CodeMode/Model/{Client,ClientServer,Server}/
```

导出产物按**模式**分目录存放，因为它们在不同 `CodeMode` 下参与编译：

| 目录 | 什么时候进编译 |
|---|---|
| `CodeMode/Model/Client/` | `CodeMode = Client` |
| `CodeMode/Model/Server/` | `CodeMode = Server` |
| `CodeMode/Model/ClientServer/` | 双端模式 |

服务端启动参数里也可以带 `--Console=1` 之外的模式相关参数，具体见 `et-build` skill。

## 生成物禁令

| 文件 | 为什么不能改 |
|---|---|
| `*_C_*.cs` / `*_S_*.cs` | 每次导出都会被覆盖，改了不报错但会静默失效 |
| `Packages/cn.etetet.proto/CodeMode/Model/**` | 同上，整个目录都是产物 |

**要改消息结构，改 `.proto`，然后重新导出。** 没有例外。

## opcode 怎么取号

| 规则 | 说明 |
|---|---|
| 号段全局唯一 | 不同包的号段不重叠 |
| 同类就近取号 | 新增消息时在所属模块的号段内取空位 |
| 保持既有 opcode 兼容 | 消息从一个包迁到另一个包时，优先沿用原号段（`move` 包的 `AGENTS.md` 明确写了这条） |

原因很实际：opcode 是**运行时契约**。客户端与服务端版本不一致时靠它识别消息，改号等同于改协议，老客户端会直接崩。

## 真源

- **proto 包的目录约定与开发约束**<br>`Packages/cn.etetet.proto/AGENTS.md`
- **Proto 导出命令与前置条件**<br>`Packages/cn.etetet.harness/skills/et-build/SKILL.md`
- **命令细节与常见排查**<br>`Packages/cn.etetet.harness/skills/et-build/references/et-build-commands.md`
- **「优先保持既有 opcode 兼容」的原始约定**<br>`Packages/cn.etetet.move/AGENTS.md`
- **生成文件禁令（含 proto2cs 产物）**<br>`AGENTS.md`（工程根）

## 源码落点

- **各包协议定义**<br>`Packages/<包>/Proto/*.proto`
- **导出产物**<br>`Packages/cn.etetet.proto/CodeMode/Model/`
- **导出工具**<br>`Bin/ET.Proto2CS.dll`
- **导出工具源码**<br>`Packages/cn.etetet.proto/Scripts/Editor/`

## 读完能回答

- 新增一条协议，`.proto` 放在哪个目录？
- 导出产物为什么按 `Client` / `Server` / `ClientServer` 分目录？
- 为什么不能直接改生成的 `*_C_*.cs`？
- opcode 为什么不能随便改？

## 下一步

→ [4.2 消息与 Handler](./2-message-and-handler)
