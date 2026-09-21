---
title: 怎么调用
---

# 怎么调用

> 所有调用都从 `TipsHelper` 走。四组入口的区别只有两个维度：**是泛型还是资源名**、**要不要等结果**。

**关键词**：TipsHelper · Open · OpenSync · OpenToParent · OpenWait · ParamVo · MessageTipsExtraData

## 1 四组入口

| 组 | 识别方式 | 适用 |
|---|---|---|
| 泛型 | `Open<T>` / `OpenSync<T>` | 编译期就知道 View 类型，**推荐** |
| 资源名 | `Open(scene, resName, ...)` | 运行时才知道资源名 |
| 等待型泛型 | `OpenWait<T>` | 需要拿到玩家选择的结果 |
| 等待型资源名 | `OpenWait(scene, resName, ...)` | 同上，但只知道资源名 |

资源名版本会先按 `resName` 反查绑定信息，**查不到就静默返回**，不打开也不抛错。对应地，`OpenWait` 的资源名版本会直接返回 `Error`。

平时一律用泛型版本，资源名版本留给「配置驱动的界面」这类场景。

## 2 真实签名

```csharp
// 泛型
static ETTask Open<T>(Scene scene, params object[] paramMore) where T : Entity
static void   OpenSync<T>(Scene scene, params object[] paramMore) where T : Entity
static ETTask OpenToParent<T>(Scene scene, Entity parent, params object[] paramMore) where T : Entity
static ETTask OpenToParent<T>(Scene scene, ParamVo vo, Entity parent = null) where T : Entity

// 按资源名
static ETTask Open(Scene scene, string resName, params object[] paramMore)
static void   OpenSync(Scene scene, string resName, params object[] paramMore)
static ETTask OpenToParent(Scene scene, string resName, Entity parent, params object[] paramMore)
static ETTask OpenToParent(Scene scene, string resName, ParamVo vo, Entity parent = null)

// 等待型
static ETTask<EHashWaitError> OpenWait<T>(Scene scene, params object[] paramMore)
    where T : Entity, IYIUIBind, IYIUIOpen<ParamVo>
static ETTask<EHashWaitError> OpenWaitToParent<T>(Scene scene, Entity parent, params object[] paramMore)
static ETTask<EHashWaitError> OpenWait(Scene scene, string resName, params object[] paramMore)
static ETTask<EHashWaitError> OpenWaitToParent(Scene scene, string resName, ParamVo vo, Entity parent = null)
```

`OpenToParent` 的 `parent` 传空时落到场景的 YIUI 根节点。

## 3 `Sync` 不是同步

`OpenSync` / `OpenSync` 系列内部实现都是 `异步版本(...).NoContext()`：

- 调完立刻返回，不阻塞
- **失败与异常都不会回到调用方**
- 要结果必须用 `OpenWait` 或 `await Open`

「显示一句提示、不关心结果」用 `OpenSync`；「弹个确认框、等玩家点」必须用 `OpenWait`。

## 4 参数怎么传

打开参数依次装进 `ParamVo`：

| 位置 | 含义 |
|---|---|
| 索引 0 | 内容字符串 |
| 索引 1 | 额外数据（如 `MessageTipsExtraData`） |

```csharp
// 一句飘字
TipsHelper.OpenSync<TipsTextViewComponent>(self.Scene(), "未实现的 Demo");

// 确认弹窗，带额外数据
TipsHelper.OpenSync<TipsMessageViewComponent>(
    clientScene,
    paramString,
    new MessageTipsExtraData { ConfirmName = "确定", CancelName = "取消" });

// 等待玩家选择
var result = await TipsHelper.OpenWait<TipsMessageViewComponent>(clientScene, "回调测试");
if (result == EHashWaitError.Success) { /* 点了确定 */ }
```

`MessageTipsExtraData` 的字段：

| 字段 | 作用 |
|---|---|
| `ConfirmName` | 确定按钮文案 |
| `CancelName` | 取消按钮文案 |
| `ShowCancelButton` | 是否显示取消按钮 |
| `ShowCloseButton` | 是否显示关闭按钮 |

⚠️ **`ParamVo` 会被回收**。Helper 在 `OpenSync` 内部会新建一份再传下去，就是为了避免外部继续持有同一个对象。不要在自己拼 `ParamVo` 之后还留引用。

## 5 业务 View 要满足什么

被 Tips 打开的 View 必须满足三条，**任何一条不满足都会静默失败**（销毁实例 + 打 Error，不抛异常）：

1. 实现 `IYIUIOpen<ParamVo>`
2. 实例是 `YIUIChild`
3. 挂在 `YIUIViewComponent` 上

关闭时如果要参与回收，**关闭结果必须是成功**。父级没关而 View 自己先关的情况不会触发回收，只会打一条提示。

## 6 飘字队列

```csharp
TipsTextViewQueueSingleton.Instance.OpenSync(content, waitTimeSeconds);
```

| 参数 | 含义 |
|---|---|
| `content` | 内容，不能为空 |
| `waitTimeSeconds` | 本条播完后的等待秒数，不传默认 1 秒 |

传入非有限数值（`NaN` / `Infinity`）会被拒。`waitTimeSeconds <= 0` 表示不等，立刻播下一条。

队列单例需要在 World 里注册过，否则调用只打 Error。

## 7 打开相关顺序问题

Tips 的全部打开动作共用同一把协程锁，键是 `TipsHelper` 的类型哈希。

含义：**Tips 的打开是串行化的**，同一帧里连开多个不会交错。业务侧不需要自己做并发保护，但也别指望它们并行。

## 8 GM 入口

提示相关的 GM 命令挂在分组 `EGMType_Tips`（组名「提示窗口」）下：

| 命令 | 用途 |
|---|---|
| `GM_TipsTest1`~`4` | 打开确认弹窗，覆盖带参、带按钮文案等形态 |
| `GM_TipsTest5` | 打开文本飘字 |
| `GM_TipsTest0`~`_4` | 等待型的成功 / 取消 / 超时 / 组合 / 连续回调 |

GM 文件头部注明了：这两个文件用于在 GM 包上测功能，**不强制引用 GM 包**；没引 GM 包时删掉即可。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuitips/Scripts/HotfixView/Client/YIUISystem/Helper/TipsHelper.cs` | 泛型入口 |
| `Packages/cn.etetet.yiuitips/Scripts/HotfixView/Client/YIUISystem/Helper/TipsHelper_String.cs` | 资源名入口 |
| `Packages/cn.etetet.yiuitips/Scripts/HotfixView/Client/YIUISystem/Helper/TipsHelper_Wait.cs` | 等待型入口 |
| `Packages/cn.etetet.yiuiframework/Scripts/Model/Share/HashWait/EHashWaitError.cs` | 等待结果枚举 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 打开参数如何拆进 `ParamVo` | `Scripts/HotfixView/Client/YIUISystem/Helper/TipsHelper.cs` 的 `OpenToParent` |
| 确认弹窗的按钮逻辑 | `Scripts/HotfixView/Client/YIUISystem/Tips/TipsMessageViewComponentSystem.cs` |
| 飘字动画与关闭时机 | `Scripts/HotfixView/Client/YIUISystem/Tips/TipsTextViewComponentSystem.cs` |
| 等待型的 NotifyWait 出口 | 同上两个文件内的按钮回调 |
| GM 命令示例 | `Scripts/HotfixView/Client/GM/GM_Command_Tips.cs` · `GM_Command_WaitTips.cs` |

## 下一步

→ [排查](./troubleshooting)
