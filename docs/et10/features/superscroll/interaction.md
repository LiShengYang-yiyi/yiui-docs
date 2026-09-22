---
title: 点击与选中
---

# 点击与选中

> 点击和选中都在控件内部实现：业务只负责一次性初始化开关，以及在 `OnClick` 里处理业务语义。

**关键词**：SetOnClick · ClickCheck · BanSelect · AutoCancelLast · RepetitionCancel · MaxClickCount · OnSnapItemFinished

## 1 点击初始化

三套控件的点击 API 同构：

| 方法 | 作用 |
|---|---|
| `SetOnClickAll(itemClickEventName = "u_EventClick")` | 全部预制体共用同一个点击规则 |
| `SetOnClick(prefabIndex = 0, itemClickEventName = "u_EventClick")` | 只给某一个预制体开点击 |
| `SetOnClickCheck(prefabIndex = 0, value = true)` | 是否启用「点击检查」 |
| `SetBanSelectAll(value = true)` | 全部禁止选中 |
| `SetBanSelect(prefabIndex = 0, value = true)` | 禁止某个预制体被选中 |
| `ChangeAutoCancelLast(bool)` | 点新的自动取消上一个选中 |
| `ChangeRepetitionCancel(bool)` | 重复点同一个取消选中 |
| `ChangeMaxClickCount(count, reset = true)` | 最多同时选中几个 |

**这几组方法只能初始化一次，之后不能再改。** 重复调用 `SetOnClick` 会打 Error。写在 `YIUIInitialize` 里、只调一次，是唯一正确用法。

`SetOnClickCheck` 与 `SetBanSelect` 依赖 `SetOnClick` 已经执行过，**没开点击就调会报错**。

## 2 点击是怎么挂上去的

Item 首次被创建时，控件把 Item 自身的事件表里的事件挂到选中逻辑上：

1. 读 Item 的 `ResName`
2. 从 Item 的事件表里找 `itemClickEventName` 指定的那个事件
3. 挂上后点击会走到控件的点击分发

因此有两条前置条件：

- Item 预制体**必须有事件表**，否则报「目标 item 没有 event 表」
- 事件名必须存在，找不到会把该 `ResName` 的初始化标记为失败

`itemClickEventName` 默认是 `u_EventClick`，即 CDE 表里约定好的那个点击事件名。改名字要两边一起改。

## 3 选中语义

| 行为 | 由谁控制 |
|---|---|
| 同时最多选中几个 | `ChangeMaxClickCount(count)` |
| 点新项是否自动取消旧的 | `ChangeAutoCancelLast(bool)` |
| 点同一个是否取消选中 | `ChangeRepetitionCancel(bool)` |
| 某类 Item 是否允许被选中 | `SetBanSelect(prefabIndex, value)` |

选中的**表现**不归控件管。控件只把 `select` 传给业务 `Renderer` 的参数，由业务决定选中态长什么样。

读取选中：

| 方法 | 说明 |
|---|---|
| `GetSelectIndex()` · `GetSelectItem()` | 读当前选中 |
| `IsSelect(entity)` | 判断某个实体是否选中 |
| `ClearSelect(reset = true)` | 清空，`reset` 一律传 `true` |

`ClearSelect` 的 `reset` 传 `false` 会留下脏状态，源码里也没有为它设计的使用场景。

## 4 主动触发点击

| 方法 | 说明 |
|---|---|
| `OnClickItem(item)` | 对某个 Item 执行一次点击 |
| `OnClickItemByIndex(index)` | 错列网格专用，按 index 点击 |

前置条件：**目标 Item 必须正在显示中**。对不可见项调会报「无法选中一个不在显示中的对象」。

需要「数据里选中第 N 条」时，先 `MovePanelToItemIndex(N)` 把它滚进可见区，或者直接用 `SetDataRefreshSelect(count, N)` 让控件自己处理。

## 5 滚动回调

滚动相关回调**只有列表和网格有**，错列网格没有。

| 方法 | 触发时机 |
|---|---|
| `OnSnapItemFinished(bool add = true)` | 停靠到某个 Item 之后 |
| `OnSnapNearestChanged(bool add = true)` | 最近的 Item 发生变化 |
| `OnSmoothMovePanelToItemFinished(bool add = true)` | 平滑滚动结束后（**仅列表**） |

传 `false` 取消订阅。内部实现是先把委托 `-=` 再按 `add` 决定是否 `+=`，所以重复调用不会叠订阅。

`OnSmoothMovePanelToItemFinished` 有额外的硬条件：

- 必须真的滚到某个**可显示**的对象上，否则报错
- **必须滚动时间大于 0 才会触发** —— `MovePanelToItemIndex` 的 `duration` 传 0 是瞬间定位，不会有这个回调

## 6 用哪种方式接业务

| 场景 | 用法 |
|---|---|
| 点一下做一件事 | `SetOnClickAll()` + 实现 `OnClick` |
| 需要单选 | `ChangeMaxClickCount(1)` + `ChangeAutoCancelLast(true)` |
| 需要多选 | `ChangeMaxClickCount(n)`，选中状态在 `Renderer` 的 `select` 里读 |
| 需要「点开某个面板」 | 在 `OnClick` 里 `OpenPanelAsync`，不要在 `Renderer` 里开界面 |
| 需要监听滚动位置 | 订阅 `OnSnapItemFinished` 或 `OnSnapNearestChanged` |

不要在 `Renderer` 里做副作用。`Renderer` 会被反复调用（复用、重刷、滚动都可能触发），把业务动作写进去会导致重复执行。

## 真源

- **点击与选中的全部实现**<br>`Packages/cn.etetet.yiuisuperscroll/Scripts/HotfixView/Client/SuperScroll/*/*ComponentSystem_OnClick.cs`
- **滚动回调订阅**<br>`Packages/cn.etetet.yiuisuperscroll/Scripts/HotfixView/Client/SuperScroll/List/*ComponentSystem_Event.cs`
- **上游点击监听**<br>`Packages/cn.etetet.yiuisuperscroll/Runtime/Common/ClickEventListener.cs`

## 源码落点

- **点击初始化**<br>`Scripts/HotfixView/Client/SuperScroll/{List,Grid,StaggeredGrid}/*ComponentSystem_OnClick.cs`
- **点击分发与选中判定**<br>同上文件内的 `OnClickItem` / `IsSelect` 分支
- **事件订阅开关**<br>`Scripts/HotfixView/Client/SuperScroll/List/YIUISuperScrollListComponentSystem_Event.cs`
- **业务需要实现的点击接口**<br>`Scripts/ModelView/Client/Event/`

## 下一步

→ [排查](./troubleshooting)
