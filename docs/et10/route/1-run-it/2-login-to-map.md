---
title: 1.2 登录 → 进地图
---

# 1.2 登录 → 进地图

> **一句话**：客户端把 `CodeMode` 设成 `Client`，Unity 里 Play，登录后进入最小地图——这就是本工程定义的最小成功标准。

**关键词**：登录 · 进图 · 最小闭环 · CodeMode · 10037 · 验收标准

**目标**：客户端连上本地服务端，走完登录流程并进入地图。

## 为什么这条链路这么重要

它是**整个工程的验收标准**，不是演示。

本工程（`YIUIET10`）的目标是官方 ET10 的纯净版：默认**不依赖数据库**也能启动、登录、进最小地图，但**不绕过服务器链路**——Realm、Gate、Map、Router、ServiceDiscovery 都还在。

所以「能登录进图」这句话背后是：网络、协议、Scene 切换、Actor 位置、配置表、UI 全链路都是通的。链路任何一环断了这条就走不完。

## 操作步骤

1. 确认服务端已经起来（见 [1.1](./1-build-and-start-server)）。
2. 客户端配置 `Packages/com.etetet.init/Resources/GlobalConfig.asset` → `CodeMode` = **`Client`**。
3. Unity 里打开 `Packages/cn.etetet.statesync/Scenes/Init` 场景。
4. 点击 **Play**。
5. 出现登录界面 → 点登录 → 进入地图。

> 独立启动服务器的情况下，要先停止 Unity Play，从菜单 `ET → Loader → Server Tools → Start Server (Single Process)` 起服，再重新 Play 客户端。顺序反了会连不上。

## 「通了」的判据

不要停在「面板打开了」。按这个顺序确认：

- [ ] 登录界面正常显示，没有报错弹窗
- [ ] 点登录有响应，界面按预期关闭或切换
- [ ] 进入地图后能看到场景内容（不是黑屏或空场景）
- [ ] `Logs/` 里没有新增 `Error`
- [ ] Unity Console 没有异常堆栈

> 更严格的验收是「**点击后有事件日志命中**」——面板打开只说明 UI 层没问题，链路通不通要看点击有没有引起真实逻辑。做法见 [7.6 测试闭环](../7-toolchain/6-test-loop)。

## 连不上时依次查这三处

| 顺序 | 查什么 | 典型现象 |
|---|---|---|
| 1 | 服务端是否真的在跑 | 进程不在，或启动时报权限错误 |
| 2 | 客户端 `CodeMode` 是否被设成 `Client` | 客户端在用服务端配置连自己 |
| 3 | `Logs/` 里有没有 `Error` | 报 `10037` 通常在这能看到根因 |

| 现象 | 常见原因 |
|---|---|
| 报 `10037` | 服务端没起、或没以管理员权限起、或 urlacl 没清 |
| 登录界面不出现 | 场景不对、或客户端编译产物没更新（需要 F6） |
| 点击无反应 | 事件未绑定，或改动后没重新编译 |

## 真源

- **本工程目标与验收标准（最小成功标准的定义在这里）**<br>`docs/YIUIET10说明.md`
- **从加按钮到「点击命中日志」的完整实操**<br>`Packages/cn.etetet.yiuimcp/Docs/Flows/LoginTestClick测试指南.md`
- **闭环「通过」的定义与失败分级**<br>`Packages/cn.etetet.yiuimcp/Docs/Flows/P0-闭环验收标准.md`
- **官方运行步骤原文**<br>`Book/1.1运行指南.md`

## 源码落点

- **登录流程前后端实现**<br>`Packages/cn.etetet.login/`
- **客户端模式配置**<br>`Packages/com.etetet.init/Resources/GlobalConfig.asset`
- **启动场景**<br>`Packages/cn.etetet.statesync/Scenes/Init`
- **服务端日志**<br>`Logs/`

## 读完能回答

- 为什么「能前进到地图」比「面板能打开」更能说明链路没问题？
- 客户端 `CodeMode` 要设成什么？设错的后果是什么？
- 报 `10037` 时按什么顺序排查？
- 本工程的验收标准是从哪份文件定义的？

## 下一步

→ [1.3 日志与排障](./3-logs-and-troubleshooting)
