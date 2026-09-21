---
title: 排查
---

# 排查

> Tips 的所有失败路径都是「打日志 + 静默返回」，所以**不看日志就会觉得提示没反应**。

**关键词**：静默失败 · 引用计数 · 重复回收 · 类型池 · 父级销毁 · CoroutineLock

## 1 先看日志

Tips 把每一类失败都写成了明确的 Error 文案。先按文案对号入座，再谈其他。

| 日志关键词 | 含义 | 处理 |
|---|---|---|
| `必须实现 IYIUIOpen<ParamVo> 才可用Tips` | 目标 View 没实现打开接口 | 补接口实现 |
| `实例化的对象非 YIUIChild` | 资源不是 YIUI 子物体 | 检查预制体结构 |
| `非 YIUIViewComponent` | 预制体缺 View 组件 | 补上 |
| `父级必须是存在的对象` | `parent` 传了已销毁或不存在的实体 | 检查调用点 |
| `加载完毕后 父级已被销毁` | 加载过程中父级没了 | 父级生命周期要覆盖整个加载过程 |
| `无法回收一个不存在的对象` | 回收了没通过 Tips 打开的对象 | 见第 3 节 |
| `View ... 被关闭，但其父级未关闭` | 关闭结果不为成功 | 用正确的关闭路径 |
| `TextTipsView 必须有消息内容` | 飘字内容为空 | 补内容 |
| `MessageTipsView 必须有消息内容` | 确认弹窗内容为空 | 补内容 |
| `TipsTextViewQueueSingleton 未初始化` | 队列单例没注册 | 检查初始化 Handler 是否生效 |
| `内容不能为空` / `等待时间必须是有限数值` | 队列入参不合法 | 修入参 |

## 2 从现象反推

**现象：调了不弹**

按顺序确认：View 类型对不对 → 内容是不是空 → 该 View 有没有实现 `IYIUIOpen<ParamVo>` → 实例是不是 `YIUIChild` + `YIUIViewComponent`。

用 `OpenSync` 时还要确认：**失败不会反馈给调用方**。排查阶段换成 `await Open(...)` 或 `OpenWait(...)`，失败至少能拿到结果。

**现象：弹了但内容空白**

内容为空会让 View 的 `Open` 返回失败并打 Error。空字符串与 null 都算空。

**现象：确认框弹了但 `await` 不返回**

只有三种出口：点确定（`Success`）、点取消 / 关闭（`Cancel`）、业务侧自己加的超时（`Timeout`）。没超时又不点，就会一直挂着。

**现象：飘字全挤在一起**

没用队列入口。直接 `OpenSync<TipsTextViewComponent>` 是并行的，需要排队就走 `TipsTextViewQueueSingleton.Instance.OpenSync(...)`。

**现象：飘字队列停在某一条不动**

队列的消费循环有一处前置判断：单例实例被替换过就整段返回，**不复位处理标记也不清队列**。复位只发生在单例 `Awake` 里。检查是不是中途重新创建过单例。

## 3 重复回收是最常见的坑

`PutTips` 对「回收一个没记录过的对象」会直接报错，文案里把两类原因都写明了：

- 在 `open` 过程中就把对象回收了 —— 打开失败本身也会触发一次自动回收，于是回收两次
- **`Open` 返回 `false` 时不用手动回收**，框架会自己收

判据：**只有自己确实拿到过成功打开的 View，才需要关心回收**。其余一律交给框架。

## 4 引用计数的时机

计数是在**加载之前**加一的，注释写明目的是「防止加载过程中有人关闭」。这带来一个结果：

- 加载失败的分支必须手动把计数减回去
- 如果你看到 Panel 一直不关，先查有没有加载失败后没回退的分支

回收路径要区分两种：

| 情况 | 处理 |
|---|---|
| View 正常关闭 | 进池，可复用 |
| View 被销毁 | 直接丢弃，不入池 |

## 5 类型池为什么会「永不释放」

Panel 按类型记录最后使用时间，超过阈值才清该类型的池。设计上**一次只清一个类型**，不做高频清理。

所以「某个 View 类型一直占着内存」在默认配置下是正常现象，不代表泄漏。需要更激进的清理策略就自己在业务侧驱动。

## 6 两个时间参数不要搞混

| 参数 | 归属 | 默认 |
|---|---|---|
| Panel 缓存时间 | UIMgr 的面板缓存策略 | 20 秒 |
| 类型池闲置时间 | TipsPanel 自己的池 | 60 秒 |

前者决定 Panel 多久被 UIMgr 回收，后者决定某种 View 的缓存实例多久被清掉。

## 7 建议的排查动作

| 动作 | 目的 |
|---|---|
| 用 `await Open` 替换 `OpenSync` | 让失败可见 |
| 在 `TipsPanelComponentSystem` 的打开路径上加日志 | 确认走到哪一步返回的 |
| 直接跑 GM 命令 | 用现成用例区分「Tips 本身有问题」和「业务接入有问题」 |
| 检查 `parent` 的生命周期 | 覆盖到加载完成之后 |

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuitips/Scripts/HotfixView/Client/YIUISystem/Tips/TipsPanelComponentSystem.cs` | 打开与回收的全部校验分支 |
| `Packages/cn.etetet.yiuitips/Scripts/HotfixView/Client/YIUISystem/Tips/TipsViewComponentSystem.cs` | 关闭后触发回收的时机 |
| `Packages/cn.etetet.yiuitips/Scripts/HotfixView/Client/YIUISystem/Tips/TipsTextViewQueueSingletonSystem.cs` | 队列消费与异常分支 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 全部 Error 文案 | 在包内搜 `Log.Error` / `Debug.LogError` |
| 引用计数的加减 | `Scripts/HotfixView/Client/YIUISystem/Tips/TipsPanelComponentSystem.cs` 的 `OpenTips` / `PutTips` |
| 等待型的异常出口 | `Scripts/HotfixView/Client/YIUISystem/Tips/TipsMessageViewComponentSystem.cs` |
| 现成用例 | `Scripts/HotfixView/Client/GM/GM_Command_Tips.cs` |

## 下一步

→ [对象池](../gameobjectpool/)
