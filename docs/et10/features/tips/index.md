---
title: 提示弹窗
---

# 提示弹窗

> 提示弹窗是「一个常驻 Panel + 多种 View 复用」的结构：所有飘字与确认弹窗都挂在同一个 TipsPanel 下，由它做池化、引用计数与自动回收。

**关键词**：yiuitips · TipsHelper · TipsPanel · TipsView · ParamVo · OpenWait · 引用计数

## 1 定位与普通弹窗的区别

| 维度 | 普通 Panel | Tips |
|---|---|---|
| 实例 | 每次打开一个 Panel | **一个常驻 TipsPanel**，内部按 View 类型分池 |
| 生命周期 | 走 UIMgr 的层级与缓存 | Panel 自己管引用计数，归零才关 |
| 层级 | 各自指定 | 固定在提示层，优先级压在最上 |
| 等待结果 | 业务自己接 | 内建 `OpenWait`，返回 `EHashWaitError` |

一句话：**Tips 不是「一类界面」，是「一类显示通道」** —— 业务说「显示这句话」，不用关心这句话由哪个界面实例承载。

## 2 三个 View 各管什么

| View | 类 | 用途 |
|---|---|---|
| `TipsMessageView` | `TipsMessageViewComponent` | 消息确认弹窗，带确定 / 取消 / 关闭 |
| `TipsTextView` | `TipsTextViewComponent` | 文本飘字，播一段动画后自动消失 |
| 任意自定义 View | 业务自己写 | 只要满足接口要求，都能被 Tips 通道打开 |

自定义 View 的命名约定：**`Tips[XXX]View`**。这不是强制规则，但框架、资源查找、排查习惯都按这个约定走。

`TipsViewComponent` 是挂在每个被 Tips 打开的 View 上的标记组件，只有一个字段，作用是标识「我是被 Tips 通道打开的」，从而参与回收链路。

## 3 一个 Panel 怎么复用多个 View

`TipsPanelComponent` 内部有三个关键字段：

| 字段 | 作用 |
|---|---|
| `_AllPool` | 按 View 类型分的对象池 |
| `_RefCount` | 引用计数，归零才关闭 Panel |
| `_AllRefView` | 当前正在使用的 View 集合 |
| `_AllPoolLastTime` | 每种类型的最后使用时间，用于超时清池 |

打开流程的核心是**先加引用计数、再加载实例**：

1. 引用计数加一 —— 目的是防止「加载过程中有人把它关了」
2. 从对应类型的池取实例，池空则新建
3. 校验实例是否满足接口要求，不满足就销毁并回退计数
4. 把实例挂到 TipsPanel 的节点下，并置为最后一个兄弟节点
5. 调实例自己的 `Open(vo)`

回收流程：

1. View 被关闭且关闭结果为成功 → 等一帧
2. 发一个动态消息通知 TipsPanel
3. Panel 把实例收回对应池，记录最后使用时间
4. 引用计数减一，归零时关闭 Panel

## 4 两级回收别混淆

| 层级 | 机制 | 默认值 |
|---|---|---|
| Panel 级 | UIMgr 的面板缓存策略 | 缓存时间 20 |
| View 级 | TipsPanel 自己的类型池 | 类型闲置 60 秒后清 |

两层独立。**「View 被回收」不等于「Panel 被关」** —— Panel 会一直等着下一次打开，直到引用计数归零。

## 5 等待型提示

`OpenWait` 系列返回 `ETTask<EHashWaitError>`，用于「弹出确认框 → 等玩家选 → 继续往下走」这种链路。

返回值含义：

| 值 | 含义 |
|---|---|
| `Success` | 点了确定 |
| `Cancel` | 点了取消或关闭 |
| `Timeout` | 业务侧自己加的超时到了 |
| `Destroy` | 界面被销毁 |
| `Reset` | 被重置 |
| `Error` | 没打开成功 |

内部实现是一套 `HashWait`：打开前生成一个 id，View 里点按钮时把结果 `NotifyWait` 回去，外层的 `await` 才继续。

超时不是内建的，由业务自己接 `.TimeoutAsync(...)`。

## 6 飘字队列

多条飘字同时来的时候，走 `TipsTextViewQueueSingleton`：

| 行为 | 说明 |
|---|---|
| 顺序 | 严格 FIFO，串行播放，**绝不并行** |
| 间隔 | 每条播完后默认再等 1 秒 |
| 判定依据 | 「上一条播放完成」由飘字动画播完 + 关闭界面来标记 |
| 队列中途 | 已有正在处理时，新来的只入队 |

队列单例需要先被注册进 World，否则入队调用只会打一条 Error。

## 真源

- **池、引用计数、回收入口**<br>`Packages/cn.etetet.yiuitips/Scripts/ModelView/Client/YIUIComponent/Tips/TipsPanelComponent.cs`
- **被打开 View 的标记组件**<br>`Packages/cn.etetet.yiuitips/Scripts/ModelView/Client/YIUIComponent/Tips/TipsViewComponent.cs`
- **确认弹窗的数据结构**<br>`Packages/cn.etetet.yiuitips/Scripts/ModelView/Client/YIUIComponent/Tips/TipsMessageViewComponent.cs`
- **飘字队列模型**<br>`Packages/cn.etetet.yiuitips/Scripts/ModelView/Client/YIUIComponent/Tips/TipsTextViewQueueSingleton.cs`

## 源码落点

- **Panel 的打开与回收**<br>`Scripts/HotfixView/Client/YIUISystem/Tips/TipsPanelComponentSystem.cs`
- **三个 View 的表现逻辑**<br>`Scripts/HotfixView/Client/YIUISystem/Tips/Tips*ComponentSystem.cs`
- **队列消费循环**<br>`Scripts/HotfixView/Client/YIUISystem/Tips/TipsTextViewQueueSingletonSystem.cs`
- **队列单例的注册**<br>`Scripts/HotfixView/Client/Handler/OnYIUIEventInitializeAfter_AddTipsTextViewQueueSingleton_Handler.cs`
- **资源与动画**<br>`Assets/GameRes/YIUI/Tips/`

## 下一步

→ [怎么调用](./usage)
